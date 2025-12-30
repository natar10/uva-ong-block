import { useQuery } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  donacionesQueryOptions,
  type Donacion,
} from '../data/query/donaciones';

interface UseDonacionesReturn {
  donaciones: Donacion[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

export const useDonaciones = (): UseDonacionesReturn => {
  const { getContract } = useContract();

  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    donacionesQueryOptions(getContract)
  );

  return {
    donaciones: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
    isRefetching,
  };
};

// Re-exportar tipos para conveniencia
export { type Donacion };
