import { Node } from "reactflow";
import { TOOL_BAR_COMPONENT_ITEMS } from "../utils/constants/roadmap";

export const useFlow = () => {
  const isNodeOverlapping = (node1: Node, node2: Node) => {
    const extra = 10;
    const w1 = node1.width - extra;
    const h1 = node1.height - extra;
    const w2 = node2.width - extra;
    const h2 = node2.height - extra;
    const { x: x1, y: y1 } = node1?.positionAbsolute || node1?.position;
    const { x: x2, y: y2 } = node2.position;
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  };

  const generateInfoNodeOverlapGroupSelection = (currentNode: Node, nodes: Node[]) => {
    const nodesInside = nodes.filter((_node) => {
      return (
        _node.id !== currentNode.id &&
        currentNode.data?.type !== TOOL_BAR_COMPONENT_ITEMS.GROUP_SELECTION &&
        _node.data?.type === TOOL_BAR_COMPONENT_ITEMS.GROUP_SELECTION &&
        isNodeOverlapping(currentNode, _node)
      );
    });

    if (!nodesInside.length) return null;

    const positionCurrentNode = {
      x: currentNode.positionAbsolute?.x || currentNode.position?.x,
      y: currentNode.positionAbsolute?.y || currentNode.position?.y,
    };

    const leftPosition = {
      x: positionCurrentNode.x - nodesInside[0].position.x,
      y: positionCurrentNode.y - nodesInside[0].position.y,
    };

    const rightPosition = {
      x: positionCurrentNode.x + currentNode.width - (nodesInside[0].position.x + nodesInside[0].width),
      y: positionCurrentNode.y + currentNode.height - (nodesInside[0].position.y + nodesInside[0].height),
    };

    if (rightPosition.x > 0) {
      leftPosition.x = nodesInside[0].width - currentNode.width;
    }

    if (rightPosition.y > 0) {
      leftPosition.y = nodesInside[0].height - currentNode.height;
    }

    if (leftPosition.x < 0) {
      leftPosition.x = 0;
    }

    if (leftPosition.y < 0) {
      leftPosition.y = 0;
    }

    if (rightPosition.x)
      return {
        id: nodesInside[0].id,
        position: leftPosition
      };
  };

  return {
    isNodeOverlapping,
    generateInfoNodeOverlapGroupSelection
  };
};
