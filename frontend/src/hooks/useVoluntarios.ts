import { useState } from 'react';
import { useContract } from './useContract';

export interface UseVoluntariosReturn {
  validarProyecto: (proyectoId: string, cantidad: string) => Promise<void>;
  retirarTodo: () => Promise<void>;
  loading: boolean;
}

export const useVoluntarios = (): UseVoluntariosReturn => {
  const { getContract } = useContract();
  const [loading, setLoading] = useState(false);

  // Validar fondos de un proyecto (voluntario)
  const validarProyecto = async (proyectoId: string, cantidad: string) => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.validarFondosProyectoComoVoluntario(
        proyectoId,
        Number(cantidad)
      );

      await tx.wait();
      alert('Fondos validados con éxito');
    } catch (err: any) {
      alert('Error: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Retirar fondos (solo owner)
  const retirarTodo = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.retirarFondos();
      await tx.wait();

      alert('Fondos retirados correctamente');
    } catch (err: any) {
      alert('Error al retirar: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return {
    validarProyecto,
    retirarTodo,
    loading,
  };
};


