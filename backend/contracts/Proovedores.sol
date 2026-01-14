

contract Proveedores{
    struct Proveedor {
        address wallet;
        string nombre;
        string categoria; // alimentos, construcción, etc.
        bool activo;
        uint256 totalCobrado;
    }

    struct Compra {
        uint256 id;
        string proyectoId;
        address proveedor;
        uint256 monto;
        EstadoCompra estado;
        uint256 fecha;
        string referencia; // hash factura, IPFS, etc.
    }

    function pagarProveedor(
        string calldata proyectoId
    ) external onlyONG {
        // transfiere ETH al proveedor
        // marca la compra como ejecutada
    }


    mapping(string => uint256) public fondosBloqueados;

    function autorizarGasto(
        string calldata proyectoId,
        uint256 monto,
        address proveedor
    ) external onlyOwner {
        fondosBloqueados[proyectoId] += monto;
        Proveedores(proveedoresContract).autorizarCompra(
            proyectoId,
            monto,
            proveedor
        );
    }

    enum EstadoCompra {
        Creada,
        Autorizada,
        Pagada,
        Entregada,
        Rechazada
    }



    mapping(address => Proveedor) public proveedores;


    uint256 public contadorCompras;
    mapping(uint256 => Compra) public compras;

    function ejecutarPago(uint256 compraId) external onlyONG {
        Compra storage c = compras[compraId];
        require(c.estado == EstadoCompra.Autorizada, "No autorizada");

        c.estado = EstadoCompra.Pagada;
        payable(c.proveedor).transfer(c.monto);
    }

    function confirmarEntrega(uint256 compraId) external onlyValidador {
        compras[compraId].estado = EstadoCompra.Entregada;
    }

    // EVENTOS 
    event ProveedorRegistrado(address proveedor, string nombre);
    event CompraCreada(uint256 id, string proyectoId, address proveedor, uint256 monto);
    event CompraAutorizada(uint256 id);
    event PagoEjecutado(uint256 id, address proveedor, uint256 monto);
    event CompraEntregada(uint256 id);

    address public ongContract; //
    // Hace que Quien lleme a esto solo pueda ser un contrato ONGDonaciones
    modifier onlyONG() {
        require(msg.sender == ongContract, "Solo ONG");
        _;
    }



}