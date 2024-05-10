import StompApi from "../helpers/StompApi";

const _stomp = new StompApi();

export const useStomp = () => {
  return _stomp;
};