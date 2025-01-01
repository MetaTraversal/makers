import { createContext } from "react";

export const DataContext = createContext({
  data: {},
});

DataContext.displayName = "DataContext";
