import { DeleteIcon, EditIcon, Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
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
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomCard from "../../../../components/CustomCard";
import Pagination from "../../../../components/Pagination";
import { PAGE_ITEMS } from "../../../../utils/constants";
import { FaPlus } from "react-icons/fa6";
import { getErrorMessage } from "../../../../utils/helpers";
import AppToast from "../../../../components/AppToast";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import postService from "../../../../services/postService";

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
  createdAt: Date;
  updatedAt: Date;
};

export default function PostList() {
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
    const { data: { data: list } = { data: {} } } = await postService.getAll({
      page,
      pageSize: itemsPerPage,
      filter: JSON.stringify({ title: search })
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
    navigate(`/admin/posts/${id}`);
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
        <Button variant="action" onClick={() => navigate("/admin/posts/new")}>
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
              w="120px"
              px="10px"
            >
              Thumbnail
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
              Trích dẫn
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
              Topics
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
                      {row.title}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Center w="full">
                      <Image src={row.thumbnail} alt="post-image" w={"100px"} h={"100px"} objectFit={"contain"} />
                    </Center>
                  </Td>
                  <Td borderColor={borderColor} px="10px">
                    <Text color={textColor} fontSize="sm" noOfLines={2}>
                      {row.shortDescription}
                    </Text>
                  </Td>
                  <Td fontSize={{ sm: "14px" }} borderColor={borderColor}>
                    <Flex w="full" align="center" justify="center" flexWrap={"wrap"} gap="6px">
                      {row.topics?.map((topic, index) => (
                        <Tag key={index} variant={"lightBrand"} fontSize="16px" px="10px" py="6px" rounded="full">
                          <TagLabel>{topic}</TagLabel>
                        </Tag>
                      ))}
                    </Flex>
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
            <Td colSpan={8} pb={0} border={0}>
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
