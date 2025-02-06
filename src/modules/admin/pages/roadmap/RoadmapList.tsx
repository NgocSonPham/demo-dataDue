import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, HStack, Icon, Stack, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomConfirmAlert from "../../../../components/CustomConfirmAlert";
import CustomSelect from "../../../../components/CustomSelect";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectSpecialities } from "../../../../redux/slice";
import courseService from "../../../../services/courseService";
import roadmapService from "../../../../services/roadmapService";
import specialityService from "../../../../services/specialityService";
import { getErrorMessage } from "../../../../utils/helpers";
import CourseModal from "./CourseModal";
import LevelModal from "./LevelModal";
import NodeModal from "./NodeModal";

export default function RoadmapList() {
  const toast = useToast();
  const navigate = useNavigate();

  const specialityList = useAppSelector(selectSpecialities);

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

  const addQuery = (key?: string, value?: any) => {
    // Parse existing query parameters
    const searchParams = new URLSearchParams(location.search);

    // Add new query parameter
    searchParams.set(key, value);

    // Update the URL without reloading
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const removeQuery = (key: string | string[]) => {
    // Parse existing query parameters
    const searchParams = new URLSearchParams(location.search);

    if (Array.isArray(key)) {
      // If key is an array, remove all specified keys
      key.forEach((k) => searchParams.delete(k));
    } else {
      // If key is a string, remove the specified key
      searchParams.delete(key);
    }

    // Update the URL while keeping history
    navigate(`${location.pathname}?${searchParams.toString()}`);
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
    const searchParams = new URLSearchParams(location.search);
    const specialityId = searchParams.get("speciality");
    if (specialityId) {
      initSpeciality(parseInt(specialityId));
    }
  }, [specialityList]);

  const initSpeciality = async (id: number) => {
    // const { data: { data } = { data: {} } } = await specialityService.getById(id);
    if (isEmpty(specialityList)) return;
    const data = specialityList.find((item: any) => item.id === id);
    setSpecialitySelected(data);
    initCourses(data.id);
    addQuery("speciality", data.id);

    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get("course");
    if (courseId) {
      initCourse(parseInt(courseId));
    } else removeQuery("course");
  };

  const initCourse = async (id: number) => {
    const { data: { data } = { data: {} } } = await courseService.getById(id);
    // const data = courseList.find((item: any) => item.id === id);
    setCourseSelected(data);

    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);

    addQuery("course", id);

    const searchParams = new URLSearchParams(location.search);
    const levelId = searchParams.get("level");
    if (levelId) {
      const level = data.levels.find((item: any) => item.id === parseInt(levelId));
      initRoadmap(level, id);
    } else removeQuery("level");
  };

  const initRoadmap = async (level: any, courseId?: number) => {
    const { data: { data: list } = { data: {} } } = await roadmapService.getAll({
      courseId: courseId ?? courseSelected.id,
      levelId: level.id
    });
    setLevelSelected(level);
    setRoadmapList(list.rows);
    setQuestionList([]);
    addQuery("level", level.id);

    const searchParams = new URLSearchParams(location.search);
    const roadmapId = searchParams.get("roadmap");
    if (roadmapId) {
      const roadmap = list.rows.find((item: any) => item.id === parseInt(roadmapId));
      initRoadmapQuestions(roadmap);
    } else removeQuery("roadmap");
  };

  const initRoadmapQuestions = async (roadmap: any) => {
    setRoadmapSelected(roadmap);
    setLessonSelected({});
    addQuery("roadmap", roadmap.id);

    let lessonList = [];
    if (["practice", "final-test"].includes(roadmap.type)) {
      const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestions(roadmap.id);
      setQuestionList(list.rows);
      lessonList = list.rows;
    } else {
      const { data: { data: list } = { data: {} } } = await roadmapService.getAllLessons(roadmap.id);
      setLessonList(list.rows);
      setQuestionList([]);
      lessonList = list.rows;
    }

    const searchParams = new URLSearchParams(location.search);
    const lessonId = searchParams.get("lesson");
    if (lessonId) {
      const lesson = lessonList.find((item: any) => item.id === parseInt(lessonId));
      initLesson(lesson, roadmap.id);
    } else removeQuery("lesson");
  };

  const initLesson = async (lesson: any, roadmapId?: number) => {
    setLessonSelected(lesson);
    const { data: { data: list } = { data: {} } } = await roadmapService.getAllQuestions(
      roadmapId ?? roadmapSelected.id,
      {
        lessonId: lesson.id
      }
    );
    setQuestionList(list.rows);
    addQuery("lesson", lesson.id);
  };

  const handleSelectSpeciality = (id: number) => {
    if (isNaN(id)) return;
    initSpeciality(id);
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);

    removeQuery("level");
    removeQuery("roadmap");
    removeQuery("lesson");
  };

  const handleUnSelectSpeciality = () => {
    setSpecialitySelected({});
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
    removeQuery("speciality");
    removeQuery("course");
    removeQuery("level");
    removeQuery("roadmap");
    removeQuery("lesson");
  };

  const handleSelectCourse = (id: number) => {
    if (isNaN(id)) return;
    initCourse(id);

    removeQuery("roadmap");
    removeQuery("lesson");
  };

  const handleUnSelectCourse = () => {
    setCourseSelected({});
    setLevelSelected(null);
    setRoadmapList([]);
    setQuestionList([]);
    removeQuery("course");
    removeQuery("level");
    removeQuery("roadmap");
    removeQuery("lesson");
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

  const handleSelectLevel = (item: any) => {
    initRoadmap(item);
    removeQuery("lesson");
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
    const lesson = lessonList.find((item: any) => item.id === id);
    initLesson(lesson);
  };

  const handleUnSelectLesson = () => {
    setLessonSelected({});
    setLessonSelected(null);
    setQuestionList([]);
    removeQuery("lesson");
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
            <Flex w="full" maxW="40px" gap={"8px"} align="center" flexWrap={"wrap"}>
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
              <Icon as={FaShareFromSquare} color="brand.600" w="15px" h="15px" cursor={"pointer"} />
            </Flex>
          </HStack>
          <VStack w="full" pl="25px" spacing={"12px"} align="flex-start">
            <Button w="full" border={"1px dashed"} onClick={handleAddLevel}>
              {"Thêm level"}
            </Button>
            {courseSelected?.levels?.map((item: any) => (
              <Flex key={item.id} w="full" align="center" gap="10px">
                <Button variant={"brand"} w="full" bg={"brand.900"} onClick={() => handleSelectLevel(item)}>
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
            <Icon as={FaShareFromSquare} color="brand.600" w="15px" h="15px" cursor={"pointer"} />
          </HStack>
          <Button
            w="full"
            border={"1px dashed"}
            onClick={() => {
              navigate(
                `/admin/roadmaps/${roadmapSelected.id}/questions/new${lessonSelected ? `?lessonId=${lessonSelected.id}` : ""}`
              );
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
