# Installationsanleitung
Genaue Erläuterung, wie das entwickelte System vollkommen funktionsfähig auf einem Rechner in Betrieb genommen werden kann.

Eingereicht wurden drei Dateien, die zur Installation notwendig sind. Darunter befinden sich zwei Tar-Dateien für die Docker-Container des Frontends und Backends sowie eine docker-compose.yml

Die Dateien frontend.tar, backend.tar und docker-compose.yml müssen sich für die Installation im selben Verzeichnis auf dem Host-System befinden.

## Installationsschritte:

Terminal öffnen: Öffnen Sie das Terminal im Verzeichnis, in dem sich die Dateien befinden.
Docker starten: Starten Sie Docker Desktop, die Docker Engine oder eine vergleichbare Docker-Installation auf dem Host-System.
Frontend-Image laden: Führen Sie im Terminal den Befehl “docker load -i frontend.tar” aus.
Backend-Image laden: Führen Sie im Terminal den Befehl “docker load -i backend.tar” aus.
Container starten: Führen Sie im Terminal den Befehl “docker compose up” aus.
Im Terminalfenster können nun der Status der vier laufenden Container beobachtet werden. Die zwei zusätzlichen Container sind postgres und pgadmin. Die Boot-Sequenz ist abgeschlossen, wenn im Backend-Container eine Zeile mit den Worten „Started BackendApplication…“ angezeigt wird.

Das Webinterface für das System ist anschließend lokal im Browser unter http://localhost:80 erreichbar.

## SEHR WICHTIG:

Der Port für die PostgreSQL-Datenbank ist 5431. Dieser Port muss unbedingt frei sein, da das Backend sonst nicht starten kann.
Der Standardport für PostgreSQL ist 5432, aber Ich habe ihn auf 5431 geändert, um Konflikte mit eventuell bereits vorhandenen PostgreSQL-Installationen auf Ihrem Gerät zu vermeiden. 
Da Sie nur die bereitgestellten Images ausführen und nicht den Quellcode bearbeiten, können Sie die Datei application.properties nicht anpassen.

Der Port 8888 soll ebenfalls für pgadmin frei sein.

Der Port 8080 soll ebenfalls für Backend frei sein.




# Bedienungsanleitung
Genaue Erläuterung, wie das entwickelte System zu bedienen ist.

Wenn man “http://localhost:80” aufruft, landet man automatisch auf dem Login-Fenster der Anwendung.

Dort erhält man die Möglichkeit, sich mit einem vorhandenen Benutzerkonto einzuloggen (in dem man den Benutzernamen und das dazugehörige Passwort eingibt). Außerdem erhält man durch den Button “Registriere dich jetzt” die Möglichkeit, ein neues Benutzerkonto anzulegen, bzw. einen neuen Benutzer (Admin oder normaler Benutzer) zu registrieren. Nachdem man sich registriert hat, gelangt man wieder zum Login-Fenster und muss sich einloggen.

Nachdem man sich eingeloggt hat, gelangt man zum Fenster für die Zwei-Faktor-Authentifizierung. Der Code für die Zwei-Faktor-Authentifizierung wird per E-Mail von der E-Mail Adresse: sep.move1@gmail.com versendet. Der Code wird ebenfalls in der jeweiligen Entwicklungsumgebung (z.B. Intellij)  in der Konsole durch das Backend ausgegeben.

Außerdem existiert ein Supercode (“000000”) mit dem man sich jederzeit authentifizieren kann, ohne den per E-Mail erhaltenen Code eingeben zu müssen.

Nachdem man sich authentifiziert hat, gelangt man zur Startseite und kann auf die restlichen Funktionen des Systems zugreifen.

Admins und normale Benutzer können sich ihr eigenes Benutzerprofil und die Teilnehmerliste ansehen. Zudem kann man in der Teilnehmerliste nach Benutzern suchen und sich das Profil von anderen Benutzern ansehen, wenn man den jeweiligen Benutzernamen anklickt.

Nur normale Benutzer können Aktivitäten erstellen. Nachdem man eine Aktivität erstellt hat, gelangt man zu der dazugehörigen Aktivitätsstatistik. Auf dem Fenster der Aktivitätsliste kann ein Benutzer alle seine Aktivitäten in einer Tabelle sehen. Diese Tabelle kann man anhand mehrerer Attribute auf- oder absteigend sortieren.
