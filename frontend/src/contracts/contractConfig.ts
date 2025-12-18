import ONGDonacionesABI from './ONGDonaciones.json';

export interface ContractConfig {
  address: string;
  abi: any;
  chainId: number;
  networkName: string;
}

// Configuración del contrato
export const CONTRACT_CONFIG: ContractConfig = {
  address: '0x7D02D00c452efd124563df0f90848A813421A8a3',
  abi: ONGDonacionesABI,
  chainId: 1337, // Chain ID de tu red Besu
  networkName: 'Besu Lab'
};

// Exportar también por separado para conveniencia
export const CONTRACT_ADDRESS = CONTRACT_CONFIG.address;
export const CONTRACT_ABI = CONTRACT_CONFIG.abi;
export const CHAIN_ID = CONTRACT_CONFIG.chainId;

export default CONTRACT_CONFIG;
