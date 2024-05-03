<?php
//get number of reatings based on user id
// Verbindung zur SQLite-Datenbank herstellen
$conn = new SQLite3('../db/image_database.db');

// Benutzernamen aus der GET-Anfrage abrufen
$username = $_GET['userID'];

// Anzahl der Bewertungen abrufen
$stmt = $conn->prepare('SELECT COUNT(*) FROM ratings WHERE user_id = :user_id');
$stmt->bindValue(':user_id', $username, SQLITE3_TEXT);
$result = $stmt->execute();
$row = $result->fetchArray();
$rating_count = $row[0];

echo $rating_count;


?>