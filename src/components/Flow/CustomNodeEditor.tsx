import { Box, Flex, Icon, Link } from "@chakra-ui/react";
import { memo } from "react";
import { Handle, NodeProps, Position, NodeResizer } from "reactflow";
import * as mdIcons from "react-icons/md";

const iconPool = {
  MdCheckCircleOutline: mdIcons.MdCheckCircleOutline,
  MdCheckCircle: mdIcons.MdCheckCircle,
};

const CustomNode = ({ data }: NodeProps) => {
  const {
    id,
    type,
    label,
    width,
    height,
    fontSizeType,
    fontColor,
    backgroundColor,
    borderType,
    borderWidth,
    borderRadius,
    borderColor,
    lineType,
    lineColor,
    legendItems,
    paragraphContent,
    linkItems,
    selectedLegendItem,
    onResizeStart,
    onNodeResize,
    onResizeEnd,
  } = data;

  let fs = "17px";
  switch (fontSizeType) {
    case "S": {
      fs = "14px";
      break;
    }
    case "M": {
      fs = "16px";
      break;
    }
    case "L": {
      fs = "18px";
      break;
    }
    case "XL": {
      fs = "24px";
      break;
    }
    case "XXL": {
      fs = "38px";
      break;
    }
    default: {
    }
  }

  const linkItemTypes = [
    { id: "artice", iconName: "MdOutlineArticle", title: "Artice" },
    { id: "video", iconName: "MdPlayCircleOutline", title: "Video" },
    { id: "opensource", iconName: "MdCode", title: "Opensource" },
    { id: "course", iconName: "MdOutlineSchool", title: "Course" },
    { id: "website", iconName: "MdOutlineBlurCircular", title: "Website" },
    { id: "podcast", iconName: "MdMicNone", title: "Podcast" },
  ];

  const widthS = width === 0 ? "auto" : `${width}px`;
  const heightS = height === 0 ? "auto" : `${height}px`;

  let node = <>{label} - In-Progress</>;
  const nodeResizer = [
    <NodeResizer
      onResizeStart={(e, p) => {
        const event = { ...e };
        console.log(event);
        const params = { ...p };
        console.log(params);
        onResizeStart();
      }}
      onResize={(e, p) => {
        const event = { ...e };
        console.log("onResize - event", event);
        const params = { ...p };
        console.log("onResize - params", params);
        const direction = params?.direction ?? [];
        let newWidth = params.width;
        if (direction.length === 2 && direction[0] === 0) newWidth = width;
        let newHeight = params.height;
        if (direction.length === 2 && direction[1] === 0) newHeight = height;
        onNodeResize({ width: newWidth, height: newHeight });
      }}
      onResizeEnd={(e, p) => {
        const event = { ...e };
        console.log(event);
        const params = { ...p };
        console.log(params);
        onResizeEnd();
      }}
    />,
  ];

  const convertHexToRGB = (hexColor: string) => {
    const hexColorWithoutHasTag = hexColor.replace("#", "");
    var R = parseInt(hexColorWithoutHasTag.substring(0, 2), 16);
    var G = parseInt(hexColorWithoutHasTag.substring(2, 4), 16);
    var B = parseInt(hexColorWithoutHasTag.substring(4, 6), 16);
    return { R, G, B };
  };

  const getGroupSelectionBackgroundColor = (backgroundColor: string) => {
    const hexToRGB = convertHexToRGB(backgroundColor);
    return `rgba(${hexToRGB.R}, ${hexToRGB.G}, ${hexToRGB.B}, 0.1)`;
  };

  const nodeExtensions = [
    nodeResizer,
    <Handle id={`${id}-source-top`} type="source" position={Position.Top} />,
    <Handle
      id={`${id}-source-right`}
      type="source"
      position={Position.Right}
    />,
    <Handle
      id={`${id}-source-bottom`}
      type="source"
      position={Position.Bottom}
    />,
    <Handle id={`${id}-source-left`} type="source" position={Position.Left} />,
    <Handle id={`${id}-target-top`} type="target" position={Position.Top} />,
    <Handle
      id={`${id}-target-right`}
      type="target"
      position={Position.Right}
    />,
    <Handle
      id={`${id}-target-bottom`}
      type="target"
      position={Position.Bottom}
    />,
    <Handle id={`${id}-target-left`} type="target" position={Position.Left} />,
  ];

  switch (type) {
    case "title": {
      node = (
        <>
          <Flex
            id={`CustomNode_${id}`}
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
          >
            {label}
          </Flex>
          {nodeExtensions.map((t) => t)}
        </>
      );
      break;
    }
    case "paragraph": {
      node = (
        <>
          <Flex
            id={`CustomNode_${id}`}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            px="24px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
            gap="12px"
          >
            <Box
              w="100%"
              className="reset-css"
              dangerouslySetInnerHTML={{
                __html: paragraphContent,
              }}
            />
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </>
      );
      break;
    }
    case "semester": {
      node = (
        <>
          <Flex
            id={`CustomNode_${id}`}
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
          >
            {label}
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </>
      );
      break;
    }
    case "subject": {
      node = (
        <Flex
          pos="relative"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {selectedLegendItem && (
            <Flex
              pos="absolute"
              zIndex="1"
              top="-30px"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="14px"
              mb="6px"
              gap="3px"
            >
              <Icon
                as={(mdIcons as any)[selectedLegendItem.iconName]}
                boxSize={4}
                color={selectedLegendItem.iconColor}
              />
              {selectedLegendItem.label}
            </Flex>
          )}
          <Flex
            id={`CustomNode_${id}`}
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
          >
            {label}
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </Flex>
      );
      break;
    }
    case "study-topic": {
      node = (
        <Flex
          pos="relative"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {selectedLegendItem && (
            <Flex
              pos="absolute"
              zIndex="1"
              top="-30px"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="14px"
              mb="6px"
              gap="3px"
            >
              <Icon
                as={(mdIcons as any)[selectedLegendItem.iconName]}
                boxSize={4}
                color={selectedLegendItem.iconColor}
              />
              {selectedLegendItem.label}
            </Flex>
          )}
          <Flex
            id={`CustomNode_${id}`}
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
          >
            {label}
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </Flex>
      );
      break;
    }
    case "button": {
      node = (
        <>
          <Link
            id={`CustomNode_${id}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
            opacity="1"
            _hover={{
              textDecor: "none",
              opacity: "0.8",
            }}
          >
            {label}
          </Link>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </>
      );
      break;
    }
    case "legend": {
      node = (
        <>
          <Flex
            id={`CustomNode_${id}`}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={"14px"}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
            gap="12px"
          >
            <Box>{label}</Box>
            {(legendItems as any[]).map((t) => (
              <Flex alignItems="center" justifyContent="center" gap="6px">
                <Icon
                  as={(iconPool as any)[t.iconName]}
                  boxSize={5}
                  color={t.iconColor}
                />
                {t.label}
              </Flex>
            ))}
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </>
      );
      break;
    }
    case "links-group": {
      node = (
        <Flex
          pos="relative"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {selectedLegendItem && (
            <Flex
              pos="absolute"
              zIndex="1"
              top="-30px"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="14px"
              mb="6px"
              gap="3px"
            >
              <Icon
                as={(mdIcons as any)[selectedLegendItem.iconName]}
                boxSize={4}
                color={selectedLegendItem.iconColor}
              />
              {selectedLegendItem.label}
            </Flex>
          )}
          <Flex
            id={`CustomNode_${id}`}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={backgroundColor}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
            gap="12px"
          >
            <Box>{label}</Box>
            {(linkItems as any[]).map((t) => {
              const linkItemType = linkItemTypes.find((l) => l.id === t.typeId);
              return (
                <Link
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="6px"
                  target="black"
                  textDecor="underline"
                  href={t.url.length > 0 ? t.url : ""}
                >
                  <Icon
                    as={(mdIcons as any)[linkItemType!.iconName]}
                    boxSize={5}
                  />
                  <Box
                  // color='blue'
                  >
                    {t.title.length > 0 ? t.title : t.url}
                  </Box>
                </Link>
              );
            })}
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </Flex>
      );
      break;
    }
    case "horizontal-line": {
      node = (
        <Flex
          alignItems="center"
          justifyContent="center"
          className="horizontal-line-node"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
          >
            <Box w="100%" border={`2px ${lineType} ${lineColor}`} />
          </Flex>
          {nodeResizer}
        </Flex>
      );
      break;
    }
    case "vertical-line": {
      node = (
        <Flex
          alignItems="center"
          justifyContent="center"
          className="vertical-line-node"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            w={widthS}
            h={heightS}
          >
            <Box h="100%" border={`2px ${lineType} ${lineColor}`} />
          </Flex>
          {nodeResizer}
        </Flex>
      );
      break;
    }
    case "group-selection": {
      node = (
        <Flex
          pos="relative"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {selectedLegendItem && (
            <Flex
              pos="absolute"
              zIndex="1"
              top="-30px"
              alignItems="center"
              justifyContent="flex-start"
              fontSize="14px"
              mb="6px"
              gap="3px"
            >
              <Icon
                as={(mdIcons as any)[selectedLegendItem.iconName]}
                boxSize={4}
                color={selectedLegendItem.iconColor}
              />
              {selectedLegendItem.label}
            </Flex>
          )}
          <Flex
            id={`CustomNode_${id}`}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            w={widthS}
            h={heightS}
            pos="relative"
            p="12px"
            fontSize={fs}
            color={fontColor}
            bgColor={getGroupSelectionBackgroundColor(backgroundColor)}
            border={
              borderType === "none"
                ? "none"
                : `${borderWidth}px ${borderType} ${borderColor}`
            }
            borderRadius={borderType === "none" ? "0" : `${borderRadius}px`}
            gap="12px"
          >
            <Box
              dangerouslySetInnerHTML={{
                __html: label,
              }}
            />
          </Flex>
          <NodeResizer />
          {nodeExtensions.map((t) => t)}
        </Flex>
      );
      break;
    }
    default: {
    }
  }

  return <>{node}</>;
};

export default memo(CustomNode);
