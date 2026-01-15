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

// ============================================
// VOTACION DE PROYECTOS
// ============================================

export interface VotarParams {
  proyectoId: string;
  cantidadVotos: number;
}

export interface VotarResult {
  success: boolean;
  transactionHash?: string;
  message: string;
  proyectoAprobado?: boolean;
  proyectoCancelado?: boolean;
}

/**
 * Votar para aprobar un proyecto propuesto
 */
export const votarAprobacion = async (
  getContract: () => Promise<any>,
  params: VotarParams
): Promise<VotarResult> => {
  console.log('Votando aprobacion:', params);

  try {
    const contract = await getContract();

    const tx = await contract.votarAprobacion(
      params.proyectoId,
      params.cantidadVotos
    );

    console.log('Transaccion enviada:', tx.hash);

    const receipt = await tx.wait();

    // Verificar si el proyecto fue aprobado (evento ProyectoAprobado)
    const proyectoAprobado = receipt.logs.some((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'ProyectoAprobado';
      } catch {
        return false;
      }
    });

    console.log('Voto registrado exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: proyectoAprobado
        ? `El proyecto "${params.proyectoId}" ha sido aprobado y ahora esta activo`
        : `Voto registrado exitosamente (${params.cantidadVotos} votos)`,
      proyectoAprobado,
    };
  } catch (error: any) {
    console.error('Error al votar:', error);

    let errorMessage = 'Error al votar';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaccion rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes('No registrado')) {
        errorMessage = 'Debes estar registrado como donante para votar';
      } else if (error.message.includes('Proyecto no existe')) {
        errorMessage = 'El proyecto no existe';
      } else if (error.message.includes('Proyecto no esta en estado Propuesto')) {
        errorMessage = 'Solo se puede votar en proyectos propuestos';
      } else if (error.message.includes('Tokens insuficientes')) {
        errorMessage = 'No tienes suficientes tokens de gobernanza';
      } else if (error.message.includes('Debe aprobar tokens')) {
        errorMessage = 'Debes aprobar los tokens antes de votar';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

/**
 * Votar para cancelar un proyecto
 */
export const votarCancelacion = async (
  getContract: () => Promise<any>,
  params: VotarParams
): Promise<VotarResult> => {
  console.log('Votando cancelacion:', params);

  try {
    const contract = await getContract();

    const tx = await contract.votarCancelacion(
      params.proyectoId,
      params.cantidadVotos
    );

    console.log('Transaccion enviada:', tx.hash);

    const receipt = await tx.wait();

    // Verificar si el proyecto fue cancelado (evento ProyectoCancelado)
    const proyectoCancelado = receipt.logs.some((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'ProyectoCancelado';
      } catch {
        return false;
      }
    });

    console.log('Voto de cancelacion registrado');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: proyectoCancelado
        ? `El proyecto "${params.proyectoId}" ha sido cancelado`
        : `Voto de cancelacion registrado (${params.cantidadVotos} votos)`,
      proyectoCancelado,
    };
  } catch (error: any) {
    console.error('Error al votar cancelacion:', error);

    let errorMessage = 'Error al votar';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaccion rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes('No registrado')) {
        errorMessage = 'Debes estar registrado como donante para votar';
      } else if (error.message.includes('Proyecto no existe')) {
        errorMessage = 'El proyecto no existe';
      } else if (error.message.includes('Proyecto ya cancelado')) {
        errorMessage = 'El proyecto ya esta cancelado';
      } else if (error.message.includes('Solo donantes del proyecto')) {
        errorMessage = 'Solo los donantes de este proyecto pueden votar su cancelacion';
      } else if (error.message.includes('Tokens insuficientes')) {
        errorMessage = 'No tienes suficientes tokens de gobernanza';
      } else if (error.message.includes('Debe aprobar tokens')) {
        errorMessage = 'Debes aprobar los tokens antes de votar';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

export const votarAprobacionMutationOptions = (
  getContract: () => Promise<any>
) =>
  mutationOptions({
    mutationFn: (params: VotarParams) => votarAprobacion(getContract, params),
    retry: false,
  });

export const votarCancelacionMutationOptions = (
  getContract: () => Promise<any>
) =>
  mutationOptions({
    mutationFn: (params: VotarParams) => votarCancelacion(getContract, params),
    retry: false,
  });
