import { createContext, Dispatch, SetStateAction } from "react";

// Define the context type
type BooleanContextType = {
  isExpand: boolean;
  setIsExpand: Dispatch<SetStateAction<boolean>>; // Correctly typed for React state
};

// Create the context
const BooleanContext = createContext<BooleanContextType>({
  isExpand: false,
  setIsExpand: () => {},
});

export default BooleanContext;