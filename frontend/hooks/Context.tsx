import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape of the context
interface DataContextType {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
}

// Create context with default value as undefined
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface ContextProps {
  children: ReactNode; // Specify children type for props
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
