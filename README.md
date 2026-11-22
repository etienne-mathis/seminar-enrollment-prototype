# seminar-enrollment-prototype

Klickbarer UI-Prototyp für die Projektseminar-Einschreibung der HTW Dresden.
Entstanden im Projektseminar Agentic Engineering, WS 2026/27.

**Live:** https://etienne-mathis.github.io/seminar-enrollment-prototype/

> Prototyp zur Anforderungsvalidierung. Beispieldaten, simulierter Login, kein Backend.
> Eingaben werden nicht gespeichert. Alle s-Nummern, Bewerbungen und Motivationstexte sind frei erfunden.

## Zweck

Grundlage für das Anforderungsgespräch mit Prof. Wiedemann. Der Prototyp macht die
User Stories US-001 bis US-010 anfassbar, damit offene Fragen am konkreten Bild
geklärt werden können statt am Fließtext.

Fachliches Repository des Projekts:
[htw-agentic-engineering/seminar-enrollment](https://github.com/htw-agentic-engineering/seminar-enrollment)

## Inhalt

| Ansicht | Datei | Rolle |
|---|---|---|
| Studierenden-Portal | `prototyp/index.html` | Anmeldung, Seminarübersicht, Priorisierung, Motivationsschreiben, Einreichung |
| Verwaltungsansicht | `prototyp/admin.html` | Seminarauslastung, Bewerbungsübersicht, KI-Zuteilungsvorschläge |

Beide Ansichten sind über einen Link am Seitenende bzw. im Kopfbereich miteinander
verbunden, damit beide Perspektiven ohne Rollenwechsel durchgeklickt werden können.

## Lokal starten

`prototyp/index.html` im Browser öffnen. Keine Installation, keine Abhängigkeiten.

## Abdeckung der User Stories

| Story | Stand | Anmerkung |
|---|---|---|
| US-001 Anmeldung und Zugangsberechtigung | angedeutet | Login-Maske mit s-Nummer-Validierung und Fehlermeldung. Keine echte LDAP-Anbindung, keine Rollentrennung. |
| US-002 Übersicht der Projektseminare | abgedeckt | Acht Seminare mit Nummer, Titel, Professor, Semester, Beschreibung. Kein Leerzustand. |
| US-003 PDF-Beschreibungen | angedeutet | Aufruf vorhanden, öffnet eine Platzhaltermeldung statt einer Datei. |
| US-004 Erst-, Zweit- und Drittwunsch | abgedeckt | Vollständig inklusive Umsortieren und Schutz vor Doppelauswahl. |
| US-005 Motivationsschreiben | abgedeckt | Erscheint beim Erstwunsch, 500 Zeichen, vor Einreichung änderbar, in der Verwaltung einsehbar. |
| US-006 Bewerbung einreichen | abgedeckt bis auf Persistenz | Vollständigkeitsprüfung, Prüfansicht, Bestätigung mit Zeitstempel. Kein Speichern. |
| US-007 Bewerbungsstatus einsehen | offen | Kein Statusbildschirm, keine Wiederaufnahme einer eingereichten Bewerbung. |
| US-008 Seminare und Kapazitäten verwalten | teilweise | Kapazität und Auslastung werden angezeigt, aber nicht gepflegt. |
| US-009 Bewerbungen einsehen und zuordnen | teilweise | Übersicht mit Wünschen, Motivationsschreiben und KI-Vorschlag. Zuordnung ist statisch. |
| US-010 Ergebnisse verwalten | angedeutet | Schaltfläche „Zuteilung bestätigen" ohne Veröffentlichungslogik. |

Der ausführliche Abgleich inklusive offener Fragen an den Auftraggeber liegt im
Projekt-Wissensspeicher und wird im Anforderungsgespräch besprochen.

## Bewusst nicht enthalten

Backend, Datenpersistenz, echte Authentifizierung, Rollen- und Rechteprüfung,
echte PDF-Dateien, Benachrichtigungen.
