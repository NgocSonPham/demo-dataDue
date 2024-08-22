import { extendTheme, HTMLChakraProps, ThemingProps } from "@chakra-ui/react";
import { globalStyles } from "./globalStyles";
import { drawerStyles } from "./drawerStyles";
import { inputStyles } from "./inputStyles";
import { buttonStyles } from "./buttonStyles";
import { cardStyles } from "./cardStyles";
import { tagStyles } from "./tagStyles";
import { radioStyles } from "./radioStyles";
import { checkboxStyles } from "./checkboxStyles";

export default extendTheme(
  globalStyles,
  drawerStyles,
  inputStyles,
  buttonStyles,
  cardStyles,
  tagStyles,
  radioStyles,
  checkboxStyles
);

export interface CustomCardProps extends HTMLChakraProps<"div">, ThemingProps {}
