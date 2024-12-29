import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, HStack, Icon, Stack, useDisclosure, useToast, VStack } from "@chakra-ui/react";
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
import courseService from "../../../../services/courseService";
import CourseModal from "./CourseModal";
import { isEmpty, set } from "lodash";

export default function RoadmapList() {
  const toast = useToast();
  const navigate = useNavigate();

  const [specialityList, setSpecialityList] = React.useState([]);
  const [specialitySelected, setSpecialitySelected] = React.useState<any>();

  const [courseList, setCourseList] = React.useState([]);
  const [courseSelected, setCourseSelected] = React.useState<any>();
  const [courseUpdate, setCourseUpdate] = React.useState<any>();
  const { isOpen: isOpenCourse, onOpen: onOpenCourse, onClose: onCloseCourse } = useDisclosure();

  const [levelSelected, setLevelSelected] = React.useState<any>();
  const { isOpen: isOpenLevel, onOpen: onOpenLevel, onClose: onCloseLevel } = useDisclosure();

  const [roadmapList, setRoadmapList] = React.useState([]);
  const [roadmapUpdate, setRoadmapUpdate] = React.useState<any>();
  const [roadmapSelected, setRoadmapSelected] = React.useState<any>();
  const { isOpen: isOpenNode, onOpen: onOpenNode, onClose: onCloseNode } = useDisclosure();

  const [lessonList, setLessonList] = React.useState([]);
  const [lessonSelected, setLessonSelected] = React.useState<any>();

  const [questionList, setQuestionList] = React.useState([]);

  const [deletingObj, setDeletingObj] = React.useState<any>();
  const { isOpen: isOpenDeleteCourse, onOpen: onOpenDeleteCourse, onClose: onCloseDeleteCourse } = useDisclosure();
  const { isOpen: isOpenDeleteNode, onOpen: onOpenDeleteNode, onClose: onCloseDeleteNode } = useDisclosure();
  const { isOpen: isOpenDeleteLesson, onOpen: onOpenDeleteLesson, onClose: onCloseDeleteLesson } = useDisclosure();
  const {
    isOpen: isOpenDeleteQuestion,
    onOpen: onOpenDeleteQuestion,
    onClose: onCloseDeleteQuestion
  } = useDisclosure();

  const init = async () => {
    const { data: { data: list } = { data: {} } } = await specialityService.getAll();
    setSpecialityList(list.rows);
  };

  const initCourses = async (specialityId: number) => {
    const { data: { data: list } = { data: {} } } = await specialityService.getAllCourses(specialityId);
    setCourseList(list);
  };

  const initLessons = async (roadmapId: number) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllLessons(roadmapId);
    setLessonList(list);
  };

  React.useEffect(() => {
    init();
  }, []);

  const initSpeciality = async (id: number) => {
    // const { data: { data } = { data: {} } } = await specialityService.getById(id);
    const data = specialityList.find((item: any) => item.id === id);
    setSpecialitySelected(data);
    initCourses(data.id);
  };

  const initCourse = async (id: number) => {
    const { data: { data } = { data: {} } } = await courseService.getById(id);
    // const data = courseList.find((item: any) => item.id === id);
    setCourseSelected(data);
  };

  const initRoadmap = async (level: any) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAll({
      courseId: courseSelected.id,
      levelId: level.id
    });
    setLevelSelected(level);
    setRoadmapList(list.rows);
    setQuestionList([]);
  };

  const initLesson = async (lessonId: any) => {
    setLessonSelected(lessonList.find((item: any) => item.id === lessonId));
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestions(roadmapSelected.id, {
      lessonId
    });
    setQuestionList(list.rows);
  };

  const initRoadmapQuestions = async (roadmap: any) => {
    setRoadmapSelected(roadmap);
    setLessonSelected({});
    if (["practice", "final-test"].includes(roadmap.type)) {
      const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestions(roadmap.id);
      setQuestionList(list.rows);
    } else {
      const { data: { data: list } = { data: {} } } = await roadmapService.getAllLessons(roadmap.id);
      setLessonList(list.rows);
      setQuestionList([]);
    }
  };

  const handleSelectSpeciality = (id: number) => {
    if (isNaN(id)) return;
    initSpeciality(id);
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleUnSelectSpeciality = () => {
    setSpecialitySelected({});
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleSelectCourse = (id: number) => {
    if (isNaN(id)) return;
    initCourse(id);
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleUnSelectCourse = () => {
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
  };

  const handleAddCourse = async () => {
    setCourseUpdate({});
    onOpenCourse();
  };

  const handleUpdateCourse = async (course: any) => {
    setCourseUpdate(course);
    onOpenCourse();
  };

  const handleDeleteCourse = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDeleteCourse();
  };

  const confirmDeleteCourse = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await courseService.delete(id);

      setDeletingObj(null);
      setCourseSelected({});
      initCourses(specialitySelected.id);
      onCloseDeleteNode();
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  };

  const handleAddLevel = async () => {
    setLevelSelected({});
    onOpenLevel();
  };

  const handleUpdateLevel = async (level: any) => {
    setLevelSelected(level);
    onOpenLevel();
  };

  const handleUpdateLevelFinal = async (course: any) => {
    setCourseSelected(course);
  };

  const handleDeleteLevel = async (level: any) => {
    try {
      const hasLevel = courseSelected.levels.some((item: any) => item.idx > level.idx);
      if (hasLevel) {
        toast({
          position: "top-right",
          render: ({ onClose }) => <AppToast status={"error"} subtitle={"Vui lòng xoá theo thứ tự"} onClose={onClose} />
        });
        return;
      }

      const { data: { data: updated } = { data: {} } } = await courseService.deleteLevel(courseSelected.id, level.id);
      setCourseSelected(updated);
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

  const handleSelectLesson = (id: number) => {
    if (isNaN(id)) return;
    initLesson(id);
    setQuestionList([]);
  };

  const handleUnSelectLesson = () => {
    setLessonSelected({});
    setLessonSelected(null);
    setQuestionList([]);
  };

  const handleDeleteLesson = async (obj: any) => {
    setDeletingObj(obj);
    onOpenDeleteLesson();
  };

  const confirmDeleteLesson = async (id: number) => {
    try {
      const { data: { data: _updated } = { data: {} } } = await roadmapService.deleteLesson(roadmapSelected.id, id);

      setDeletingObj(null);
      setLessonSelected({});
      initLessons(roadmapSelected.id);
      onCloseDeleteLesson();
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
          <Flex w="full" pl="25px" justifyContent="flex-start" align="center" gap={"10px"}>
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
          <HStack w="full" pl="25px" gap={"2px"}>
            <CustomSelect
              w="full"
              placeholder="Chọn khóa học.."
              allowAddNew={false}
              name={"speciality"}
              value={[courseSelected?.id ?? ""]}
              options={courseList.map((item: any) => ({
                label: item.name,
                value: item.id
              }))}
              onSelected={(value) => handleSelectCourse(parseInt(value[0]))}
              onRemove={(_value, _idx) => handleUnSelectCourse()}
            />
            {!isEmpty(courseSelected) && (
              <>
                <EditIcon
                  color="brand.600"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => handleUpdateCourse(courseSelected)}
                />
                <DeleteIcon
                  color="red.500"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => handleDeleteCourse(courseSelected)}
                />
              </>
            )}
            <PlusSquareIcon color="brand.600" w="15px" h="15px" cursor={"pointer"} onClick={handleAddCourse} />
          </HStack>
          <VStack w="full" pl="25px" spacing={"12px"} align="flex-start">
            <Button w="full" border={"1px dashed"} onClick={handleAddLevel}>
              {"Thêm level"}
            </Button>
            {courseSelected?.levels?.map((item: any) => (
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
          <Button w="full" border={"1px dashed"} onClick={handleAddNode}>
            {"Thêm node"}
          </Button>
          <Box w="full" maxH="680px" overflowY={"scroll"}>
            <VStack w="full" spacing={"12px"} align="flex-start">
              {roadmapList
                .sort((a: any, b: any) => a.idx - b.idx)
                .map((item: any) => (
                  <Flex key={item.id} w="full" align="center" gap="10px">
                    <Button variant={"brand"} w="full" bg={"brand.800"} onClick={() => initRoadmapQuestions(item)}>
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
          <HStack w="full" gap={"2px"}>
            <CustomSelect
              w="full"
              placeholder="Chọn bài học.."
              allowAddNew={false}
              name={"lesson"}
              value={[lessonSelected?.id ?? ""]}
              options={lessonList.map((item: any) => ({
                label: item.title,
                value: item.id
              }))}
              onSelected={(value) => handleSelectLesson(parseInt(value[0]))}
              onRemove={(_value, _idx) => handleUnSelectLesson()}
            />
            {!isEmpty(lessonSelected) && (
              <>
                <EditIcon
                  color="brand.600"
                  w="15px"
                  h="15px"
                  cursor={"pointer"}
                  onClick={() => {
                    navigate(`/admin/roadmaps/${roadmapSelected.id}/lessons/${lessonSelected.id}`);
                  }}
                />
                <DeleteIcon color="red.500" w="15px" h="15px" cursor={"pointer"} onClick={handleDeleteLesson} />
              </>
            )}
            <PlusSquareIcon
              color="brand.600"
              w="15px"
              h="15px"
              cursor={"pointer"}
              onClick={() => {
                navigate(`/admin/roadmaps/${roadmapSelected.id}/lessons/new`);
              }}
            />
          </HStack>
          <Button
            w="full"
            border={"1px dashed"}
            onClick={() => {
              navigate(`/admin/roadmaps/${roadmapSelected.id}/questions/new${lessonSelected ? `?lessonId=${lessonSelected.id}` : ""}`);
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
                      navigate(`/admin/roadmaps/${roadmapSelected.id}/questions/${item.id}`);
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
      {isOpenCourse && (
        <CourseModal
          speciality={specialitySelected}
          specialityList={specialityList}
          data={courseUpdate}
          onUpdate={() => initCourses(specialitySelected.id)}
          onClose={onCloseCourse}
        />
      )}
      {isOpenLevel && (
        <LevelModal
          course={courseSelected}
          data={levelSelected}
          onUpdate={handleUpdateLevelFinal}
          onClose={onCloseLevel}
        />
      )}
      {isOpenNode && (
        <NodeModal
          course={courseSelected}
          levelId={levelSelected.id}
          data={roadmapUpdate}
          onUpdate={handleUpdateRoadmap}
          onClose={onCloseNode}
        />
      )}
      {isOpenDeleteCourse && deletingObj && (
        <CustomConfirmAlert
          title={`Remove ${deletingObj.name}`}
          question={"Are you sure to remove this Course?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDeleteCourse}
          onConfirm={() => confirmDeleteCourse(deletingObj.id)}
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
      {isOpenDeleteLesson && deletingObj && (
        <CustomConfirmAlert
          title={`Remove ${deletingObj.name}`}
          question={"Are you sure to remove this Lesson?"}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onCloseDeleteLesson}
          onConfirm={() => confirmDeleteLesson(deletingObj.id)}
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
