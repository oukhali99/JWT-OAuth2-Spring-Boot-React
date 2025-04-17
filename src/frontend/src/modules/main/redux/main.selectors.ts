import { RootState } from "store";

export const getCounter = (state: RootState) => state.main.counter;
