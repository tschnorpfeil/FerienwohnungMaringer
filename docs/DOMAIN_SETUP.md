# Domain Umzug: Von Wix zu GitHub Pages

Da die neue Website nun fertig programmiert ist, muss die Domain `ferienwohnung-maringer.de` (die aktuell noch bei Wix registriert ist und auf die alte Wix-Baukasten-Seite zeigt) auf den neuen GitHub-Speicherplatz umgeleitet werden. 

Dies erfordert **zwei Schritte**: Wir müssen GitHub mitteilen, dass Sie diese Domain besitzen, und wir müssen Wix (Ihrem Domain-Anbieter) mitteilen, dass er Besucher auf die GitHub-Server leiten soll.

## Wichtiger Hinweis vorab
**Führen Sie diese Schritte erst aus, wenn Sie den Code vollständig auf GitHub hochgeladen haben (Repository) und die GitHub Pages Umgebung in den Repository-Einstellungen aktiviert ist!**

---

### Schritt 1: Konfiguration in GitHub
1. Gehen Sie auf GitHub in Ihr neues Repository (z.B. `IhrName/FerienwohnungMaringer`).
2. Klicken Sie oben auf **Settings** (Einstellungen).
3. Scrollen Sie im linken Menü nach unten zu **Pages**.
4. Scrollen Sie auf der Pages-Einstellungsseite zum Bereich **Custom domain** (Benutzerdefinierte Domain).
5. Tragen Sie hier Ihre Domain ein: `www.ferienwohnung-maringer.de`
6. Klicken Sie auf **Save**. GitHub wird ab jetzt versuchen, die Domain zu überprüfen (dies schlägt noch fehl, bis Schritt 2 erledigt ist).

---

### Schritt 2: DNS-Einstellungen bei Wix ändern
1. Loggen Sie sich in Ihr **Wix-Konto** ein.
2. Gehen Sie zum Dashboard Ihrer Website und klicken Sie im Menü links auf **Einstellungen** -> **Domains**.
3. Klicken Sie neben Ihrer Domain `ferienwohnung-maringer.de` auf das Drei-Punkte-Menü `...` und wählen Sie **DNS-Einträge verwalten** (Manage DNS Records).
4. Suchen Sie nach den sogenannten **A-Einträgen** (A Records) und **CNAME-Einträgen**.

#### 2.1 A-Einträge (für die Haupt-Domain ohne 'www')
Löschen Sie die vorhandenen A-Einträge von Wix und fügen Sie **vier neue A-Einträge** hinzu. Alle vier müssen als "Host" oder "Name" ein `@` (oder leer) haben. Geben Sie als "Wert" (Value/Points to) diese exakten IP-Adressen von GitHub ein:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

#### 2.2 CNAME-Eintrag (für die Subdomain mit 'www')
Suchen Sie den CNAME-Eintrag für "www" (Host/Name: `www`).
Ändern Sie den Wert (Points to) auf Ihren GitHub-Benutzernamen gefolgt von `.github.io`.
- *Beispiel:* Wenn Ihr GitHub-Name "MaxMustermann" ist, tragen Sie hier `maxmustermann.github.io` ein.

---

### Schritt 3: Abwarten und HTTPS aktivieren
1. DNS-Änderungen können **bis zu 24 Stunden** dauern (meistens geht es aber in 1-2 Stunden). 
2. Gehen Sie danach wieder in Ihre GitHub Repository-Einstellungen unter **Pages**.
3. Wenn der DNS-Check erfolgreich war, setzen Sie unten den Haken bei **Enforce HTTPS** (HTTPS erzwingen). Dadurch wird Ihre Seite sicher verschlüsselt aufgerufen.

Herzlichen Glückwunsch, Ihre blitzschnelle, neue Ferienwohnungs-Website ist nun unter Ihrer Hauptdomain erreichbar!
