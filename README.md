Aqui estara a informacion de los endpoints y lo que esperan


## 📚 Endpoints Disponibles

URL Base = https://survey-management-backend.onrender.com

### Autenticación

```
POST   /api/auth/register          - Registrar nuevo usuario

Ejemplo:

{
    "email" : "correo@correo.com",
    "password" : "Admin123!",
    "fullName" : "Algun Nombre",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000"
}

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