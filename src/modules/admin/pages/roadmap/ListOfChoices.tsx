import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Input, VStack } from "@chakra-ui/react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Controller, useForm } from "react-hook-form";
import { SortableItem } from "./SortableItem";
import { useEffect } from "react";

type Choice = {
  name: string;
  isRight: boolean;
  id?: number;
};

type FormType = {
  choices: Choice[];
};

export default function ListOfChoices({
  choices,
  rightChoices,
  disableChooseRightChoices = false,
  haveArrangement = false,
  isMultiChoices = false,
  onUpdateChoices,
  onUpdateRightChoices
}: {
  choices: Choice[];
  disableChooseRightChoices?: boolean;
  rightChoices: string[];
  haveArrangement?: boolean;
  isMultiChoices?: boolean;
  onUpdateChoices: (data: any) => void;
  onUpdateRightChoices: (data: any) => void;
}) {
  const derivedChoices = choices.map((choice, idx) => ({
    ...choice,
    isRight: rightChoices?.includes(choice.name),
    id: idx + 1
  }));

  useEffect(() => {
    reset({
      choices: choices.map((choice, idx) => ({
        ...choice,
        isRight: rightChoices?.includes(choice.name),
        id: idx + 1
      }))
    });
  }, [choices, rightChoices]);

  const { control, setValue, watch, reset } = useForm<FormType>({ defaultValues: { choices: derivedChoices } });

  const currentChoices = watch("choices");

  const addChoice = () => {
    const newChoice: Choice = {
      name: "",
      isRight: false,
      ...(haveArrangement ? { id: currentChoices.length + 1 } : {})
    };
    setValue("choices", [...currentChoices, newChoice]);
  };

  const deleteChoice = (id: number) => {
    const updatedChoices = currentChoices.filter((choice, i) => choice.id !== id);
    setValue("choices", updatedChoices);
  };

  const handleNameChange = (index: number, value: string) => {
    const updatedChoices = [...currentChoices];
    updatedChoices[index].name = value;
    setValue("choices", updatedChoices);
    onUpdateChoices(updatedChoices);
  };

  const handleIsRightChange = (id: number) => {
    const updatedChoices = isMultiChoices
      ? currentChoices.map((choice, i) => (choice.id === id ? { ...choice, isRight: !choice.isRight } : choice))
      : currentChoices.map((choice, i) => ({
          ...choice,
          isRight: choice.id === id
        }));
    setValue("choices", updatedChoices);
    onUpdateRightChoices(updatedChoices.filter((choice) => choice.isRight).map((choice) => choice.name));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = currentChoices.findIndex((choice) => choice.id === active.id);
      const newIndex = currentChoices.findIndex((choice) => choice.id === over.id);

      const updatedChoices = arrayMove(currentChoices, oldIndex, newIndex).map((choice, index) => ({
        ...choice,
        id: index + 1
      }));

      setValue("choices", updatedChoices);
      onUpdateRightChoices(
        disableChooseRightChoices
          ? updatedChoices
          : updatedChoices.filter((choice) => choice.isRight).map((choice) => choice.name)
      );
      onUpdateChoices(updatedChoices);
    }
  };

  return (
    <VStack w="full" align="start" spacing={1}>
      <Button border={"1px dashed"} onClick={addChoice} mb="10px">
        {"Thêm câu trả lời"}
      </Button>
      {haveArrangement ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentChoices.map((choice) => choice.id!)} strategy={verticalListSortingStrategy}>
            {currentChoices.map((choice, index) => (
              <SortableItem key={choice.id} id={choice.id!}>
                <Box w="full" display="flex" alignItems="center" gap={4}>
                  <DeleteIcon
                    color="red.500"
                    w="15px"
                    h="15px"
                    cursor={"pointer"}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChoice(choice.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                  <Controller
                    name={`choices.${index}.name`}
                    control={control}
                    render={() => (
                      <Input
                        value={choice.name}
                        placeholder="Nhập mô tả câu trả lời..."
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                      />
                    )}
                  />
                  {!disableChooseRightChoices && (
                    <Checkbox
                      w="200px"
                      isChecked={choice.isRight}
                      onPointerDown={(e) => e.stopPropagation()}
                      onChange={() => handleIsRightChange(choice.id)}
                    >
                      {"Câu trả lời đúng"}
                    </Checkbox>
                  )}
                  <Box cursor="grab">
                    <DragHandleIcon />
                  </Box>
                </Box>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        currentChoices.map((choice, index) => (
          <Box w="full" key={index} display="flex" alignItems="center" gap={4}>
            <DeleteIcon color="red.500" w="15px" h="15px" cursor={"pointer"} onClick={() => deleteChoice(choice.id)} />
            <Controller
              name={`choices.${index}.name`}
              control={control}
              render={() => (
                <Input
                  value={choice.name}
                  placeholder="Nhập mô tả câu trả lời..."
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              )}
            />
            <Checkbox w="200px" isChecked={choice.isRight} onChange={() => handleIsRightChange(choice.id)}>
              {"Câu trả lời đúng"}
            </Checkbox>
          </Box>
        ))
      )}
    </VStack>
  );
}
