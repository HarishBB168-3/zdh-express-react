import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getPositions } from "../services/zdhService";
import {
  closePositionsIfDayOver,
  getStocksWithOpenPositions,
} from "../services/autoTradeCloseVerifierService";

/*

Will be completed at last, after
knowing how to place trades using 
code.

*/

const AutoTradeCloseVerifier = () => {
  const { enctoken } = useUser();

  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logText, setLogText] = useState([]);

  const getTimeStamp = () => {
    const time = new Date();
    return `${time.getDate()}-${
      time.getMonth() + 1
    }-${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  };

  const doTask = async () => {
    setIsLoading(true);
    const pos = await getPositions(enctoken);
    const stocks = getStocksWithOpenPositions(pos);
    closePositionsIfDayOver(stocks);
    setLogText((prevVal) => [
      ...prevVal.slice(-10),
      getTimeStamp() + " - Doing task...",
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isEnabled) {
      const interval = setInterval(doTask, 5000);
      return () => clearInterval(interval);
    }
  }, [isEnabled]);

  return (
    <Flex
      border="2px solid dodgerblue"
      borderRadius="0.3rem"
      padding="0.7rem"
      height="fit-content"
      gap="1rem"
      flexDir="column"
    >
      <Text>AutoTradeCloseVerfier</Text>
      <Button
        onClick={() => setIsEnabled(!isEnabled)}
        colorScheme={isEnabled ? "red" : "blue"}
        isLoading={isLoading}
        loadingText="Working..."
      >
        {isEnabled ? "Disable" : "Enable"}
      </Button>
      <Flex>
        <Text>
          {logText.map((item) => (
            <>
              {item}
              <br />
            </>
          ))}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AutoTradeCloseVerifier;
