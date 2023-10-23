import {
  Badge,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";

const Order = ({ order }) => {
  const colorScheme = order.transaction_type === "BUY" ? "green" : "red";

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <Flex
          flexDir="column"
          border="2px solid"
          borderColor={colorScheme}
          p="0.5rem"
          borderRadius="0.5rem"
        >
          <h2>
            <AccordionButton>
              <Flex gap="1rem" justifyContent="space-between">
                <Badge
                  fontSize="1rem"
                  variant="solid"
                  colorScheme={colorScheme}
                >
                  {order.tradingsymbol}
                </Badge>
                <Text>{order.status}</Text>
                <Text>{order.transaction_type}</Text>
                <Text>{order.price}</Text>
              </Flex>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text display="flex" justifyContent="space-between">
              Symbol :{" "}
              <Badge
                fontSize="1rem"
                variant="solid"
                colorScheme="blue"
                ml="auto"
              >
                {order.tradingsymbol}
              </Badge>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Status : <Text>{order.status}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Price : <Text>{order.price}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Order time : <Text>{order.order_timestamp}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Exchange time : <Text>{order.exchange_timestamp}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Order Type : <Text>{order.order_type}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Transaction Type : <Text>{order.transaction_type}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Pending Quantity : <Text>{order.pending_quantity}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Filled Quantity : <Text>{order.filled_quantity}</Text>
            </Text>
          </AccordionPanel>
        </Flex>
      </AccordionItem>
    </Accordion>
  );
};

export default Order;
