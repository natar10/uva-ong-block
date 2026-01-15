import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  votarAprobacionMutationOptions,
  votarCancelacionMutationOptions,
  type VotarParams,
  type VotarResult,
} from '../data/mutations/proyectos';

interface UseVotarReturn {
  votar: (params: VotarParams) => void;
  votarAsync: (params: VotarParams) => Promise<VotarResult>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: VotarResult | undefined;
  reset: () => void;
}

/**
 * Hook para votar aprobacion de un proyecto propuesto
 */
export const useVotarAprobacion = (): UseVotarReturn => {
  const { getContract } = useContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...votarAprobacionMutationOptions(getContract),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      queryClient.invalidateQueries({ queryKey: ['tokensGobernanza'] });
    },
  });

  return {
    votar: mutation.mutate,
    votarAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

/**
 * Hook para votar cancelacion de un proyecto
 */
export const useVotarCancelacion = (): UseVotarReturn => {
  const { getContract } = useContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...votarCancelacionMutationOptions(getContract),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      queryClient.invalidateQueries({ queryKey: ['tokensGobernanza'] });
    },
  });

  return {
    votar: mutation.mutate,
    votarAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

// Re-exportar tipos
export type { VotarParams, VotarResult };
