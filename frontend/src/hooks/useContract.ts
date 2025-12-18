import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/contractConfig';

export const useContract = () => {
  const getContract = async () => {
    // Verificar que MetaMask esté instalado
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    // Crear provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Obtener signer (cuenta conectada)
    const signer = await provider.getSigner();
    
    // Crear instancia del contrato
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    return contract;
  };

  return { getContract };
};
