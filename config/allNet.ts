import NET_CONST_LIVE from "./networksLive";
import NET_CONST_TEST from "./networksTest";

const NET_CONFIG = {
  ...NET_CONST_LIVE,
  ...NET_CONST_TEST,
};

export default NET_CONFIG;
