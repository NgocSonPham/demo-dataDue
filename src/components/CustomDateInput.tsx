import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
  useMediaQuery,
  useOutsideClick,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BiSolidErrorAlt } from "react-icons/bi";
import InputMask from "react-input-mask";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface Props extends FormControlProps {
  disabled?: boolean;
  disabledPast?: boolean;
  isRequired?: boolean;
  error?: any;
  label?: string;
  mask?: string;
  maskChar?: string;
  onTextChange: (value: string | dayjs.Dayjs) => void;
  pattern?: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  type?: string;
  value?: string | dayjs.Dayjs;
  setError?: (message: string | undefined) => void;
}

const CustomDateInput = ({
  disabled = false,
  disabledPast = false,
  isRequired = false,
  error,
  label,
  mask,
  maskChar,
  onTextChange,
  pattern,
  placeholder,
  rightElement,
  type,
  value,
  setError,
  ...others
}: Props) => {
  const [isLargerThanMd] = useMediaQuery("(min-width: 48em)");
  const [inputValue, setInputValue] = useState<string>(
    (value ?? "").toString()
  );
  const [dateValue, setDateValue] = useState(dayjs.utc());
  const [date, setDate] = useState(dateValue.format("YYYY-MM-DD"));
  const [month, setMonth] = useState(dateValue.get("month"));
  const [year, setYear] = useState(dateValue.get("year"));
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const { isOpen, onToggle } = useDisclosure();
  const formRef = React.useRef<HTMLDivElement | null>(null);
  const [pickerHeight, setPickerHeight] = useState(330);
  const currentDate = new Date();
  const isInvalid = !!error;

  const reset = (value?: string | dayjs.Dayjs) => {
    if (value) {
      const dateValue =
        value !== "Invalid Date"
          ? value
            ? dayjs.utc(value)
            : dayjs.utc()
          : dayjs.utc();
      setDate(dateValue.format("YYYY-MM-DD"));
      setMonth(dateValue.get("month"));
      setYear(dateValue.get("year"));
      setDateValue(dateValue);
    }
  };

  useEffect(() => {
    reset(value);
    setInputValue((value ?? "").toString());
  }, [value]);

  const changeMonth = (offset: number) => {
    if (view === "day") {
      if (month === 0 && offset < 0) {
        setYear((prev) => prev - 1);
        setMonth(11);
        return;
      }
      if (month === 11 && offset > 0) {
        setYear((prev) => prev + 1);
        setMonth(0);
        return;
      }
      setMonth((prev) => prev + offset);
    } else {
      setYear((prev) => prev + offset * 10);
    }
  };

  const selectDate = (day: number) => {
    if (view === "day") {
      const mo = month + 1 > 9 ? month + 1 : `0${month + 1}`;
      const da = day > 9 ? day : `0${day}`;
      const d = dayjs.utc(`${year}-${mo}-${da}`, "YYYY-MM-DD");
      setDate(d.format("YYYY-MM-DD"));
      onTextChange(d.format("YYYY-MM-DD"));
      if (setError) {
        const eighteenYearsAgo = dayjs().subtract(18, "year");
        if (d.isAfter(eighteenYearsAgo)) {
          setError("You must be at least 18 years old");
        } else {
          setError && setError(undefined);

          onToggle();
        }
      } else onToggle();
      return;
    }
    setView("day");
    if (view === "month") {
      setMonth(day);
      return;
    }
    if (view === "year") {
      setYear(day);
      return;
    }
  };

  const renderHeader = () => (
    <Flex justify="space-between" align="center" mb={4}>
      <Button onClick={() => changeMonth(-1)} variant="ghost">
        <ChevronLeftIcon />
      </Button>
      {view === "day" ? (
        <>
          <Button
            variant="link"
            color="black"
            fontSize="14px"
            fontWeight="600"
            onClick={() => setView("month")}
          >
            {dayjs.utc().month(month).format("MMMM")}
          </Button>
          <Button
            variant="link"
            color="black"
            fontSize="14px"
            fontWeight="600"
            onClick={() => setView("year")}
          >
            {year}
          </Button>
        </>
      ) : (
        <Text color="black" fontSize="14px" fontWeight="600">
          {`${Math.floor(year / 10) * 10} - ${Math.floor(year / 10) * 10 + 19}`}
        </Text>
      )}
      <Button onClick={() => changeMonth(1)} variant="ghost">
        <ChevronRightIcon />
      </Button>
    </Flex>
  );

  const renderDays = () => {
    const firstDayOfMonth = dayjs.utc(new Date(year, month, 1)).toDate();
    const lastDayOfMonth = dayjs.utc(new Date(year, month + 1, 0)).toDate();

    const prefixDays = Array.from(
      { length: (firstDayOfMonth.getDay() || 7) - 1 },
      (_, i) => ({
        day: dayjs
          .utc(firstDayOfMonth)
          .subtract((firstDayOfMonth.getDay() || 7) - 1 - i, "day")
          .date(),
        monthOffset: -1,
      })
    );
    const monthDays = Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => ({
        day: i + 1,
        monthOffset: 0,
      })
    );
    const suffixDays = Array.from(
      { length: (7 - lastDayOfMonth.getDay()) % 7 },
      (_, i) => ({
        day: i + 1,
        monthOffset: 1,
      })
    );
    const allDays = [...prefixDays, ...monthDays, ...suffixDays];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const d = dayjs.utc(date, "YYYY-MM-DD");

    return (
      <SimpleGrid w="full" columns={7} spacingY={"8px"}>
        {days.map((day, index) => (
          <Text
            key={index}
            py="10px"
            align="center"
            color="gray.600"
            fontSize="11px"
            fontWeight="500"
            lineHeight="16px"
            textTransform="uppercase"
          >
            {day}
          </Text>
        ))}
        {allDays.map(({ day, monthOffset }, index) => {
          const isPast = dayjs
            .utc(`${year}-${month + 1 + monthOffset}-${day}`)
            .isBefore(currentDate, "day");

          return (
            <Center
              key={index}
              p={0}
              bg={
                monthOffset === 0 &&
                day === d.get("date") &&
                month === d.get("month") &&
                year === d.get("year")
                  ? "black"
                  : "transparent"
              }
              onClick={() => monthOffset === 0 && selectDate(day)}
              color={
                (disabledPast && isPast) || monthOffset !== 0
                  ? "gray.400"
                  : day === d.get("date") &&
                    month === d.get("month") &&
                    year === d.get("year")
                  ? "white"
                  : "black"
              }
              cursor={
                (disabledPast && isPast) || monthOffset !== 0
                  ? "not-allowed"
                  : "pointer"
              }
              rounded="full"
              h="38px"
              userSelect="none"
            >
              <VStack spacing={0}>
                <Text
                  fontSize="14px"
                  fontWeight="400"
                  lineHeight="20px"
                  letterSpacing="-0.154px"
                >
                  {day}
                </Text>
              </VStack>
            </Center>
          );
        })}
      </SimpleGrid>
    );
  };

  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs.utc().month(i).format("MMM")
    );
    return (
      <SimpleGrid columns={4} spacing={2}>
        {months.map((month, index) => {
          const isPast =
            index < currentDate.getMonth() && year <= currentDate.getFullYear();
          return (
            <Button
              key={index}
              onClick={() => selectDate(index)}
              isDisabled={disabledPast && isPast}
              color="black"
              fontSize="14px"
              fontWeight="400"
            >
              {month}
            </Button>
          );
        })}
      </SimpleGrid>
    );
  };

  const renderYears = () => {
    const years = Array.from(
      { length: 20 },
      (_, i) => Math.floor(year / 10) * 10 + i
    );
    return (
      <SimpleGrid columns={4} spacing={2}>
        {years.map((yr, index) => {
          const isPast = yr < currentDate.getFullYear();
          return (
            <Button
              key={index}
              onClick={() => selectDate(yr)}
              isDisabled={disabledPast && isPast}
              color="black"
              fontSize="14px"
              fontWeight="400"
            >
              {yr}
            </Button>
          );
        })}
      </SimpleGrid>
    );
  };

  const handleClick = () => {
    reset(value);
    onToggle();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length < 14) {
      return setInputValue(value);
    }

    const arrD = value.split(" / ");
    const date = dayjs.utc(`${arrD[2]}-${arrD[0]}-${arrD[1]}`, "YYYY-MM-DD");
    const eighteenYearsAgo = dayjs().subtract(18, "year");

    if (date.isValid()) {
      if (setError)
        if (date.isAfter(eighteenYearsAgo)) {
          setError("You must be at least 18 years old");
        } else {
          setError && setError(undefined);
        }
      setDateValue(date);
      onTextChange(date.isValid() ? date.format("YYYY-MM-DD") : value);
    }
  };

  const isTop = () => {
    if (!formRef.current) return false;
    const { bottom } = formRef.current.getBoundingClientRect();
    return window.innerHeight - bottom < pickerHeight - 30;
  };

  const leftOffset = () => {
    if (!formRef.current) return 0;
    const { left } = formRef.current.getBoundingClientRect();
    return window.innerWidth - left;
  };

  return (
    <>
      <FormControl
        ref={formRef}
        isDisabled={disabled}
        isInvalid={isInvalid}
        bg={disabled ? "secondaryGray.200" : "transparent"}
        border="1px solid"
        borderColor={
          isInvalid
            ? "red.600"
            : others.border || others.borderColor
            ? undefined
            : "secondaryGray.100"
        }
        rounded={others.rounded ?? "8px"}
        // overflow={"hidden"}
        {...others}
      >
        <VStack w="full" spacing={"2px"}>
          <VStack
            w="full"
            spacing={"4px"}
            pt="8px"
            pb="10px"
            pr="10px"
            pl="12px"
            // bg={"backgroundTextfield"}
            // rounded={"8px"}
            // border="2px solid transparent"
            // borderColor={isInvalid ? "contentNegative" : "transparent"}
            _focusWithin={{ borderColor: "black" }}
          >
            {label && (
              <Text
                w="full"
                align="left"
                color="black"
                fontSize="14px"
                fontWeight="500"
                letterSpacing={"-0.056px"}
              >
                {label}{" "}
                {isRequired && <span style={{ color: "#BD2843" }}>*</span>}
              </Text>
            )}
            <InputGroup>
              <Input
                as={InputMask}
                mask={mask ?? ""}
                maskChar={maskChar ?? ""}
                border="0"
                cursor="pointer"
                fontSize="16px"
                fontWeight="400"
                letterSpacing={"-0.2px"}
                lineHeight="24px"
                placeholder={placeholder ?? ""}
                rounded={"0px"}
                type={type ?? "text"}
                value={
                  ((inputValue.length === 10 && !inputValue.includes("/")) ||
                    inputValue.length === 14) &&
                  dateValue.isValid()
                    ? dateValue.format("DD / MM / YYYY")
                    : inputValue
                }
                variant={"unstyled"}
                onChange={handleChange}
                onClick={handleClick}
              />
              {isLargerThanMd && (
                <InputRightElement h="24px">{rightElement}</InputRightElement>
              )}
            </InputGroup>
          </VStack>
          {isOpen && (
            <DatePickerPopup
              height={pickerHeight}
              isOpen={isOpen}
              isTop={isTop}
              leftOffset={leftOffset}
              onResize={setPickerHeight}
              onToggle={onToggle}
              view={view}
              renderHeader={renderHeader}
              renderDays={renderDays}
              renderMonths={renderMonths}
              renderYears={renderYears}
            />
          )}

          {error && (
            <FormErrorMessage
              as={HStack}
              w="full"
              color="contentNegative"
              align={"center"}
              fontSize="12px"
              fontWeight="400"
              lineHeight="150%"
              letterSpacing={"-0.2px"}
              spacing={"4px"}
            >
              <Icon
                as={BiSolidErrorAlt}
                w="18px"
                h="18px"
                px={"3px"}
                py={"3.5px"}
              />
              <Text>{error.message}</Text>
            </FormErrorMessage>
          )}
        </VStack>
      </FormControl>
    </>
  );
};

export default CustomDateInput;

const DatePickerPopup = ({
  height,
  isOpen,
  isTop,
  leftOffset,
  onResize,
  onToggle,
  view,
  renderHeader,
  renderDays,
  renderMonths,
  renderYears,
}: any) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    ref: ref,
    handler: () => isOpen && onToggle(),
  });

  useLayoutEffect(() => {
    const node = ref.current;
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          onResize(entry.contentRect.height + 34);
        }
      });

      resizeObserver.observe(node);

      return () => resizeObserver.disconnect();
    }
  }, [onResize]);
  const offset = leftOffset();
  return (
    <Flex
      ref={ref}
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      direction="column"
      p={4}
      position="absolute"
      left={offset > 300 ? "0" : offset - 300 + "px"}
      {...(isTop() && { top: `-${height + 2}px` })}
      {...(!isTop() && { bottom: `-${height}px` })}
      w="300px"
      zIndex="9999"
    >
      {renderHeader()}
      <Flex wrap="wrap" justify="space-between">
        {view === "day" && renderDays()}
        {view === "month" && renderMonths()}
        {view === "year" && renderYears()}
      </Flex>
    </Flex>
  );
};
