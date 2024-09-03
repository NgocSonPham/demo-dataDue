import { DeleteIcon, EditIcon, Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
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
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import Pagination from "../../../../components/Pagination";
import subCategoryService from "../../../../services/subCategoryService";
import { PAGE_ITEMS } from "../../../../utils/constants";
import { getErrorMessage } from "../../../../utils/helpers";

type RowObj = {
  id: number;
  name: string;
  idx?: number;
  mainCategory: any;
  createdAt: Date;
  updatedAt: Date;
};

export default function SubCategoryList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const [list, setList] = React.useState<Array<RowObj>>();
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const itemsPerPage = PAGE_ITEMS;
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await subCategoryService.getAll({
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

  const handleEdit = (id: number) => {
    navigate(`/admin/sub-categories/${id}`);
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleDelete = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDelete();
  };

  const confirmDelete = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await subCategoryService.delete(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
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
        <Button variant="action" onClick={() => navigate("/admin/sub-categories/new")}>
          <Icon as={FaPlus} w="15px" h="15px" />
        </Button>
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
              w="80px"
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
              // w="20%"
              maxW="100px"
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
              w="80px"
              px="10px"
            >
              Thứ tự
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="200px"
              px="10px"
            >
              Main Cat
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
              w="220px"
            >
              Ngày tạo
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
              w="220px"
            >
              Cập nhật gần nhất
            </Th>
            <Th borderColor={borderColor} cursor="pointer" w="70px" minW={0} px="10px" />
          </Tr>
        </Thead>
        <Tbody>
          {list &&
            list.map((row) => {
              return (
                <Tr key={row.id}>
                  <Td borderColor={borderColor}>
                    <Text w="full" color={textColor} fontSize="sm" fontWeight="700" textAlign={"center"}>
                      {row.id}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={1}>
                      {row.name}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text w="full" color={textColor} fontSize="sm" fontWeight="700" textAlign={"center"}>
                      {row.idx}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={1} textAlign={"center"}>
                      {row.mainCategory?.name}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Flex align="center">
                      <Text color={textColor} fontSize="sm">
                        {row.createdAt.toString()}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor} px="14px">
                    <Flex align="center">
                      <Text color={textColor} fontSize="sm">
                        {row.updatedAt.toString()}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Flex align="center" gap="10px">
                      <EditIcon
                        color="brand.600"
                        w="15px"
                        h="15px"
                        cursor={"pointer"}
                        onClick={() => handleEdit(row.id)}
                      />
                      <DeleteIcon
                        color="red.500"
                        w="15px"
                        h="15px"
                        cursor={"pointer"}
                        onClick={() => handleDelete(row)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td colSpan={5} pb={0} border={0}>
              <Flex w="full" align={"center"} justify={"space-between"}>
                <Text fontSize="sm" color="gray.500">
                  {totalItems > 0
                    ? `Showing ${(page - 1) * PAGE_ITEMS + 1} to ${
                        (page - 1) * PAGE_ITEMS + (list?.length ?? 1)
                      } of ${totalItems} entries`
                    : ""}
                </Text>
                <Pagination page={page} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setPage} />
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
      {isOpenDelete && deletingObj && (
        <CustomConfirmAlert
          title={`Remove ${deletingObj.name}`}
          question={"Are you sure to remove this Sub Category?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDelete}
          onConfirm={() => confirmDelete(deletingObj.id)}
        />
      )}
    </CustomCard>
  );
}
