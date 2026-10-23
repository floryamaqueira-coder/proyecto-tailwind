<?php
require_once __DIR__ . '/../helpers/seguridad.php';
iniciarSesionSegura();

$respuesta = ['logueado' => false, 'csrf' => tokenCsrf()];
if (!empty($_SESSION['usuario_id'])) {
    $respuesta['logueado'] = true;
    $respuesta['usuario'] = [
        'id'       => $_SESSION['usuario_id'],
        'nombre'   => $_SESSION['usuario_nombre'],
        'apellido' => $_SESSION['usuario_apellido'],
        'email'    => $_SESSION['usuario_email'],
        'rol'      => $_SESSION['usuario_rol']
    ];
}
responder($respuesta);
?>