<?php
require_once __DIR__ . '/../helpers/seguridad.php';
iniciarSesionSegura();
exigirCsrf();
$_SESSION = [];
session_destroy();
responder(['success' => true]);
?>