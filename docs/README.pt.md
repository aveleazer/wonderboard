🌐 [English](../README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

7 conselheiros de IA que discordam de você e entre si.

> *"A única ferramenta que vai te dizer o que você não quer ouvir."*

## O Problema

Você faz uma pergunta para a IA. Recebe uma resposta. Educada, equilibrada, genérica. Ninguém diz "isso vai dar errado." Ninguém pergunta "por que você está fazendo isso?" Ninguém sugere a alternativa maluca que você não considerou.

Na vida real, as melhores decisões nascem de discussões entre pessoas que pensam diferente. O Wonderboard cria essa discussão.

## Como isso é diferente de simplesmente perguntar ao Claude

**Isolamento.** Cada conselheiro pensa de forma independente, numa chamada separada ao Claude. Quando um único prompt tenta ser cético e visionário ao mesmo tempo — sai uma papinha sem gosto. Quando estão isolados — a discordância é real.

**Duas rodadas.** Na rodada 1, os conselheiros respondem sem ver as opiniões uns dos outros. Na rodada 2, eles leem todas as respostas, debatem e mudam de posição. O Pragmático volta atrás numa recomendação porque o Visionário o convenceu. O Cético reforça o argumento do Focalizador. Isso é impossível com um prompt único.

**Entrevista.** O Chapeleiro faz perguntas de esclarecimento antes de reunir o Conselho. Você não vai receber sete respostas para uma pergunta mal formulada.

**Contexto.** No primeiro uso, o Claude pergunta sobre sua situação e salva. Cada conselheiro recebe esse contexto automaticamente — sem precisar explicar quem você é toda vez.

**Síntese ≠ média.** O Chapeleiro não busca consenso. Ele mapeia as discordâncias: onde convergiram, onde divergiram, por quê — e acrescenta um pensamento perpendicular que vira a situação de cabeça para baixo.

## Exemplos de Perguntas

O Wonderboard não se limita a negócios. É uma ferramenta para qualquer decisão que precise de polifonia:

🏢 **Estratégia.** "Tenho 5 produtos e uma pessoa. O que matar, o que manter?"
🚀 **Lançamento.** "Quero entrar no mercado americano com um produto que só faz sucesso no meu país."
💰 **Dinheiro.** "Recebi uma proposta de investidor. Aceitar ou continuar no bootstrap?"
🧠 **Carreira.** "Tenho 35 anos, cansado de ser empregado. Ir por conta própria ou não?"
🏗️ **Arquitetura.** "Monolito ou microsserviços para um projeto de 3 anos?"
📝 **Conteúdo.** "Tenho um portal com 30 mil artigos. Como não destruí-lo durante uma migração de plataforma?"
🤝 **Negociação.** "O cliente quer 40% de desconto. O que eu faço?"

## Instalação

Cole isso no Claude Code:

```
Clone https://github.com/aveleazer/wonderboard and run install.sh
```

O Claude vai configurar tudo, perguntar sobre sua situação e abrir o Wonderboard no navegador. Da próxima vez — `/wonderboard` ou simplesmente peça ao Claude para reunir o conselho.

**Requisitos:** Node.js 18+, Claude Code CLI (funciona com a sua assinatura existente — sem chaves de API).

### Tokens

O Wonderboard consome bastante token. Uma sessão completa no Opus: 7 conselheiros × 2 rodadas + entrevista + síntese = 16+ chamadas ao Claude, 300.000+ tokens.

Para explorar a interface sem gastar tokens, use o modo de teste (digite `test question`).

## O Conselho

| | Conselheiro | Perspectiva |
|---|---|---|
| 🎯 | Focalizador | "Jogue fora metade. O que sobrou?" |
| ⚔️ | Estrategista | "Onde lutar, onde recuar?" |
| 💰 | Pragmático | "Me mostra a conta. Onde está a vantagem competitiva?" |
| 🔥 | Cético | "Onde isso quebra? Quem paga pelo erro?" |
| 🔧 | Produto | "O que dá pra entregar em 6 semanas?" |
| 📢 | Marketeiro | "Quem indica isso pra um amigo e por quê?" |
| 🔮 | Visionário | "Como isso vai ser daqui a 10 anos?" |
| 🎩 | Chapeleiro | Entrevista, sintetiza, vira o jogo |

## Como Funciona uma Sessão

1. **Sua pergunta** — sobre o que você precisa de conselho
2. **Entrevista do Chapeleiro** — perguntas de esclarecimento para extrair contexto
3. **Rodada 1** — cada Sábio responde de forma independente + faz sua própria pergunta complementar
4. **Questionário complementar** — o Chapeleiro compila as perguntas dos Sábios num questionário focado
5. **Rodada 2** — os Sábios leem as respostas uns dos outros + as suas, entregam posições finais com planos de ação
6. **Síntese** — o Chapeleiro resume: consensos, discordâncias e um pensamento perpendicular

## Configuração

- `context.md` — sua situação (o Claude pergunta e preenche no primeiro uso, ignorado pelo git)
- `profiles/*.md` — personas dos conselheiros (totalmente editáveis, crie as suas)
- `prompts/*.md` — templates de prompts
- 10 idiomas na interface, detectados automaticamente pelo navegador
- Modo escuro — porque decisões importantes se tomam de noite

## Arquitetura

Zero dependências. Apenas módulos nativos do Node.js.

| Arquivo | O que faz |
|---|---|
| `server.js` | Servidor HTTP, chama o Claude via CLI, lógica de sessão |
| `ui.html` | Interface single-page — sem framework, sem build |
| `profiles/` | Prompts de sistema das personas |
| `prompts/` | Templates de prompts |

Veja [PRINCIPLES.md](PRINCIPLES.md) para a filosofia de design.

## Modo de Teste

Digite `test question` para rodar uma sessão completa com dados simulados. Sem chamadas de API, sem gasto de tokens. Ideal para explorar a interface.

## Licença

[MIT](LICENSE)
