// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OngDonantes.sol";

/**
 * @title OngProyectos
 * @dev Módulo para gestión de proyectos y votación
 */
abstract contract OngProyectos is OngDonantes {
    /**
     * Crear un nuevo proyecto (solo owner)
     */
    function crearProyecto(
        string memory _id,
        string memory _descripcion,
        address _responsable,
        EstadoProyecto _estado
    ) public soloOwner {
        require(bytes(proyectos[_id].id).length == 0, "Proyecto ya existe");
        require(
            _estado != EstadoProyecto.Cancelado,
            "No se puede crear proyecto cancelado"
        );

        proyectos[_id] = Proyecto({
            id: _id,
            descripcion: _descripcion,
            responsable: _responsable,
            cantidadRecaudada: 0,
            cantidadValidada: 0,
            estado: _estado,
            votosAprobacion: 0,
            votosCancelacion: 0
        });

        listaProyectos.push(_id);
        emit ProyectoCreado(_id, _descripcion);
    }

    /**
     * Votar para aprobar un proyecto propuesto
     */
    function votarAprobacion(
        string memory _proyectoId,
        uint256 _cantidadVotos
    ) public {
        require(donantes[msg.sender].direccion != address(0), "No registrado");
        require(
            bytes(proyectos[_proyectoId].id).length > 0,
            "Proyecto no existe"
        );
        require(
            proyectos[_proyectoId].estado == EstadoProyecto.Propuesto,
            "Proyecto no esta en estado Propuesto"
        );

        _verificarYQuemarTokens(_cantidadVotos);

        proyectos[_proyectoId].votosAprobacion += _cantidadVotos;

        emit VotoAprobacion(msg.sender, _proyectoId, _cantidadVotos);

        if (proyectos[_proyectoId].votosAprobacion >= VOTOS_MINIMOS) {
            proyectos[_proyectoId].estado = EstadoProyecto.Activo;
            emit ProyectoAprobado(
                _proyectoId,
                proyectos[_proyectoId].votosAprobacion
            );
        }
    }

    /**
     * Votar para cancelar un proyecto
     */
    function votarCancelacion(
        string memory _proyectoId,
        uint256 _cantidadVotos
    ) public {
        require(donantes[msg.sender].direccion != address(0), "No registrado");
        require(
            bytes(proyectos[_proyectoId].id).length > 0,
            "Proyecto no existe"
        );
        require(
            proyectos[_proyectoId].estado != EstadoProyecto.Cancelado,
            "Proyecto ya cancelado"
        );

        if (proyectos[_proyectoId].estado == EstadoProyecto.Activo) {
            require(
                _haDonandoAlProyecto(msg.sender, _proyectoId),
                "Solo donantes del proyecto pueden votar cancelacion"
            );
        }

        _verificarYQuemarTokens(_cantidadVotos);

        proyectos[_proyectoId].votosCancelacion += _cantidadVotos;

        emit VotoCancelacion(msg.sender, _proyectoId, _cantidadVotos);

        if (proyectos[_proyectoId].votosCancelacion >= VOTOS_MINIMOS) {
            uint256 fondosAlFondoComun = proyectos[_proyectoId]
                .cantidadRecaudada - proyectos[_proyectoId].cantidadValidada;

            proyectos[_proyectoId].estado = EstadoProyecto.Cancelado;

            emit ProyectoCancelado(
                _proyectoId,
                proyectos[_proyectoId].votosCancelacion,
                fondosAlFondoComun
            );
        }
    }

    /**
     * Función interna para verificar y quemar tokens de gobernanza
     */
    function _verificarYQuemarTokens(uint256 _cantidadVotos) internal {
        uint256 tokensRequeridos = _cantidadVotos * 1e18;
        require(
            tokenGobernanza.balanceOf(msg.sender) >= tokensRequeridos,
            "Tokens insuficientes"
        );
        require(
            tokenGobernanza.allowance(msg.sender, address(this)) >=
                tokensRequeridos,
            "Debe aprobar tokens para votar"
        );
        tokenGobernanza.quemar(msg.sender, tokensRequeridos);
    }

    /**
     * Función interna para verificar si una dirección ha donado a un proyecto
     */
    function _haDonandoAlProyecto(
        address _donante,
        string memory _proyectoId
    ) internal view returns (bool) {
        return donantesDeProyecto[_proyectoId][_donante];
    }

    /**
     * Validar fondos de un proyecto (owner marca como validado)
     */
    function validarFondosProyecto(
        string memory _proyectoId,
        uint256 _cantidad
    ) public soloOwner {
        require(
            bytes(proyectos[_proyectoId].id).length > 0,
            "Proyecto no existe"
        );
        require(
            _cantidad <= proyectos[_proyectoId].cantidadRecaudada,
            "Cantidad excede recaudado"
        );

        proyectos[_proyectoId].cantidadValidada += _cantidad;
    }

    /**
     * Obtener información de un proyecto
     */
    function obtenerProyecto(
        string memory _id
    ) public view returns (Proyecto memory) {
        return proyectos[_id];
    }

    /**
     * Obtener total de proyectos
     */
    function obtenerTotalProyectos() public view returns (uint256) {
        return listaProyectos.length;
    }
}
