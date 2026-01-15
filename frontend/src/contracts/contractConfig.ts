import ONGDonacionesABI from './ONGDonaciones.json';

export interface ContractConfig {
  address: string;
  abi: any;
  chainId: number;
  networkName: string;
}

// Configuración del contrato usando variables de entorno
export const CONTRACT_CONFIG: ContractConfig = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS,
  abi: ONGDonacionesABI,
  chainId: Number(import.meta.env.VITE_CHAIN_ID) || 1337,
  networkName: import.meta.env.VITE_NETWORK_NAME || 'Besu Lab'
};

// Exportar también por separado para conveniencia
export const CONTRACT_ADDRESS = CONTRACT_CONFIG.address;
export const CONTRACT_ABI = CONTRACT_CONFIG.abi;
export const CHAIN_ID = CONTRACT_CONFIG.chainId;

export default CONTRACT_CONFIG;
