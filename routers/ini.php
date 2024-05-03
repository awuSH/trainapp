<?php


// Überprüfen, ob die Datenbankdatei bereits existiert
if (!file_exists('../db/image_database.db')) {
    // Verbindung zur Datenbank herstellen
    $conn = new SQLite3('../db/image_database.db');
    echo 'Datenbank erstellt';
    // Tabelle für die Bild-Dateinamen erstellen
    $conn->exec('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT)');
    // Verzeichnis mit Bildern durchgehen
    $images = scandir('../assets');
    foreach ($images as $image) {
        // Nur JPG-Dateien verarbeiten
        if (pathinfo($image, PATHINFO_EXTENSION) == 'jpg') {
            // Bildnamen in die Datenbank einfügen
            $stmt = $conn->prepare("INSERT INTO images (filename) VALUES (:filename)");
            $stmt->bindValue(':filename', $image, SQLITE3_TEXT);
            $stmt->execute();
        }
    }
    
    // Tabelle für die Bewertungen erstellen
    $conn->exec('CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, image_id INTEGER, rating INTEGER, user_id INTEGER, date TEXT, FOREIGN KEY(image_id) REFERENCES images(id), FOREIGN KEY(user_id) REFERENCES users(id))');

    // Tabelle für die Benutzer erstellen
    $conn->exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, registration_date TEXT)');

    // Verbindung zur Datenbank schließen
    $conn->close();
}

    $conn = new SQLite3('../db/image_database.db');
?>