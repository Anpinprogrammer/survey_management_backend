Aqui estara a informacion de los endpoints y lo que esperan


## 📚 Endpoints Disponibles

URL Base = https://survey-management-backend.onrender.com

### Autenticación

```
## POST   /api/auth/register          - Registrar nuevo usuario

Ejemplo:

{
    "email" : "correo@correo.com",
    "password" : "Admin123!",
    "fullName" : "Algun Nombre",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000"
}

## POST   /api/auth/login             - Iniciar sesión

Ejemplo: 

{
    "email": "correo@correo.com",
    "password" : "Admin123!"
}

## POST   /api/auth/refresh           - Refrescar token

Una vez el usuario es registrado se generan los tokens y se guardan en la tabla refresh_tokens, estos deben ser refrescados cada 7 dias

Ejemplo: 

{
    "refreshToken" : "Token generado al momento de registro y que se encuentra disponible en la base de datos"
}



## POST   /api/auth/logout            - Cerrar sesión

Ejemplo:

{
    "refreshToken" : "Recibe el token mas actualizado"
}

## GET    /api/auth/me                - Obtener usuario actual

Ejemplo: Se envie una solicitud GET, se ajustan los Headers de Authorization y debe ponerse Bearer "Token Actualizado"

POST   /api/auth/change-password   - Cambiar contraseña
```
### Google OAuth

```
GET    /api/google/auth-url        - Obtener URL de autorización
POST   /api/google/callback        - Callback de autorización
DELETE /api/google/disconnect      - Desconectar cuenta de Google
```