<?php

require 'database-vendor.php';

$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
$spreadsheet = $reader->load($_FILES['dictionary_file']['tmp_name']);
$worksheet = $spreadsheet->getActiveSheet();

$prepared_array = $worksheet->toArray();

$images_path = null;

$zip = new ZipArchive;

if ($_FILES['dictionary_imagesfolder']["error"] == 0) {

    $file_temp_storage_path = $_FILES["dictionary_imagesfolder"]["tmp_name"] . $_FILES["dictionary_imagesfolder"]["name"];

    // Zip File Name
    if ($zip->open($_FILES['dictionary_imagesfolder']['tmp_name']) === TRUE) {

        $images_path_token_size = 20;
        $images_path = bin2hex(random_bytes(20));

        // Unzip Path
        $zip->extractTo(dirname(__FILE__) . '/storage/' . $images_path . '/');
        $zip->close();
    } else {
        exit('Unzipped Process failed');
    }
}

$sql = "INSERT INTO `dictionaries` (`title`, `source`, `destination`, `data`, `images_path`) VALUES (?, ?, ?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([htmlspecialchars($_POST["dictionary_title"]), $prepared_array[0][0], $prepared_array[0][1], json_encode($prepared_array), $images_path]);
    echo $pdo->lastInsertId();
} catch (Exception $ex) {
    echo "error";
}

// (D) CLOSE DATABASE CONNECTION
if ($stmt !== null) {
    $stmt = null;
}
if ($pdo !== null) {
    $pdo = null;
}
