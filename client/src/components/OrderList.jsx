import { Flex, Heading } from "@chakra-ui/react";
import Order from "./Order";
import { useEffect, useState } from "react";

const OrderList = ({ ordersList }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [inactiveOrders, setInactiveOrders] = useState([]);

  const processOrders = (orders) => {
    let actOrd = orders.filter(
      (item) => !(item.status === "CANCELLED" || item.status === "COMPLETE")
    );
    actOrd = actOrd.sort((a, b) => {
      if (a.tradingsymbol > b.tradingsymbol) return 1;
      else if (a.tradingsymbol < b.tradingsymbol) return -1;
      return 0;
    });

    let inactOrd = orders.filter(
      (item) => item.status === "CANCELLED" || item.status === "COMPLETE"
    );
    inactOrd = inactOrd.sort((a, b) => {
      if (a.tradingsymbol > b.tradingsymbol) return 1;
      else if (a.tradingsymbol < b.tradingsymbol) return -1;
      return 0;
    });

    setActiveOrders(actOrd);
    setInactiveOrders(inactOrd);
    console.log("inactOrd :>> ", inactOrd);
    console.log("actOrd :>> ", actOrd);
  };

  useEffect(() => {
    if (ordersList) processOrders(ordersList);
  }, [ordersList]);

  return (
    <Flex flexDir="column" gap="1rem">
      <Heading fontSize="2rem">Orders</Heading>

      <Flex flexDir="column" maxH="80vh" overflowY="auto">
        <Flex flexDir="column" gap="1rem">
          {activeOrders.map((order, idx) => (
            <Order key={idx} order={order} />
          ))}
        </Flex>
        <Flex flexDir="column" gap="1rem" opacity="50%">
          {inactiveOrders.map((order, idx) => (
            <Order key={idx} order={order} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OrderList;
