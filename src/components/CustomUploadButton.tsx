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
import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import React, { useMemo } from "react";
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
  onUploadChange,
  ...others
}: UploadButtonProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentSrc = src;
  // console.log("currentSrc", currentSrc, "src", src);

  const cld = new Cloudinary({ cloud: { cloudName: "road4u" } });
  const img = cld.image(src).format("auto").quality("auto");

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
        if (!["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(selectedFile.type)) {
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

  const handleImageClick = () => {
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
        <Flex bg={"secondaryGray.100"} w={"120px"} h={"100px"} position="relative" px="10px" py="20px" rounded={"8px"}>
          <Flex w={"full"} h={"full"} overflow="hidden" position="relative" rounded={"4px"} onClick={handleViewImage}>
            <AdvancedImage cldImg={img} plugins={[lazyload(), responsive()]} />
          </Flex>
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
        <Box position="relative" w="48px" h="48px">
          <Image src="/icons/image-add.png" alt="upload" width={"full"} height={"full"} />
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
        <Text color="secondaryGray.600" textAlign="center" whiteSpace="pre-line">
          {label}
        </Text>
      )}
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
                <AdvancedImage cldImg={img} plugins={[lazyload(), responsive()]} />
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
