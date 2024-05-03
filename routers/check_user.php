<?php
require('ini.php');

// Benutzernamen aus der GET-Anfrage abrufen
$username = $_GET['username'];

// Überprüfen, ob der Benutzer bereits in der Datenbank existiert
$stmt = $conn->prepare('SELECT id FROM users WHERE username = :username');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray();

if ($user) {
    // Benutzer existiert bereits
    $userID = $user['id'];
    echo json_encode(array('status' => 'exists', 'userID' => $userID));
} else {
    // Benutzer existiert nicht
    echo json_encode(array('status' => 'not_exists'));
}
?>
