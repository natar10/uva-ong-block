// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OngProyectos.sol";

/**
 * @title OngDonaciones
 * @dev Módulo para gestión de donaciones
 */
abstract contract OngDonaciones is OngProyectos {
    function donar(string memory _proyectoId) public payable {
        require(msg.value > 0, "La donacion debe ser mayor a 0");
        require(
            bytes(proyectos[_proyectoId].id).length > 0,
            "Proyecto no existe"
        );
        require(
            proyectos[_proyectoId].estado == EstadoProyecto.Activo,
            "Proyecto no activo"
        );

        // Si el donante no está registrado, registrarlo como individuo
        if (donantes[msg.sender].direccion == address(0)) {
            donantes[msg.sender] = Donante({
                direccion: msg.sender,
                nombre: "Individuo",
                tipoDonante: TipoDonante.Individual,
                totalDonado: 0
            });
            listaDonantes.push(msg.sender);
        }

        // Crear registro de donación
        contadorDonaciones++;
        string memory donacionId = string(
            abi.encodePacked("DON", uintToString(contadorDonaciones))
        );

        donaciones[donacionId] = Donacion({
            id: donacionId,
            donante: msg.sender,
            proyectoId: _proyectoId,
            cantidad: msg.value,
            fecha: block.timestamp
        });

        listaDonaciones.push(donacionId);

        // Actualizar totales
        donantes[msg.sender].totalDonado += msg.value;
        proyectos[_proyectoId].cantidadRecaudada += msg.value;

        // Registrar que este donante ha donado a este proyecto
        donantesDeProyecto[_proyectoId][msg.sender] = true;

        // Mintear tokens de gobernanza al donante (1 token = 1e18 unidades por cada 0.001 ETH)
        uint256 tokensAMintear = (msg.value / 0.001 ether) * 1e18;
        if (tokensAMintear > 0) {
            tokenGobernanza.mintear(msg.sender, tokensAMintear);
        }

        emit DonacionRealizada(msg.sender, _proyectoId, msg.value);
    }

    /**
     * Obtener información de una donación
     */
    function obtenerDonacion(
        string memory _id
    ) public view returns (Donacion memory) {
        return donaciones[_id];
    }

    /**
     * Obtener total de donaciones
     */
    function obtenerTotalDonaciones() public view returns (uint256) {
        return listaDonaciones.length;
    }

    /**
     * Trazabilidad completa para un donante:
     * Retorna todas las donaciones del donante con sus proyectos y compras asociadas
     */
    function obtenerTrazabilidadDonante(
        address _donante
    ) public view returns (TrazabilidadDonacion[] memory) {
        // Primero contar donaciones del donante
        uint256 countDonaciones = 0;
        for (uint256 i = 0; i < listaDonaciones.length; i++) {
            if (donaciones[listaDonaciones[i]].donante == _donante) {
                countDonaciones++;
            }
        }

        TrazabilidadDonacion[] memory trazabilidad = new TrazabilidadDonacion[](countDonaciones);
        uint256 index = 0;

        for (uint256 i = 0; i < listaDonaciones.length; i++) {
            Donacion memory donacion = donaciones[listaDonaciones[i]];
            if (donacion.donante == _donante) {
                trazabilidad[index].donacion = donacion;
                trazabilidad[index].proyecto = proyectos[donacion.proyectoId];
                trazabilidad[index].compras = _obtenerComprasPorProyectoInternal(donacion.proyectoId);
                index++;
            }
        }

        return trazabilidad;
    }

    /**
     * Función interna para obtener compras por proyecto (será implementada en OngCompras)
     */
    function _obtenerComprasPorProyectoInternal(
        string memory _proyectoId
    ) internal view virtual returns (Compra[] memory);
}
