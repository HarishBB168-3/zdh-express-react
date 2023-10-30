import { useState } from "react";
import {
  Badge,
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import {
  getLatestPriceForStockName,
  getStockIdFromName,
} from "../services/zdhService";
import { useUser } from "../context/UserContext";

const tradeTypes = {
  BUY: 0,
  SELL: 1,
};

const OrderCreater = () => {
  const { enctoken } = useUser();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tradeType, setTradeType] = useState(tradeTypes.BUY);
  const [latestPrice, setLatestPrice] = useState("");
  const [stockName, setStockName] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [target, setTarget] = useState("");
  const [stoploss, setStoploss] = useState("");

  const toggleTradeType = () => {
    console.log("Toggling trade type");
    setTradeType((prevTradeType) =>
      prevTradeType === tradeTypes.BUY ? tradeTypes.SELL : tradeTypes.BUY
    );
  };

  const getColorScheme = () => {
    return tradeType === tradeTypes.BUY ? "blue" : "red";
  };

  const handlePasteBtnClick = async () => {
    const text = await navigator.clipboard.readText();
    const newData = text.split(",");
    console.log("text >>", text);
    console.log("newData :>> ", newData);
    if (newData.length !== 4)
      return alert(
        "Data in invalid format : format should be : Stockname,Entry,Target,Stoploss"
      );
    setStockName(newData[0]);
    setEntryPrice(newData[1]);
    setTarget(newData[2]);
    setStoploss(newData[3]);
  };

  const fetchLatestPriceOfStock = async () => {
    if (!stockName) {
      return alert("Please specify stockname first");
    }
    try {
      const price = await getLatestPriceForStockName(enctoken, stockName);
      setLatestPrice(price);
    } catch (err) {
      return toast({
        title: `Error occured`,
        status: "error",
        description: err.message,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      border="2px solid"
      borderRadius="0.3rem"
      padding="0.7rem"
      height="fit-content"
      gap="1rem"
      flexDir="column"
      borderColor={getColorScheme()}
    >
      <Text>Order Creator</Text>

      <Button onClick={onOpen} colorScheme={"blue"}>
        Create a trade
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Badge
            w="100%"
            h="100%"
            colorScheme={getColorScheme()}
            variant="solid"
          >
            <ModalHeader>Create a Order</ModalHeader>
            <ModalCloseButton />
          </Badge>
          <ModalBody>
            <Flex flexDir="column" gap="1.5rem">
              <Flex alignItems="center" gap="0.7rem">
                <Badge colorScheme="blue" variant="solid" p="0.2rem 0.5rem">
                  Buy
                </Badge>
                <Switch
                  isChecked={tradeType === tradeTypes.SELL}
                  onChange={toggleTradeType}
                />
                <Badge colorScheme="red" variant="solid" p="0.2rem 0.5rem">
                  Sell
                </Badge>
                <Button ml="auto" onClick={handlePasteBtnClick}>
                  <VStack gap="0.1rem">
                    <CopyIcon />
                    <Text fontSize="0.6rem">Paste</Text>
                  </VStack>
                </Button>
              </Flex>
              <Flex flexDir="column" gap="1.5rem">
                <Flex justifyContent="space-between">
                  <FormLabel whiteSpace="nowrap">Stock Name :</FormLabel>
                  <Input
                    value={stockName}
                    onChange={(e) => setStockName(e.target.value)}
                  />
                </Flex>
                <Flex justifyContent="space-between">
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={fetchLatestPriceOfStock}
                  >
                    Get latest price of stock
                  </Button>
                  {latestPrice && (
                    <Badge variant="solid" p="0.2rem 0.5rem">
                      {latestPrice}
                    </Badge>
                  )}
                </Flex>
                <Flex justifyContent="space-between">
                  <FormLabel whiteSpace="nowrap">Entry :</FormLabel>
                  <Input
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    type="number"
                  />
                </Flex>
                <Flex justifyContent="space-between">
                  <FormLabel whiteSpace="nowrap">Target :</FormLabel>
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    type="number"
                  />
                </Flex>
                <Flex justifyContent="space-between">
                  <FormLabel whiteSpace="nowrap">Stoploss :</FormLabel>
                  <Input
                    value={stoploss}
                    onChange={(e) => setStoploss(e.target.value)}
                    type="number"
                  />
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={getColorScheme()} mr={3} onClick={onClose}>
              Execute
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default OrderCreater;
