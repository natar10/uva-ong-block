import { mutationOptions } from '@tanstack/react-query';

export enum TipoDonante {
  Individual = 0,
  Empresa = 1,
}

export interface RegistrarDonanteParams {
  nombre: string;
  tipo: TipoDonante;
}

export interface RegistrarDonanteResult {
  success: boolean;
  transactionHash?: string;
  message: string;
}

/**
 * Función que registra un donante en el contrato
 */
export const registrarDonante = async (
  getContract: () => Promise<any>,
  params: RegistrarDonanteParams
): Promise<RegistrarDonanteResult> => {
  console.log('Registrando donante:', params);

  try {
    // Obtener contrato
    const contract = await getContract();

    // Llamar a la función registrarDonante del contrato
    const tx = await contract.registrarDonante(params.nombre, params.tipo);

    console.log('Transacción enviada:', tx.hash);

    // Esperar confirmación
    const receipt = await tx.wait();

    console.log('✓ Donante registrado exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: 'Donante registrado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al registrar donante:', error);

    // Extraer mensaje de error más específico
    let errorMessage = 'Error al registrar donante';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transacción rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Mutation options para TanStack React Query
 */
export const registrarDonanteMutationOptions = (getContract: () => Promise<any>) =>
  mutationOptions({
    mutationFn: (params: RegistrarDonanteParams) =>
      registrarDonante(getContract, params),
    retry: false, // No reintentar automáticamente transacciones blockchain
  });
