import { useQuery } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  donanteQueryOptions,
  type Donante,
  TipoDonante,
} from '../data/query/donantes';

interface UseDonanteReturn {
  donante: Donante | null;
  isRegistered: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDonante = (address: string | null): UseDonanteReturn => {
  const { getContract } = useContract();

  const { data, isLoading, error, refetch } = useQuery(
    donanteQueryOptions(getContract, address)
  );

  return {
    donante: data ?? null,
    isRegistered: !!data,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};

// Re-exportar tipos para conveniencia
export { TipoDonante, type Donante };
