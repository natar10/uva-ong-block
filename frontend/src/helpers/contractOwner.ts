import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contractConfig';

/**
 * Verifica si una dirección es el owner del contrato
 */
export const isContractOwner = async (userAddress: string): Promise<boolean> => {
  if (!userAddress || !window.ethereum) {
    return false;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const owner = await contract.owner();

    return owner.toLowerCase() === userAddress.toLowerCase();
  } catch (error) {
    console.error('Error verificando owner:', error);
    return false;
  }
};

/**
 * Obtiene la dirección del owner del contrato
 */
export const getContractOwner = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const owner = await contract.owner();
    return owner;
  } catch (error) {
    console.error('Error obteniendo owner:', error);
    return null;
  }
};
