Gestor de tareas en tiempo real

Gestor de tareas en tiempo real que notifica
cambios a usuarios conectados sobre proyectos y tareas
utilizando WebSocket.io backend Express js y frontend React

# Gestor-Tareas-WS-Proyecto

Gestor-Tareas-WS-Proyecto es una aplicación web para la gestión de tareas y proyectos, que incluye autenticación de usuarios, sistema de roles y comunicación en tiempo real mediante WebSockets. El proyecto está dividido en tres partes principales: **backend (Node.js/Express)**, **frontend (React)** y **base de datos SQL Server**.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación Manual (Modo Local)](#instalación-manual-modo-local)
- [Uso](#uso)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [WebSockets](#websockets)
- [Dockerización](#dockerización)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Descripción General

Esta aplicación permite la administración de proyectos y tareas colaborativas, con soporte para múltiples usuarios, asignación de tareas, actualizaciones en tiempo real y autenticación segura. Incluye notificaciones en tiempo real usando **Socket.IO**.

---

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MSSQL (SQL Server)
- Socket.IO
- JWT (autenticación)
- bcryptjs (hash de contraseñas)
- dotenv
- cors

### Frontend
- React
- React Router DOM
- Socket.IO Client
- Vite (para desarrollo)

### Base de Datos
- SQL Server

### DevOps/Utilidades
- Docker
- docker-compose
- nodemon

---

## Estructura del Proyecto

```
Gestor-Tareas-WS-Proyecto/
│
├── backend/              # API REST y WebSocket (Node.js/Express)
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/             # Aplicación React
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── database/             # (Opcional) Scripts SQL para la DB
│   └── init.sql
│
├── docker-compose.yml    # Orquestador de servicios
└── README.md
```

---

## Instalación Manual (Modo Local)

### Prerrequisitos

- Node.js (>=18)
- npm o yarn
- SQL Server 2019+ (local o en Docker)

### 1. Clona el repositorio

```sh
git clone https://github.com/CChete/Gestor-Tareas-WS-Proyecto.git
cd Gestor-Tareas-WS-Proyecto
```

### 2. Configura la base de datos

- Crea una base de datos en SQL Server.
- Ejecuta los scripts en `/database/init.sql` para crear las tablas y datos iniciales.
- Configura el archivo `.env` del backend con tus credenciales de SQL Server.

### 3. Instala dependencias

#### Backend

```sh
cd backend
npm install
cp .env.example .env
# Edita .env con tus datos de la DB y JWT_SECRET
```

#### Frontend

```sh
cd ../frontend
npm install
```

### 4. Ejecuta los servicios

#### Backend

```sh
cd backend
npm run dev     # o npm start
```

#### Frontend

```sh
cd frontend
npm run dev     # o npm start
```

---

## Uso

1. Accede a la app web (`http://localhost:5173` si usas Vite).
2. Regístrate/inicia sesión.
3. Administra tus proyectos y tareas.
4. Observa las actualizaciones en tiempo real (chat/notificaciones).

---

## Autenticación y Seguridad

- El backend utiliza JWT para autenticar y autorizar usuarios.
- Las contraseñas se almacenan hasheadas con bcryptjs.
- El token JWT se almacena en localStorage en el frontend y se envía en el header Authorization.
- El frontend utiliza un contexto de autenticación (`AuthContext`).

---

## WebSockets

- La comunicación en tiempo real se realiza con **Socket.IO**.
- El backend expone un servidor Socket.IO integrado con Express.
- El frontend se conecta usando `socket.io-client` para recibir notificaciones de tareas y chat en tiempo real.

---

## Dockerización

Levanta todo el entorno (backend, frontend y base de datos) con un solo comando.

### 1. Requisitos

- Docker y Docker Compose instalados.

### 2. Uso Básico

```sh
docker compose up --build
```

Esto levantará:
- Un contenedor para SQL Server
- Un contenedor para el backend
- Un contenedor para el frontend

### 3. Variables de entorno

- El backend y la base de datos se comunican internamente en la red de Docker.
- Edita los archivos `.env` según sea necesario.

---

## Contribuir

¡Las contribuciones son bienvenidas!  
Por favor abre un issue o pull request para sugerencias y mejoras.

---

## Licencia

Este proyecto está bajo la licencia MIT.

---
