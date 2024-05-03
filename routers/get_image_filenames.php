<?php
require('ini.php');

// Abfrage ausführen, um die Bild-Dateinamen abzurufen
$result = $conn->query('SELECT filename FROM images');

// Bild-Dateinamen in ein Array speichern
$imageFileNames = [];
while ($row = $result->fetchArray()) {
    $imageFileNames[] = $row['filename'];
}

// Bild-Dateinamen als JSON zurückgeben
echo json_encode($imageFileNames);
?>
