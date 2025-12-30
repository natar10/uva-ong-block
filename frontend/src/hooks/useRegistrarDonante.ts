import { useMutation } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  registrarDonanteMutationOptions,
  type RegistrarDonanteParams,
  type RegistrarDonanteResult,
  TipoDonante,
} from '../data/mutations/donantes';

interface UseRegistrarDonanteReturn {
  registrar: (params: RegistrarDonanteParams) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: RegistrarDonanteResult | undefined;
  reset: () => void;
}

export const useRegistrarDonante = (): UseRegistrarDonanteReturn => {
  const { getContract } = useContract();

  const mutation = useMutation({
    ...registrarDonanteMutationOptions(getContract),
    onSuccess: (data) => {
      console.log('Donante registrado:', data);
      // Opcional: Invalidar queries relacionadas si existen
      // queryClient.invalidateQueries({ queryKey: ['donantes'] });
    },
    onError: (error) => {
      console.error('Error en mutación de registro:', error);
    },
  });

  return {
    registrar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

// Re-exportar tipos para conveniencia
export { TipoDonante, type RegistrarDonanteParams };
