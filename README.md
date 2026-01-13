# UVA ONG Block

Plataforma blockchain para gestión de donaciones a ONGs con transparencia y trazabilidad.

## Estructura del Proyecto

```
uva-ong-block/
├── backend/           # Smart contracts Solidity
│   ├── contracts/     # Contratos inteligentes
│   │   └── ONGDonaciones.sol
│   ├── scripts/       # Scripts de despliegue
│   └── tests/         # Tests de contratos
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
        ├── hooks/         # React hooks personalizados
        ├── data/          # Datos estáticos
        └── types/         # Definiciones TypeScript
```

## Tecnologías

- **Backend**: Solidity, Ethereum
- **Frontend**: React, TypeScript, Vite
- **Blockchain**: Web3.js/Ethers.js

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
pnpm run dev
```
