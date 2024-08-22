import { HStack, Icon } from "@chakra-ui/react";
import { FaRegStar, FaStar } from "react-icons/fa6";

const CustomStars = ({
  w,
  h,
  name: _n,
  rating,
  onChange,
}: {
  w: string;
  h: string;
  name?: string;
  rating?: number;
  onChange?: (rate: any) => void;
}) => {
  return (
    <HStack spacing="12px">
      {[1, 2, 3, 4, 5].map((item) =>
        item <= rating ? (
          <Icon
            key={item}
            as={FaStar}
            cursor="pointer"
            w={w}
            h={h}
            color="#F6BC2F"
            onClick={() => onChange && onChange(item)}
          />
        ) : (
          <Icon
            key={item}
            as={FaRegStar}
            cursor="pointer"
            w={w}
            h={h}
            color="#F6BC2F"
            onClick={() => onChange && onChange(item)}
          />
        )
      )}
    </HStack>
  );
};

export default CustomStars;
