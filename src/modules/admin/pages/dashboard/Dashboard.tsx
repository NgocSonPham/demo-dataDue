import CustomCard from "../../../../components/CustomCard";

export default function Dashboard() {
  return <CustomCard flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}></CustomCard>;
}
