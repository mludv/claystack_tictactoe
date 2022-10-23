/**
 * Context hook for setting up the web3 instance and storing account reference.
 */

import React from "react";
import Web3 from "web3";
import type { provider } from "web3-core";
import type { AbiItem } from "web3-utils";

import { ADDRESS, ABI } from "./constants";

const AppContext = React.createContext<AppState>(null!);

interface AppState {
  web3: Web3;
  contract: any;
  account?: string;
  setAccount: (account: string) => void;
}

interface Props {
  provider: provider;
}
/**
 * Create a web3 instance which can be used the hook.
 */
export function AppStateProvider({
  provider,
  children,
}: React.PropsWithChildren<Props>) {
  const [web3, setWeb3] = React.useState<Web3>();
  const [contract, setContract] = React.useState<any>();
  const [account, setAccount] = React.useState<string>();
  React.useEffect(() => {
    const _web3 = new Web3(provider);
    setWeb3(_web3);
    setContract(new _web3.eth.Contract(ABI as AbiItem[], ADDRESS));
  }, []);

  if (!web3) return <div>Setting up web3 connection...</div>;
  return (
    <AppContext.Provider value={{ web3, setAccount, account, contract }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Use for accessing the web3 instance.
 */
export const useAppState = () => React.useContext(AppContext);
