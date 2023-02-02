import { TX_STATUS } from "constants/digits";
import { INotification } from "./INotification";

export interface IStorage {
    create(): (id: string, data: INotification) => boolean;

    update(): (id: string, status: TX_STATUS) => boolean;
}