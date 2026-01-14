import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  crearProyectoMutationOptions,
  type CrearProyectoParams,
  type CrearProyectoResult,
} from '../data/mutations/proyectos';

export const useCrearProyecto = () => {
  const { getContract } = useContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...crearProyectoMutationOptions(getContract),
    onSuccess: () => {
      // Invalidar query de proyectos para refetch
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
    },
  });

  return {
    crearProyecto: mutation.mutate,
    crearProyectoAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data as CrearProyectoResult | undefined,
    reset: mutation.reset,
  };
};

export type { CrearProyectoParams, CrearProyectoResult };
