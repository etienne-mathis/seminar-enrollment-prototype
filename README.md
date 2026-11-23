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

## Der vollständige Durchlauf

Der Prototyp bildet die ganze Kette ab. Beide Ansichten teilen sich eine Ablage im
`localStorage` des Browsers, die stellvertretend für das spätere Backend steht:

1. **Portal** — anmelden (beliebige s-Nummer), drei Projektseminare priorisieren,
   Motivationsschreiben verfassen, Bewerbung einreichen
2. **Portal** — die Statusansicht zeigt die Bewerbung mit Status *Eingereicht*;
   erneutes Anmelden führt direkt dorthin, Änderungen bleiben bis Fristende möglich
3. **Verwaltung** — die eingereichte Bewerbung erscheint oben in der Liste, markiert
   als *neu*; Zuordnung in der Spalte *Zuordnung* anpassen (Kapazität wird geprüft)
4. **Portal** — Status springt auf *In Bearbeitung*, das Ergebnis bleibt verborgen
5. **Verwaltung** — *Ergebnisse veröffentlichen*
6. **Portal** — Status springt auf *Zugeteilt* und nennt das zugewiesene Seminar
   sowie den erfüllten Wunschrang

*Demo zurücksetzen* in der Verwaltung löscht Bewerbung, Zuordnungen und
Veröffentlichung.

### Demo-Szenarien

| Aufruf | Zeigt |
|---|---|
| `index.html?leer=1` | Verhalten, wenn keine Projektseminare angeboten werden (US-002 AK6) |
| PS-08 → *Beschreibung (PDF)* | Verhalten, wenn keine Beschreibung hinterlegt ist (US-003 AK5) |

## Abdeckung der User Stories

| Story | Stand | Anmerkung |
|---|---|---|
| US-001 Anmeldung und Zugangsberechtigung | angedeutet | Login-Maske mit s-Nummer-Validierung und Fehlermeldung. Keine echte LDAP-Anbindung, keine Rollentrennung. |
| US-002 Übersicht der Projektseminare | abgedeckt | Acht Seminare mit Nummer, Titel, Professor, Semester, Beschreibung, plus Leerzustand. |
| US-003 PDF-Beschreibungen | abgedeckt bis auf echte Dateien | Vorschau mit Inhalt, Voraussetzungen und Prüfungsform; Hinweis, wenn keine Beschreibung hinterlegt ist. |
| US-004 Erst-, Zweit- und Drittwunsch | abgedeckt | Vollständig inklusive Umsortieren und Schutz vor Doppelauswahl. |
| US-005 Motivationsschreiben | abgedeckt | Erscheint beim Erstwunsch, 500 Zeichen, vor Einreichung änderbar, in der Verwaltung einsehbar. |
| US-006 Bewerbung einreichen | abgedeckt | Vollständigkeitsprüfung, Prüfansicht, Bestätigung mit Zeitstempel, Speicherung mit Zuordnung zur s-Nummer. |
| US-007 Bewerbungsstatus einsehen | abgedeckt | Eigene Statusansicht mit den Werten Eingereicht, In Bearbeitung und Zugeteilt. |
| US-008 Seminare und Kapazitäten verwalten | teilweise | Kapazität und Auslastung werden angezeigt und bei der Zuordnung durchgesetzt, aber nicht gepflegt. |
| US-009 Bewerbungen einsehen und zuordnen | abgedeckt | Übersicht mit Wünschen, Motivationsschreiben und KI-Vorschlag; manuelle Zuordnung mit Kapazitätsprüfung. |
| US-010 Ergebnisse verwalten | abgedeckt bis auf Benachrichtigung | Veröffentlichen und Zurücknehmen; vor der Veröffentlichung ist das Ergebnis für Studierende nicht sichtbar. |

Der ausführliche Abgleich inklusive offener Fragen an den Auftraggeber liegt im
Projekt-Wissensspeicher und wird im Anforderungsgespräch besprochen.

## Prüfung

```
node tests/ak-harness.mjs
```

62 Prüfungen gegen die Akzeptanzkriterien, ohne Framework und ohne Abhängigkeiten.
Die Skriptblöcke der HTML-Dateien werden mit einem minimalen DOM-Stub geladen und
direkt ausgeführt. Der Lauf ist Voraussetzung für das Pages-Deployment — ein
Prototyp, der die Kriterien reißt, wird nicht veröffentlicht.

## Bewusst nicht enthalten

Server und Datenbank (die Ablage liegt im Browser und ist pro Gerät sichtbar),
echte Authentifizierung gegen LDAP, Rollen- und Rechteprüfung, echte PDF-Dateien,
Benachrichtigungen an Studierende, Pflege des Seminarangebots.
