import {
  Badge,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";

const Position = ({ position }) => {
  const profitNLoss = Math.round(parseFloat(position.pnl) * 100) / 100;
  const colorScheme = profitNLoss >= 0 ? "green" : "red";

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
                  {position.tradingsymbol}
                </Badge>
                <Text>Q: {position.quantity}</Text>
                <Text>B: {position.buy_price}</Text>
                <Text>S: {position.sell_price}</Text>
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
                {position.tradingsymbol}
              </Badge>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Buy price : <Text>{position.buy_price}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Buy quantity : <Text>{position.buy_quantity}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Sell price : <Text>{position.sell_price}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Sell quantity : <Text>{position.sell_quantity}</Text>
            </Text>
            <Text display="flex" justifyContent="space-between">
              Profit/Loss :{" "}
              <Text>{Math.round(parseFloat(position.pnl) * 100) / 100}</Text>
            </Text>
          </AccordionPanel>
        </Flex>
      </AccordionItem>
    </Accordion>
  );
};

export default Position;
