// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ONGDonaciones {
    
    // Enum para tipo de donante
    enum TipoDonante { Individual, Empresa }
    
    // Enum para estado del proyecto
    enum EstadoProyecto { Activo, Cancelado }
    
    // Estructura Donante (como una fila en tabla DONANTE)
    struct Donante {
        address direccion;
        string nombre;
        TipoDonante tipoDonante;
        uint256 totalDonado;
        uint256 tokensGobernanza;
    }
    
    // Estructura Proyecto
    struct Proyecto {
        string id;
        string descripcion;
        address responsable;
        uint256 cantidadRecaudada;
        uint256 cantidadValidada;
        EstadoProyecto estado;
        uint256 votos;
    }
    
    // Estructura Donación
    struct Donacion {
        string id;
        address donante;
        string proyectoId;
        uint256 cantidad;
        uint256 fecha;
    }
    
    // Mapeos
    mapping(address => Donante) public donantes;
    mapping(string => Proyecto) public proyectos;
    mapping(string => Donacion) public donaciones;
    
    // Arrays para iterar (listar todos los registros)
    address[] public listaDonantes;
    string[] public listaProyectos;
    string[] public listaDonaciones;
    
    // Contador para IDs autoincrementales
    uint256 private contadorDonaciones = 0;
    
    // Dueño del contrato (admin de la ONG)
    address public owner;
    
    // ============================================
    // EVENTOS (para que el frontend sepa qué pasó)
    // ============================================
    
    event DonacionRealizada(address indexed donante, string proyectoId, uint256 cantidad);
    event ProyectoCreado(string id, string descripcion);
    event DonanteRegistrado(address indexed direccion, string nombre);
    
    // ============================================
    // CONSTRUCTOR (se ejecuta al desplegar)
    // ============================================
    
    constructor() {
        owner = msg.sender; // quien despliega el contrato es el owner
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
        require(donantes[msg.sender].direccion == address(0), "Donante ya registrado");
        
        donantes[msg.sender] = Donante({
            direccion: msg.sender,
            nombre: _nombre,
            tipoDonante: _tipo,
            totalDonado: 0,
            tokensGobernanza: 0
        });
        
        listaDonantes.push(msg.sender);
        emit DonanteRegistrado(msg.sender, _nombre);
    }
    
    /**
     * Crear un nuevo proyecto (solo owner)
     */
    function crearProyecto(
        string memory _id, 
        string memory _descripcion,
        address _responsable
    ) public soloOwner {
        require(bytes(proyectos[_id].id).length == 0, "Proyecto ya existe");
        
        proyectos[_id] = Proyecto({
            id: _id,
            descripcion: _descripcion,
            responsable: _responsable,
            cantidadRecaudada: 0,
            cantidadValidada: 0,
            estado: EstadoProyecto.Activo,
            votos: 0
        });
        
        listaProyectos.push(_id);
        emit ProyectoCreado(_id, _descripcion);
    }
    
    /**
     * Realizar una donación (con ETH real)
     */
    function donar(string memory _proyectoId) public payable {
        require(msg.value > 0, "La donacion debe ser mayor a 0");
        require(bytes(proyectos[_proyectoId].id).length > 0, "Proyecto no existe");
        require(proyectos[_proyectoId].estado == EstadoProyecto.Activo, "Proyecto no activo");
        
        // Si el donante no está registrado, registrarlo como individuo
        if (donantes[msg.sender].direccion == address(0)) {
            donantes[msg.sender] = Donante({
                direccion: msg.sender,
                nombre: "Individuo",
                tipoDonante: TipoDonante.Individual,
                totalDonado: 0,
                tokensGobernanza: 0
            });
            listaDonantes.push(msg.sender);
        }
        
        // Crear registro de donación
        contadorDonaciones++;
        string memory donacionId = string(abi.encodePacked("DON", uintToString(contadorDonaciones)));
        
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
        donantes[msg.sender].tokensGobernanza += msg.value / 1 ether; // 1 token por cada ETH
        proyectos[_proyectoId].cantidadRecaudada += msg.value;
        
        emit DonacionRealizada(msg.sender, _proyectoId, msg.value);
    }
    
    /**
     * Validar fondos de un proyecto (owner marca como validado)
     */
    function validarFondosProyecto(string memory _proyectoId, uint256 _cantidad) public soloOwner {
        require(bytes(proyectos[_proyectoId].id).length > 0, "Proyecto no existe");
        require(_cantidad <= proyectos[_proyectoId].cantidadRecaudada, "Cantidad excede recaudado");
        
        proyectos[_proyectoId].cantidadValidada += _cantidad;
    }
    
    /**
     * Cambiar estado de un proyecto
     */
    function cambiarEstadoProyecto(string memory _proyectoId, EstadoProyecto _nuevoEstado) public soloOwner {
        require(bytes(proyectos[_proyectoId].id).length > 0, "Proyecto no existe");
        proyectos[_proyectoId].estado = _nuevoEstado;
    }
    
    // ============================================
    // FUNCIONES DE CONSULTA (no modifican estado)
    // ============================================
    
    function obtenerDonante(address _direccion) public view returns (Donante memory) {
        return donantes[_direccion];
    }
    
    function obtenerProyecto(string memory _id) public view returns (Proyecto memory) {
        return proyectos[_id];
    }
    
    function obtenerDonacion(string memory _id) public view returns (Donacion memory) {
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
            bstr[--k] = bytes1(uint8(48 + j % 10));
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
