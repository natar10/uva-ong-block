# UVA ONG Block

Plataforma blockchain para gestión de donaciones a ONGs con transparencia y trazabilidad.

Este es un proyecto realizado como MVP o fines demostrativos del uso de blockchain, es propósito es 
crear contratos en Solidity y una vez desplegados, usarlos mediante Frontend.

## Estructura del Proyecto

```
uva-ong-block/
├── backend/           # Smart contracts Solidity
│   ├── contracts/     # Contratos inteligentes
│   │   └── ONGDonaciones.sol
│   ├── scripts/       # Scripts de despliegue (experimental)
│
└── frontend/          # Aplicación React
    └── src/
        ├── components/    # Componentes UI reutilizables
        ├── routes/        # Páginas de la aplicación
        │   ├── dashboard/
        │   ├── donaciones/
        │   ├── donar/
        │   ├── proyectos/
        │   └── voluntarios/
        ├── contracts/     # ABIs de contratos
        ├── hooks/         # React hooks personalizados para usar métodos del contrato
        ├── data/          # Obtención y Mutaciones/Escritura en Blockchain
        └── types/         # Definiciones TypeScript
├── latex/            # Código LaTeX de la memoria
```

## Tecnologías

- **Backend**: Solidity, Ethereum
- **Frontend**: React, TypeScript, Vite
- **Blockchain**: Web3.js/Ethers.js

## Requisitos

- Node.js >= 18
- pnpm >= 8
- Navegador con extensión MetaMask

## Inicio Rápido

### Backend

```bash
cd backend
# Compilar contratos en Remix IDE o usar tu entorno preferido
```

### Frontend

```bash
cd frontend
pnpm i
pnpm dev
```
