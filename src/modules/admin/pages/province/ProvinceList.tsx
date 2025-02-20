import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import CustomCard from "../../../../components/CustomCard";
import Pagination from "../../../../components/Pagination";
import provinceService from "../../../../services/provinceService";
import UpdateTypeModal from "./UpdateTypeModal";

type RowObj = {
  id: number;
  name: string;
  type: any;
  createdAt: Date;
  updatedAt: Date;
};

export default function ProvinceList() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [list, setList] = React.useState<Array<RowObj>>();
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const itemsPerPage = 15;
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [objUpdating, setObjUpdating] = React.useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await provinceService.getAll({
      search,
      page,
      pageSize: itemsPerPage
    });
    setTotalItems(list.count);
    setList(list.rows);
    setInitialized(true);
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (!initialized) return;
    init();
  }, [initialized, page]);

  React.useEffect(() => {
    if (!initialized) return;
    init();
  }, [initialized, search]);

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleUpdateType = (obj: any) => {
    setObjUpdating(obj);
    onOpen();
  };

  const handleCloseUpdateType = (reset: boolean = false) => {
    setObjUpdating(undefined);
    reset && init();
    onClose();
  };

  return (
    <CustomCard flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" mb="8px" justifyContent="flex-start" align="center" gap={"10px"}>
        <InputGroup w={{ base: "100%", md: "200px" }}>
          <InputLeftElement>
            <IconButton
              aria-label="search"
              bg="inherit"
              borderRadius="inherit"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent"
              }}
              _focus={{
                boxShadow: "none"
              }}
              icon={<SearchIcon color={"gray.700"} w="15px" h="15px" />}
            />
          </InputLeftElement>
          <Input
            variant="search"
            pl="40px"
            fontSize="sm"
            bg={"secondaryGray.300"}
            color={"gray.700"}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"30px"}
            placeholder={"Tìm kiếm..."}
            onChange={(e: any) => handleSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Table variant="simple" color="gray.500" w="full" layout="fixed">
        <Thead>
          <Tr>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="100px"
              px="10px"
            >
              ID
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="20%"
              px="10px"
            >
              Tên
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
            >
              Khu vực ưu tiên
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {list &&
            list.map((row) => {
              return (
                <Tr key={row.id}>
                  <Td borderColor={borderColor}>
                    <Flex align="center">
                      <Text color={textColor} fontSize="sm" fontWeight="700" textAlign={"center"}>
                        {row.id}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={1}>
                      {row.name}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px" cursor={"pointer"} onClick={() => handleUpdateType(row)}>
                    <Text color={textColor} fontSize="sm">
                      {row.type?.join(", ")}
                    </Text>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td colSpan={3} pb={0} border={0}>
              <Flex w="full" align={"center"} justify={"space-between"}>
                <Text fontSize="sm" color="gray.500">
                  {totalItems > 0
                    ? `Showing ${(page - 1) * 15 + 1} to ${
                        (page - 1) * 15 + (list?.length ?? 1)
                      } of ${totalItems} entries`
                    : ""}
                </Text>
                <Pagination page={page} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setPage} />
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
      {isOpen && objUpdating && <UpdateTypeModal data={objUpdating} onClose={handleCloseUpdateType} />}
    </CustomCard>
  );
}
