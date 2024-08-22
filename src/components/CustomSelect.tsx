import {
  Box,
  BoxProps,
  Flex,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";

type Option = {
  label: string;
  value: any;
};

interface CustomSelectProps extends BoxProps {
  allowAddNew?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  options: Array<Option>;
  name: string;
  value: Array<any>;
  placeholder?: string;
  onSelected?: (value: Array<string>) => void;
  onAddNew?: (value: string) => void;
  onRemove?: (value: string, index: number) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  allowAddNew = true,
  disabled = false,
  multiple = false,
  options,
  name,
  value,
  placeholder,
  onSelected,
  onAddNew,
  onRemove,
  ...others
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [listOptions, setListOptions] = React.useState<Array<Option>>(options);
  const [selectedOptions, setSelectedOptions] = React.useState<any[]>([]);
  const [filteredOptions, setFilteredOptions] =
    React.useState<Array<Option>>(options);
  const { isOpen, onClose, onToggle } = useDisclosure();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLInputElement | null>(null);
  const [_position, setPosition] = React.useState({ top: 0, left: 0 });
  const [searchWidth, setSearchWidth] = React.useState(0);

  const adjustInputWidth = () => {
    const inputWidth = inputRef.current?.offsetWidth - 42;
    const tags = document.querySelectorAll(`.select-tag-${name}`);
    let tagsWidth = 0,
      count = 0;
    for (let index = 0; index < tags.length; index++) {
      const element = tags[index];
      count += 1;
      tagsWidth += element.getBoundingClientRect().width;
      if (inputWidth - tagsWidth - 8 * count < 60) {
        tagsWidth = 0;
        count = 0;
      } else {
        tagsWidth += 8;
      }
    }

    setSearchWidth(inputWidth - tagsWidth);
  };

  React.useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    setListOptions((prev) => {
      const uniqueOptions = options.filter(
        (option) => !prev.some((item) => item.value === option.value)
      );
      return [...prev, ...uniqueOptions];
    });
    setFilteredOptions((prev) => {
      const uniqueOptions = options.filter(
        (option) => !prev.some((item) => item.value === option.value)
      );
      return [...prev, ...uniqueOptions];
    });
  }, [options]);

  React.useEffect(() => {
    if (isEmpty(value) || isEmpty(value[0])) return;

    setSelectedOptions(value);
  }, [value]);

  React.useEffect(() => {
    if (inputRef.current) {
      adjustInputWidth();
    }
  }, [selectedOptions]);

  React.useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        (!listRef.current ||
          (listRef.current && !listRef.current.contains(event.target as Node)))
      ) {
        onClose();
      }
    };

    adjustInputWidth();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setFilteredOptions(
      newValue === ""
        ? listOptions
        : listOptions.filter((option) =>
            option.label.toLowerCase().includes(newValue.toLowerCase())
          )
    );
  };

  const handleSelectOption = (option: string) => {
    // single select
    if (!multiple) {
      setSelectedOptions([option]);
      onSelected([option]);
    }
    // mutiple select
    if (multiple && !selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
      onSelected([...selectedOptions, option]);
    }
    setInputValue("");
    setFilteredOptions(listOptions);
  };

  const handleRemoveOption = (value: string, index: number) => {
    const removed = selectedOptions.filter((selected) => selected !== value);
    setSelectedOptions(removed);
    onRemove(value, index);
    onSelected(removed);
  };

  const handleAddOption = () => {
    if (
      inputValue &&
      !listOptions.find(
        (option) =>
          option.label.includes(inputValue) || option.value.includes(inputValue)
      )
    ) {
      const newOptions = [
        ...listOptions,
        { label: inputValue, value: inputValue },
      ];
      handleSelectOption(inputValue);
      setListOptions(newOptions);
      setFilteredOptions(newOptions);
      onAddNew(inputValue);
    }
  };

  return (
    <Box
      ref={ref}
      onClick={() => {
        if (disabled) return;
        searchRef.current?.focus();
        onToggle();
      }}
      position="relative"
      bg={disabled ? "secondaryGray.200" : "transparent"}
      color={useColorModeValue("secondaryGray.900", "white")}
      border="1px solid"
      borderColor={
        others.border || others.borderColor
          ? ((others.border || others.borderColor) as string)
          : useColorModeValue("secondaryGray.100", "whiteAlpha.100")
      }
      borderRadius="8px"
      {...others}
    >
      <Flex
        ref={inputRef}
        w="full"
        direction="row"
        gap={"8px"}
        wrap="wrap"
        align="center"
        px={"12px"}
        py={"11px"}
        position={"relative"}
      >
        {selectedOptions.map((value, index) =>
          listOptions
            .filter((item) => item.value == value)
            .map((option) => (
              <Tag
                variant={"lightBrand"}
                className={`select-tag-${name}`}
                size="md"
                key={index}
                borderRadius="full"
              >
                <TagLabel>{option.label}</TagLabel>
                <TagCloseButton
                  onClick={() => handleRemoveOption(option.value, index)}
                />
              </Tag>
            ))
        )}
        {(multiple ||
          (!multiple && isEmpty(selectedOptions)) ||
          allowAddNew) && (
          <Input
            ref={searchRef}
            variant={"search"}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={(e) => e.stopPropagation()}
            placeholder={placeholder ?? "Search.."}
            readOnly={disabled}
            bg={useColorModeValue(
              "transparent",
              disabled ? "navy.700" : "navy.800"
            )}
            fontSize={"sm"}
            h="20px"
            w={`${searchWidth}px`}
          />
        )}
      </Flex>

      {isOpen && (
        // <Portal>
        <Box
          ref={listRef}
          bg={useColorModeValue("white", "navy.900")}
          boxShadow="md"
          mt={2}
          maxH="300px"
          overflowY="auto"
          width={ref.current?.offsetWidth || "100%"}
          rounded="xl"
          position="absolute"
          top={10}
          zIndex={999}
        >
          {filteredOptions.map((option, index) => (
            <Box
              key={index}
              cursor="pointer"
              py={2}
              px={4}
              color={useColorModeValue("secondaryGray.900", "white")}
              _hover={{
                bg: useColorModeValue("brand.500", "brand.400"),
                color: "white",
              }}
              onClick={() => handleSelectOption(option.value)}
            >
              {option.label}
            </Box>
          ))}
          {allowAddNew &&
            inputValue &&
            !listOptions.find(
              (option) =>
                option.label.includes(inputValue) ||
                option.value.includes(inputValue)
            ) && (
              <Box
                cursor="pointer"
                py={2}
                px={4}
                color={useColorModeValue("secondaryGray.900", "white")}
                _hover={{
                  bg: useColorModeValue("brand.500", "brand.400"),
                  color: "white",
                }}
                onClick={handleAddOption}
              >
                Add "{inputValue}"
              </Box>
            )}
        </Box>
        // </Portal>
      )}
    </Box>
  );
};

export default CustomSelect;
