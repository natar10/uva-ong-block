import { useQuery } from '@tanstack/react-query';
import { useContract } from './useContract';
import {
  proyectosQueryOptions,
  type Proyecto,
  type ProyectosStats,
  EstadoProyecto,
} from '../data/proyectos.data';

interface UseProyectosReturn {
  proyectos: Proyecto[];
  stats: ProyectosStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

export const useProyectos = (): UseProyectosReturn => {
  const { getContract } = useContract();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery(proyectosQueryOptions(getContract));

  return {
    proyectos: data?.proyectos ?? [],
    stats: data?.stats ?? {
      totalProyectos: 0,
      totalRecaudado: '0',
      totalValidado: '0',
    },
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
    isRefetching,
  };
};

// Re-exportar tipos para conveniencia
export { EstadoProyecto, type Proyecto, type ProyectosStats };
