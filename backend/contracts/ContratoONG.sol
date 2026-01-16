// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./modules/OngCompras.sol";

/**
 * @title ContratoONG
 * @dev Contrato principal que integra todos los módulos de la ONG
 *
 * Cadena de herencia:
 * OngBase → OngDonantes → OngProyectos → OngDonaciones → OngCompras → ContratoONG
 */
contract ContratoONG is OngCompras {
    constructor(address _tokenGobernanza) OngBase(_tokenGobernanza) {}

    /**
     * Obtener balance del contrato
     */
    function obtenerBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
