import { mutationOptions } from '@tanstack/react-query';
import { ethers } from 'ethers';

// ============================================
// REALIZAR COMPRA
// ============================================

export interface RealizarCompraParams {
  compraId: string;
  proyectoId: string;
  proveedor: string;
  tipoMaterial: string;
  cantidad: number;
}

export interface RealizarCompraResult {
  success: boolean;
  transactionHash?: string;
  message: string;
}

/**
 * Realizar una compra (solo el responsable del proyecto)
 * Segun el ABI: realizarCompra(string _compraId, string _proyectoId, address _proveedor, string tipo_material, uint128 _cantidad)
 */
export const realizarCompra = async (
  getContract: () => Promise<ethers.Contract>,
  params: RealizarCompraParams
): Promise<RealizarCompraResult> => {
  console.log('Realizando compra:', params);

  try {
    const contract = await getContract();

    const tx = await contract.realizarCompra(
      params.compraId,
      params.proyectoId,
      params.proveedor,
      params.tipoMaterial,
      params.cantidad
    );

    console.log('Transaccion enviada:', tx.hash);

    const receipt = await tx.wait();

    console.log('Compra realizada exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: `Compra "${params.compraId}" realizada exitosamente`,
    };
  } catch (error: any) {
    console.error('Error al realizar compra:', error);

    let errorMessage = 'Error al realizar la compra';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaccion rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes('Proyecto no existe')) {
        errorMessage = 'El proyecto no existe';
      } else if (error.message.includes('Proyecto no activo')) {
        errorMessage = 'El proyecto no esta activo';
      } else if (error.message.includes('No autorizado')) {
        errorMessage = 'No estas autorizado para realizar compras en este proyecto';
      } else if (error.message.includes('cantidad tiene que ser mayor')) {
        errorMessage = 'La cantidad debe ser mayor que 0';
      } else if (error.message.includes('Compra ya existe')) {
        errorMessage = 'Ya existe una compra con ese ID';
      } else if (error.message.includes('Proveedor no registrado')) {
        errorMessage = 'El proveedor no esta registrado';
      } else if (error.message.includes('Fondos insuficientes')) {
        errorMessage = 'Fondos insuficientes en el proyecto';
      } else if (error.message.includes('Material no existe')) {
        errorMessage = 'El material seleccionado no existe';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

export const realizarCompraMutationOptions = (
  getContract: () => Promise<ethers.Contract>
) =>
  mutationOptions({
    mutationFn: (params: RealizarCompraParams) =>
      realizarCompra(getContract, params),
    retry: false,
  });

// ============================================
// VALIDAR COMPRA
// ============================================

export interface ValidarCompraParams {
  compraId: string;
}

export interface ValidarCompraResult {
  success: boolean;
  transactionHash?: string;
  message: string;
}

/**
 * Validar una compra (solo el responsable del proyecto)
 * Segun el ABI: validarCompra(string _compraId)
 */
export const validarCompra = async (
  getContract: () => Promise<ethers.Contract>,
  params: ValidarCompraParams
): Promise<ValidarCompraResult> => {
  console.log('Validando compra:', params.compraId);

  try {
    const contract = await getContract();

    const tx = await contract.validarCompra(params.compraId);

    console.log('Transaccion enviada:', tx.hash);

    const receipt = await tx.wait();

    console.log('Compra validada exitosamente');

    return {
      success: true,
      transactionHash: receipt.hash,
      message: `Compra "${params.compraId}" validada exitosamente. Fondos transferidos al proveedor.`,
    };
  } catch (error: any) {
    console.error('Error al validar compra:', error);

    let errorMessage = 'Error al validar la compra';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transaccion rechazada por el usuario';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      if (error.message.includes('Compra no existe')) {
        errorMessage = 'La compra no existe';
      } else if (error.message.includes('Compra ya validada')) {
        errorMessage = 'Esta compra ya fue validada';
      } else if (error.message.includes('Solo el responsable')) {
        errorMessage = 'Solo el responsable del proyecto puede validar';
      } else if (error.message.includes('Proyecto no activo')) {
        errorMessage = 'El proyecto no esta activo';
      } else if (error.message.includes('Transferencia fallida')) {
        errorMessage = 'Error al transferir fondos al proveedor';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
};

export const validarCompraMutationOptions = (
  getContract: () => Promise<ethers.Contract>
) =>
  mutationOptions({
    mutationFn: (params: ValidarCompraParams) =>
      validarCompra(getContract, params),
    retry: false,
  });
