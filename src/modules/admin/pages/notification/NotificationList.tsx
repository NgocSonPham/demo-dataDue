import { Flex, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { collection, DocumentData, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import { isEmpty } from "lodash";
import React from "react";
import CustomCard from "../../../../components/CustomCard";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectUser } from "../../../../redux/slice";
import { db } from "../../../../utils/firebase";

export default function NotificationList() {
  const user = useAppSelector(selectUser);

  const [notificationList, setNotificationList] = React.useState<any>([]);
  const [lastDoc, setLastDoc] = React.useState<DocumentData | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchNotifications = React.useCallback(() => {
    if (isEmpty(user) || isEmpty(user.id?.toString()) || isFetching) return;

    setIsFetching(true);

    let q = query(
      collection(db, "notification"),
      where("uid", "==", user.id.toString()),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedCons: any[] = [];
      QuerySnapshot.forEach((doc) => {
        fetchedCons.push({ id: doc.id, ...doc.data() });
      });

      if (fetchedCons.length > 0) {
        setLastDoc(QuerySnapshot.docs[QuerySnapshot.docs.length - 1]);
        setNotificationList((prev: any) => [...prev, ...fetchedCons]);
      }
      setIsFetching(false);
    });

    return () => unsubscribe();
  }, [user, lastDoc, isFetching]);

  React.useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      fetchNotifications();
    }
  };

  return (
    <CustomCard
      flexDirection="column"
      w="100%"
      minH={"calc(100vh - 140px)"}
      maxH={"calc(100vh - 140px)"}
      px="20px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      overflowY={"scroll"}
      onScroll={handleScroll}
    >
      <VStack w="full" spacing={2}>
        {notificationList.map((data: any) => (
          <ItemContent key={data.id} data={data} />
        ))}
        {isFetching && (
          <Text textAlign="center" mt="4">
            Loading more notifications...
          </Text>
        )}
      </VStack>
    </CustomCard>
  );
}

function ItemContent({ data }: { data: any }) {
  const textColor = useColorModeValue("navy.700", "white");
  return (
    <>
      <Flex w="full" flexDirection="column" border="1px dashed #7777" px="20px" py="10px" rounded={"10px"}>
        <Text mb="5px" fontWeight={data.seen ? "500" : "700"} color={textColor} fontSize={{ base: "md", md: "md" }}>
          {data.title}
        </Text>
        <Flex alignItems="center">
          <Text
            fontSize={{ base: "sm", md: "sm" }}
            fontWeight={data.seen ? "400" : "600"}
            lineHeight="100%"
            color={textColor}
          >
            {data.body}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
