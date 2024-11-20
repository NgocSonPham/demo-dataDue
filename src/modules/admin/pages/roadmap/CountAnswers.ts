interface Mark {
  type: string;
}

interface Content {
  type: string;
  text?: string;
  marks?: Mark[];
}

interface Node {
  type: string;
  attrs?: Record<string, any>;
  content?: Content[];
}

export const countBoldItalicTexts = (nodes: Node[]): number => {
  let count = 0;

  const checkMarksAndQuotes = (content: Content): boolean => {
    if (!content.text || !content.marks) return false;

    const hasBold = content.marks.some((mark) => mark.type === "bold");
    const hasItalic = content.marks.some((mark) => mark.type === "italic");
    const startsAndEndsWithQuotes = content.text.startsWith('"') && content.text.endsWith('"');

    return hasBold && hasItalic && startsAndEndsWithQuotes;
  };

  const traverseNodes = (nodeArray: Node[]): void => {
    for (const node of nodeArray) {
      if (node.content) {
        for (const content of node.content) {
          if (checkMarksAndQuotes(content)) {
            count++;
          }
        }
      }
    }
  };

  traverseNodes(nodes);
  return count;
};
