<?php
require('ini.php');
if(isset($_GET['image']) && isset($_GET['userID'])) {

    
    $image = $_GET['image'];
    $userID = $_GET['userID'];

    $stmt = $conn->prepare('SELECT COUNT(*) AS count FROM ratings WHERE image_id = (SELECT id FROM images WHERE filename = :filename) AND user_id = :user_id');
    $stmt->bindValue(':filename', $image, SQLITE3_TEXT);
    $stmt->bindValue(':user_id', $userID, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $row = $result->fetchArray();
    $count = $row['count'];

    // Wenn die Bewertung existiert, wird rated auf true gesetzt, andernfalls auf false
    $response = array('rated' => ($count > 0));
    echo json_encode($response);
} else {
    echo json_encode(array('error' => 'Fehlende Parameter'));
}
?>
