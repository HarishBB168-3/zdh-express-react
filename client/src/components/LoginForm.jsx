import { useRef, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { login, twoFaAuth, validateEnctoken } from "../services/zdhService";
import { useUser } from "../context/UserContext";

const LoginForm = () => {
  const userIdRef = useRef();
  const passwordRef = useRef();
  const enctokenRef = useRef();
  const tAuthRef = useRef();

  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [cookieFinal, setCookieFinal] = useState("");
  const { user, setUser, enctoken, setEnctoken, loadUserAndtokenFromLocal } =
    useUser();

  const handleLogin = async () => {
    const userId = userIdRef.current.value;
    const password = passwordRef.current.value;

    if (!(userId && password))
      return toast({
        title: `Please enter data first`,
        status: "error",
        isClosable: true,
      });

    console.log(
      "Logging in with : ",
      userIdRef.current.value,
      passwordRef.current.value
    );
    const result = await login(userId, password);
    console.log("result :>> ", result);

    if (!("requestId" in result))
      toast({
        title: `Unknown error`,
        description: `Data : ${JSON.stringify(result)}`,
        status: "error",
        isClosable: true,
      });
    else {
      setUser(userId);
      setIsLoggedIn(true);
      setRequestId(result.requestId);
      setCookieFinal(result.cookieFinal);
    }
  };

  const handleValidateToken = async () => {
    const token = enctokenRef.current.value;

    if (!token)
      return toast({
        title: "Enter token first",
        status: "error",
        isClosable: true,
      });

    const data = await validateEnctoken(token);
    console.log("data :>> ", data);
    if (!data.status) {
      return toast({
        title: `Invalid token`,
        status: "error",
        isClosable: true,
      });
    }

    setUser(data.data.user_id);
    setEnctoken(token);
    setIsLoggedIn(true);
  };

  const handleTAuth = async () => {
    const tAuthCode = tAuthRef.current.value;

    const enctoken = await twoFaAuth(user, requestId, cookieFinal, tAuthCode);
    console.log("enctoken :>> ", enctoken);
    setEnctoken(enctoken);
  };

  return (
    <Flex flexDir="column" p="2rem" alignItems="center">
      <Flex p="1rem" flexDir="column" gap="1rem" w="50%">
        {!isLoggedIn && (
          <>
            <Button onClick={loadUserAndtokenFromLocal}>
              Load from local storage
            </Button>
            <Input placeholder="User ID" ref={userIdRef} />
            <Input placeholder="Password" ref={passwordRef} />
            <Button colorScheme="blue" w="fit-content" onClick={handleLogin}>
              Login
            </Button>
            <Input placeholder="Validate a enctoken" ref={enctokenRef} />
            <Button
              colorScheme="blue"
              w="fit-content"
              onClick={handleValidateToken}
            >
              Validate token
            </Button>
          </>
        )}
        {isLoggedIn && !enctoken && (
          <>
            <Text>User : {user}</Text>
            <Input placeholder="Enter TOTP" ref={tAuthRef} />
            <Button colorScheme="blue" w="fit-content" onClick={handleTAuth}>
              Authorize
            </Button>
          </>
        )}
        {enctoken && <Text>Enctoken is : {enctoken}</Text>}
        {user && <Text>User : {user}</Text>}
        {/* <Input /> */}
      </Flex>
    </Flex>
  );
};

export default LoginForm;
