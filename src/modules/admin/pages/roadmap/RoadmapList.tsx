import { DeleteIcon, EditIcon, Icon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
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
  useToast,
  VStack
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
import specialityService from "../../../../services/specialityService";
import CustomSelect from "../../../../components/CustomSelect";
import roadmapService from "../../../../services/roadmapService";
import { set } from "lodash";

export default function RoadmapList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const [specialityList, setSpecialityList] = React.useState([]);
  const [specialitySelected, setSpecialitySelected] = React.useState<any>();

  const [roadmapList, setRoadmapList] = React.useState([]);
  const [questionList, setQuestionList] = React.useState([]);
  const [initialized, setInitialized] = React.useState<boolean>(false);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await specialityService.getAll();
    setSpecialityList(list.rows);
    setInitialized(true);
  };

  React.useEffect(() => {
    init();
  }, []);

  const initRoadmap = async (levelId: number) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAll({
      specialityId: specialitySelected.id,
      levelId
    });
    setRoadmapList(list.rows);
    setQuestionList([]);
  };

  const initRoadmapQuestions = async (roadmapId: number) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestion(roadmapId);
    setQuestionList(list.rows);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/posts/${id}`);
  };

  const handleDelete = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDelete();
  };

  const handleSelectSpeciality = (id: number) => {
    setSpecialitySelected(specialityList.find((item: any) => item.id === id));
    setQuestionList([]);
  };

  const handleUnSelectSpeciality = () => {
    setSpecialitySelected({});
    setRoadmapList([]);
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
    <CustomCard flexDirection="column" w="100%" px="0px" minH="600px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Stack w="full" direction={{ base: "column", md: "row" }} spacing={0} align="flex-start">
        <VStack w="300px" minW="300px" spacing={"12px"} align="flex-start">
          <Flex w="full" pl="25px" mb="8px" justifyContent="flex-start" align="center" gap={"10px"}>
            <CustomSelect
              w="full"
              placeholder="Chọn ngành.."
              allowAddNew={false}
              name={"speciality"}
              value={[specialitySelected?.id ?? ""]}
              options={specialityList.map((item: any) => ({
                label: item.name,
                value: item.id
              }))}
              onSelected={(value) => handleSelectSpeciality(parseInt(value[0]))}
              onRemove={(_value, _idx) => handleUnSelectSpeciality()}
            />
          </Flex>
          <VStack w="full" pl="25px" spacing={"12px"} align="flex-start">
            <Button w="full" border={"dashed"}>
              {"Thêm level"}
            </Button>
            {Array.from({ length: specialitySelected?.numOfLevel ?? 0 }, (_, index) => (
              <Button key={index} variant={"brand"} w="full" bg={"brand.900"} onClick={() => initRoadmap(index + 1)}>
                Level {index + 1}
              </Button>
            ))}
          </VStack>
        </VStack>
        <Box h="600px" px={5} w="1px">
          <Divider orientation="vertical" />
        </Box>
        <VStack w="300px" minW="300px" spacing={"12px"} align="flex-start">
          <Button w="full" border={"dashed"}>
            {"Thêm node"}
          </Button>
          <Box w="full" maxH="680px" overflowY={"scroll"}>
            <VStack w="full" spacing={"12px"} align="flex-start">
              {roadmapList.map((item: any) => (
                <Flex key={item.id} w="full" align="center" gap="10px">
                  <Button variant={"brand"} w="full" bg={"brand.800"} onClick={() => initRoadmapQuestions(item.id)}>
                    {item.name}
                  </Button>
                  <EditIcon
                    color="brand.600"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleEdit(item.id)}
                  />
                  <DeleteIcon
                    color="red.500"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleDelete(item.id)}
                  />
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
        <Box h="600px" px={5} w="1px">
          <Divider orientation="vertical" />
        </Box>
        <VStack w="full" spacing={"12px"} align="flex-start" pr={"25px"}>
          <Button w="full" border={"dashed"}>
            {"Thêm câu hỏi"}
          </Button>
          <Box w="full" maxH="680px" overflowY={"scroll"}>
            <VStack w="full" spacing={"12px"} align="flex-start">
              {questionList.map((item: any) => (
                <Flex key={item.id} w="full" align="center" gap="10px">
                  <Button variant={"brand"} w="full" bg={"brand.600"}>
                    {item.title}
                  </Button>
                  <EditIcon
                    color="brand.600"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleEdit(item.id)}
                  />
                  <DeleteIcon
                    color="red.500"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleDelete(item.id)}
                  />
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Stack>

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
