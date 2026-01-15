// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenGobernanza.sol";

contract ONGDonaciones {
    /// MATERIALES ---------------------
    struct Material {
        string nombre;
        uint256 valor;
    }

    Material[] public materiales;

    // ------------------------------------------

    // Enum para tipo de donante
    enum TipoDonante {
        Individual,
        Empresa
    }

    // Enum para estado del proyecto
    enum EstadoProyecto {
        Propuesto, // Proyecto nuevo, solo puede recibir votaciones
        Activo, // Proyecto aprobado, puede recibir donaciones
        Cancelado // Proyecto cancelado, fondos van al fondo común
    }

    // Estructura Donante (como una fila en tabla DONANTE)
    struct Donante {
        address direccion;
        string nombre;
        TipoDonante tipoDonante;
        uint256 totalDonado;
    }

    // Estructura Proyecto
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

    // Mínimo de votos requeridos para aprobar o cancelar un proyecto
    // NOTA: Valor bajo (2) para propósitos demostrativos.
    uint256 public constant VOTOS_MINIMOS = 2;

    // Estructura Proveedor
    struct Proveedor {
        string id;
        string descripcion;
        address proveedor;
        uint256 ganancias;
    }

    // Estructura Donación
    struct Donacion {
        string id;
        address donante;
        string proyectoId;
        uint256 cantidad;
        uint256 fecha;
    }

    // Estructura Compra
    struct Compra {
        string id;
        address comprador;
        address proveedor;
        string proyectoId;
        uint256 cantidad;
        string tipo;
        uint256 fecha;
        bool validada;
    }

    // Mapeos
    mapping(address => Donante) public donantes;
    mapping(string => Proyecto) public proyectos;
    mapping(string => Donacion) public donaciones;
    mapping(string => Compra) public compras;
    mapping(address => Proveedor) public proveedores;
    // Mapping para verificar si un donante ha donado a un proyecto específico
    mapping(string => mapping(address => bool)) public donantesDeProyecto;

    // Arrays para iterar (listar todos los registros)
    address[] public listaDonantes;
    string[] public listaProyectos;
    string[] public listaDonaciones;
    string[] public listaCompras;

    // Contador para IDs autoincrementales
    uint256 private contadorDonaciones = 0;

    // Dueño del contrato (admin de la ONG)
    address public owner;

    // Referencia al contrato del token de gobernanza ERC20
    TokenGobernanza public tokenGobernanza;

    // ============================================
    // EVENTOS (para que el frontend sepa qué pasó)
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

    // ============================================
    // CONSTRUCTOR (se ejecuta al desplegar)
    // ============================================

    constructor(address _tokenGobernanza) {
        owner = msg.sender; // quien despliega el contrato es el owner
        tokenGobernanza = TokenGobernanza(_tokenGobernanza);

        // Declaracion materiales
        materiales.push(Material("Libro", 10 wei));
        materiales.push(Material("Cuaderno", 8 wei));
        materiales.push(Material("PelotaFutbol", 5 wei)); // 1.5
        materiales.push(Material("Madera", 15 wei)); // 0.8
    }

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
    // MODIFICADORES (como middleware)
    // ============================================

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto");
        _;
    }

    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================

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

    /** Obtiene el objeto Matrial dado un numbre
     */
    function getMaterialByName(
        string calldata _nombre
    ) public view returns (Material memory) {
        for (uint256 i = 0; i < materiales.length; i++) {
            if (
                keccak256(bytes(materiales[i].nombre)) ==
                keccak256(bytes(_nombre))
            ) {
                return materiales[i];
            }
        }

        revert("Material no existe");
    }

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
     * Realizar una donación (con ETH real)
     */
    function donar(
        string memory _proyectoId,
        string calldata tipo_material
    ) public payable {
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
     * Votar para aprobar un proyecto propuesto
     * Solo se puede votar en proyectos con estado Propuesto
     * Si alcanza VOTOS_MINIMOS, el proyecto pasa a Activo
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

        // Verificar y quemar tokens
        _verificarYQuemarTokens(_cantidadVotos);

        // Registrar votos
        proyectos[_proyectoId].votosAprobacion += _cantidadVotos;

        emit VotoAprobacion(msg.sender, _proyectoId, _cantidadVotos);

        // Si alcanza el mínimo de votos, aprobar el proyecto
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
     * Se puede votar en proyectos Propuestos o Activos
     * Solo donantes que hayan donado al proyecto pueden votar cancelación (si está Activo)
     * Si alcanza VOTOS_MINIMOS, el proyecto pasa a Cancelado
     * Los fondos no validados quedan en el fondo común del contrato
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

        // Si el proyecto está Activo, verificar que el votante haya donado al proyecto
        if (proyectos[_proyectoId].estado == EstadoProyecto.Activo) {
            require(
                _haDonandoAlProyecto(msg.sender, _proyectoId),
                "Solo donantes del proyecto pueden votar cancelacion"
            );
        }

        // Verificar y quemar tokens
        _verificarYQuemarTokens(_cantidadVotos);

        // Registrar votos
        proyectos[_proyectoId].votosCancelacion += _cantidadVotos;

        emit VotoCancelacion(msg.sender, _proyectoId, _cantidadVotos);

        // Si alcanza el mínimo de votos, cancelar el proyecto
        if (proyectos[_proyectoId].votosCancelacion >= VOTOS_MINIMOS) {
            // Calcular fondos que van al fondo común
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
     * Usa mapping para búsqueda O(1) en lugar de iterar
     */
    function _haDonandoAlProyecto(
        address _donante,
        string memory _proyectoId
    ) internal view returns (bool) {
        return donantesDeProyecto[_proyectoId][_donante];
    }

    /**
     * Obtener balance de tokens de gobernanza de un donante
     */
    function obtenerTokensGobernanza(
        address _donante
    ) public view returns (uint256) {
        return tokenGobernanza.balanceOf(_donante);
    }

    function registrarProveedor(
        address _proveedor,
        string calldata nombre,
        string calldata _descripcion
    ) public soloOwner {
        proveedores[_proveedor] = Proveedor({
            proveedor: _proveedor,
            descripcion: _descripcion,
            ganancias: 0,
            id: nombre
        });
    }

    function realizarCompra(
        string calldata _compraId,
        string calldata _proyectoId,
        address _proveedor,
        string calldata tipo_material,
        uint128 _cantidad
    ) external {
        Proyecto storage proyecto = proyectos[_proyectoId];

        require(bytes(proyecto.id).length > 0, "Proyecto no existe");
        require(proyecto.responsable == msg.sender, "No autorizado");
        require(_cantidad > 0, "La cantidad tiene que ser mayor que 0");
        require(compras[_compraId].fecha == 0, "Compra ya existe");

        Material memory material = getMaterialByName(tipo_material);

        uint256 valor = _cantidad * material.valor;
        require(proyecto.cantidadRecaudada >= valor, "Fondos insuficientes");

        compras[_compraId] = Compra({
            id: _compraId,
            comprador: msg.sender,
            proveedor: _proveedor,
            proyectoId: _proyectoId,
            cantidad: _cantidad,
            tipo: tipo_material,
            fecha: block.timestamp,
            validada: false
        });

        proyecto.cantidadRecaudada -= valor;

        listaCompras.push(_compraId);

        emit CompraRealizada(msg.sender, _compraId, valor);
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

    // ============================================
    // FUNCIONES DE CONSULTA (no modifican estado)
    // ============================================

    function obtenerDonante(
        address _direccion
    ) public view returns (Donante memory) {
        return donantes[_direccion];
    }

    function obtenerProyecto(
        string memory _id
    ) public view returns (Proyecto memory) {
        return proyectos[_id];
    }

    function obtenerDonacion(
        string memory _id
    ) public view returns (Donacion memory) {
        return donaciones[_id];
    }

    function obtenerTotalDonantes() public view returns (uint256) {
        return listaDonantes.length;
    }

    function obtenerTotalProyectos() public view returns (uint256) {
        return listaProyectos.length;
    }

    function obtenerTotalDonaciones() public view returns (uint256) {
        return listaDonaciones.length;
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

    // Función para retirar fondos (solo owner)
    function retirarFondos() public soloOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Obtener balance del contrato
    function obtenerBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
