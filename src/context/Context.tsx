import React, {createContext, useContext, useState} from "react";
import StompApi from "../helpers/StompApi";
import { useStomp } from "../hooks/useStomp.js";
import PropTypes from "prop-types";
interface ContextProviderProps {
  children?: React.ReactNode;
}
interface IContext {
  userId: number,
  username: string,
  gameId: number,
  role: string,
  stompApi: StompApi;
  setUserId: (userId: number) => void;
  setUsername: (username: string) => void;
  setGameId: (gameId: number) => void;
  setRole: (role: string) => void;
}
export const Context = createContext<IContext>(null)


export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [gameId, setGameId] = useState<number>();
  const [role, setRole] = useState<string>();

  const stompApi = useStomp()
  const content: IContext = {
    userId,
    username,
    gameId,
    role,
    stompApi,
    setUserId,
    setUsername,
    setGameId,
    setRole
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