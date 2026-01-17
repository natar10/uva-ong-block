// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../base/OngBase.sol";

/**
 * @title OngDonantes
 * @dev Módulo para gestión de donantes
 */
abstract contract OngDonantes is OngBase {
    /**
     * Registrar un nuevo donante
     */
    function registrarDonante(string memory _nombre, TipoDonante _tipo) public {
        require(
            donantes[msg.sender].direccion == address(0),
            "Donante ya registrado"
        );

        donantes[msg.sender] = Donante({
            direccion: msg.sender,
            nombre: _nombre,
            tipoDonante: _tipo,
            totalDonado: 0
        });

        listaDonantes.push(msg.sender);
        emit DonanteRegistrado(msg.sender, _nombre);
    }

    /**
     * Obtener información de un donante
     */
    function obtenerDonante(
        address _direccion
    ) public view returns (Donante memory) {
        return donantes[_direccion];
    }

    /**
     * Obtener total de donantes registrados
     */
    function obtenerTotalDonantes() public view returns (uint256) {
        return listaDonantes.length;
    }

    /**
     * Obtener balance de tokens de gobernanza de un donante
     */
    function obtenerTokensGobernanza(
        address _donante
    ) public view returns (uint256) {
        return tokenGobernanza.balanceOf(_donante);
    }
}
