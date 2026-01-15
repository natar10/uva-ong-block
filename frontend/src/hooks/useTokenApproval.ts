import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../contracts/contractConfig';
import TokenGobernanzaABI from '../contracts/TokenGobernanza.json';

interface UseTokenApprovalReturn {
  checkAllowance: (amount: bigint) => Promise<boolean>;
  approve: (amount: bigint) => Promise<boolean>;
  isApproving: boolean;
  error: Error | null;
}

/**
 * Hook para manejar la aprobacion de tokens de gobernanza
 * Permite al contrato ONGDonaciones gastar tokens del usuario
 */
export const useTokenApproval = (): UseTokenApprovalReturn => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTokenContract = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask no esta instalado');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Obtener la direccion del token desde el contrato principal
    const ongContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ['function tokenGobernanza() view returns (address)'],
      provider
    );

    const tokenAddress = await ongContract.tokenGobernanza();

    // Crear instancia del contrato de token
    const tokenContract = new ethers.Contract(
      tokenAddress,
      TokenGobernanzaABI,
      signer
    );

    return { tokenContract, signer };
  }, []);

  /**
   * Verifica si el usuario ya aprobo suficientes tokens
   */
  const checkAllowance = useCallback(
    async (amount: bigint): Promise<boolean> => {
      try {
        const { tokenContract, signer } = await getTokenContract();
        const userAddress = await signer.getAddress();

        const allowance = await tokenContract.allowance(
          userAddress,
          CONTRACT_ADDRESS
        );

        return allowance >= amount;
      } catch (err) {
        console.error('Error verificando allowance:', err);
        return false;
      }
    },
    [getTokenContract]
  );

  /**
   * Aprueba tokens para que el contrato pueda gastarlos
   */
  const approve = useCallback(
    async (amount: bigint): Promise<boolean> => {
      setIsApproving(true);
      setError(null);

      try {
        const { tokenContract } = await getTokenContract();

        console.log('Aprobando tokens:', amount.toString());

        const tx = await tokenContract.approve(CONTRACT_ADDRESS, amount);
        console.log('Transaccion de aprobacion enviada:', tx.hash);

        await tx.wait();
        console.log('Tokens aprobados exitosamente');

        setIsApproving(false);
        return true;
      } catch (err: any) {
        console.error('Error aprobando tokens:', err);

        let errorMessage = 'Error al aprobar tokens';
        if (err.code === 'ACTION_REJECTED') {
          errorMessage = 'Aprobacion rechazada por el usuario';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(new Error(errorMessage));
        setIsApproving(false);
        return false;
      }
    },
    [getTokenContract]
  );

  return {
    checkAllowance,
    approve,
    isApproving,
    error,
  };
};
