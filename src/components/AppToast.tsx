import {
  AlertStatus,
  CloseButton,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { MdWarning } from "react-icons/md";

interface ToastProps extends FlexProps {
  status?: AlertStatus;
  title?: string;
  subtitle: string;
  onClose: () => void;
  link?: string;
  pathname?: string;
  navigate?: any;
}

const AppToast = ({
  status = "success",
  link,
  title,
  subtitle,
  pathname,
  navigate,
  onClose,
}: ToastProps) => {
  return (
    <HStack
      minW="200px"
      spacing="4px"
      px="12px"
      py="10px"
      rounded="2px"
      align="center"
      bg={
        status === "info"
          ? "#FAFAFA"
          : status === "success"
          ? "#EAF6ED"
          : status === "error"
          ? "#FFF0EE"
          : "#FDF2DC"
      }
      boxShadow="0px 9px 28px 8px rgba(37, 37, 37, 0.05), 0px 6px 16px 0px rgba(37, 37, 37, 0.08), 0px 3px 6px -4px rgba(37, 37, 37, 0.12)"
    >
      <Flex align="flex-start" pr="8px">
        <Icon
          as={
            status === "info"
              ? FaCircleInfo
              : status === "success"
              ? FaCircleCheck
              : status === "error"
              ? AiFillCloseCircle
              : MdWarning
          }
          color={
            status === "info"
              ? "#E84771"
              : status === "success"
              ? "#0E8345"
              : status === "error"
              ? "#DE1135"
              : "#F6BC2F"
          }
          w="16px"
          h="16px"
        />
      </Flex>
      {link ? (
        <Link
          href={link}
          onClick={(e) => {
            e.preventDefault();
            if (!link.includes(pathname)) {
              navigate(link);
              return;
            }
            window.location.href = link;
            window.location.reload();
          }}
          _hover={{ textDecoration: "none" }}
        >
          <VStack w="full" maxW="300px" spacing={0} fontSize="16px">
            {!isEmpty(title) && (
              <Text w="full" color="black" fontWeight="500">
                {title}
              </Text>
            )}
            {!isEmpty(subtitle) && (
              <Text
                w="full"
                color="gray.500"
                fontWeight="400"
                whiteSpace="pre-line"
              >
                {subtitle}
              </Text>
            )}
          </VStack>
        </Link>
      ) : (
        <VStack w="full" maxW="300px" spacing={0} fontSize="16px">
          {!isEmpty(title) && (
            <Text w="full" color="black" fontWeight="500">
              {title}
            </Text>
          )}
          {!isEmpty(subtitle) && (
            <Text
              w="full"
              color="contentSeccondary"
              fontWeight="400"
              whiteSpace="pre-line"
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      )}
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </HStack>
  );
};

export default AppToast;
