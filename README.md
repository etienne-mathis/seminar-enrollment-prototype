# seminar-enrollment-prototype

Prototypische UI für das Wahlpflichtmodul-Einschreibungssystem der HTW Dresden.
Erstellt im Rahmen des Projektseminars Agentic Engineering (WS 2026/27).

## Zweck

Visuelle Vorlage zur Anforderungsvalidierung mit Prof. Wiedemann (Feature 004 — Erst-/Zweit-/Drittwunsch auswählen).
Kein produktiver Code — kein Backend, keine Authentifizierung, nur statisches HTML.

## Starten

Datei `index.html` direkt im Browser öffnen — keine Installation nötig.

## Abgedeckte Fachregeln (aus Spec 004)

- R1: Genau drei Module auswählen
- R2: Eindeutige Priorisierung (Platz 1, 2, 3)
- R3: Dasselbe Modul kann nicht mehrfach gewählt werden
- R5/R6: Auswahl kann jederzeit geändert werden (bis Fristende)
- AK1: Bestätigungsmeldung nach erfolgreicher Einschreibung
- AK2: Fehlermeldung bei weniger als drei Modulen
- AK7: Responsive — auf Smartphone ohne horizontales Scrollen bedienbar

## Bewusst nicht enthalten

- Admin-Ansicht (Feature 009)
- Motivationsschreiben (Feature 005)
- Verbindliches Einreichen (Feature 006)
- Backend / Datenpersistenz
