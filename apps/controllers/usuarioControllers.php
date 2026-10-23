<?php
require_once __DIR__ . '/../helpers/seguridad.php';
require_once __DIR__ . '/../database/conexion.php';
require_once __DIR__ . '/../models/usuarios.php';
iniciarSesionSegura();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['success' => false, 'message' => 'Método no permitido.'], 405);
}
exigirCsrf();

$nombre     = trim($_POST['nombre'] ?? '');
$apellido   = trim($_POST['apellido'] ?? '');
$email      = strtolower(trim($_POST['email'] ?? ''));
$contrasena = $_POST['contrasena'] ?? '';

if ($nombre === '' || $apellido === '' || $email === '' || $contrasena === '') {
    responder(['success' => false, 'message' => 'Por favor, completa todos los campos.'], 400);
}
if (strlen($nombre) > 100 || strlen($apellido) > 100 || strlen($email) > 150) {
    responder(['success' => false, 'message' => 'Algún dato es demasiado largo.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(['success' => false, 'message' => 'El formato del correo electrónico no es válido.'], 400);
}
$errorClave = validarContrasena($contrasena, $email, $nombre);
if ($errorClave !== '') {
    responder(['success' => false, 'message' => $errorClave], 400);
}

try {
    $id = registrarUsuario($pdo, $nombre, $apellido, $email, $contrasena);
    registrarAuditoria($pdo, $id, 'REGISTRO', 'Usuario registrado');
    responder(['success' => true, 'message' => 'Usuario registrado exitosamente.']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        responder(['success' => false, 'message' => 'Este correo ya está registrado.'], 409);
    }
    error_log($e->getMessage());
    responder(['success' => false, 'message' => 'Error interno del servidor.'], 500);
}
?>