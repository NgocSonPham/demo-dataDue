import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
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
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import Pagination from "../../../../components/Pagination";
import userService from "../../../../services/userService";
import { PAGE_ITEMS } from "../../../../utils/constants";
import { getErrorMessage, userFullnameOrUsername } from "../../../../utils/helpers";
import UpdateRoleModal from "./UpdateRoleModal";

type RowObj = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  status: string;
  roleId: string;
  provider: string;
  updatedAt: Date;
  deletedAt: Date;
};

export default function UserList() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const [list, setList] = React.useState<Array<RowObj>>();
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const itemsPerPage = PAGE_ITEMS;
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [userUpdating, setUserUpdating] = React.useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userDeleting, setUserDeleting] = React.useState<any>();
  const { isOpen: isOpenUserDelete, onOpen: onOpenUserDelete, onClose: onCloseUserDelete } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await userService.getAll({
      ...(!isEmpty(search) && {
        filter: JSON.stringify({ name: search })
      }),
      page,
      pageSize: itemsPerPage,
      includeDeleted: true
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

  const handleDelete = async (user: any) => {
    setUserDeleting(user);
    onOpenUserDelete();
  };

  const confirmDelete = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await userService.delete(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleUpdateRole = (user: any) => {
    setUserUpdating(user);
    onOpen();
  };

  const handleCloseUpdateRole = (reset: boolean = false) => {
    setUserUpdating(undefined);
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
              px="10px"
            >
              Họ & Tên
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
              Tên đăng nhập
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
            >
              Email
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
              w="100px"
            >
              Quyền
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
              w="120px"
            >
              Tình trạng
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              px="10px"
              w="120px"
            >
              Nền tảng đăng ký
            </Th>
            <Th borderColor={borderColor} cursor="pointer" w="50px" minW={0} px="10px" />
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
                        {userFullnameOrUsername(row, true)}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={1}>
                      {row.username}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm">
                      {row.email}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text
                      color={textColor}
                      fontSize="sm"
                      textAlign={"center"}
                      cursor={"pointer"}
                      onClick={() => handleUpdateRole(row)}
                    >
                      {row.roleId}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="14px">
                    <Text color={textColor} fontSize="sm" textAlign={"center"}>
                      {!isEmpty(row.deletedAt) ? "DELETED" : row.status}
                    </Text>
                  </Td>

                  <Td borderColor={borderColor} px="14px">
                    <Text color={textColor} fontSize="sm" textAlign={"center"}>
                      {row.provider}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Flex align="center" gap="10px">
                      {isEmpty(row.deletedAt) && (
                        <DeleteIcon
                          color="red.500"
                          w="15px"
                          h="15px"
                          cursor={"pointer"}
                          onClick={() => handleDelete(row)}
                        />
                      )}
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Td colSpan={7} pb={0} border={0}>
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
      {isOpen && userUpdating && <UpdateRoleModal user={userUpdating} onClose={handleCloseUpdateRole} />}
      {isOpenUserDelete && userDeleting && (
        <CustomConfirmAlert
          title={`Remove ${userDeleting.username}`}
          question={"Are you sure to remove this User?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseUserDelete}
          onConfirm={() => confirmDelete(userDeleting.id)}
        />
      )}
    </CustomCard>
  );
}
