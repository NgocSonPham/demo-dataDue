export const radioStyles = {
  components: {
    Radio: {
      baseStyle: {
        container: {
          alignItems: "flex-start",
        },
        control: {
          marginTop: "3px",
          _checked: {
            bg: "#6453A8",
            borderColor: "#6453A8",
            _hover: {
              bg: "secondaryGray.700",
              borderColor: "secondaryGray.700",
            },
          },
        },
      },
    },
  },
};
