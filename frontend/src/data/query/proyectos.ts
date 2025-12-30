import { ethers } from 'ethers';
import { queryOptions } from '@tanstack/react-query';

export enum EstadoProyecto {
  Activo = 0,
  Completado = 1,
  Cancelado = 2,
}

export interface Proyecto {
  id: string;
  descripcion: string;
  responsable: string;
  cantidadRecaudada: string;
  cantidadValidada: string;
  estado: EstadoProyecto;
  votos: string;
}

export interface ProyectosStats {
  totalProyectos: number;
  totalRecaudado: string;
  totalValidado: string;
}

export interface ProyectosData {
  proyectos: Proyecto[];
  stats: ProyectosStats;
}

/**
 * Función que obtiene todos los proyectos desde el contrato
 */
export const fetchProyectos = async (
  getContract: () => Promise<any>
): Promise<ProyectosData> => {
  console.log('Cargando proyectos desde la blockchain...');

  // Obtener contrato
  const contract = await getContract();

  // Obtener total de proyectos
  const total = await contract.obtenerTotalProyectos();
  const totalNumber = Number(total);

  // Obtener datos de cada proyecto
  const proyectos: Proyecto[] = [];
  let recaudadoTotal = 0n;
  let validadoTotal = 0n;

  for (let i = 0; i < totalNumber; i++) {
    // Obtener el ID del proyecto
    const proyectoId = await contract.listaProyectos(i);

    // Obtener los datos completos del proyecto
    const proyectoData = await contract.obtenerProyecto(proyectoId);

    // Convertir los datos del contrato al formato de la interfaz
    proyectos.push({
      id: proyectoData.id,
      descripcion: proyectoData.descripcion,
      responsable: proyectoData.responsable,
      cantidadRecaudada: ethers.formatEther(proyectoData.cantidadRecaudada),
      cantidadValidada: ethers.formatEther(proyectoData.cantidadValidada),
      estado: Number(proyectoData.estado) as EstadoProyecto,
      votos: proyectoData.votos.toString(),
    });

    // Acumular totales
    recaudadoTotal += proyectoData.cantidadRecaudada;
    validadoTotal += proyectoData.cantidadValidada;
  }

  const stats: ProyectosStats = {
    totalProyectos: totalNumber,
    totalRecaudado: parseFloat(ethers.formatEther(recaudadoTotal)).toFixed(2),
    totalValidado: parseFloat(ethers.formatEther(validadoTotal)).toFixed(2),
  };

  console.log(`✓ ${totalNumber} proyectos cargados exitosamente`);

  return { proyectos, stats };
};

/**
 * Query options para TanStack React Query
 */
export const proyectosQueryOptions = (getContract: () => Promise<any>) =>
  queryOptions({
    queryKey: ['proyectos'],
    queryFn: () => fetchProyectos(getContract),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
