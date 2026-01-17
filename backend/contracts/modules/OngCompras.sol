// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OngDonaciones.sol";

/**
 * @title OngCompras
 * @dev Módulo para gestión de compras, proveedores y validación
 */
abstract contract OngCompras is OngDonaciones {
    /**
     * Obtiene el objeto Material dado un nombre
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
     * Registrar un proveedor (solo owner)
     */
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

    /**
     * Realizar una compra (solo el responsable del proyecto)
     */
    function realizarCompra(
        string calldata _compraId,
        string calldata _proyectoId,
        address _proveedor,
        string calldata tipo_material,
        uint128 _cantidad
    ) external {
        Proyecto storage proyecto = proyectos[_proyectoId];

        require(bytes(proyecto.id).length > 0, "Proyecto no existe");
        require(proyecto.estado == EstadoProyecto.Activo, "Proyecto no activo");
        require(proyecto.responsable == msg.sender, "No autorizado");
        require(_cantidad > 0, "La cantidad tiene que ser mayor que 0");
        require(compras[_compraId].fecha == 0, "Compra ya existe");
        require(proveedores[_proveedor].proveedor != address(0), "Proveedor no registrado");

        Material memory material = getMaterialByName(tipo_material);

        uint256 valor = _cantidad * material.valor;
        require(proyecto.cantidadRecaudada >= valor, "Fondos insuficientes");

        compras[_compraId] = Compra({
            id: _compraId,
            comprador: msg.sender,
            proveedor: _proveedor,
            proyectoId: _proyectoId,
            cantidad: _cantidad,
            valor: valor,
            tipo: tipo_material,
            fecha: block.timestamp,
            validada: false
        });

        // Reservar los fondos (restar de cantidadRecaudada)
        proyecto.cantidadRecaudada -= valor;

        listaCompras.push(_compraId);

        emit CompraRealizada(msg.sender, _compraId, valor);
    }

    /**
     * Validar una compra (solo el responsable del proyecto)
     * Al validar, se transfiere el ETH al proveedor
     * Actúa como "oráculo humano" - el voluntario verifica en el mundo físico
     * y luego valida en la blockchain
     */
    function validarCompra(string calldata _compraId) external {
        Compra storage compra = compras[_compraId];

        require(compra.fecha != 0, "Compra no existe");
        require(!compra.validada, "Compra ya validada");

        Proyecto storage proyecto = proyectos[compra.proyectoId];
        require(proyecto.responsable == msg.sender, "Solo el responsable puede validar");
        require(proyecto.estado == EstadoProyecto.Activo, "Proyecto no activo");

        // Marcar como validada
        compra.validada = true;

        // Actualizar cantidad validada del proyecto
        proyecto.cantidadValidada += compra.valor;

        // Actualizar ganancias del proveedor
        proveedores[compra.proveedor].ganancias += compra.valor;

        // Transferir ETH al proveedor
        (bool success, ) = payable(compra.proveedor).call{value: compra.valor}("");
        require(success, "Transferencia fallida");

        emit CompraValidada(_compraId, msg.sender, compra.proveedor, compra.valor);
    }

    /**
     * Obtener información de una compra
     */
    function obtenerCompra(
        string memory _id
    ) public view returns (Compra memory) {
        return compras[_id];
    }

    /**
     * Obtener todas las compras de un proyecto específico
     */
    function obtenerComprasPorProyecto(
        string memory _proyectoId
    ) public view returns (Compra[] memory) {
        return _obtenerComprasPorProyectoInternal(_proyectoId);
    }

    /**
     * Implementación interna para obtener compras por proyecto
     */
    function _obtenerComprasPorProyectoInternal(
        string memory _proyectoId
    ) internal view override returns (Compra[] memory) {
        uint256 count = 0;

        // Contar compras del proyecto
        for (uint256 i = 0; i < listaCompras.length; i++) {
            if (keccak256(bytes(compras[listaCompras[i]].proyectoId)) == keccak256(bytes(_proyectoId))) {
                count++;
            }
        }

        // Crear array con el tamaño exacto
        Compra[] memory comprasProyecto = new Compra[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < listaCompras.length; i++) {
            if (keccak256(bytes(compras[listaCompras[i]].proyectoId)) == keccak256(bytes(_proyectoId))) {
                comprasProyecto[index] = compras[listaCompras[i]];
                index++;
            }
        }

        return comprasProyecto;
    }
}
