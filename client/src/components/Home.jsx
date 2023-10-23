import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { getHoldings, getOrders, getPositions } from "../services/zdhService";
import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import PositionList from "./PositionList";

const Home = () => {
  const { saveUserAndTokenInLocal, enctoken } = useUser();

  const [positions, setPositions] = useState();
  const [holdings, setHoldings] = useState();
  const [orders, setOrders] = useState();
  const [isAutoReloadOn, setIsAutoReloadOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const pos = await getPositions(enctoken);
    const hold = await getHoldings(enctoken);
    const orders = await getOrders(enctoken);
    setPositions(pos);
    setHoldings(hold);
    setOrders(orders);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isAutoReloadOn) {
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoReloadOn]);

  return (
    <Flex
      p="1rem"
      gap="1rem"
      justifyContent="center"
      flexDir="column"
      alignItems="center"
    >
      <Flex gap="1rem">
        <Button
          colorScheme="blue"
          onClick={saveUserAndTokenInLocal}
          w="fit-content"
        >
          Save User & Token in Local Storage
        </Button>
        <Button
          colorScheme={isAutoReloadOn ? "green" : "blue"}
          isLoading={isLoading}
          loadingText="Loading data..."
          onClick={() => setIsAutoReloadOn(!isAutoReloadOn)}
        >
          {isAutoReloadOn ? "Disable Autoreload" : "Enable Autoreload"}
        </Button>
      </Flex>
      <Flex gap="1rem">
        {positions && (
          <PositionList
            netPositions={positions.data.net}
            dayPositions={positions.data.day}
          />
        )}
        <Flex flex="1 0" flexDir="column" border="1px solid blue" p="10px">
          <Heading fontSize="2rem">Holdings</Heading>
          {/* <Text wordBreak="break-all">{JSON.stringify(holdings)}</Text> */}
        </Flex>
        {orders && (
          <Flex flex="1 0">
            <OrderList ordersList={orders.data} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
