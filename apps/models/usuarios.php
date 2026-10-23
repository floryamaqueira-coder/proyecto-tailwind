<?php
require_once __DIR__ . "/../database/conexion.php";

// El rol NO se recibe: todo registro nuevo es "usuario"
function registrarUsuario($pdo, $nombre, $apellido, $email, $contrasena) {
    $passHash = password_hash($contrasena, PASSWORD_BCRYPT);
    $sql = "INSERT INTO usuario (nombre, apellido, email, contrasena, fecha_registro)
            VALUES (:nombre, :apellido, :email, :contrasena, CURDATE())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre' => $nombre, ':apellido' => $apellido,
        ':email' => $email, ':contrasena' => $passHash
    ]);
    return $pdo->lastInsertId();
}

function obtenerUsuarioPorEmail($pdo, $email) {
    $stmt = $pdo->prepare("SELECT id_usuario, nombre, apellido, email, contrasena, rol, estado FROM usuario WHERE email = :email");
    $stmt->execute([':email' => $email]);
    return $stmt->fetch();
}

function verificarLogin($pdo, $email, $contrasena) {
    $usuario = obtenerUsuarioPorEmail($pdo, $email);
    if (!$usuario) { return false; }
    if (!password_verify($contrasena, $usuario['contrasena'])) { return false; }
    if ($usuario['estado'] !== 'activo') { return false; }
    unset($usuario['contrasena']);
    return $usuario;
} 
?>