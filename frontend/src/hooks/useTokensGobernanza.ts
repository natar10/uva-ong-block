import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useContract } from './useContract';

interface UseTokensGobernanzaReturn {
  tokens: string;
  tokensRaw: bigint;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook para obtener los tokens de gobernanza de un donante
 */
export const useTokensGobernanza = (
  address: string | null
): UseTokensGobernanzaReturn => {
  const { getContract } = useContract();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokensGobernanza', address],
    queryFn: async () => {
      if (!address) return { formatted: '0', raw: 0n };

      const contract = await getContract();
      const tokens = await contract.obtenerTokensGobernanza(address);

      return {
        formatted: ethers.formatEther(tokens),
        raw: tokens,
      };
    },
    enabled: !!address,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
  });

  return {
    tokens: data?.formatted ?? '0',
    tokensRaw: data?.raw ?? 0n,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
