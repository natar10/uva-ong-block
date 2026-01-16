// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../TokenGobernanza.sol";

/**
 * @title OngBase
 * @dev Contrato base con estructuras, enums, variables de estado, eventos y modificadores
 */
abstract contract OngBase {
    // ============================================
    // ESTRUCTURAS
    // ============================================

    struct Material {
        string nombre;
        uint256 valor;
    }

    struct Donante {
        address direccion;
        string nombre;
        TipoDonante tipoDonante;
        uint256 totalDonado;
    }

    struct Proyecto {
        string id;
        string descripcion;
        address responsable;
        uint256 cantidadRecaudada;
        uint256 cantidadValidada;
        EstadoProyecto estado;
        uint256 votosAprobacion;
        uint256 votosCancelacion;
    }

    struct Proveedor {
        string id;
        string descripcion;
        address proveedor;
        uint256 ganancias;
    }

    struct Donacion {
        string id;
        address donante;
        string proyectoId;
        uint256 cantidad;
        uint256 fecha;
    }

    struct Compra {
        string id;
        address comprador;
        address proveedor;
        string proyectoId;
        uint256 cantidad;
        uint256 valor;
        string tipo;
        uint256 fecha;
        bool validada;
    }

    struct TrazabilidadDonacion {
        Donacion donacion;
        Proyecto proyecto;
        Compra[] compras;
    }

    // ============================================
    // ENUMS
    // ============================================

    enum TipoDonante {
        Individual,
        Empresa
    }

    enum EstadoProyecto {
        Propuesto,
        Activo,
        Cancelado
    }

    // ============================================
    // CONSTANTES
    // ============================================

    uint256 public constant VOTOS_MINIMOS = 2;

    // ============================================
    // VARIABLES DE ESTADO
    // ============================================

    address public owner;
    TokenGobernanza public tokenGobernanza;
    uint256 internal contadorDonaciones = 0;
    Material[] public materiales;

    // Mapeos
    mapping(address => Donante) public donantes;
    mapping(string => Proyecto) public proyectos;
    mapping(string => Donacion) public donaciones;
    mapping(string => Compra) public compras;
    mapping(address => Proveedor) public proveedores;
    mapping(string => mapping(address => bool)) public donantesDeProyecto;

    // Arrays para iterar
    address[] public listaDonantes;
    string[] public listaProyectos;
    string[] public listaDonaciones;
    string[] public listaCompras;

    // ============================================
    // EVENTOS
    // ============================================

    event DonacionRealizada(
        address indexed donante,
        string proyectoId,
        uint256 cantidad
    );
    event ProyectoCreado(string id, string descripcion);
    event DonanteRegistrado(address indexed direccion, string nombre);
    event TokenGobernanzaActualizado(
        address indexed tokenAnterior,
        address indexed tokenNuevo
    );
    event ProyectoAprobado(string id, uint256 votosTotal);
    event ProyectoCancelado(
        string id,
        uint256 votosTotal,
        uint256 fondosAlFondoComun
    );
    event VotoAprobacion(
        address indexed votante,
        string proyectoId,
        uint256 cantidadVotos
    );
    event VotoCancelacion(
        address indexed votante,
        string proyectoId,
        uint256 cantidadVotos
    );
    event CompraRealizada(
        address indexed comprador,
        string compraId,
        uint256 valor
    );
    event CompraValidada(
        string compraId,
        address indexed validador,
        address indexed proveedor,
        uint256 valor
    );

    // ============================================
    // MODIFICADORES
    // ============================================

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto");
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(address _tokenGobernanza) {
        owner = msg.sender;
        tokenGobernanza = TokenGobernanza(_tokenGobernanza);

        // Declaracion materiales
        materiales.push(Material("Libro", 10 wei));
        materiales.push(Material("Cuaderno", 8 wei));
        materiales.push(Material("PelotaFutbol", 5 wei));
        materiales.push(Material("Madera", 15 wei));
    }

    // ============================================
    // FUNCIONES BASE
    // ============================================

    /**
     * Actualizar la dirección del token de gobernanza (solo owner)
     */
    function setTokenGobernanza(address _tokenGobernanza) public soloOwner {
        require(_tokenGobernanza != address(0), "Direccion invalida");
        address anterior = address(tokenGobernanza);
        tokenGobernanza = TokenGobernanza(_tokenGobernanza);
        emit TokenGobernanzaActualizado(anterior, _tokenGobernanza);
    }

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    function uintToString(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        return string(bstr);
    }
}
