import React, {createContext, useContext, useState} from "react";
import StompApi from "../helpers/StompApi";
import { useStomp } from "../hooks/useStomp.js";
import PropTypes from "prop-types";
interface ContextProviderProps {
  children?: React.ReactNode;
}
interface IContext {
  reload: boolean;
  stompApi: StompApi;
  setReload: (reload: boolean) => void;
}
export const Context = createContext<IContext>(null)


export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {


  const stompApi = useStomp()
  const [reload, setReload] = useState<boolean>()

  const content: IContext = {
    reload,
    stompApi,
    setReload
  }

  return (
    <Context.Provider value={content}>
      <ContextGuard children={children} />
    </Context.Provider>
  );
}
ContextProvider.propTypes = {
  children: PropTypes.node,
};
const ContextGuard = ({ children }) => {
  const context = useContext(Context);

  if (!context) return null;
  return <>{children}</>;
};
ContextGuard.propTypes = {
  children: PropTypes.node,
};