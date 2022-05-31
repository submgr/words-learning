<?php

if(!is_numeric($_GET["id"])){
    exit();
}

require 'database-vendor.php';

$stmt = $pdo->query("SELECT * FROM `dictionaries` WHERE id = " . $_GET["id"]);

$data = $stmt->fetch();

echo json_encode($data);

// (D) CLOSE DATABASE CONNECTION
if ($stmt !== null) { $stmt = null; }
if ($pdo !== null) { $pdo = null; }