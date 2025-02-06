import { DeleteIcon, EditIcon, Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tag,
  TagLabel,
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
import dayjs from "dayjs";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { MdCancel, MdCheckCircle, MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import CustomConfirmIconButton from "../../../../components/CustomConfirmIconButton";
import Pagination from "../../../../components/Pagination";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectUser } from "../../../../redux/slice";
import postService from "../../../../services/postService";
import { PAGE_ITEMS, USER_ROLE } from "../../../../utils/constants";
import { getErrorMessage } from "../../../../utils/helpers";
import { POST_STATUS } from "./constant";

type RowObj = {
  id: number;
  thumbnail: string;
  title: string;
  shortDescription: string;
  mainCategory: any;
  subCategory: any;
  topics?: string[];
  view: number;
  like: number;
  comment: number;
  status: string;
  userId: number;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export default function PostList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();
  const user = useAppSelector(selectUser);

  const [list, setList] = React.useState<Array<RowObj>>();
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  const [statusSelected, setStatusSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const itemsPerPage = PAGE_ITEMS;
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await postService.getAll({
      isAdmin: true,
      page,
      pageSize: itemsPerPage,
      filter: JSON.stringify({ title: search, ...(statusSelected.length > 0 && { status: statusSelected }) })
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
  }, [initialized, search, statusSelected]);

  const handleEdit = (id: number) => {
    navigate(`/admin/posts/${id}`);
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleFilterStatus = (value: string) => {
    setPage(1);
    if (statusSelected.includes(value)) {
      setStatusSelected(statusSelected.filter((item) => item !== value));
    } else {
      setStatusSelected([...statusSelected, value]);
    }
  };

  const handleDelete = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDelete();
  };

  const confirmDelete = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.delete(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmDeletePermanantly = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.deletePermanently(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmPublish = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.publish(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmUnPublish = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.unPublish(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmApprove = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.approve(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmReject = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.reject(id);

      init();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const confirmDisApprove = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await postService.disapprove(id);

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
      <Flex px="25px" mb="18px" justifyContent="space-between" align="center" gap={"10px"}>
        <HStack spacing="10px">
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
          {Object.entries(POST_STATUS).map(([key, value]) => (
            <Button
              key={key}
              variant={statusSelected.includes(value) ? "brand" : "action"}
              onClick={() => handleFilterStatus(value)}
            >
              {value}
            </Button>
          ))}
        </HStack>
        <Button variant="action" onClick={() => navigate("/admin/posts/new")}>
          <Icon as={FaPlus} w="15px" h="15px" />
        </Button>
      </Flex>

      <Table
        variant="simple"
        color="gray.500"
        w="full"
        layout="fixed"
        sx={{ th: { p: "10px" }, td: { px: "6px", py: "8px" } }}
      >
        <Thead>
          <Tr>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="60px"
            >
              ID
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
            >
              Tên
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="120px"
              maxW="120px"
              minW="100px"
            >
              Main Cat
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="120px"
              maxW="120px"
              minW="100px"
            >
              Sub Cat
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="160px"
              maxW="160px"
              minW="100px"
            >
              Topics
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="110px"
            >
              Trạng thái
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="120px"
              minW="140px"
            >
              Người tạo
            </Th>
            <Th
              textAlign="center"
              borderColor={borderColor}
              color="gray.400"
              cursor="pointer"
              fontSize={{ sm: "10px", lg: "12px" }}
              w="100px"
            >
              Ngày tạo
            </Th>
            <Th borderColor={borderColor} cursor="pointer" w="100px" maxW="100px" minW="0px" />
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
                    <Text color={textColor} fontSize="sm" noOfLines={3}>
                      {row.title}
                    </Text>
                  </Td>
                  {/* <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={2}>
                      {row.shortDescription}
                    </Text>
                  </Td> */}
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" w="full" noOfLines={2} textAlign={"center"}>
                      {row.mainCategory.name}
                    </Text>
                  </Td>
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" w="full" noOfLines={2} textAlign={"center"}>
                      {row.subCategory.name}
                    </Text>
                  </Td>
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" w="full" noOfLines={2} textAlign={"center"}>
                      {row.topics?.join(", ")}
                    </Text>
                    {/* <Flex w="full" align="center" justify="center" flexWrap={"wrap"} gap="6px">
                      {row.topics?.map((topic, index) => (
                        <Tag key={index} variant={"lightBrand"} fontSize="16px" px="10px" py="6px" rounded="full">
                          <TagLabel>{topic}</TagLabel>
                        </Tag>
                      ))}
                    </Flex> */}
                  </Td>
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Flex w="full" align="center" justify="center" flexWrap={"wrap"} gap="6px">
                      <Tag
                        variant={"subtle"}
                        colorScheme={
                          row.status === "pending"
                            ? "blue"
                            : row.status === "published"
                              ? "green"
                              : row.status === "deleted"
                                ? "red"
                                : "orange"
                        }
                        fontSize="16px"
                        px="10px"
                        py="6px"
                        rounded="full"
                      >
                        <TagLabel>{row.status}</TagLabel>
                      </Tag>
                    </Flex>
                  </Td>
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Text color={textColor} fontSize="sm" w="full" noOfLines={2} textAlign={"center"}>
                      {row.createdBy.username}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" w="full" textAlign="center">
                      {dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Flex justify={"center"} align="center" gap="10px" flexWrap={"wrap"}>
                      {["draft", "private"].includes(row.status) && row.userId === user.id && (
                        <>
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
                          <CustomConfirmIconButton
                            title={`Publish ${row.title}`}
                            question={"Are you sure to publish this Post?"}
                            icon={MdOutlinePublic}
                            color="blue.500"
                            data={row}
                            onConfirm={() => confirmPublish(row.id)}
                          />
                        </>
                      )}
                      {row.status === "pending" && user.roleId === USER_ROLE.ADMIN && (
                        <>
                          <CustomConfirmIconButton
                            title={`Revert publish ${row.title}`}
                            question={"Are you sure to revert publish this Post?"}
                            icon={MdOutlinePublicOff}
                            color="orange.500"
                            data={row}
                            onConfirm={() => confirmUnPublish(row.id)}
                          />
                          <CustomConfirmIconButton
                            title={`Approve ${row.title}`}
                            question={"Are you sure to approve this Post?"}
                            icon={MdCheckCircle}
                            color="green.500"
                            data={row}
                            onConfirm={() => confirmApprove(row.id)}
                          />
                          <CustomConfirmIconButton
                            title={`Reject ${row.title}`}
                            question={"Are you sure to reject this Post?"}
                            icon={MdCancel}
                            color="red.500"
                            data={row}
                            onConfirm={() => confirmReject(row.id)}
                          />
                        </>
                      )}
                      {row.status === "published" && user.roleId === USER_ROLE.ADMIN && (
                        <CustomConfirmIconButton
                          title={`Disapprove ${row.title}`}
                          question={"Are you sure to make this Post private?"}
                          icon={MdOutlinePublicOff}
                          color="orange.500"
                          data={row}
                          onConfirm={() => confirmDisApprove(row.id)}
                        />
                      )}
                      {row.status === "deleted" && user.roleId === USER_ROLE.ADMIN && (
                        <CustomConfirmIconButton
                          title={`Delete ${row.title}`}
                          question={"Are you sure to delete this Post permanently?"}
                          icon={IoTrashBin}
                          color="black"
                          data={row}
                          onConfirm={() => confirmDeletePermanantly(row.id)}
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
            <Td colSpan={9} border={0}>
              <Flex w="full" align={"center"} justify={"space-between"} p="10px" pb={0}>
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
          title={`Remove ${deletingObj.title}`}
          question={"Are you sure to remove this Post?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDelete}
          onConfirm={() => confirmDelete(deletingObj.id)}
        />
      )}
    </CustomCard>
  );
}
