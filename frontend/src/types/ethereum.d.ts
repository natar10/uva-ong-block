// Declaración de tipos para Ethereum (MetaMask)
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: Array<unknown> }) => Promise<unknown>;
  on?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (eventName: string, handler: (...args: unknown[]) => void) => void;
  selectedAddress?: string | null;
  chainId?: string;
  networkVersion?: string;
}

interface Window {
  ethereum?: EthereumProvider;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
