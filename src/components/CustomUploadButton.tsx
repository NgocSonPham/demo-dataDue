import {
  Box,
  Center,
  Flex,
  FlexProps,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import React, { HTMLAttributes, useMemo } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import uploadService from "../services/uploadService";
import AppToast from "./AppToast";
import { use } from "i18next";

interface UploadButtonProps extends FlexProps {
  label?: string;
  name: string;
  src?: string;
  thumbnail?: boolean;
  loading?: boolean;
  triggerButton?: {
    component: React.ReactNode;
  } & HTMLAttributes<HTMLDivElement>;
  onUploadChange: (name: string, file: string | string[]) => void;
}


export default function CustomUploadButton({
  align,
  bg,
  children,
  direction,
  h,
  justify,
  position,
  w,
  label,
  name,
  src,
  thumbnail,
  triggerButton,
  onUploadChange,
  ...others

}: UploadButtonProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentSrc = src;
  // console.log("currentSrc", currentSrc, "src", src);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const formData = new FormData();
    if (files) {
      for (const selectedFile of files) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast({
            position: "top-right",
            render: ({ onClose }) => (
              <AppToast status={"warning"} subtitle={"File size must be less than 5MB."} onClose={onClose} />
            )
          });
          return;
        }
        // console.log("selectedFile", selectedFile);
        if (
          ![
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/svg",
            "image/heif"
          ].includes(selectedFile.type)
        ) {
          toast({
            position: "top-right",
            render: ({ onClose }) => (
              <AppToast status={"warning"} subtitle={"File type must be png, jpg or jpeg."} onClose={onClose} />
            )
          });
          return;
        }
        formData.append("files", selectedFile);
      }
      setLoading(true);

      uploadService
        .upload(formData)
        .then((res) => {
          const { data: { data: uploaded } = { data: {} } } = res;
          onUploadChange(name, uploaded ? (thumbnail ? uploaded[0] : uploaded) : "");
          setLoading(false);
          toast({
            position: "top-right",
            render: ({ onClose }) => <AppToast status={"success"} subtitle={"File uploaded!"} onClose={onClose} />
          });
        })
        .catch((err) => {
          toast({
            position: "top-right",
            render: ({ onClose }) => (
              <AppToast
                status={"error"}
                subtitle={err?.response?.data?.message ?? "Upload failed!"}
                onClose={onClose}
              />
            )
          });
        });
    }
  };

  const handleImageClick = (e: any) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };


  const handleViewImage = (e: any) => {
    e.stopPropagation();
    onOpen();
  };

  const handleRemoveImage = (e: any) => {
    e.stopPropagation();
    onUploadChange(name, "");
  };

  return (
    <Flex
      w={w ?? "48px"}
      h={h ?? "48px"}
      direction={direction ?? "column"}
      justify={justify ?? "center"}
      align={align ?? "center"}
      position={position ?? "relative"}
      bg={bg ?? "transparent"}
      color="secondaryGray.600"
      fontSize="12px"
      fontWeight="400"
      letterSpacing="-0.2px"
      lineHeight="150%"
      {...others}
      cursor="pointer"
      onClick={handleImageClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".jpg, .jpeg, .png, .webp" // Chỉ chấp nhận các loại tệp này
        multiple
      />
      {children ? (
        children
      ) : src ? (
        <Flex bg={"secondaryGray.100"} w={"100%"} h={"100%"} position="relative" rounded={"8px"}>
          <Center w={"full"} h={"full"} overflow="hidden" position="relative" rounded={"4px"} onClick={handleViewImage}>
            <Image src={src} />
          </Center>
          <Icon
            as={RiCloseCircleFill}
            bg="white"
            color="black"
            w="20px"
            h="20px"
            position="absolute"
            top="3"
            right="1"
            rounded="full"
            onClick={handleRemoveImage}
          />
        </Flex>
      ) : (
        <Box position="relative" w="100%" h="100%" >
          <Image src="/icons/image-add.png" objectFit="contain" alt="upload" width={"full"} height={"full"} />
          {/* <Box position="absolute" bottom="-1" right="-3" w="20px" h="20px">
            <Image

              src="/icons/circle-plus.png"
              alt="plus"
              width={"20px"}
              height={"20px"}
            />
          </Box> */}
        </Box>
      )}
      {label && !src && (
        <Text color="secondaryGray.600" textAlign="right" whiteSpace="pre-line">
          {label}
        </Text>
      )}
      {triggerButton && <div className={triggerButton.className} onClick={handleImageClick}>
        {
          triggerButton.component
        }
      </div>}

      {loading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgColor="blackAlpha.50"
          backdropFilter="blur(0.8px)"
          rounded={others.rounded}
          zIndex={999}
        >
          <Spinner size="xl" />
        </Box>
      )}
      {isOpen && !children && src && (
        <Modal isOpen={true} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton rounded="full" border="1px" borderColor="secondaryGray.50" top="16px" right="24px" />
            <ModalBody
              mt="44px"
              // maxH="calc(100vh - 200px)"
              overflowX="hidden"
              overflowY="auto"
            >
              <Center w="full" position="relative" rounded={"4px"}>
                <Image src={src} />
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
