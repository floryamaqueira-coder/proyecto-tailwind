<?php
require_once __DIR__ . '/../helpers/seguridad.php';
require_once __DIR__ . '/../database/conexion.php';
require_once __DIR__ . '/../models/usuarios.php';
iniciarSesionSegura();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['success' => false, 'message' => 'Método no permitido.'], 405);
}
exigirCsrf();

$email      = strtolower(trim($_POST['email'] ?? ''));
$contrasena = $_POST['contrasena'] ?? '';

if ($email === '' || $contrasena === '') {
    responder(['success' => false, 'message' => 'Por favor, completa todos los campos.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(['success' => false, 'message' => 'El formato del correo electrónico no es válido.'], 400);
}

try {
    if (cuentaBloqueada($pdo, $email)) {
        registrarAuditoria($pdo, null, 'LOGIN_BLOQUEADO', $email);
        responder(['success' => false, 'message' => 'Demasiados intentos. Espera 15 minutos.'], 429);
    }

    $usuario = verificarLogin($pdo, $email, $contrasena);

    if (!$usuario) {
        $stmt = $pdo->prepare("INSERT INTO intento_login (email, ip) VALUES (:e, :ip)");
        $stmt->execute([':e' => $email, ':ip' => obtenerIp()]);
        registrarAuditoria($pdo, null, 'LOGIN_FALLIDO', $email);
        logFallidoArchivo($email);
        responder(['success' => false, 'message' => 'Correo o contraseña incorrectos.'], 401);
    }

    // Éxito: limpiar intentos y renovar la sesión (evita fijación de sesión)
    $stmt = $pdo->prepare("DELETE FROM intento_login WHERE email = :e");
    $stmt->execute([':e' => $email]);
    session_regenerate_id(true);

    $_SESSION['usuario_id']       = $usuario['id_usuario'];
    $_SESSION['usuario_nombre']   = $usuario['nombre'];
    $_SESSION['usuario_apellido'] = $usuario['apellido'];
    $_SESSION['usuario_email']    = $usuario['email'];
    $_SESSION['usuario_rol']      = $usuario['rol'];
    unset($_SESSION['csrf']);   // token nuevo para la sesión nueva

    registrarAuditoria($pdo, $usuario['id_usuario'], 'LOGIN_OK', '');
    responder(['success' => true, 'message' => 'Inicio de sesión exitoso.']);

} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(['success' => false, 'message' => 'Error interno del servidor.'], 500);
}
?>