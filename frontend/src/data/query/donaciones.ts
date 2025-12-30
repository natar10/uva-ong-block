import { queryOptions } from '@tanstack/react-query';
import { ethers } from 'ethers';

export interface Donacion {
  id: string;
  donante: string;
  proyectoId: string;
  cantidad: string; // En Wei
  cantidadEth: string; // En ETH (formateado)
  fecha: number; // timestamp
  fechaFormateada: string;
}

/**
 * Función que obtiene todas las donaciones desde el contrato
 */
export const fetchDonaciones = async (
  getContract: () => Promise<any>
): Promise<Donacion[]> => {
  console.log('Obteniendo todas las donaciones...');

  try {
    // Obtener contrato
    const contract = await getContract();

    // Obtener el total de donaciones
    const total = await contract.obtenerTotalDonaciones();
    const totalNumber = Number(total);

    console.log(`Total de donaciones: ${totalNumber}`);

    if (totalNumber === 0) {
      return [];
    }

    // Obtener todas las donaciones iterando sobre la lista
    const donaciones: Donacion[] = [];

    for (let i = 0; i < totalNumber; i++) {
      // Obtener el ID de la donación desde el array público
      const donacionId = await contract.listaDonaciones(i);

      // Obtener los detalles de la donación
      const donacionData = await contract.obtenerDonacion(donacionId);

      const cantidadEth = ethers.formatEther(donacionData.cantidad);
      const fecha = Number(donacionData.fecha);
      const fechaFormateada = new Date(fecha * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      donaciones.push({
        id: donacionData.id,
        donante: donacionData.donante,
        proyectoId: donacionData.proyectoId,
        cantidad: donacionData.cantidad.toString(),
        cantidadEth,
        fecha,
        fechaFormateada,
      });
    }

    console.log(`✓ ${donaciones.length} donaciones obtenidas`);
    return donaciones;
  } catch (error: any) {
    console.error('Error al obtener donaciones:', error);
    throw new Error('Error al cargar las donaciones desde el contrato');
  }
};

/**
 * Query options para TanStack React Query
 */
export const donacionesQueryOptions = (getContract: () => Promise<any>) =>
  queryOptions({
    queryKey: ['donaciones'],
    queryFn: () => fetchDonaciones(getContract),
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
