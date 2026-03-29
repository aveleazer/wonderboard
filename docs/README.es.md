🌐 [English](../README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

7 asesores de IA que discrepan contigo y entre ellos.

> *"La única herramienta que te dice lo que no quieres escuchar."*

## El problema

Le haces una pregunta a la IA. Recibes una respuesta. Educada, equilibrada, promediada. Nadie dice "esto va a fracasar". Nadie pregunta "¿por qué siquiera estás haciendo esto?". Nadie sugiere la alternativa disparatada que no habías considerado.

En la vida real, las mejores decisiones nacen de discusiones entre personas que piensan distinto. Wonderboard crea esa discusión.

## En qué se diferencia de simplemente preguntarle a Claude

**Aislamiento.** Cada asesor piensa de forma independiente, en una llamada separada a Claude. Cuando un solo prompt intenta ser escéptico y visionario a la vez, el resultado es una papilla. Cuando están aislados, obtienes desacuerdo real.

**Dos rondas.** En la ronda 1, los asesores responden sin ver las opiniones de los demás. En la ronda 2, leen todas las respuestas, discuten y cambian de posición. El Pragmático retira una recomendación porque el Visionario lo convenció. El Escéptico refuerza el argumento del Focalizador. Esto no se consigue con un solo prompt.

**Entrevista.** El Sombrerero hace preguntas de contexto antes de convocar la Junta. No vas a recibir siete respuestas a una pregunta mal planteada.

**Contexto.** En el primer uso, Claude pregunta sobre tu situación y la guarda. Todos los asesores reciben ese contexto automáticamente — no hace falta volver a explicar quién eres cada vez.

**Síntesis ≠ promediar.** El Sombrerero no busca el consenso. Mapea los desacuerdos: en qué convergieron, en qué divergieron, por qué — y añade un pensamiento perpendicular que le da la vuelta a la situación.

## Ejemplos de preguntas

Wonderboard no se limita a los negocios. Es una herramienta para cualquier decisión que necesite polifonía:

🏢 **Estrategia.** "Tengo 5 productos y una sola persona. ¿Qué elimino y qué conservo?"

🚀 **Lanzamiento.** "Quiero entrar en el mercado estadounidense con un producto que solo es popular en mi país."

💰 **Dinero.** "Recibí una oferta de un inversor. ¿La acepto o sigo con bootstrapping?"

🧠 **Carrera.** "Tengo 35 años y estoy harto del empleo. ¿Me lanzo por mi cuenta o no?"

🏗️ **Arquitectura.** "¿Monolito o microservicios para un proyecto a 3 años?"

📝 **Contenido.** "Tengo un portal con 30.000 artículos. ¿Cómo no destrozarlo durante una migración de plataforma?"

🤝 **Negociación.** "El cliente quiere un 40% de descuento. ¿Qué hago?"

## Instalación

Pega esto en Claude Code:

```
Clone https://github.com/aveleazer/wonderboard and run install.sh
```

Claude lo configurará, te preguntará sobre tu situación y abrirá Wonderboard en tu navegador. La próxima vez: `/wonderboard` o simplemente pídele a Claude que convoque la junta.

**Requisitos:** Node.js 18+, Claude Code CLI (funciona con tu suscripción actual — no se necesitan claves de API).

### Tokens

Wonderboard consume muchos tokens. Una sesión completa en Opus: 7 asesores × 2 rondas + entrevista + síntesis = más de 16 llamadas a Claude, más de 300.000 tokens.

Para explorar la interfaz sin gastar tokens, usa el modo de prueba (escribe `test question`).

## La Junta

| | Asesor | Enfoque |
|---|---|---|
| 🎯 | Focalizador | "Descarta la mitad. ¿Qué queda?" |
| ⚔️ | Estratega | "¿Dónde pelear, dónde retirarse?" |
| 💰 | Pragmático | "Enséñame la rentabilidad unitaria. ¿Dónde está la ventaja competitiva?" |
| 🔥 | Escéptico | "¿Dónde se rompe esto? ¿Quién paga el error?" |
| 🔧 | Producto | "¿Qué puedes lanzar en 6 semanas?" |
| 📢 | Marketero | "¿Quién le cuenta esto a un amigo y por qué?" |
| 🔮 | Visionario | "¿Cómo se ve esto en 10 años?" |
| 🎩 | Sombrerero | Entrevista, sintetiza, le da la vuelta al tablero |

## Cómo funciona una sesión

1. **Tu pregunta** — sobre qué necesitas asesoramiento
2. **Entrevista del Sombrerero** — preguntas de contexto para extraer información clave
3. **Ronda 1** — cada Sabio responde de forma independiente + hace su propia pregunta de seguimiento
4. **Cuestionario de seguimiento** — el Sombrerero recopila las preguntas de los Sabios en una encuesta enfocada
5. **Ronda 2** — los Sabios leen las respuestas de los demás + las tuyas, y entregan posiciones finales con planes de acción
6. **Síntesis** — el Sombrerero resume: consensos, desacuerdos y un pensamiento perpendicular

## Configuración

- `context.md` — tu situación (Claude pregunta y lo rellena en el primer uso, incluido en gitignore)
- `profiles/*.md` — personalidades de los asesores (totalmente editables, puedes añadir las tuyas)
- `prompts/*.md` — plantillas de prompts
- 10 idiomas en la interfaz, detectados automáticamente desde el navegador
- Modo oscuro — porque las decisiones importantes se toman mejor de noche

## Arquitectura

Cero dependencias. Solo módulos nativos de Node.js.

| Archivo | Qué hace |
|---|---|
| `server.js` | Servidor HTTP, llama a Claude vía CLI, lógica de sesión |
| `ui.html` | Interfaz de página única — sin framework, sin paso de compilación |
| `profiles/` | System prompts de cada personalidad |
| `prompts/` | Plantillas de prompts |

Consulta [PRINCIPLES.md](PRINCIPLES.md) para la filosofía de diseño.

## Modo de prueba

Escribe `test question` para ejecutar una sesión completa con datos simulados. Sin llamadas a la API, sin gasto de tokens. Ideal para explorar la interfaz.

## Licencia

[MIT](LICENSE)
