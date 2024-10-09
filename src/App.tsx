import { CSSReset, ChakraProvider, createStandaloneToast } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "./assets/css/App.css";
import AppToast from "./components/AppToast";
import { Admin } from "./modules/admin";
import { Login } from "./modules/auth/Login";
import { SignUp } from "./modules/auth/SignUp";
import { persistor, store } from "./redux/store";
import "./styles/marquee.css";
import "./styles/popover.css";
import "./styles/slick.css";
import theme from "./theme/theme";
import { getErrorMessage } from "./utils/helpers";
import { Social } from "./modules/auth/Social";
import { LoginApple } from "./modules/auth/LoginApple";
import { LoginGoogle } from "./modules/auth/LoginGoogle";

const { ToastContainer, toast } = createStandaloneToast();

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error, _variables, _context) {
        const message = getErrorMessage(error);

        toast({
          position: "top-right",
          render: ({ onClose }) => <AppToast status={"error"} title={"Error"} subtitle={message} onClose={onClose} />
        });
      },
      onSuccess(_data, _variables, _context) {
        toast({
          title: "Success",
          status: "success",
          position: "top-right",
          duration: 5000,
          isClosable: true
        });
      }
    }
  }
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/admin" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/apple" element={<LoginApple />} />
                <Route path="/login/google" element={<LoginGoogle />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/social" element={<Social />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
              <ToastContainer />
            </BrowserRouter>
            <CSSReset />
          </ChakraProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
