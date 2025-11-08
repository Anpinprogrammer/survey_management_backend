-- Insertar organización de ejemplo
INSERT INTO organizations (id, name, subdomain) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Demo Organization', 'demo');

-- Insertar roles del sistema para la organización
-- Password para todos: "Admin123!" (hash bcrypt)
INSERT INTO roles (id, name, description, organization_id, is_system_role) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Super Admin', 'Acceso total al sistema', '550e8400-e29b-41d4-a716-446655440000', true),
('660e8400-e29b-41d4-a716-446655440002', 'Admin', 'Administrador de la organización', '550e8400-e29b-41d4-a716-446655440000', true),
('660e8400-e29b-41d4-a716-446655440003', 'Survey Creator', 'Puede crear y gestionar encuestas', '550e8400-e29b-41d4-a716-446655440000', true),
('660e8400-e29b-41d4-a716-446655440004', 'Viewer', 'Solo puede ver resultados', '550e8400-e29b-41d4-a716-446655440000', true);

-- Asignar permisos al rol Super Admin (todos los permisos)
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions;

-- Asignar permisos al rol Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440002', id FROM permissions
WHERE name IN (
    'manage_users', 'view_users', 'assign_roles',
    'create_survey', 'edit_survey', 'delete_survey', 
    'view_survey', 'view_results', 'export_results', 'share_survey'
);

-- Asignar permisos al rol Survey Creator
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440003', id FROM permissions
WHERE name IN (
    'create_survey', 'edit_survey', 'view_survey', 
    'view_results', 'export_results', 'share_survey'
);

-- Asignar permisos al rol Viewer
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440004', id FROM permissions
WHERE name IN ('view_survey', 'view_results');

-- Insertar usuario administrador de ejemplo
-- Email: admin@demo.com
-- Password: Admin123!
-- Hash generado con bcrypt rounds=10
INSERT INTO users (id, email, password_hash, full_name, organization_id, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440000', 
 'admin@demo.com', 
 '$2b$10$rKvH3VqZRzJQhJL6kxZxEeXhZqGqYqL5VqKUJZnGqHqJL6kxZxEeX',
 'Admin Demo',
 '550e8400-e29b-41d4-a716-446655440000',
 true);

-- Asignar rol Super Admin al usuario
INSERT INTO user_roles (user_id, role_id) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001');