import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack
} from "@chakra-ui/react";
import { FC } from "react";
import { BiSolidErrorAlt } from "react-icons/bi";

interface Props extends FormControlProps {
  disabled?: boolean;
  error?: any;
  label?: string;
  isRequired?: boolean;
  value: number;
  onChange: (event: any) => void;
  min?: number;
  max?: number;
}

export const CustomInputNumber: FC<Props> = ({
  disabled,
  error,
  label,
  isRequired,
  value,
  onChange,
  min,
  max,
  ...others
}) => {
  const isInvalid = !!error;
  return (
    <FormControl
      isDisabled={disabled}
      isInvalid={isInvalid}
      {...(others.roundedTopLeft ? { roundedTopLeft: others.roundedTopLeft } : {})}
      {...(others.roundedTopRight ? { roundedTopRight: others.roundedTopRight } : {})}
      {...(others.roundedBottomLeft ? { roundedBottomLeft: others.roundedBottomLeft } : {})}
      {...(others.roundedBottomRight ? { roundedBottomRight: others.roundedBottomRight } : {})}
      bg={disabled ? "secondaryGray.200" : "transparent"}
      border="1px solid"
      borderColor={isInvalid ? "red.600" : others.border || others.borderColor ? undefined : "secondaryGray.100"}
      rounded={others.rounded ?? "8px"}
      overflow={"hidden"}
      {...others}
    >
      <VStack w="full" spacing={"4px"} pt="8px" pb="10px">
        {label && (
          <Text
            w="full"
            align="left"
            color="secondaryGray.500"
            fontSize="14px"
            fontWeight="500"
            letterSpacing={"-0.056px"}
            px="10px"
          >
            {label} {isRequired && <span style={{ color: "#BD2843" }}>*</span>}
          </Text>
        )}
        <NumberInput
          value={value}
          min={min}
          max={max}
          step={1}
          w="full"
          // border="1px solid #9ca3cf"
          borderRadius="6px"
        >
          <NumberInputField
            h="24px"
            fontSize="sm"
            fontWeight="400"
            outline="none"
            boxShadow="none"
            border="0px"
            borderColor={"transparent"}
            letterSpacing={"-0.2px"}
            lineHeight="24px"
            px="10px"
            _hover={{
              border: "0px",
              borderColor: "transparent",
              boxShadow: "none"
            }}
            _focus={{
              border: "0px",
              borderColor: "transparent",
              boxShadow: "none"
            }}
            _invalid={{ border: "0px", borderColor: "transparent", boxShadow: "none" }}
            onChange={(e: any) => {
              const value = e?.target.value ?? 0;
              onChange(value);
            }}
          />
          {/* <NumberInputStepper gap="6px">
        <NumberIncrementStepper
          color="#9ca3cf"
          _hover={{ color: "black" }}
          fontSize="9px"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          textAlign="center"
          onClick={onIncrement}
        />
        <NumberDecrementStepper
          color="#9ca3cf"
          _hover={{ color: "black" }}
          fontSize="9px"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          textAlign="center"
          onClick={onDecrement}
        />
      </NumberInputStepper> */}
        </NumberInput>
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
            px="10px"
          >
            <Icon as={BiSolidErrorAlt} w="18px" h="18px" px={"3px"} py={"3.5px"} />
            <Text>{error.message}</Text>
          </FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  );
};
