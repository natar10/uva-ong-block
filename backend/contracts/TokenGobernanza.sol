// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenGobernanza
 * @dev Token ERC20 para gobernanza de la ONG
 * Los donantes reciben tokens proporcionales a sus donaciones
 * que pueden usar para votar en proyectos.
 */
contract TokenGobernanza is ERC20, Ownable {
    // Dirección del contrato de donaciones autorizado para mintear tokens
    address public contratoDonaciones;

    // Evento cuando se actualiza el contrato de donaciones
    event ContratoDonacionesActualizado(
        address indexed anterior,
        address indexed nuevo
    );

    constructor()
        ERC20("Token Gobernanza ONG", "TKN4GOOD")
        Ownable(msg.sender)
    {
        // El owner inicial es quien despliega el contrato
    }

    /**
     * @dev Modificador para permitir solo al contrato de donaciones o al owner
     */
    modifier soloAutorizado() {
        require(
            msg.sender == contratoDonaciones || msg.sender == owner(),
            "No autorizado para mintear"
        );
        _;
    }

    /**
     * @dev Establece la dirección del contrato de donaciones
     * Solo el owner puede llamar esta función
     */
    function setContratoDonaciones(
        address _contratoDonaciones
    ) external onlyOwner {
        require(_contratoDonaciones != address(0), "Direccion invalida");
        address anterior = contratoDonaciones;
        contratoDonaciones = _contratoDonaciones;
        emit ContratoDonacionesActualizado(anterior, _contratoDonaciones);
    }

    /**
     * @dev Mintea nuevos tokens para un donante
     * Solo puede ser llamado por el contrato de donaciones o el owner
     */
    function mintear(
        address _destinatario,
        uint256 _cantidad
    ) external soloAutorizado {
        require(_destinatario != address(0), "Destinatario invalido");
        _mint(_destinatario, _cantidad);
    }

    /**
     * @dev Quema tokens de una dirección (para votaciones)
     * El usuario debe haber aprobado previamente al contrato que llama
     */
    function quemar(address _de, uint256 _cantidad) external soloAutorizado {
        _burn(_de, _cantidad);
    }

    /**
     * @dev Override de decimals para usar 18 decimales (estándar)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
