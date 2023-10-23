import { Flex } from "@chakra-ui/react";
import LoginForm from "./components/LoginForm";
import { useUser } from "./context/UserContext";
import Home from "./components/Home";
import { useEffect } from "react";

const App = () => {
  const { isLoggedIn, loadUserAndtokenFromLocal, user, enctoken } = useUser();

  console.log("isLoggedIn() :>> ", isLoggedIn());

  useEffect(() => {
    console.log("user :>> ", user);
    console.log("enctoken :>> ", enctoken);
  });

  return (
    <>
      {!isLoggedIn() && <LoginForm />}
      {isLoggedIn() && <Home />}
    </>
  );
};

export default App;
