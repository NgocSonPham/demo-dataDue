"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  HStack,
  Portal
} from "@chakra-ui/react";
import React from "react";
import C4UCKeditor from "./C4UCKeditor";

export default function UpdatePostDrawer({
  name,
  title,
  content,
  onClose,
  onSave,
}: {
  name: string;
  title: string;
  content: string;
  onClose: () => void;
  onSave: (name: string, value: string) => void;
}) {
  const [editingData, setEditingData] = React.useState(content);

  // const save = async () => {
  //   onSave(name, editingData, null);
  // };

  const onSubmit = () => {
    onSave(name, editingData);
    onClose();
  }

  return (
    <Portal>
      <Drawer isOpen={true} onClose={onClose} size={"full"}>
        <DrawerContent>
          <DrawerCloseButton
            rounded="full"
            border="1px"
            borderColor="gray.100"
            top="16px"
            right="24px"
          />
          <DrawerHeader>{title}</DrawerHeader>
          <DrawerBody>
            <Flex
                flexDir='column'
                alignItems='center'
                justifyContent='flex-start'
                h='90%'
                w='100%'
                className='full-ck-editor'
                overflow='hidden'
            >
                <C4UCKeditor
                    data={content}
                    onDataChange={(_e, editor) => {
                      const newData = editor.getData();
                      // console.log(newData);
                      setEditingData(newData);
                  }}
                />
            </Flex>
            
            <HStack p={4} spacing={5}>
              <Button
                onClick={() => onSubmit()}
                variant={"brand"}
              >
                {"Lưu nháp"}
              </Button>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
}
