🌐 [English](../README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

7 KI-Berater, die dir und einander widersprechen.

> *„Das einzige Tool, das dir sagt, was du nicht hören willst."*

## Das Problem

Du stellst einer KI eine Frage. Du bekommst eine Antwort. Höflich, ausgewogen, glattgebügelt. Niemand sagt „das wird scheitern." Niemand fragt „warum machst du das überhaupt?" Niemand schlägt die verrückte Alternative vor, an die du noch nicht gedacht hast.

Im echten Leben entstehen die besten Entscheidungen aus Auseinandersetzungen zwischen Menschen, die unterschiedlich denken. Wonderboard erzeugt genau diese Auseinandersetzung.

## Was ist anders, als einfach Claude zu fragen

**Isolation.** Jeder Berater denkt unabhängig, in einem eigenen Claude-Aufruf. Wenn ein einzelner Prompt gleichzeitig Skeptiker und Visionär sein soll — kommt Brei raus. Wenn sie isoliert sind — entsteht echte Meinungsverschiedenheit.

**Zwei Runden.** In Runde 1 antworten die Berater, ohne die Meinungen der anderen zu kennen. In Runde 2 lesen sie alle Antworten, streiten und ändern ihre Position. Der Pragmatiker nimmt eine Empfehlung zurück, weil der Visionär ihn überzeugt hat. Der Skeptiker stärkt das Argument des Fokussierers. Das bekommt man mit einem einzelnen Prompt nicht hin.

**Interview.** Der Hutmacher stellt klärende Fragen, bevor er das Board einberuft. Du bekommst keine sieben Antworten auf eine schlecht formulierte Frage.

**Kontext.** Beim ersten Start fragt Claude nach deiner Situation und speichert sie. Jeder Berater bekommt diesen Kontext automatisch — du musst nicht jedes Mal erklären, wer du bist.

**Synthese ≠ Mittelwert.** Der Hutmacher sucht keinen Kompromiss. Er kartiert die Meinungsverschiedenheiten: wo sich die Berater einig waren, wo sie auseinandergingen, warum — und fügt einen querdenkenden Gedanken hinzu, der die Situation auf den Kopf stellt.

## Beispielfragen

Wonderboard ist nicht auf Business beschränkt. Es ist ein Werkzeug für jede Entscheidung, die Vielstimmigkeit braucht:

🏢 **Strategie.** „Ich habe 5 Produkte und eine Person. Was streichen, was behalten?"
🚀 **Launch.** „Ich will mit einem Produkt in den US-Markt, das nur in meinem Heimatland bekannt ist."
💰 **Geld.** „Ich habe ein Investorenangebot. Annehmen oder bootstrapped bleiben?"
🧠 **Karriere.** „Ich bin 35, vom Angestelltendasein erschöpft. Selbstständig machen oder nicht?"
🏗️ **Architektur.** „Monolith oder Microservices für ein 3-Jahres-Projekt?"
📝 **Content.** „Ich habe ein Portal mit 30.000 Artikeln. Wie überlebe ich eine Plattform-Migration, ohne alles kaputtzumachen?"
🤝 **Verhandlung.** „Der Kunde will 40 % Rabatt. Was tun?"

## Installation

Füge das in Claude Code ein:

```
Clone https://github.com/aveleazer/wonderboard and run install.sh
```

Claude richtet alles ein, fragt nach deiner Situation und öffnet Wonderboard im Browser. Beim nächsten Mal — `/wonderboard` oder bitte Claude einfach, das Board einzuberufen.

**Voraussetzungen:** Node.js 18+, Claude Code CLI (läuft über dein bestehendes Abo — keine API-Keys nötig).

### Tokens

Wonderboard ist token-intensiv. Eine vollständige Sitzung mit Opus: 7 Berater × 2 Runden + Interview + Synthese = 16+ Claude-Aufrufe, 300.000+ Tokens.

Um die Oberfläche ohne Token-Verbrauch zu erkunden, nutze den Testmodus (gib `test question` ein).

## Das Board

| | Berater | Blickwinkel |
|---|---|---|
| 🎯 | Fokussierer | „Wirf die Hälfte weg. Was bleibt?" |
| ⚔️ | Stratege | „Wo kämpfen, wo zurückziehen?" |
| 💰 | Pragmatiker | „Zeig mir die Unit Economics. Wo ist der Burggraben?" |
| 🔥 | Skeptiker | „Wo bricht das zusammen? Wer zahlt für den Fehler?" |
| 🔧 | Produktmensch | „Was kannst du in 6 Wochen ausliefern?" |
| 📢 | Vermarkter | „Wer erzählt einem Freund davon und warum?" |
| 🔮 | Visionär | „Wie sieht das in 10 Jahren aus?" |
| 🎩 | Hutmacher | Interviewt, synthetisiert, dreht den Spieß um |

## Ablauf einer Sitzung

1. **Deine Frage** — wozu du Rat brauchst
2. **Hutmacher-Interview** — klärende Fragen, um den Kontext herauszuarbeiten
3. **Runde 1** — jeder Weise antwortet unabhängig + stellt eine eigene Rückfrage
4. **Rückfragen-Bogen** — der Hutmacher bündelt die Fragen der Weisen zu einer kompakten Umfrage
5. **Runde 2** — die Weisen lesen die Antworten der anderen + deine, liefern ihre finale Position mit Handlungsplan
6. **Synthese** — der Hutmacher fasst zusammen: Konsens, Dissens und ein querdenkender Gedanke

## Konfiguration

- `context.md` — deine Situation (Claude fragt und füllt sie beim ersten Start aus, gitignored)
- `profiles/*.md` — Berater-Personas (frei editierbar, eigene hinzufügbar)
- `prompts/*.md` — Prompt-Vorlagen
- 10 UI-Sprachen, automatisch über den Browser erkannt
- Dark Mode — weil wichtige Entscheidungen am besten nachts getroffen werden

## Architektur

Null Abhängigkeiten. Ausschließlich eingebaute Node.js-Module.

| Datei | Was sie tut |
|---|---|
| `server.js` | HTTP-Server, ruft Claude per CLI auf, Session-Logik |
| `ui.html` | Single-Page-Oberfläche — kein Framework, kein Build-Schritt |
| `profiles/` | System-Prompts der Personas |
| `prompts/` | Prompt-Vorlagen |

Siehe [PRINCIPLES.md](PRINCIPLES.md) für die Design-Philosophie.

## Testmodus

Gib `test question` ein, um eine vollständige Sitzung mit Testdaten zu starten. Keine API-Aufrufe, kein Token-Verbrauch. Ideal, um die Oberfläche kennenzulernen.

## Lizenz

[MIT](LICENSE)
