import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BiSolidErrorAlt } from "react-icons/bi";
import InputMask from "react-input-mask";

interface Props extends FormControlProps {
  disabled?: boolean;
  error?: any;
  label?: string;
  mask?: string;
  maskChar?: string;
  isMultipleLines?: boolean;
  lines?: number;
  isRequired?: boolean;
  onTextChange: (value: string) => void;
  pattern?: string;
  placeholder?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  type?: string;
  value?: string;
}

const CustomInput = ({
  error,
  label,
  type,
  value,
  mask,
  maskChar,
  pattern,
  placeholder,
  disabled = false,
  isMultipleLines = false,
  lines = 5,
  isRequired = false,
  onTextChange,
  leftElement,
  rightElement,
  ...others
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInvalid = !!error;

  const handleFocus = (event: any) => {
    setTimeout(() => {
      const currentInput = event.target;
      if (currentInput && mask) {
        const defaultMask = mask.replace(/9/g, maskChar ?? " ");

        if (currentInput.value === defaultMask) {
          currentInput.setSelectionRange(0, 0);
        }
      }
      // if (currentInput && !mask && !isMultipleLines) {
      //   if (currentInput.value.includes("-")) {
      //     currentInput.value = "";
      //     onTextChange("");
      //   }
      // }
    }, 10);
  };

  return (
    <FormControl
      ref={ref}
      isDisabled={disabled}
      isInvalid={isInvalid}
      {...(others.roundedTopLeft
        ? { roundedTopLeft: others.roundedTopLeft }
        : {})}
      {...(others.roundedTopRight
        ? { roundedTopRight: others.roundedTopRight }
        : {})}
      {...(others.roundedBottomLeft
        ? { roundedBottomLeft: others.roundedBottomLeft }
        : {})}
      {...(others.roundedBottomRight
        ? { roundedBottomRight: others.roundedBottomRight }
        : {})}
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
      overflow={"hidden"}
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
          _focusWithin={{ borderColor: "black" }}
        >
          {label && (
            <Text
              w="full"
              align="left"
              color="secondaryGray.500"
              fontSize="14px"
              fontWeight="500"
              letterSpacing={"-0.056px"}
            >
              {label}{" "}
              {isRequired && <span style={{ color: "#BD2843" }}>*</span>}
            </Text>
          )}
          {!isMultipleLines && (
            <InputGroup>
              {leftElement && (
                <InputLeftElement
                  w="24px"
                  h="24px"
                  display="flex"
                  justifyContent="flex-start"
                >
                  {leftElement}
                </InputLeftElement>
              )}
              <Input
                // ref={setRef}
                onFocus={handleFocus}
                as={InputMask}
                mask={mask ?? ""}
                maskChar={maskChar ?? ""}
                border="0"
                fontSize="sm"
                fontWeight="400"
                letterSpacing={"-0.2px"}
                lineHeight="24px"
                rounded={"0px"}
                variant={"unstyled"}
                placeholder={placeholder ?? ""}
                type={type ?? "text"}
                value={value}
                onChange={(e) => onTextChange(e.target.value)}
              />
              {rightElement && (
                <InputRightElement w="24px" h="24px">
                  {rightElement}
                </InputRightElement>
              )}
            </InputGroup>
          )}
          {isMultipleLines && (
            <Textarea
              onFocus={handleFocus}
              bg="backgroundTextfield"
              w="full"
              fontSize="sm"
              fontWeight="400"
              letterSpacing={"-0.2px"}
              lineHeight="24px"
              rounded={"0px"}
              rows={lines}
              variant={"unstyled"}
              p={0}
              placeholder={placeholder ?? ""}
              value={value}
              onChange={(e) => onTextChange(e.target.value)}
            />
          )}
        </VStack>

        {error && (
          <FormErrorMessage
            as={HStack}
            w="full"
            color="red.600"
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
  );
};

export default CustomInput;
