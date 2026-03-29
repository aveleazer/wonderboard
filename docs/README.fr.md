🌐 [English](../README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

7 conseillers IA qui ne sont d'accord ni avec vous, ni entre eux.

> *« Le seul outil qui vous dira ce que vous ne voulez pas entendre. »*

## Le problème

Vous posez une question à une IA. Vous obtenez une réponse. Polie, équilibrée, lissée. Personne ne dit « ça va échouer ». Personne ne demande « pourquoi tu fais ça, déjà ? » Personne ne propose l'alternative folle à laquelle vous n'avez pas pensé.

Dans la vraie vie, les meilleures décisions naissent de débats entre des gens qui pensent différemment. Wonderboard crée ce débat.

## En quoi c'est différent de simplement demander à Claude

**L'isolement.** Chaque conseiller réfléchit de manière indépendante, dans un appel Claude séparé. Quand un seul prompt essaie d'être à la fois sceptique et visionnaire — vous obtenez de la bouillie. Quand ils sont isolés — vous obtenez un vrai désaccord.

**Deux tours.** Au premier tour, les conseillers répondent sans voir les avis des autres. Au deuxième tour, ils lisent toutes les réponses, argumentent et changent de position. Le Pragmatique retire une recommandation parce que le Visionnaire l'a convaincu. Le Sceptique renforce l'argument du Focaliseur. Impossible d'obtenir ça avec un seul prompt.

**L'entretien.** Le Chapelier pose des questions de clarification avant de réunir le Conseil. Vous n'obtiendrez pas sept réponses à une question mal formulée.

**Le contexte.** Au premier lancement, Claude vous interroge sur votre situation et la sauvegarde. Chaque conseiller reçoit ce contexte automatiquement — pas besoin de réexpliquer qui vous êtes à chaque fois.

**Synthèse ≠ compromis.** Le Chapelier ne cherche pas le consensus mou. Il cartographie les désaccords : où les avis convergent, où ils divergent, pourquoi — et ajoute une pensée perpendiculaire qui retourne la situation.

## Exemples de questions

Wonderboard ne se limite pas au business. C'est un outil pour toute décision qui a besoin de polyphonie :

🏢 **Stratégie.** « J'ai 5 produits et une seule personne. Que supprimer, que garder ? »
🚀 **Lancement.** « Je veux entrer sur le marché américain avec un produit qui ne marche que dans mon pays. »
💰 **Financement.** « J'ai reçu une offre d'investisseur. Accepter ou rester en autofinancement ? »
🧠 **Carrière.** « J'ai 35 ans, le salariat m'épuise. Me lancer en indépendant ou pas ? »
🏗️ **Architecture.** « Monolithe ou microservices pour un projet sur 3 ans ? »
📝 **Contenu.** « J'ai un portail avec 30 000 articles. Comment ne pas tout casser pendant une migration de plateforme ? »
🤝 **Négociation.** « Le client veut 40 % de remise. Qu'est-ce que je fais ? »

## Installation

Collez ceci dans Claude Code :

```
Clone https://github.com/aveleazer/wonderboard and run install.sh
```

Claude s'occupe de tout, vous pose des questions sur votre situation et ouvre Wonderboard dans votre navigateur. La fois suivante — `/wonderboard` ou demandez simplement à Claude de réunir le conseil.

**Prérequis :** Node.js 18+, Claude Code CLI (fonctionne avec votre abonnement existant — pas de clé API nécessaire).

### Tokens

Wonderboard consomme beaucoup de tokens. Une session complète sur Opus : 7 conseillers × 2 tours + entretien + synthèse = plus de 16 appels Claude, plus de 300 000 tokens.

Pour explorer l'interface sans dépenser de tokens, utilisez le mode test (tapez `test question`).

## Le Conseil

| | Conseiller | Angle de vue |
|---|---|---|
| 🎯 | Focaliseur | « Jetez la moitié. Qu'est-ce qui reste ? » |
| ⚔️ | Stratège | « Où se battre, où se replier ? » |
| 💰 | Pragmatique | « Montrez-moi l'économie unitaire. Où est l'avantage concurrentiel ? » |
| 🔥 | Sceptique | « Où est-ce que ça casse ? Qui paie l'erreur ? » |
| 🔧 | Produit | « Qu'est-ce que vous pouvez livrer en 6 semaines ? » |
| 📢 | Marketeur | « Qui en parle à un ami, et pourquoi ? » |
| 🔮 | Visionnaire | « À quoi ça ressemble dans 10 ans ? » |
| 🎩 | Chapelier | Interroge, synthétise, retourne la situation |

## Déroulement d'une session

1. **Votre question** — le sujet sur lequel vous avez besoin de conseils
2. **Entretien du Chapelier** — questions de clarification pour extraire le contexte
3. **Tour 1** — chaque Sage répond de manière indépendante + pose sa propre question de suivi
4. **Questionnaire de suivi** — le Chapelier compile les questions des Sages en un questionnaire ciblé
5. **Tour 2** — les Sages lisent les réponses des autres + les vôtres, livrent leurs positions finales avec plans d'action
6. **Synthèse** — le Chapelier résume : points de convergence, désaccords, et une pensée perpendiculaire

## Configuration

- `context.md` — votre situation (Claude vous la demande et la remplit au premier lancement, dans le gitignore)
- `profiles/*.md` — personnalités des conseillers (entièrement modifiables, ajoutez les vôtres)
- `prompts/*.md` — modèles de prompts
- 10 langues pour l'interface, détectées automatiquement depuis le navigateur
- Mode sombre — parce que les décisions importantes se prennent mieux la nuit

## Architecture

Zéro dépendance. Uniquement les modules natifs de Node.js.

| Fichier | Rôle |
|---|---|
| `server.js` | Serveur HTTP, appelle Claude via CLI, logique de session |
| `ui.html` | Interface mono-page — pas de framework, pas d'étape de build |
| `profiles/` | System prompts des personnalités |
| `prompts/` | Modèles de prompts |

Voir [PRINCIPLES.md](PRINCIPLES.md) pour la philosophie de conception.

## Mode test

Tapez `test question` pour lancer une session complète avec des données fictives. Aucun appel API, aucun token dépensé. Idéal pour explorer l'interface.

## Licence

[MIT](LICENSE)
