import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import CustomSelect from "../../../../components/CustomSelect";
import roadmapService from "../../../../services/roadmapService";
import specialityService from "../../../../services/specialityService";
import { getErrorMessage } from "../../../../utils/helpers";
import NodeModal from "./NodeModal";

export default function RoadmapList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const [specialityList, setSpecialityList] = React.useState([]);
  const [specialitySelected, setSpecialitySelected] = React.useState<any>();

  const [levelSelected, setLevelSelected] = React.useState<number | undefined | null>();
  const [roadmapList, setRoadmapList] = React.useState([]);
  const [roadmapSelected, setRoadmapSelected] = React.useState<any>();
  const { isOpen: isOpenNode, onOpen: onOpenNode, onClose: onCloseNode } = useDisclosure();

  const [questionList, setQuestionList] = React.useState([]);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDeleteNode, onOpen: onOpenDeleteNode, onClose: onCloseDeleteNode } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await specialityService.getAll();
    setSpecialityList(list.rows);
  };

  React.useEffect(() => {
    init();
  }, []);

  const initRoadmap = async (levelId: number) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAll({
      specialityId: specialitySelected.id,
      levelId
    });
    setLevelSelected(levelId);
    setRoadmapList(list.rows);
    setQuestionList([]);
  };

  const initRoadmapQuestions = async (roadmapId: any) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestion(roadmapId);
    setQuestionList(list.rows);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/posts/${id}`);
  };

  const handleAddLevel = async () => {
    try {
      const { data: { data: updated } = { data: {} } } = await specialityService.increaseLevel(specialitySelected.id);

      setSpecialitySelected(updated);
      setLevelSelected(updated.numOfLevel);
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const handleDeleteLevel = async (levelId: number) => {
    try {
      const { data: { data: updated } = { data: {} } } = await specialityService.deleteLevel(
        specialitySelected.id,
        levelId
      );

      setSpecialitySelected(updated);
      setLevelSelected(null);
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const handleAddNode = async () => {
    setRoadmapSelected({});
    onOpenNode();
  };

  const handleUpdateNode = (data: any) => {
    setRoadmapSelected(data);
    onOpenNode();
  };

  const handleUpdateRoadmap = async (id: number, data: any) => {
    if (id === -1) {
      setRoadmapList([...roadmapList, data]);
      return;
    }
    setRoadmapList(
      roadmapList.map((item: any) => {
        if (item.id === id) {
          return { ...item, ...data };
        }

        return item;
      })
    );
  };

  const handleSelectSpeciality = (id: number) => {
    setSpecialitySelected(specialityList.find((item: any) => item.id === id));
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleUnSelectSpeciality = () => {
    setSpecialitySelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleDeleteNode = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDeleteNode();
  };

  const confirmDeleteNode = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await roadmapService.delete(id);

      setDeletingObj(null);
      setRoadmapList(roadmapList.filter((item: any) => item.id !== id));
      onCloseDeleteNode();
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
            <Button w="full" border={"dashed"} onClick={handleAddLevel}>
              {"Thêm level"}
            </Button>
            {Array.from({ length: specialitySelected?.numOfLevel ?? 0 }, (_, index) => (
              <Flex key={index} w="full" align="center" gap="10px">
                <Button variant={"brand"} w="full" bg={"brand.900"} onClick={() => initRoadmap(index + 1)}>
                  Level {index + 1}
                </Button>
                <DeleteIcon
                  color="red.500"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => handleDeleteLevel(index + 1)}
                />
              </Flex>
            ))}
          </VStack>
        </VStack>
        <Box h="600px" px={5} w="1px">
          <Divider orientation="vertical" />
        </Box>
        <VStack w="300px" minW="300px" spacing={"12px"} align="flex-start">
          <Button w="full" border={"dashed"} onClick={handleAddNode}>
            {"Thêm node"}
          </Button>
          <Box w="full" maxH="680px" overflowY={"scroll"}>
            <VStack w="full" spacing={"12px"} align="flex-start">
              {roadmapList
                .sort((a: any, b: any) => a.idx - b.idx)
                .map((item: any) => (
                  <Flex key={item.id} w="full" align="center" gap="10px">
                    <Button variant={"brand"} w="full" bg={"brand.800"} onClick={() => initRoadmapQuestions(item.id)}>
                      {item.name}
                    </Button>
                    <EditIcon
                      color="brand.600"
                      w="15px"
                      h="15px"
                      cursor={"pointer"}
                      onClick={() => handleUpdateNode(item)}
                    />
                    <DeleteIcon
                      color="red.500"
                      w="15px"
                      h="15px"
                      cursor={"pointer"}
                      onClick={() => handleDeleteNode(item)}
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
                  {/* <DeleteIcon
                    color="red.500"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleDelete(item.id)}
                  /> */}
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Stack>
      {isOpenNode && (
        <NodeModal
          speciality={specialitySelected}
          levelId={levelSelected}
          data={roadmapSelected}
          onUpdate={handleUpdateRoadmap}
          onClose={onCloseNode}
        />
      )}
      {isOpenDeleteNode && deletingObj && (
        <CustomConfirmAlert
          title={`Remove ${deletingObj.name}`}
          question={"Are you sure to remove this Node?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDeleteNode}
          onConfirm={() => confirmDeleteNode(deletingObj.id)}
        />
      )}
    </CustomCard>
  );
}
