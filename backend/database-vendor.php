<?php

require "vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$dbhost = $_ENV['DBHOST'];
$dbname = $_ENV['DBNAME'];
$dbchar = "utf8";
$dbuser = $_ENV['DBUSER'];
$dbpass = $_ENV['DBPASS'];

try {
  $pdo = new PDO(
    "mysql:host=$dbhost;charset=$dbchar;dbname=$dbname",
    $dbuser, $dbpass, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );
} catch (Exception $ex) { exit($ex->getMessage()); }

?>