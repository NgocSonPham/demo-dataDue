import { Box } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Box w="full" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Box>
  );
}
