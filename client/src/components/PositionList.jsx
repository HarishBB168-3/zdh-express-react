import { Flex, Heading, Text } from "@chakra-ui/react";
import Position from "./Position";

const PositionList = ({ netPositions, dayPositions }) => {
  return (
    <Flex flexDir="column" gap="1rem">
      <Heading fontSize="2rem">Positions</Heading>
      {netPositions && (
        <Flex flexDir="column" gap="1rem">
          <Heading fontSize="1rem">Net</Heading>
          {netPositions.map((pos) => (
            <Position position={pos} />
          ))}
        </Flex>
      )}
      {dayPositions && (
        <Flex flexDir="column" gap="1rem">
          <Heading fontSize="1rem">Day</Heading>
          {dayPositions.map((pos) => (
            <Position position={pos} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default PositionList;
