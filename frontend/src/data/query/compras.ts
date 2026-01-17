import { queryOptions } from '@tanstack/react-query';
import { ethers } from 'ethers';

export interface Compra {
  id: string;
  comprador: string;
  proveedor: string;
  proyectoId: string;
  cantidad: number;
  valor: string;
  valorEth: string;
  tipo: string;
  fecha: number;
  fechaFormateada: string;
  validada: boolean;
}

export interface Material {
  nombre: string;
  valor: string;
  valorNumber: number;
}

export interface Proveedor {
  id: string;
  descripcion: string;
  direccion: string;
  ganancias: string;
}

/**
 * Obtener compras por proyecto usando obtenerComprasPorProyecto del contrato
 */
export const fetchComprasPorProyecto = async (
  getContract: () => Promise<ethers.Contract>,
  proyectoId: string
): Promise<Compra[]> => {
  console.log(`Obteniendo compras del proyecto: ${proyectoId}`);

  try {
    const contract = await getContract();
    const comprasData = await contract.obtenerComprasPorProyecto(proyectoId);

    const compras: Compra[] = comprasData.map((compra: any) => {
      const fecha = Number(compra.fecha);
      const fechaFormateada = fecha > 0
        ? new Date(fecha * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Sin fecha';

      return {
        id: compra.id,
        comprador: compra.comprador,
        proveedor: compra.proveedor,
        proyectoId: compra.proyectoId,
        cantidad: Number(compra.cantidad),
        valor: compra.valor.toString(),
        valorEth: ethers.formatEther(compra.valor),
        tipo: compra.tipo,
        fecha,
        fechaFormateada,
        validada: compra.validada,
      };
    });

    console.log(`${compras.length} compras obtenidas`);
    return compras;
  } catch (error: any) {
    console.error('Error al obtener compras:', error);

    if (
      error.code === 'BAD_DATA' ||
      error.code === 'UNSUPPORTED_OPERATION' ||
      error.message?.includes('could not decode') ||
      error.message?.includes('ENS')
    ) {
      console.warn('Contrato no disponible');
      return [];
    }

    throw new Error('Error al cargar las compras desde el contrato');
  }
};

/**
 * Obtener una compra por ID
 */
export const fetchCompra = async (
  getContract: () => Promise<ethers.Contract>,
  compraId: string
): Promise<Compra | null> => {
  try {
    const contract = await getContract();
    const compra = await contract.obtenerCompra(compraId);

    if (!compra.id || compra.fecha === 0n) {
      return null;
    }

    const fecha = Number(compra.fecha);
    return {
      id: compra.id,
      comprador: compra.comprador,
      proveedor: compra.proveedor,
      proyectoId: compra.proyectoId,
      cantidad: Number(compra.cantidad),
      valor: compra.valor.toString(),
      valorEth: ethers.formatEther(compra.valor),
      tipo: compra.tipo,
      fecha,
      fechaFormateada: new Date(fecha * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      validada: compra.validada,
    };
  } catch (error: any) {
    console.error('Error al obtener compra:', error);
    return null;
  }
};

/**
 * Obtener material por nombre
 */
export const fetchMaterial = async (
  getContract: () => Promise<ethers.Contract>,
  nombre: string
): Promise<Material | null> => {
  try {
    const contract = await getContract();
    const material = await contract.getMaterialByName(nombre);

    return {
      nombre: material.nombre,
      valor: material.valor.toString(),
      valorNumber: Number(material.valor),
    };
  } catch (error: any) {
    console.error('Error al obtener material:', error);
    return null;
  }
};

/**
 * Obtener todos los materiales disponibles
 * Los materiales estan definidos en el constructor del contrato con indices 0-3
 */
export const fetchMateriales = async (
  getContract: () => Promise<ethers.Contract>
): Promise<Material[]> => {
  try {
    const contract = await getContract();
    const materiales: Material[] = [];

    // El contrato tiene 4 materiales definidos (indices 0-3)
    for (let i = 0; i < 4; i++) {
      try {
        const material = await contract.materiales(i);
        materiales.push({
          nombre: material.nombre,
          valor: material.valor.toString(),
          valorNumber: Number(material.valor),
        });
      } catch {
        break; // No hay mas materiales
      }
    }

    return materiales;
  } catch (error: any) {
    console.error('Error al obtener materiales:', error);
    return [];
  }
};

/**
 * Obtener proveedor por direccion
 */
export const fetchProveedor = async (
  getContract: () => Promise<ethers.Contract>,
  direccion: string
): Promise<Proveedor | null> => {
  try {
    const contract = await getContract();
    const proveedor = await contract.proveedores(direccion);

    // Si el proveedor no existe, la direccion sera 0x0
    if (proveedor.proveedor === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    return {
      id: proveedor.id,
      descripcion: proveedor.descripcion,
      direccion: proveedor.proveedor,
      ganancias: ethers.formatEther(proveedor.ganancias),
    };
  } catch (error: any) {
    console.error('Error al obtener proveedor:', error);
    return null;
  }
};

/**
 * Query options para obtener materiales
 */
export const materialesQueryOptions = (getContract: () => Promise<ethers.Contract>) =>
  queryOptions({
    queryKey: ['materiales'],
    queryFn: () => fetchMateriales(getContract),
    staleTime: 1000 * 60 * 30, // 30 minutos (los materiales no cambian)
    gcTime: 1000 * 60 * 60,
  });

/**
 * Query options para obtener compras por proyecto
 */
export const comprasPorProyectoQueryOptions = (
  getContract: () => Promise<ethers.Contract>,
  proyectoId: string
) =>
  queryOptions({
    queryKey: ['compras', proyectoId],
    queryFn: () => fetchComprasPorProyecto(getContract, proyectoId),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    enabled: !!proyectoId,
  });
