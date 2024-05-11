import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";
import {ContextProvider} from "./context/Context";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <ContextProvider>
      <Header height="100" />
      <AppRouter />
    </ContextProvider>


  );
};


export default App;
