# Documento de Diseño de Juego (GDD)

## ⚡ EMPUJÓN ELÉCTRICO (ESTÁ MAL... PERO NO TAN MAL)

**Trabajo Práctico Integrador — Medio término**  
**Materia:** Desarrollo Tecnológico 2  
**Profesores:** Nocete, Nicolás - Galván, Agustín  
**Estudiante:** Tornau, Santiago

---

## Índice

1. High Concept y Temática
2. Dirección de Arte y Escalado Multidispositivo
3. Mecánicas Principales
   - 3.1. Tipo de Física
   - 3.2. Escenario, Recursos y Peligros
   - 3.3. Actores
   - 3.4. Acciones del Personaje Jugador
   - 3.5. Estados del Personaje Jugador
4. Inteligencia Artificial y NPCs
   - 4.1. Peatones en peligro
   - 4.2. Dron de Tormenta (NPC peligroso del Nivel 3)
   - 4.3. Rayos que caen con advertencia
5. Reglas de Juego
   - 5.1. Sistema de Puntos (Suman y Restan)
   - 5.2. Sistema de Vidas
   - 5.3. Condición de Avance, Victoria y Derrota
6. Diseño de los Tres Niveles
7. Interfaz (HUD) y Flujo de Escenas
8. Sonido
9. Controles

---

## 1. High Concept y Temática

**Disparador conceptual:** “Está mal, pero no tan mal”.

**Concepto general:**  
Videojuego de acción arcade 2D con vista cenital (*top-down*) desarrollado en Phaser.js. En medio de un temporal eléctrico severo, el jugador controla a un **rescatista con piloto impermeable amarillo** que patrulla distintos puntos de la ciudad. Peatones distraídos caminan bajo la lluvia sin advertir que el suelo se carga de estática antes de que caiga un rayo. El rescatista no puede evitar que caigan los rayos, pero puede **empujar a las personas con una embestida** o **aturdirlas con su silbato de emergencia** para correrlas de la zona de impacto justo a tiempo.

Empujar a un desconocido en la calle está mal. Pero si gracias a ese empujón se salva de que le caiga un rayo en la cabeza y lo carbonice, entonces no está tan mal.

**Pilares de diseño:**

- **Anticipación y tensión:** cada rayo anuncia su caída con un círculo ionizado celeste que crece y un anillo rojo que titila; el jugador cuenta con pocos segundos para reaccionar.
- **Acción justificada:** el juego distingue entre empujar para salvar (+100 puntos) y empujar sin necesidad (−20 puntos) o hacia el peligro (−50 puntos).
- **Claridad y progresión:** tres niveles con metas claras de rescate (`3/3`, `5/5` y `7/7`), dificultad creciente y una interfaz superior limpia.

---

## 2. Dirección de Arte y Escalado Multidispositivo

- **Estilo visual:** sprites 2D vistos desde arriba con alto contraste sobre el pavimento mojado para que las zonas de peligro, los peatones y los recursos se reconozcan al instante bajo la lluvia.
- **Resolución base y escalado:** 960 × 540 píxeles (relación 16:9) con `Phaser.Scale.FIT` y `Phaser.Scale.CENTER_BOTH`, adaptándose a cualquier resolución de escritorio o dispositivo móvil sin recortar el área jugable.
- **Paleta cromática:** pavimento húmedo en tonos azul pizarra cada vez más oscuros según la intensidad de la tormenta; amarillo impermeable para identificar rápidamente al jugador; celeste eléctrico para el silbato, la lluvia y la estática; verde para recursos positivos (baterías) y rojo para amenazas (anillos de rayo, paraguas metálicos, dron hostil).
- **Feedback visual:** cortina de lluvia en movimiento, haz luminoso del relámpago, sacudida de cámara (*shake*) en cada descarga, marca de piso carbonizado, destello rojo al perder vida, textos flotantes (`+100`, `+15`, `−25`, `−20`, `−50`) y onda expansiva del silbato.

---

## 3. Mecánicas Principales

### 3.1. Tipo de Física
Física **Arcade** de Phaser sin gravedad (movimiento 2D en plano cenital). El rescatista, los peatones y el Dron de Tormenta utilizan cuerpos de colisión circulares; las vallas y generadores utilizan cuerpos estáticos rectangulares. Al recibir un empujón, los peatones adquieren velocidad y desaceleran progresivamente mediante rozamiento (*drag*).

### 3.2. Escenario, Recursos y Peligros
- **Baterías pararrayos (suman puntos):** aparecen periódicamente en puntos libres del escenario en los 3 niveles. Al recogerlas otorgan **+15 puntos**.
- **Paraguas metálicos abiertos (restan puntos):** aparecen en el suelo en los 3 niveles; por ser conductores peligrosos en plena tormenta, recogerlos resta **−25 puntos**.
- **Charcos electrificados (restan vidas):** zonas de agua con arcos voltaicos presentes en los 3 niveles. Si el rescatista los pisa, recibe una descarga y pierde **1 vida**.
- **Vallas de emergencia y generadores (obstáculos):** presentes en los niveles 2 y 3, bloquean el paso y obligan a maniobrar alrededor de las zonas de impacto.

### 3.3. Actores
- **Rescatista (Jugador):** personaje controlable con impermeable amarillo.
- **Peatones (NPCs en peligro):** cinco variantes visuales que caminan distraídas bajo la lluvia.
- **Dron de Tormenta / Esfera Eléctrica (NPC peligroso del Nivel 3):** patrulla de forma autónoma y quita una vida al contacto con el jugador.

### 3.4. Acciones del Personaje Jugador
- **Moverse:** en 8 direcciones con `WASD` / flechas o joystick virtual táctil.
- **Silbato de emergencia (clic en el suelo):** emite una onda expansiva de 225 px de radio que desplaza a los peatones cercanos alejándolos del rescatista. No penaliza si se usa para reubicar gente a salvo, salvo que empuje a alguien hacia un rayo activo.
- **Embestida (clic sobre un peatón):** el rescatista corre velozmente hacia la persona elegida y la empuja en la dirección de la carrera. Al impactar, el rescatista rebota hacia atrás para quedar fuera del área del rayo y entra en un enfriamiento de 1,4 s.

### 3.5. Estados del Personaje Jugador
- **Normal:** puede moverse, usar el silbato y embestir.
- **Embistiendo:** carrera rápida hacia el peatón objetivo (máximo 0,45 s).
- **Rebotando:** retroceso automático de 0,22 s tras el choque.
- **En enfriamiento de embestida:** puede moverse y usar el silbato mientras se completa el anillo indicador.
- **Invulnerable:** parpadea durante 1,5 s luego de perder una vida para evitar daño múltiple instantáneo.

---

## 4. Inteligencia Artificial y NPCs

### 4.1. Peatones en peligro
Cuentan con tres estados:
- **Caminando:** cada 1,2 a 3,5 s eligen caminar en una dirección aleatoria (45 px/s) o detenerse brevemente (35 % de probabilidad).
- **Empujado:** se desplazan por la fuerza del silbato o la embestida y frenan por rozamiento hasta retomar la caminata normal.
- **Carbonizado (Lastimado):** si un rayo impacta en su posición, se oscurecen, caen y desaparecen; luego de 1,8 s ingresa un nuevo peatón lejos del rescatista.

### 4.2. Dron de Tormenta (NPC peligroso del Nivel 3)
NPC no controlado por el jugador que aparece en el Nivel 3. Se desplaza a 95 px/s rotando sobre su eje, cambia de dirección aleatoriamente cada 0,8 a 2 s y rebota en bordes y obstáculos. Si toca al rescatista, le descuenta **1 vida**.

### 4.3. Rayos que caen con advertencia
- **Generación:** aparecen a intervalos regulares según el nivel, apuntando cerca de algún peatón con alta probabilidad (75 % a 85 %).
- **Advertencia visual:** círculo celeste que se expande hasta el radio de impacto junto con un anillo rojo parpadeante (entre 1,8 s en el Nivel 1 y 1,25 s en el Nivel 3).
- **Impacto y rescate:** cae el relámpago, sacude la cámara y carboniza a quien siga dentro del círculo. Si un peatón estuvo dentro del círculo, fue empujado por el jugador y logró salir antes de la descarga, se contabiliza como **rescate exitoso (+100 puntos y +1 salvado)**.

---

## 5. Reglas de Juego

### 5.1. Sistema de Puntos (Suman y Restan)

| Acción u objeto | Puntos |
|---|---|
| Rescatar a un peatón de la caída de un rayo | **+100** |
| Recolectar una batería pararrayos | **+15** |
| Recolectar un paraguas metálico abierto | **−25** |
| Embestir a un peatón que no estaba en peligro | **−20** |
| Empujar a un peatón hacia la zona de un rayo | **−50** |

El puntaje nunca baja de 0 y se acumula de un nivel al siguiente.

### 5.2. Sistema de Vidas
El jugador comienza en el Nivel 1 con **3 vidas** que se mantienen entre niveles. Se pierde **1 vida** cuando:
- Un rayo alcanza a un peatón.
- Un rayo alcanza al rescatista.
- El rescatista pisa un charco electrificado (presente en los 3 niveles).
- El rescatista entra en contacto con el Dron de Tormenta (Nivel 3).

### 5.3. Condición de Avance, Victoria y Derrota
- **Avanzar de nivel:** alcanzar o superar la meta de personas rescatadas del nivel (`3/3` en Nivel 1, `5/5` en Nivel 2, `7/7` en Nivel 3) y resistir hasta que el reloj llegue a 0 con al menos 1 vida.
- **Victoria:** completar el Nivel 3 cumpliendo su meta de rescate y sobreviviendo al tiempo.
- **Derrota (Game Over):** quedarse sin vidas en cualquier momento, o que termine el tiempo de un nivel sin haber alcanzado la cantidad mínima de personas salvadas.

---

## 6. Diseño de los Tres Niveles

| Característica | Nivel 1 · Plaza Lluviosa | Nivel 2 · Avenida Inundada | Nivel 3 · Epicentro Eléctrico |
|---|---|---|---|
| **Duración** | 45 s | 60 s | 75 s |
| **Meta de salvados** | **3 / 3** | **5 / 5** | **7 / 7** |
| **Peatones simultáneos** | 5 | 7 | 8 |
| **Frecuencia de rayos** | cada 2,5 s | cada 1,95 s | cada 1,55 s |
| **Tiempo de advertencia** | 1,8 s | 1,5 s | 1,25 s |
| **Rayos simultáneos (máx.)** | 2 | 3 | 4 |
| **Recursos (+ y − puntos)** | Baterías (+15) y Paraguas (−25) | Baterías (+15) y Paraguas (−25) | Baterías (+15) y Paraguas (−25) |
| **Charcos electrificados** | 1 | 2 | 2 (extendidos) |
| **Obstáculos físicos** | — | 1 valla, 1 generador | 3 vallas, 2 generadores |
| **NPC enemigo** | — | — | **Dron de Tormenta** |

---

## 7. Interfaz (HUD) y Flujo de Escenas

- **BootScene:** precarga los archivos de audio y da inicio a `MenuScene`.
- **MenuScene:** título del juego (*Empujón Eléctrico*), subtítulo del disparador conceptual, resumen de controles y reglas, nombre del autor y botón **JUGAR**.
- **Level1Scene, Level2Scene, Level3Scene:** heredan de `BaseLevelScene` e inyectan la configuración de `src/config/levels.js`.
- **HudScene:** corre en paralelo en la parte superior mostrando corazones de vida, nombre del nivel, cuenta regresiva, indicador de meta `Salvados X/Y` (cambia a verde al cumplirse) y puntaje acumulado.
- **GameOverScene:** informa el motivo de la derrota (sin vidas o meta de rescate incompleta), el puntaje final, el total de personas salvadas y botones **REINTENTAR** y **MENÚ**.
- **VictoryScene:** muestra el mensaje de victoria, puntaje final acumulado, total de personas salvadas, vidas restantes y botones **REINTENTAR** y **MENÚ**.

---

## 8. Sonido

- **Música de fondo:** pista continua en bucle durante la partida.
- **Efectos de sonido:** silbato de emergencia (tres variaciones), impulso de embestida, estruendo de trueno al caer cada rayo, descarga eléctrica en charcos y dron, sonido de rescate exitoso, recolección de batería, penalización de puntos y clic de interfaz.

---

## 9. Controles

| Acción | Teclado y Mouse | Dispositivo Táctil |
|---|---|---|
| Desplazamiento | `WASD` o teclas de dirección | Joystick virtual en esquina inferior izquierda |
| Silbato (onda en área) | Clic izquierdo en zona libre | Toque en zona libre |
| Embestida (empujón directo) | Clic izquierdo sobre un peatón | Toque sobre un peatón |
