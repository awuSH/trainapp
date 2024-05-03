<?php
require('ini.php');
if(isset($_POST['image']) && isset($_POST['rating']) && isset($_POST['userID'])) {
    
    $image = $_POST['image'];
    $rating = $_POST['rating'];
    $userID = $_POST['userID']; // Korrekter Variablenname

    $stmt = $conn->prepare('SELECT id FROM images WHERE filename = :filename');
    $stmt->bindValue(':filename', $image, SQLITE3_TEXT);
    $result = $stmt->execute();
    $row = $result->fetchArray();
    $image_id = $row['id'];

    $stmt = $conn->prepare('INSERT INTO ratings (image_id, rating, user_id, date) VALUES (:image_id, :rating, :user_id, datetime("now"))');
    $stmt->bindValue(':image_id', $image_id, SQLITE3_INTEGER);
    $stmt->bindValue(':rating', $rating, SQLITE3_INTEGER);
    $stmt->bindValue(':user_id', $userID, SQLITE3_INTEGER); // Korrekter Variablenname
    $stmt->execute();

    echo 'Bewertung erfolgreich gespeichert.';
} else {
    echo 'Fehler: Keine Bild-, Bewertungs- oder Benutzerdaten übergeben.';
}
?>
