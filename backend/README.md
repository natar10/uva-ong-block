# Backend - Contratos Solidity

Contratos inteligentes para la gestión de una ONG en blockchain.

## Estructura del Proyecto

```
backend/
├── contracts/
│   ├── ContratoONG.sol       # Contrato principal
│   ├── TokenGobernanza.sol   # Token ERC20 de gobernanza
│   ├── base/
│   │   └── OngBase.sol       # Estructuras y mapeos base
│   └── modules/
│       ├── OngDonantes.sol   # Gestión de donantes
│       ├── OngProyectos.sol  # Gestión de proyectos
│       ├── OngDonaciones.sol # Lógica de donaciones
│       └── OngCompras.sol    # Sistema de compras y votaciones
└── scripts/
    └── deploy_with_ethers.ts # Script de despliegue (experimental)
```

## Arquitectura Modular

El contrato `ContratoONG.sol` implementa un diseño modular mediante herencia:

```
OngBase → OngDonantes → OngProyectos → OngDonaciones → OngCompras → ContratoONG
```

- **OngBase**: Estructuras de datos y mapeos para donantes, proyectos, donaciones, compras y proveedores
- **OngDonantes**: Registro y gestión de donantes
- **OngProyectos**: Creación y administración de proyectos
- **OngDonaciones**: Lógica de donaciones y asignación de tokens
- **OngCompras**: Sistema de compras con votaciones

## Token de Gobernanza

`TokenGobernanza.sol` es un token ERC20 (`TKN4GOOD`) que permite a los donantes participar en votaciones. Los donantes reciben tokens proporcionales a sus donaciones.

## Scripts

Los scripts en `/scripts` fueron utilizados para pruebas experimentales. Su funcionalidad no está completamente implementada.
