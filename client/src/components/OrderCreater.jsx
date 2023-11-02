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
  placeOrder,
} from "../services/zdhService";
import { useUser } from "../context/UserContext";

const tradeTypes = {
  BUY: "BUY",
  SELL: "SELL",
};

const orderTypes = {
  LIMIT: "LIMIT",
  STOP: "SL",
};

const OrderCreater = () => {
  const { enctoken } = useUser();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tradeType, setTradeType] = useState(tradeTypes.BUY);
  const [orderType, setOrderType] = useState(orderTypes.LIMIT);
  const [latestPrice, setLatestPrice] = useState("");
  const [stockName, setStockName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [target, setTarget] = useState(0);
  const [stoploss, setStoploss] = useState(0);

  const toggleTradeType = () => {
    console.log("Toggling trade type");
    setTradeType((prevTradeType) =>
      prevTradeType === tradeTypes.BUY ? tradeTypes.SELL : tradeTypes.BUY
    );
  };

  const toggleTransactionType = () => {
    setOrderType((prevTransType) =>
      prevTransType === orderTypes.LIMIT ? orderTypes.STOP : orderTypes.LIMIT
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

  const handleExecuteOrder = async () => {
    //
    const data = {
      variety: "regular",
      exchange: "NSE",
      tradingsymbol: stockName,
      transaction_type: tradeType,
      order_type: orderType,
      quantity: quantity,
      price: entryPrice,
      product: "MIS",
      validity: "DAY",
      disclosed_quantity: "0",
      trigger_price: "0",
      squareoff: "0",
      stoploss: "0",
      trailing_stoploss: "0",
      user_id: "VY5511",
      enctoken,
    };

    try {
      const res = await placeOrder(enctoken, data);
      console.log("res :>> ", res);

      if (res.status === "error")
        return toast({
          title: `Error occured`,
          status: "error",
          description: res.message,
          isClosable: true,
        });
      toast({
        title: `Order placed successfully`,
        status: "success",
        description: `Order id : ${res.data.order_id}`,
        isClosable: true,
      });
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
              <Flex alignItems="center" gap="0.7rem">
                <Badge variant="solid" p="0.2rem 0.5rem">
                  Limit
                </Badge>
                <Switch
                  isChecked={orderType === orderTypes.STOP}
                  onChange={toggleTransactionType}
                />
                <Badge variant="solid" p="0.2rem 0.5rem">
                  Stop
                </Badge>
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
                  <FormLabel whiteSpace="nowrap">Quantity :</FormLabel>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    type="number"
                  />
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
            <Button
              colorScheme={getColorScheme()}
              mr={3}
              onClick={handleExecuteOrder}
            >
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
