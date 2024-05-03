<?php
require('ini.php');

// Benutzernamen aus der POST-Anfrage abrufen
$username = $_POST['username'];

// Benutzer in der Datenbank registrieren
$stmt = $conn->prepare('INSERT INTO users (username, registration_date) VALUES (:username, datetime("now"))');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$stmt->execute();

// Die zuletzt eingefügte Zeile (Benutzer) abrufen und die Benutzer-ID zurückgeben
$userID = $conn->lastInsertRowID();

// Die Benutzer-ID als JSON zurückgeben
echo json_encode(['userID' => $userID]);
?>