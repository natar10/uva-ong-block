// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;






contract ONGDonaciones {
    

    /// MATERIALES ---------------------
    struct Material {
        string nombre;
        uint256 valor;
    }

    Material[] public materiales;

    // ------------------------------------------

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

    // Estructura 
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


    // Arrays para iterar (listar todos los registros)
    address[] public listaDonantes;
    string[] public listaProyectos;
    string[] public listaDonaciones;
    string[] public listaCompras;
    
    // Contador para IDs autoincrementales
    uint256 private contadorDonaciones = 0;
    
    // Dueño del contrato (admin de la ONG)
    address public owner;

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto");
        _;
    }

    
    // ============================================
    // EVENTOS (para que el frontend sepa qué pasó)
    // ============================================
    
    event DonacionRealizada(address indexed donante, string proyectoId, uint256 cantidad);
    event ProyectoCreado(string id, string descripcion);
    event DonanteRegistrado(address indexed direccion, string nombre);
    event VotacionRealizada(address indexed donante, string proyectoId, uint256 cantidad_votos);
    event CompraRealizada(address indexed donante, string compradorId, uint256 valor_compra);
    
    // ============================================
    // CONSTRUCTOR (se ejecuta al desplegar)
    // ============================================
    
   
    
    // ============================================
    // MODIFICADORES (como middleware)
    // ============================================
    
    
    constructor() {
        owner = msg.sender;

        // Declaracion materiales
        materiales.push(Material("Libro", 10 wei));
        materiales.push(Material("Cuaderno", 8 wei));
        materiales.push(Material("PelotaFutbol", 5 wei)); // 1.5
        materiales.push(Material("Madera", 15 wei)); // 0.8
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

    /** Obtiene el objeto Matrial dado un numbre
     */
    function getMaterialByName(string calldata _nombre)
        public
        view
        returns (Material memory)
    {
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
        address _responsable
    ) public soloOwner{
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
    function donar(string memory _proyectoId, string calldata tipo_material) public payable {
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
        donantes[msg.sender].tokensGobernanza += msg.value / 0.001 ether; // 1 token por cada 0.001 ETH
        proyectos[_proyectoId].cantidadRecaudada += msg.value;
        
        emit DonacionRealizada(msg.sender, _proyectoId, msg.value);

    }

    /**
     * Realizar votación
     */
    function votarProyecto(string memory _proyectoId, uint256 _cantidadVotos) public { // No es payable porque usamos token interno, no ETH
        require(donantes[msg.sender].direccion != address(0), "No registrado");
        require(proyectos[_proyectoId].estado == EstadoProyecto.Activo, "Proyecto no activo");
        require(donantes[msg.sender].tokensGobernanza >= _cantidadVotos, "Tokens insuficientes");
        

        donantes[msg.sender].tokensGobernanza -= _cantidadVotos;
        proyectos[_proyectoId].votos += _cantidadVotos;

        emit VotacionRealizada(msg.sender, _proyectoId, _cantidadVotos);
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
        require(_cantidad> 0, "La cantidad tiene que ser mayor que 0");
        require(compras[_compraId].fecha == 0, "Compra ya existe");

        Material memory material = getMaterialByName(tipo_material);

        uint256 valor = _cantidad * material.valor;
        require(
            proyecto.cantidadRecaudada >= valor,
            "Fondos insuficientes"
        );

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


