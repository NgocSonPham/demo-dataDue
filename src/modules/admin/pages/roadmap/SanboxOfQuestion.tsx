import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { Center, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../../../components/CustomInput";
import { isEmpty } from "lodash";
import ContentEditor from "../../../../components/ContentEditor";

type FormType = {
  sandbox: any;
};

export default function SanboxOfQuestion({
  sandbox,
  onUpdateSanbox
}: {
  sandbox: any;
  onUpdateSanbox: (data: any) => void;
}) {
  const [tabSelected, setTabSelected] = useState<any>();
  const [tabEditing, setTabEditing] = useState<number | null>(null);
  const [tabName, setTabName] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isEmpty(sandbox)) {
      setTabSelected(sandbox[0]);
    }
  }, []);

  useEffect(() => {
    if (deleted) {
      const currentSandbox = watch("sandbox");
      if (!isEmpty(currentSandbox)) setTabSelected(sandbox[0]);
      setDeleted(false);
    }
  }, [deleted]);

  const { control, setValue, watch, reset } = useForm<FormType>({ defaultValues: { sandbox } });

  const addTab = () => {
    const currentSandbox = watch("sandbox");
    setTabSelected({ id: currentSandbox.length + 1, name: "", content: "" });
    setTabEditing(currentSandbox.length + 1);
    setValue("sandbox", [...currentSandbox, { id: currentSandbox.length + 1, name: "", content: "" }]);
  };

  const deleteTab = (id: number) => {
    const currentSandbox = watch("sandbox");
    const updated = currentSandbox.filter((item: any) => item.id !== id);
    setValue("sandbox", updated);
    onUpdateSanbox(updated);
    setDeleted(true);
  };

  const handleChangeTabName = () => {
    if (!tabName) return;
    const currentSandbox = watch("sandbox");
    const updated = currentSandbox.map((item: any) => {
      if (item.id === tabSelected.id) {
        item.name = tabName;
      }
      return item;
    });
    setValue("sandbox", updated);
    onUpdateSanbox(updated);
    setTabEditing(null);
    setTabName(null);
  };

  const handleChangeContent = (content: string) => {
    const currentSandbox = watch("sandbox");
    const updated = currentSandbox.map((item: any) => {
      if (item.id === tabSelected.id) {
        item.content = content;
      }
      return item;
    });
    setValue("sandbox", updated);
    onUpdateSanbox(updated);
  };

  return (
    <VStack w="full" align="start" spacing={1}>
      <HStack w="full" bg="white" spacing="8px" overflow="auto" p="2px">
        {watch("sandbox").map((item: any) => (
          <Center
            key={item.id}
            w="full"
            minW="160px"
            maxW="320px"
            h="34px"
            boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
            borderBottom="4px"
            borderColor={tabSelected?.id === item.id ? "#E84771" : "transparent"}
            _hover={{ borderColor: "#E84771" }}
            cursor="pointer"
            position="relative"
            px="8px"
            py="6px"
            onClick={() => setTabSelected(item)}
            onDoubleClick={() => {
              setTabEditing(item.id);
              setTabName(item.name);
            }}
          >
            {tabEditing === item.id ? (
              <HStack w="full" spacing={1}>
                <Input
                  w="full"
                  variant={"unstyled"}
                  size="xs"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                />
                <CheckIcon h={"10px"} onClick={handleChangeTabName} />
              </HStack>
            ) : (
              <HStack w="full" spacing={1}>
                <Text w="full" color="contentPrimary" fontSize="14px" fontWeight="500" noOfLines={1}>
                  {item.name}
                </Text>
                <DeleteIcon color="red" h={"10px"} onClick={() => deleteTab(item.id)} />
              </HStack>
            )}
          </Center>
        ))}

        <Center
          w="full"
          minW="60px"
          maxW="60px"
          h="34px"
          cursor="pointer"
          position="relative"
          px="8px"
          py="10px"
          onClick={addTab}
          boxShadow="0px 0px 2px rgba(0, 0, 0, 0.75)"
          borderBottom="4px"
          borderColor={"transparent"}
          _hover={{ borderColor: "#E84771" }}
        >
          <AddIcon h={"10px"} />
        </Center>
      </HStack>

      {tabSelected && (
        <ContentEditor
          key={tabSelected.id}
          type={"html"}
          content={tabSelected?.content ?? ""}
          onChange={handleChangeContent}
        />
      )}
    </VStack>
  );
}
