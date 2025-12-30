import { mutationOptions } from '@tanstack/react-query';
import { ethers } from 'ethers';

export interface RealizarDonacionParams {
  proyectoId: string;
  monto: string; // En ETH
}

export interface RealizarDonacionResult {
  success: boolean;
  transactionHash?: string;
  message: string;
  montoEnWei?: string;
}

/**
 * Función que realiza una donación a un proyecto
 */
export const realizarDonacion = async (
  getContract: () => Promise<any>,
  params: RealizarDonacionParams
): Promise<RealizarDonacionResult> => {
  console.log('Realizando donación:', params);

  try {
    // Obtener contrato
    const contract = await getContract();

    // Convertir el monto de ETH a Wei
    const montoEnWei = ethers.parseEther(params.monto);

    console.log('Monto en Wei:', montoEnWei.toString());

    // Llamar a la función donar del contrato con el valor en Wei
    const tx = await contract.donar(params.proyectoId, {
      value: montoEnWei,
    });

    console.log('Transacción enviada:', tx.hash);

    // Esperar confirmación
    const receipt = await tx.wait();

    console.log('✓ Donación realizada exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: `Donación de ${params.monto} ETH realizada exitosamente`,
      montoEnWei: montoEnWei.toString(),
    };
  } catch (error: any) {
    console.error('Error al realizar donación:', error);

    // Extraer mensaje de error más específico
    let errorMessage = 'Error al realizar la donación';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transacción rechazada por el usuario';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Fondos insuficientes para realizar la donación';
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
export const realizarDonacionMutationOptions = (getContract: () => Promise<any>) =>
  mutationOptions({
    mutationFn: (params: RealizarDonacionParams) =>
      realizarDonacion(getContract, params),
    retry: false, // No reintentar automáticamente transacciones blockchain
  });
