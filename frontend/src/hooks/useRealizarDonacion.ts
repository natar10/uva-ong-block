import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  realizarDonacionMutationOptions,
  type RealizarDonacionParams,
  type RealizarDonacionResult,
} from '../data/mutations/donaciones';

interface UseRealizarDonacionReturn {
  donar: (params: RealizarDonacionParams) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: RealizarDonacionResult | undefined;
  reset: () => void;
}

export const useRealizarDonacion = (): UseRealizarDonacionReturn => {
  const { getContract } = useContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...realizarDonacionMutationOptions(getContract),
    onSuccess: (data) => {
      console.log('Donación realizada:', data);
      // Invalidar las queries de proyectos para actualizar los montos
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      // Invalidar la query del donante para actualizar su información
      queryClient.invalidateQueries({ queryKey: ['donante'] });
    },
    onError: (error) => {
      console.error('Error en mutación de donación:', error);
    },
  });

  return {
    donar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

// Re-exportar tipos para conveniencia
export { type RealizarDonacionParams, type RealizarDonacionResult };
