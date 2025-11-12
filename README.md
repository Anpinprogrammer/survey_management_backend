Aqui estara a informacion de los endpoints y lo que esperan


## 📚 Endpoints Disponibles

URL Base = https://survey-management-backend.onrender.com

### Autenticación

```
## POST   /api/auth/register          - Registrar nuevo usuario

Test:

{
    "email" : "correo@correo.com",
    "password" : "Admin123!",
    "fullName" : "Algun Nombre",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000"
}

## POST   /api/auth/login             - Iniciar sesión

Test: 

{
    "email": "anpingom@demo.com",
    "password" : "Admin123!"
}

## POST   /api/auth/refresh           - Refrescar token

Una vez el usuario es registrado se generan los tokens y se guardan en la tabla refresh_tokens, estos deben ser refrescados cada 7 dias

Ejemplo: 

{
    "refreshToken" : "Token generado al momento de registro y que se encuentra disponible en la base de datos"
}



## POST   /api/auth/logout            - Cerrar sesión

Test:

{
    "refreshToken" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOWVlNmVjNC0yOGYzLTRlNTgtYTBjNi1kYWIzOGVmZjU2YjgiLCJlbWFpbCI6ImFucGluZ29tQGRlbW8uY29tIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2Mjk4ODc5MCwiZXhwIjoxNzYzMDc1MTkwfQ.uSyCyIqdb5b7inq0c1Qa6oxnFQFcQEz4GO07QOZLTF4"
}

## GET    /api/auth/me                - Obtener usuario actual

Test: Se envie una solicitud GET, se ajustan los Headers de Authorization y debe ponerse Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOWVlNmVjNC0yOGYzLTRlNTgtYTBjNi1kYWIzOGVmZjU2YjgiLCJlbWFpbCI6ImFucGluZ29tQGRlbW8uY29tIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2Mjk4ODc5MCwiZXhwIjoxNzYzMDc1MTkwfQ.uSyCyIqdb5b7inq0c1Qa6oxnFQFcQEz4GO07QOZLTF4

## POST   /api/auth/change-password   - Cambiar contraseña

Test: 

headers.Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOWVlNmVjNC0yOGYzLTRlNTgtYTBjNi1kYWIzOGVmZjU2YjgiLCJlbWFpbCI6ImFucGluZ29tQGRlbW8uY29tIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2Mjk4ODc5MCwiZXhwIjoxNzYzMDc1MTkwfQ.uSyCyIqdb5b7inq0c1Qa6oxnFQFcQEz4GO07QOZLTF4

{
    "currentPassword" : "Admin123!",
    "newPassword" : "Admin321!"
}

```
### Google OAuth

```
GET    /api/google/auth-url        - Obtener URL de autorización
POST   /api/google/callback        - Callback de autorización
DELETE /api/google/disconnect      - Desconectar cuenta de Google
```