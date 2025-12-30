import { queryOptions } from '@tanstack/react-query';

export enum TipoDonante {
  Individual = 0,
  Empresa = 1,
}

export interface Donante {
  direccion: string;
  nombre: string;
  tipoDonante: TipoDonante;
  totalDonado: string;
  tokensGobernanza: string;
}

/**
 * Función que obtiene la información de un donante desde el contrato
 */
export const fetchDonante = async (
  getContract: () => Promise<any>,
  address: string
): Promise<Donante | null> => {
  console.log('Verificando donante:', address);

  try {
    // Obtener contrato
    const contract = await getContract();

    // Obtener datos del donante
    const donanteData = await contract.obtenerDonante(address);

    // Verificar si el donante está registrado (si la dirección es 0x0, no está registrado)
    if (donanteData.direccion === '0x0000000000000000000000000000000000000000') {
      console.log('Donante no registrado');
      return null;
    }

    const donante: Donante = {
      direccion: donanteData.direccion,
      nombre: donanteData.nombre,
      tipoDonante: Number(donanteData.tipoDonante) as TipoDonante,
      totalDonado: donanteData.totalDonado.toString(),
      tokensGobernanza: donanteData.tokensGobernanza.toString(),
    };

    console.log('✓ Donante encontrado:', donante);
    return donante;
  } catch (error: any) {
    console.error('Error al obtener donante:', error);
    // Si hay un error, asumimos que no está registrado
    return null;
  }
};

/**
 * Query options para TanStack React Query
 */
export const donanteQueryOptions = (
  getContract: () => Promise<any>,
  address: string | null
) =>
  queryOptions({
    queryKey: ['donante', address],
    queryFn: () => {
      if (!address) {
        return Promise.resolve(null);
      }
      return fetchDonante(getContract, address);
    },
    enabled: !!address, // Solo ejecutar si hay una dirección
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
