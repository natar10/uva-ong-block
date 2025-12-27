import { useContract } from '@/hooks/useContract';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/test/')({
  component: RouteComponent,
})

function RouteComponent() {

    const[proyectos, setProyectos] = useState(null);
    const { getContract } = useContract();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProyecto = async () => {
        try {
            const contract = await getContract();
            
            // Llamar función de solo lectura (no cuesta gas)
            const proyectoData = await contract.obtenerProyecto("1");
            
            setProyectos(proyectoData);

        } catch (error) {
            console.error('Error al cargar proyecto:', error);
        } finally {
            setLoading(false);
        }
        };

        cargarProyecto();
    }, []);

    console.log("proyectos");
    console.log(proyectos);

  return <div> <h2>Este es el FE, cutre... pero FE jaja </h2> <h3>{loading ? <>Cargando...</> : <>Proyecto cargado desde solidity id: {proyectos.id} nombre: {proyectos.descripcion}</>}</h3></div>
}
