import { ethers } from 'ethers';
import { queryOptions } from '@tanstack/react-query';

export enum EstadoProyecto {
  Propuesto = 0,
  Activo = 1,
  Cancelado = 2,
}

export interface Proyecto {
  id: string;
  descripcion: string;
  responsable: string;
  cantidadRecaudada: string;
  cantidadValidada: string;
  estado: EstadoProyecto;
  votosAprobacion: string;
  votosCancelacion: string;
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
 * Funcion que obtiene todos los proyectos desde el contrato
 */
export const fetchProyectos = async (
  getContract: () => Promise<ethers.Contract>
): Promise<ProyectosData> => {
  console.log('Cargando proyectos desde la blockchain...');

  try {
    const contract = await getContract();
    console.log('Contrato obtenido correctamente');

    // Obtener total de proyectos
    const total = await contract.obtenerTotalProyectos();
    console.log('Total proyectos raw:', total);
    const totalNumber = Number(total);

    if (totalNumber === 0) {
      return {
        proyectos: [],
        stats: { totalProyectos: 0, totalRecaudado: '0', totalValidado: '0' },
      };
    }

    // Obtener datos de cada proyecto
    const proyectos: Proyecto[] = [];
    let recaudadoTotal = 0n;
    let validadoTotal = 0n;

    for (let i = 0; i < totalNumber; i++) {
      try {
        const proyectoId = await contract.listaProyectos(i);

        // Validar que el proyectoId no este vacio
        if (!proyectoId || proyectoId === '') {
          console.warn(`Proyecto en indice ${i} tiene ID vacio, saltando...`);
          continue;
        }

        const proyectoData = await contract.obtenerProyecto(proyectoId);

        // Validar que el proyecto tenga datos
        if (!proyectoData || !proyectoData.id) {
          console.warn(`Proyecto ${proyectoId} no tiene datos, saltando...`);
          continue;
        }

        proyectos.push({
          id: proyectoData.id,
          descripcion: proyectoData.descripcion,
          responsable: proyectoData.responsable,
          cantidadRecaudada: ethers.formatEther(proyectoData.cantidadRecaudada),
          cantidadValidada: ethers.formatEther(proyectoData.cantidadValidada),
          estado: Number(proyectoData.estado) as EstadoProyecto,
          votosAprobacion: proyectoData.votosAprobacion.toString(),
          votosCancelacion: proyectoData.votosCancelacion.toString(),
        });

        recaudadoTotal += proyectoData.cantidadRecaudada;
        validadoTotal += proyectoData.cantidadValidada;
      } catch (err: any) {
        console.warn(`Error al cargar proyecto en indice ${i}:`, err.message);
        continue;
      }
    }

    const stats: ProyectosStats = {
      totalProyectos: totalNumber,
      totalRecaudado: parseFloat(ethers.formatEther(recaudadoTotal)).toFixed(3),
      totalValidado: parseFloat(ethers.formatEther(validadoTotal)).toFixed(3),
    };

    console.log(`${totalNumber} proyectos cargados exitosamente`);

    return { proyectos, stats };
  } catch (error: any) {
    console.error('Error al cargar proyectos:', error);

    // Si es error de BAD_DATA o ENS, el contrato no esta desplegado o red no soportada
    if (
      error.code === 'BAD_DATA' ||
      error.code === 'UNSUPPORTED_OPERATION' ||
      error.message?.includes('could not decode') ||
      error.message?.includes('ENS')
    ) {
      console.warn('Contrato no disponible o no desplegado');
      return {
        proyectos: [],
        stats: { totalProyectos: 0, totalRecaudado: '0', totalValidado: '0' },
      };
    }

    throw error;
  }
};

/**
 * Query options para TanStack React Query
 */
export const proyectosQueryOptions = (getContract: () => Promise<ethers.Contract>) =>
  queryOptions({
    queryKey: ['proyectos'],
    queryFn: () => fetchProyectos(getContract),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });
