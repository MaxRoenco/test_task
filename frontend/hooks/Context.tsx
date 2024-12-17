import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface DataContextType {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface ContextProps {
  children: ReactNode;
}

const Context: React.FC<ContextProps> = ({ children }) => {
  const [userName, setUserName] = useState<string>("");

  const value: DataContextType = {
    userName,
    setUserName,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default Context;
