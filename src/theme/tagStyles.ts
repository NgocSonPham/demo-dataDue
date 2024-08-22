import { mode } from "@chakra-ui/theme-tools";

export const tagStyles = {
  components: {
    Tag: {
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props: any) => ({
          bg: mode("brand.500", "brand.400")(props),
          color: "white",
        }),
        darkBrand: (props: any) => ({
          bg: mode("brand.900", "brand.400")(props),
          color: "white",
        }),
        lightBrand: (props: any) => ({
          container: {
            bg: mode("#F2EFFF", "whiteAlpha.100")(props),
            color: mode("brand.500", "white")(props),
          },
        }),
        light: (props: any) => ({
          container: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
            color: mode("secondaryGray.900", "white")(props),
          },
        }),
        setup: (props: any) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("transparent", "brand.400")(props),
          border: mode("1px solid", "0px solid")(props),
          borderColor: mode("secondaryGray.400", "transparent")(props),
          color: mode("secondaryGray.900", "white")(props),
        }),
      },
    },
  },
};
