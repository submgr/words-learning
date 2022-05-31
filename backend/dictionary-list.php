<?php

require 'database-vendor.php';

$query = "SELECT * FROM `dictionaries`";
$stmt = $pdo->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll();

echo json_encode($result);
