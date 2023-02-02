import { TickHeavyIcon, UpIcon, DoubleIcon } from "components/icons";
import { GAS_PRIORITY } from "./digits";

export const priorities = {
  [GAS_PRIORITY.NORMAL]: {
    icon: TickHeavyIcon,
    text: "Normal Priority",
    time: "15 Min",
    id: GAS_PRIORITY.NORMAL,
  },
  [GAS_PRIORITY.HIGH]: {
    icon: UpIcon,
    text: "High Priority",
    time: "5 Min",
    id: GAS_PRIORITY.HIGH,
  },
  [GAS_PRIORITY.HIGHEST]: {
    icon: DoubleIcon,
    text: "Highest Priority",
    time: "2 Min",
    id: GAS_PRIORITY.HIGHEST,
  },
};
