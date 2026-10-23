<?php
function iniciarSesionSegura() {
    if (session_status() === PHP_SESSION_ACTIVE) { return; }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
          || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/',
        'secure' => $https, 'httponly' => true, 'samesite' => 'Strict'
    ]);
    session_start();
}

function responder($datos, $codigo = 200) {
    http_response_code($codigo);
    header('Content-Type: application/json');
    echo json_encode($datos);
    exit;
}

function obtenerIp() { return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }

function tokenCsrf() {
    if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(32)); }
    return $_SESSION['csrf'];
}

function exigirCsrf() {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
        responder(['success' => false, 'message' => 'Token de seguridad inválido.'], 403);
    }
}

function exigirLogin() {
    if (empty($_SESSION['usuario_id'])) {
        responder(['success' => false, 'message' => 'Debes iniciar sesión.'], 401);
    }
}

function exigirAdmin() {
    exigirLogin();
    if ($_SESSION['usuario_rol'] !== 'administrador') {
        responder(['success' => false, 'message' => 'No tienes permisos.'], 403);
    }
}

// Devuelve "" si la contraseña es válida, o el mensaje de error
function validarContrasena($c, $email, $nombre) {
    if (strlen($c) < 8)                return 'La contraseña debe tener al menos 8 caracteres.';
    if (!preg_match('/[A-Z]/', $c))    return 'Debe incluir una mayúscula.';
    if (!preg_match('/[a-z]/', $c))    return 'Debe incluir una minúscula.';
    if (!preg_match('/[0-9]/', $c))    return 'Debe incluir un número.';
    if (!preg_match('/[^A-Za-z0-9]/', $c)) return 'Debe incluir un carácter especial.';
    $min = strtolower($c);
    $prohibidas = ['12345', 'abcde', 'asdfg', 'qwert', 'contraseña', 'password'];
    foreach ($prohibidas as $p) {
        if (strpos($min, $p) !== false) { return 'La contraseña es demasiado común o secuencial.'; }
    }
    if ($nombre !== '' && strpos($min, strtolower($nombre)) !== false) {
        return 'La contraseña no puede contener tu nombre.';
    }
    $local = strtolower(explode('@', $email)[0]);
    if ($local !== '' && strpos($min, $local) !== false) {
        return 'La contraseña no puede contener tu correo.';
    }
    return '';
}

function registrarAuditoria($pdo, $idUsuario, $accion, $detalle) {
    $stmt = $pdo->prepare("INSERT INTO log_auditoria (id_usuario, accion, detalle, ip) VALUES (:u, :a, :d, :ip)");
    $stmt->execute([':u' => $idUsuario, ':a' => $accion, ':d' => $detalle, ':ip' => obtenerIp()]);
}

// Línea que lee Fail2Ban
function logFallidoArchivo($email) {
    $linea = '[' . date('Y-m-d H:i:s') . '] LOGIN_FALLIDO ip=' . obtenerIp() . ' email=' . $email . "\n";
    @file_put_contents('/var/log/vyse/login_fallidos.log', $linea, FILE_APPEND);
}

function cuentaBloqueada($pdo, $email) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM intento_login WHERE email = :e AND fecha > (NOW() - INTERVAL 15 MINUTE)");
    $stmt->execute([':e' => $email]);
    return $stmt->fetchColumn() >= 5;
}
?>