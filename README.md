# Survey Management System - Backend API

Sistema de gestión de encuestas integrado con Google Forms para empresas.

## 📋 Prerequisitos

- Node.js v16 o superior
- PostgreSQL v13 o superior
- Cuenta de Google Cloud con APIs habilitadas
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio o crear la estructura

```bash
mkdir survey-management
cd survey-management/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar PostgreSQL

Crear la base de datos:

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE survey_management;

# Salir de psql
\q
```

### 4. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` y configurar las variables:

```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survey_management
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# JWT
JWT_SECRET=genera_un_secret_aleatorio_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=genera_otro_secret_aleatorio_seguro
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (obtenidos de Google Cloud Console)
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# CORS
FRONTEND_URL=http://localhost:5173
```

### 5. Ejecutar migraciones

```bash
npm run migrate
```

### 6. Ejecutar seeds (datos de prueba)

```bash
npm run seed
```

Esto creará:
- Una organización demo
- Roles del sistema (Super Admin, Admin, Survey Creator, Viewer)
- Un usuario administrador: `admin@demo.com` / `Admin123!`

### 7. Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🔑 Configuración de Google Cloud

### 1. Crear proyecto en Google Cloud Console

1. Ir a https://console.cloud.google.com/
2. Crear un nuevo proyecto
3. Nombrar el proyecto: "Survey Management System"

### 2. Habilitar APIs

En el menú de APIs y servicios, habilitar:
- Google Forms API
- Google Drive API
- Google Sheets API

### 3. Configurar OAuth 2.0

1. Ir a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth"
2. Configurar pantalla de consentimiento:
   - Tipo: Externo
   - Nombre: Survey Management
   - Email de soporte: tu email
3. Crear credenciales:
   - Tipo: Aplicación web
   - URIs autorizados de JavaScript: `http://localhost:5173`
   - URIs de redireccionamiento: 
     - `http://localhost:3000/api/auth/google/callback`
     - `http://localhost:5173/auth/callback`
4. Copiar el Client ID y Client Secret al archivo `.env`

## 📚 Endpoints Disponibles

### Autenticación

```
POST   /api/auth/register          - Registrar nuevo usuario
POST   /api/auth/login             - Iniciar sesión
POST   /api/auth/refresh           - Refrescar token
POST   /api/auth/logout            - Cerrar sesión
GET    /api/auth/me                - Obtener usuario actual
POST   /api/auth/change-password   - Cambiar contraseña
```

### Google OAuth

```
GET    /api/google/auth-url        - Obtener URL de autorización
POST   /api/google/callback        - Callback de autorización
DELETE /api/google/disconnect      - Desconectar cuenta de Google
```

### Admin (próximamente)

```
GET    /api/admin/users            - Listar usuarios
POST   /api/admin/users            - Crear usuario
GET    /api/admin/roles            - Listar roles
```

### Surveys (próximamente)

```
GET    /api/surveys                - Listar encuestas
POST   /api/surveys                - Crear encuesta
GET    /api/surveys/:id            - Obtener encuesta
GET    /api/surveys/:id/results    - Obtener resultados
```

## 🧪 Probar la API

### Usando curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "Admin123!"
  }'
```

**Obtener usuario actual:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### Usando Postman

1. Importar colección de Postman (disponible próximamente)
2. Configurar variable de entorno `baseUrl`: `http://localhost:3000`
3. Ejecutar request de login
4. El token se guardará automáticamente para otras requests

## 🗂️ Estructura de la Base de Datos

```
organizations       - Empresas/Organizaciones
users              - Usuarios del sistema
roles              - Roles personalizables
permissions        - Permisos del sistema
user_roles         - Asignación de roles a usuarios
role_permissions   - Permisos asignados a roles
surveys            - Encuestas creadas
survey_access      - Control de acceso a encuestas
survey_responses   - Cache de respuestas
refresh_tokens     - Tokens de refresco
audit_logs         - Auditoría de acciones
```

## 🔐 Roles y Permisos por Defecto

### Super Admin
- Acceso total al sistema

### Admin
- Gestionar usuarios
- Ver y asignar roles
- Crear, editar, eliminar encuestas
- Ver y exportar resultados
- Compartir encuestas

### Survey Creator
- Crear y editar encuestas
- Ver resultados
- Exportar resultados
- Compartir encuestas

### Viewer
- Ver encuestas
- Ver resultados

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev           # Iniciar con nodemon

# Producción
npm start            # Iniciar servidor

# Base de datos
npm run migrate      # Ejecutar migraciones
npm run seed         # Insertar datos de prueba

# Testing (próximamente)
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
```

## 📝 Próximos Pasos

1. ✅ Configuración inicial del proyecto
2. ⏳ Implementar módulo de administración completo
3. ⏳ Implementar servicio de Google Forms
4. ⏳ Crear panel de encuestas
5. ⏳ Desarrollar frontend con React
6. ⏳ Agregar tests unitarios e integración
7. ⏳ Documentación con Swagger

## 🐛 Troubleshooting

### Error de conexión a la base de datos

Verificar que PostgreSQL esté corriendo:
```bash
sudo service postgresql status
```

Verificar credenciales en `.env`

### Error de Google OAuth

1. Verificar que las APIs estén habilitadas
2. Verificar que las URIs de redireccionamiento estén correctas
3. Verificar que el Client ID y Secret sean correctos

### Error de tokens JWT

Regenerar los secrets en `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📧 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

## 📄 Licencia

ISC