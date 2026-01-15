import { mutationOptions } from '@tanstack/react-query';
import { EstadoProyecto } from '../query/proyectos';

export interface CrearProyectoParams {
  id: string;
  descripcion: string;
  responsable: string; // Dirección del responsable
  estado: EstadoProyecto; // Propuesto o Activo
}

export interface CrearProyectoResult {
  success: boolean;
  transactionHash?: string;
  message: string;
}

/**
 * Función que crea un nuevo proyecto (solo owner)
 */
export const crearProyecto = async (
  getContract: () => Promise<any>,
  params: CrearProyectoParams
): Promise<CrearProyectoResult> => {
  console.log('Creando proyecto:', params);

  try {
    const contract = await getContract();

    const tx = await contract.crearProyecto(
      params.id,
      params.descripcion,
      params.responsable,
      params.estado
    );

    console.log('Transacción enviada:', tx.hash);

    const receipt = await tx.wait();

    console.log('Proyecto creado exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: `Proyecto "${params.id}" creado exitosamente`,
    };
  } catch (error: any) {
    console.error('Error al crear proyecto:', error);

    let errorMessage = 'Error al crear el proyecto';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transacción rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes('Solo el owner')) {
        errorMessage = 'Solo el administrador puede crear proyectos';
      } else if (error.message.includes('Proyecto ya existe')) {
        errorMessage = 'Ya existe un proyecto con ese ID';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Mutation options para TanStack React Query
 */
export const crearProyectoMutationOptions = (getContract: () => Promise<any>) =>
  mutationOptions({
    mutationFn: (params: CrearProyectoParams) =>
      crearProyecto(getContract, params),
    retry: false,
  });
