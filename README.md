# ⚡ Empujón Eléctrico (Está mal... pero no tan mal)

**Estudiante:** Santiago Tornau  
**Trabajo Práctico Integrador — Medio término** · Videojuego 2D en Phaser.js  
**Materia:** Desarrollo Tecnológico 2

🎮 **Jugar online:** https://acloshh.github.io/Actividad-MedioTermino-Phaser-Desarrollo-Tecnol-gico/  
📄 **Documento de Diseño de Juego (GDD):** [Docs/GDD.md](Docs/GDD.md)

---

## 📌 Descripción breve del juego

Durante una feroz tormenta eléctrica en la ciudad, peatones distraídos caminan bajo la lluvia sin notar que el suelo se ioniza segundos antes de que caiga un rayo. El jugador controla a un **rescatista con piloto impermeable amarillo** que recorre la zona inundada. No puede detener los rayos, pero puede **hacer sonar su silbato de emergencia** (onda expansiva) o **embestir a la gente** para sacarla del círculo de impacto antes de que un relámpago la carbonice.

Vista desde arriba (*top-down*), partidas dinámicas de tres niveles con dificultad progresiva.

---

## 🧠 Explicación del concepto: “Está mal, pero no tan mal”

Llevarse puesta a una persona de un empujón en plena calle está mal. Aturdirla con un silbatazo de emergencia para que salga corriendo, también. Pero en medio de esta tormenta eléctrica, si el rescatista no la empuja a tiempo, le cae un rayo en la cabeza y la carboniza.

El juego trabaja directamente esta contradicción jugable premiando el empujón **justificado** y penalizando el innecesario:

- **Empujar a un peatón para sacarlo de la zona del rayo** suma **+100 puntos** y cuenta como persona salvada.
- **Embestir a alguien que no estaba en peligro** resta **−20 puntos**.
- **Empujar a alguien hacia adentro de la zona de caída de un rayo** resta **−50 puntos**.

---

## 🕹️ Controles

| Acción | Teclado y mouse | Pantalla táctil |
|---|---|---|
| **Mover al rescatista** | `WASD` o `Flechas` | Joystick virtual (abajo a la izquierda) |
| **Silbato (onda expansiva)** | Clic izquierdo en el suelo libre | Tocar un lugar sin peatones |
| **Embestir a un peatón** | Clic izquierdo sobre una persona | Tocar una persona |

- **Silbato de emergencia:** lanza una onda expansiva celeste que aleja a todos los peatones dentro de su radio. Cuanto más cerca están del rescatista, mayor es el desplazamiento.
- **Embestida de rescate:** el rescatista corre a toda velocidad hacia la persona y la empuja en la dirección que va *desde donde inició la carrera hasta el peatón*. Al chocar rebota hacia atrás para no quedar él mismo dentro del radio del rayo. Luego tiene un breve tiempo de recuperación (visible como un anillo blanco alrededor del personaje).

---

## 🎯 Objetivo del juego

Salvar al menos la **cantidad mínima de peatones requerida en cada nivel** y **sobrevivir con al menos una vida** hasta que pase el frente de tormenta (cuenta regresiva):

- **Nivel 1:** Rescatar al menos **3 / 3** personas y sobrevivir **45 s**.
- **Nivel 2:** Rescatar al menos **5 / 5** personas y sobrevivir **60 s**.
- **Nivel 3:** Rescatar al menos **7 / 7** personas, esquivar al **Dron de Tormenta** y sobrevivir **75 s**.

Las vidas son compartidas entre el rescatista y los peatones: si un rayo alcanza a una persona o al rescatista, se pierde una vida. Si el jugador se queda sin vidas o termina el tiempo sin alcanzar el mínimo de personas rescatadas del nivel, pasa a la pantalla de **Game Over**. Al superar los 3 niveles, alcanza la **Victoria**.

---

## ⚙️ Mecánicas principales

- **Rayos con señal visual de advertencia:** antes de cada descarga aparece en el suelo un círculo celeste ionizado que crece acompañado de un anillo rojo parpadeante. Cuando se completa, cae el relámpago desde el cielo, sacude la cámara y deja una marca de piso carbonizado.
- **Empujar para salvar:** mediante la embestida puntual o la onda del silbato.
- **Recursos recolectables:** baterías pararrayos que suman puntos y paraguas metálicos abiertos que restan puntos.
- **Peligros ambientales:** charcos electrificados en los tres niveles y obstáculos físicos (vallas de emergencia y generadores caídos).
- **Lluvia dinámica e interfaz (HUD):** lluvia continua cuya intensidad sube en cada nivel y barra superior con vidas, nivel actual, reloj, progreso de salvados (`Salvados X/Y`) y puntaje acumulado.

---

## 🌩️ Descripción de los tres niveles

| Nivel | Escenario | Duración | Meta de rescate | Qué cambia |
|---|---|---|---|---|
| **Nivel 1 · Plaza Lluviosa** | 5 peatones, 1 charco electrificado | 45 s | **3 / 3** | Introducción a la mecánica: caídas de rayos espaciadas y advertencia de 1,8 s. |
| **Nivel 2 · Avenida Inundada** | 7 peatones, valla, generador y 2 charcos electrificados | 60 s | **5 / 5** | Más lluvia, hasta 3 rayos simultáneos con menos tiempo de aviso (1,5 s) y obstáculos que bloquean el paso. |
| **Nivel 3 · Epicentro Eléctrico** | 8 peatones, 5 obstáculos, 2 charcos largos y **Dron de Tormenta** | 75 s | **7 / 7** | Máxima intensidad: hasta 4 rayos simultáneos (aviso de 1,25 s) y un **NPC peligroso** que patrulla el escenario. |

El puntaje acumulado, las vidas restantes y el total histórico de personas salvadas se mantienen entre niveles.

---

## ⭐ Objetos o acciones que suman puntos

| Acción / Objeto | Puntos |
|---|---|
| **Salvar a un peatón** (estaba dentro del aviso del rayo, fue empujado y salió antes de la descarga) | **+100** |
| **Recolectar una batería pararrayos** (aparecen periódicamente en los 3 niveles) | **+15** |

---

## ⚠️ Objetos o acciones que restan puntos

| Acción / Objeto | Puntos |
|---|---|
| **Recolectar un paraguas metálico abierto** (conduce la electricidad; aparece en los 3 niveles) | **−25** |
| **Embestir a un peatón que no estaba en peligro** | **−20** |
| **Empujar a un peatón hacia adentro de la zona de un rayo** (con silbato o embestida) | **−50** |

El puntaje nunca baja de cero.

---

## ❤️ Elementos que restan vidas

Se comienza con **3 vidas** (que se mantienen de un nivel al siguiente). Se descuenta **1 vida** cuando:

1. **Un rayo golpea a un peatón** (una vida menos por cada persona carbonizada).
2. **Un rayo golpea al rescatista**.
3. **El rescatista pisa un charco electrificado** (presente en los niveles 1, 2 y 3).
4. **El Dron de Tormenta / Esfera Eléctrica toca al rescatista** (presente en el Nivel 3).

Tras recibir daño, el rescatista parpadea durante 1,5 segundos de invulnerabilidad temporal.

---

## 🧍 Funcionamiento de los NPCs

- **Peatones en peligro (Niveles 1, 2 y 3):** son NPCs no controlados por el jugador que caminan por el escenario con distintos abrigos, alternando caminatas en direcciones aleatorias y breves pausas sin prestar atención a las señales de los rayos. Rebotan contra bordes, obstáculos y otros peatones. Cuando el rescatista los empuja, salen despedidos y se frenan gradualmente por rozamiento (*drag*). Si un rayo los alcanza, quedan carbonizados y tras unos segundos ingresa otro peatón lejos del jugador.
- **Dron de Tormenta / Esfera Eléctrica (NPC obligatorio del Nivel 3):** es un NPC hostil no controlado por el jugador que patrulla el Epicentro Eléctrico a velocidad media, cambiando de rumbo al azar y rebotando contra obstáculos y bordes. Si entra en contacto con el rescatista, le produce una descarga y le descuenta una vida.

---

## 💻 Instrucciones para ejecutar el juego localmente

El proyecto utiliza módulos ES de JavaScript (`type="module"`), por lo que debe servirse mediante un servidor web local (no abriendo `index.html` con doble clic desde `file://`).

1. Clonar o descargar este repositorio y ubicarse en la carpeta del proyecto.
2. Iniciar un servidor HTTP local, por ejemplo con Python:
   ```bash
   python -m http.server 8000
   ```
   *(También puede utilizarse la extensión **Live Server** de Visual Studio Code o `npx serve .`).*
3. Abrir en el navegador: `http://localhost:8000`

No se requiere instalar paquetes adicionales: el motor Phaser se encuentra incluido en `lib/phaser.min.js`.

---

## 🛠️ Tecnologías utilizadas

- **Phaser 3.90.0** (Física Arcade, sistema de escenas, *tweens*, cámaras, audio y escalado multidispositivo `Phaser.Scale.FIT`).
- **JavaScript ES6+** (Módulos nativos, organización modular bajo principios SOLID, todos los archivos de menos de 200 líneas).
- **HTML5 Canvas / WebGL**.
- **GitHub Pages** para el despliegue web.
