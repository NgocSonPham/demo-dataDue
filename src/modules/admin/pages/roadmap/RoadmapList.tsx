import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Stack, useDisclosure, useToast, VStack } from "@chakra-ui/react";
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
import LevelModal from "./LevelModal";

export default function RoadmapList() {
  const toast = useToast();
  const navigate = useNavigate();

  const [specialityList, setSpecialityList] = React.useState([]);
  const [specialitySelected, setSpecialitySelected] = React.useState<any>();

  const [levelSelected, setLevelSelected] = React.useState<any>();
  const { isOpen: isOpenLevel, onOpen: onOpenLevel, onClose: onCloseLevel } = useDisclosure();

  const [roadmapList, setRoadmapList] = React.useState([]);
  const [roadmapUpdate, setRoadmapUpdate] = React.useState<any>();
  const [roadmapSelected, setRoadmapSelected] = React.useState<any>();
  const { isOpen: isOpenNode, onOpen: onOpenNode, onClose: onCloseNode } = useDisclosure();

  const [questionList, setQuestionList] = React.useState([]);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDeleteNode, onOpen: onOpenDeleteNode, onClose: onCloseDeleteNode } = useDisclosure();
  const {
    isOpen: isOpenDeleteQuestion,
    onOpen: onOpenDeleteQuestion,
    onClose: onCloseDeleteQuestion
  } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await specialityService.getAll();
    setSpecialityList(list.rows);
  };

  React.useEffect(() => {
    init();
  }, []);

  const initSpeciality = async (id: number) => {
    const { data: { data } = { data: {} } } = await specialityService.getById(id);
    setSpecialitySelected(data);
  }

  const initRoadmap = async (level: any) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAll({
      specialityId: specialitySelected.id,
      levelId: level.id
    });
    setLevelSelected(level);
    setRoadmapList(list.rows);
    setQuestionList([]);
  };

  const initRoadmapQuestions = async (roadmapId: any) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestion(roadmapId);
    setRoadmapSelected(roadmapId);
    setQuestionList(list.rows);
  };

  const handleSelectSpeciality = (id: number) => {
    if (isNaN(id)) return;
    initSpeciality(id);
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

  const handleAddLevel = async () => {
    setLevelSelected({});
    onOpenLevel();
  };

  const handleUpdateLevel = async (level: any) => {
    setLevelSelected(level);
    onOpenLevel();
  };

  const handleUpdateLevelFinal = async (speciality: any) => {
    setSpecialitySelected(speciality);
  };

  const handleDeleteLevel = async (level: any) => {
    try {
      const hasLevel = specialitySelected.levels.some((item: any) => item.idx > level.idx);
      if (hasLevel) {
        toast({
          position: "top-right",
          render: ({ onClose }) => <AppToast status={"error"} subtitle={"Vui lòng xoá theo thứ tự"} onClose={onClose} />
        });
        return;
      }

      const { data: { data: updated } = { data: {} } } = await specialityService.deleteLevel(
        specialitySelected.id,
        level.id
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
    setRoadmapUpdate({});
    onOpenNode();
  };

  const handleUpdateNode = (data: any) => {
    setRoadmapUpdate(data);
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

  const handleDeleteQuestion = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDeleteQuestion();
  };

  const confirmDeleteQuestion = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await roadmapService.deleteQuestion(roadmapSelected, id);

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
            {specialitySelected?.levels?.map((item: any) => (
              <Flex key={item.id} w="full" align="center" gap="10px">
                <Button variant={"brand"} w="full" bg={"brand.900"} onClick={() => initRoadmap(item)}>
                  {item.name}
                </Button>
                <EditIcon
                  color="brand.600"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => handleUpdateLevel(item)}
                />
                <DeleteIcon
                  color="red.500"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => handleDeleteLevel(item)}
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
          <Button
            w="full"
            border={"dashed"}
            onClick={() => {
              navigate(`/admin/roadmaps/${roadmapSelected}/questions/new`);
            }}
          >
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
                    onClick={() => {
                      navigate(`/admin/roadmaps/${roadmapSelected}/questions/${item.id}`);
                    }}
                  />
                  <DeleteIcon
                    color="red.500"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={() => handleDeleteQuestion(item)}
                  />
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Stack>
      {isOpenLevel && (
        <LevelModal
          speciality={specialitySelected}
          data={levelSelected}
          onUpdate={handleUpdateLevelFinal}
          onClose={onCloseLevel}
        />
      )}
      {isOpenNode && (
        <NodeModal
          speciality={specialitySelected}
          levelId={levelSelected.id}
          data={roadmapUpdate}
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
      {isOpenDeleteQuestion && deletingObj && (
        <CustomConfirmAlert
          title={`Remove ${deletingObj.title}`}
          question={"Are you sure to remove this Question?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDeleteQuestion}
          onConfirm={() => confirmDeleteQuestion(deletingObj.id)}
        />
      )}
    </CustomCard>
  );
}
