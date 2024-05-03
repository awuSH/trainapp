document.addEventListener("DOMContentLoaded", function() {
    const imageContainer = document.getElementById('image');
    const ratingButtons = document.querySelectorAll('#rating-buttons button');
    
    let images = []; // Array zum Speichern der Bildpfade
    let currentIndex = 0;
    let userID = 0;
    let username = '';
    
    createButtons();
    // Benutzernamen abfragen und Benutzer überprüfen
    getUsernameAndCheckUser();

    // Event-Listener zu den Bewertungsbuttons hinzufügen
    // ratingButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         const rating = parseInt(button.innerText);
    //         saveRating(images[currentIndex], rating, userID); // Bewertung an den Server senden
    //     });
    // });

    // create Buttons
    function createButtons() {
        fetch('config.json')
        .then((response) => response.json())
        .then((config) => {
            const ratingButtons = document.querySelector('#rating-buttons');
            for (let i = 0; i < config.Classes.length; i++) {
                const button = document.createElement('button');
                const className = config.Classes[i].Class;
                const buttonName = config.Classes[i].ButtonName;
                button.value = config.Classes[i].Value;
                button.innerText = buttonName;
                ratingButtons.appendChild(button);
                button.addEventListener('click', function() {
                    saveRating(images[currentIndex], button.value, userID)
                })
            }
            document.getElementById("description").innerHTML = config.Variables.Description;
        });

    }

    // Benutzernamen abfragen und Benutzer überprüfen
    function getUsernameAndCheckUser() {
        // Benutzernamen abfragen
        username = prompt("Bitte gib deinen Benutzernamen ein (3 Zeichen):");
        
        // Überprüfen, ob der Benutzername 3 Zeichen hat
        if (username.length !== 3) {
            alert("Der Benutzername muss genau 3 Zeichen lang sein.");
            window.location.reload(); // Seite neu laden, um erneut nach dem Benutzernamen zu fragen
        } else {
            // Benutzer überprüfen, ob er bereits in der Datenbank existiert
            checkUser(username);
        }
    }
    function showUserMessage() {
        document.getElementById("logged-in-message").innerHTML = `Benutzer: ${username}`; // Nachricht anzeigen
    }
    // Benutzer überprüfen
    async function checkUser(username) {
        try {
            const response = await fetch(`/routers/check_user.php?username=${encodeURIComponent(username)}`);
            const data = await response.json(); // Antwort als JSON-Objekt parsen
            
            if (data.status === 'exists') {
                // Benutzer existiert bereits
                userID = data.userID; // Benutzer-ID abrufen
                showUserMessage(); 
            } else {
                // Benutzer existiert nicht, registrieren
                await registerUser(username);
                showUserMessage();
            }
            // Bilder laden, nachdem der Benutzer überprüft wurde
            loadImages();
        } catch (error) {
            console.error('Fehler beim Überprüfen des Benutzers:', error);
        }
    }

    // Benutzer registrieren
    async function registerUser(username) {
        try {
            const response = await fetch('/routers/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}`,
            });
            if (!response.ok) {
                throw new Error('Fehler beim Registrieren des Benutzers');
            }
            // Antwort des Servers als JSON parsen
            const data = await response.json();
            // Die Benutzer-ID aus der Antwort extrahieren
            userID = data.userID;
            console.log('Die Benutzer-ID lautet: ' + userID);
        } catch (error) {
            console.error(error);
        }
    }
    
    // Bilder laden
    function loadImages() {
        fetch('/routers/get_image_filenames.php')
            .then(response => response.json())
            .then(data => {
                images = data; // Bild-Dateinamen speichern
                showNextUnratedImage(); // Nächstes nicht bewertetes Bild anzeigen
            })
            .catch(error => console.error('Fehler beim Laden der Bild-Dateinamen:', error));
    }

    // Funktion zum Anzeigen des nächsten nicht bewerteten Bildes
    function showNextUnratedImage() {

        if (currentIndex < images.length) {
            const image = images[currentIndex];
            fetch(`/routers/check_rating.php?image=${encodeURIComponent(image)}&userID=${userID}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.rated) {

                        imageContainer.src = 'assets/' + image; // Bild anzeigen
                        get_image_filenames();
                    } else {
                        currentIndex++; // Zum nächsten Bild gehen
                        showNextUnratedImage(); // Rekursiv das nächste nicht bewertete Bild anzeigen
                    }
                })
                .catch(error => console.error('Fehler beim Überprüfen der Bewertung:', error));
        } else {
            if (currentIndex > 0) {
               // alert('Alle Bilder wurden bewertet.'); // Alle Bilder wurden bewertet
                finished()
            }
        }

    }
    
    function finished() {
        document.getElementById("image").style.display = "none";
        document.getElementById("rating-buttons").innerHTML = "Alles bewertet. Herzlichen Dank für deine Unterstützung!"
        console.log("finished");
    }
    function get_image_filenames() {
        //Zeigt den Namen des Bildes an
       document.getElementById("image-date").innerHTML = convertFilenameToDateTime(images[currentIndex])
    }
    function convertFilenameToDateTime(filename) {
        filename = filename.replace('.jpg', '');
        const parts = filename.split('_');
        const datePart = parts[0];
        const timePart = parts[1].split('-').join(':');
    
        const date = new Date(datePart.replace(/-/g, '/'));
    
        const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('de-DE', optionsDate);
    
        return formattedDate + ' um ' + timePart + ' Uhr';
    }
    
    function calculateProgress() {
        const progress = (currentIndex / images.length) * 100;
        document.getElementById("progress-bar").value = progress;
    }
    // Funktion zum Speichern der Bewertung auf dem Server
    async function saveRating(image, rating, userID) {
        calculateProgress();
        try {
            const response = await fetch('/routers/save_rating.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `image=${encodeURIComponent(image)}&rating=${encodeURIComponent(rating)}&userID=${userID}`
            });
            if (!response.ok) {
                throw new Error('Fehler beim Speichern der Bewertung');
            } else {
                currentIndex++; // Zum nächsten Bild gehen
                showNextUnratedImage(); // Nächstes nicht bewertetes Bild anzeigen
            }
        } catch (error) {
            console.error(error);
        }
    }
});
