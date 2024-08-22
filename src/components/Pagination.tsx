import {
  Button,
  HStack,
  Icon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
  LuChevronFirst,
  LuChevronLast,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

const Pagination = ({ page, totalItems, itemsPerPage, onPageChange }: any) => {
  // const [currentPage, setCurrentPage] = React.useState(page);
  const [firstPageInRange, setFirstPageInRange] = React.useState(1);

  const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;

  React.useEffect(() => {
    let newFirstPageInRange = page - 2;

    if (page === totalPages) {
      newFirstPageInRange = totalPages - 2;
    }

    setFirstPageInRange(
      Math.max(1, Math.min(newFirstPageInRange, totalPages - 2))
    );
  }, [page, totalPages]);

  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <HStack spacing={"6px"}>
      <IconButton
        onClick={() => handlePageChange(1)}
        isDisabled={page === 1}
        bg={useColorModeValue("white", "navy.700")}
        border="1px"
        borderColor={useColorModeValue("gray.500", "gray.100")}
        color={useColorModeValue("gray.500", "gray.100")}
        rounded={"full"}
        w="40px"
        h="40px"
        icon={<Icon as={LuChevronFirst} />}
        aria-label="First Page"
      />
      <IconButton
        onClick={() => handlePageChange(page - 1)}
        isDisabled={page === 1}
        bg={useColorModeValue("white", "navy.700")}
        border="1px"
        borderColor={useColorModeValue("gray.500", "gray.100")}
        color={useColorModeValue("gray.500", "gray.100")}
        rounded={"full"}
        w="40px"
        h="40px"
        icon={<Icon as={LuChevronLeft} />}
        aria-label="Previous Page"
      />

      {Array.from(
        { length: Math.min(3, totalPages) },
        (_, i) => i + firstPageInRange
      ).map((num) => (
        <Button
          key={num}
          onClick={() => handlePageChange(num)}
          bg={
            page === num
              ? useColorModeValue("brand.500", "brand.400")
              : useColorModeValue("white", "navy.700")
          }
          border="1px"
          borderColor={
            page === num
              ? useColorModeValue("brand.500", "brand.400")
              : useColorModeValue("gray.500", "gray.100")
          }
          color={
            page === num ? "white" : useColorModeValue("black", "gray.100")
          }
          _hover={{
            bg:
              page === num
                ? useColorModeValue("brand.500", "brand.400")
                : useColorModeValue("white", "navy.700"),
          }}
          rounded={"full"}
          w="40px"
          h="40px"
        >
          {num}
        </Button>
      ))}

      <IconButton
        onClick={() => handlePageChange(page + 1)}
        isDisabled={page === totalPages}
        bg={useColorModeValue("white", "navy.700")}
        border="1px"
        borderColor={useColorModeValue("gray.500", "gray.100")}
        color={useColorModeValue("gray.500", "gray.100")}
        rounded={"full"}
        w="40px"
        h="40px"
        icon={<Icon as={LuChevronRight} />}
        aria-label="Next Page"
      />
      <IconButton
        onClick={() => handlePageChange(totalPages)}
        isDisabled={page === totalPages}
        bg={useColorModeValue("white", "navy.700")}
        border="1px"
        borderColor={useColorModeValue("gray.500", "gray.100")}
        color={useColorModeValue("gray.500", "gray.100")}
        rounded={"full"}
        w="40px"
        h="40px"
        icon={<Icon as={LuChevronLast} />}
        aria-label="Last Page"
      />
    </HStack>
  );
};

export default Pagination;
