import { useState, useEffect } from 'react';
import { isContractOwner } from '../helpers/contractOwner';

/**
 * Hook para verificar si el usuario conectado es el owner del contrato
 */
export const useIsOwner = (walletAddress: string | null) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwner = async () => {
      if (!walletAddress) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await isContractOwner(walletAddress);
        setIsOwner(result);
      } catch (error) {
        console.error('Error verificando owner:', error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwner();
  }, [walletAddress]);

  return { isOwner, loading };
};
