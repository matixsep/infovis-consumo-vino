# Consumo de vino y cerveza en Chile · Visualización de información

Proyecto del curso Visualización de Información (IIC2026) — Pontificia Universidad Católica de Chile.

El proyecto se entregó en dos etapas:

- **Entrega 1 · pantalla.** Visualización interactiva y sonora del consumo de vino (V1–V4).
- **Entrega 2 · físico-digital.** La misma idea pasa al mundo físico: un vaso conectado a un sensor de nivel (Arduino) controla la visualización, que ahora compara vino y cerveza en Chile entre 1972 y 2022.

**Pregunta que responde la versión final (Entrega 2):** ¿Dejamos de tomar o cambiamos de trago? — es decir, cómo evolucionó el consumo registrado de vino y de cerveza en Chile entre 1972 y 2022.

**Pregunta de la Entrega 1:** ¿Cómo ha cambiado el consumo de vino en Chile entre 1963 y 2022, y cómo se compara con el de otros países?

**Propósito:** mixto. Explicativo, porque respalda una conclusión (el vino cae un 80,2 % entre 1972 y 2022); y exploratorio, porque el usuario recorre los años y compara las dos bebidas. La visualización no permite concluir cuánto se bebe en total ni por qué cambió el consumo.

**Audiencia:** público general con lectura básica de gráficos, sin formación en estadística.

## Demo

| Versión | Enlace | Commit / tag |
|---|---|---|
| V1 | https://matixsep.github.io/infovis-consumo-vino/V1.html | v1 |
| V2 | https://matixsep.github.io/infovis-consumo-vino/V2.html | v2 |
| V3 | https://matixsep.github.io/infovis-consumo-vino/V3.html | v3 |
| V4 (final E1) | https://matixsep.github.io/infovis-consumo-vino/V4.html | v4 |
| V4 (editada para R2) | https://matixsep.github.io/infovis-consumo-vino/V4_2.html | v4_2 |
| V4 (editada para R3) | https://matixsep.github.io/infovis-consumo-vino/V4_3.html | v4_3 |
| **Versión final E2** | https://matixsep.github.io/infovis-consumo-vino/VersionFinal/ | — |

## Datos

Dos archivos del indicador de consumo registrado de alcohol por tipo de bebida (OMS), distribuidos por Our World in Data:

| Bebida | Fuente | Archivo |
|---|---|---|
| Vino | wine-consumption-per-capita | `wine-consumption-per-capita(1).csv` — 10.598 observaciones, 187 entidades, 1960–2022 |
| Cerveza | beer-consumption-per-person | `beer-consumption-per-person.csv` — 10.598 observaciones, 187 entidades, 1963–2022 |

**Unidad:** litros de alcohol puro por persona de 15 años o más, al año, atribuidos a cada bebida. No son litros de bebida servida, ni número de copas, ni consumo por persona bebedora. Como referencia, 1 L de alcohol puro equivale a unas 10 botellas de vino o 57 latas de cerveza.

- **Recorte de la Entrega 2:** solo Chile, 1972–2022 (51 años), sin interpolar. Los valores de la versión final están en `V5_modificado.html`.
- Máximo del archivo de vino: 20,56 L. Por eso el audio usa un dominio fijo de 0–21 L. Los vasos digitales usan 0–10 L, una escala común para ambas bebidas.
- La cobertura varía entre países y años. Ausencia de dato no equivale a cero: ambas cosas se distinguen en pantalla (hueco) y en el audio (las dos son silencio).
- El mínimo del vino en la serie chilena es 2017, no 2022. Los datos y el audio van incrustados en cada HTML.

## Prototipo físico (Entrega 2)

### Cómo funciona

1. El usuario sirve líquido lentamente en el vaso de vino, que es el que está conectado al sensor de nivel. El vaso de cerveza, sin sensor, sirve de comparación física en cada marca.
2. Un Arduino envía la lectura al computador por puerto serie (9600 baudios, un valor por línea) y la página la recibe con Web Serial.
3. El nivel del líquido recorre los años: la marca de 2022 equivale a 25,7 ml y la de 1972 a 130 ml. Entre las dos marcas el nivel solo selecciona el año.
4. En paralelo, un buzzer en el propio montaje marca un **ritmo** que se acelera a medida que sube el nivel: es la señal física inmediata, independiente del computador.
5. La pantalla muestra, para ese año, dos vasos digitales (vino y cerveza) en una misma escala de 0 a 10 L de alcohol puro, la serie completa 1972–2022 y un brindis que codifica el dato del vino.

El volumen servido es un **control narrativo, no una medida**: no representa litros ni se afirma que el consumo cambiara linealmente entre las marcas. La proporción la llevan los vasos digitales, que parten de cero y comparten escala.

### Materiales

- **Arduino Uno** (se descartó un Arduino Leonardo tras dañarse su conversor analógico-digital durante el montaje).
- **Sensor de nivel de agua analógico** de tira resistiva (módulo de 3 pines: `S`, `+`, `−`). Lectura en **A0**; alimentación desde el **pin digital 7**, que se enciende solo durante la medición en las primeras versiones del sketch para reducir la corrosión; **GND** común.
- **Buzzer activo** en el **pin 8**.
- Protoboard y cables jumper.
- Dos vasos plásticos transparentes iguales, uno con dos marcas (2022 y 1972), montados sobre una caja de cartón que oculta la electrónica.
- Computador con Chrome o Edge.
- **Líquido para servir:** vino diluido en agua. Calibrar siempre con el mismo líquido que se usará en la demostración (ver "Hallazgos del prototipado").

### Calibración y lectura

- **Lectura estable:** mediana de una ventana de 250 ms, para filtrar el ruido del sensor sin introducir retardo perceptible.
- **Nivel acumulativo:** el nivel mostrado solo avanza. El sensor deriva hacia abajo después de alcanzar un nivel, y sin esta regla el relato retrocedía solo. El botón *Reiniciar* lo devuelve a cero.
- **Calibración de tres puntos en dos tramos:** se registran las lecturas al tocar el líquido, en la marca de 2022 y en la marca de 1972. Los dos tramos resultantes compensan la fuerte respuesta no lineal del sensor.
- Un panel de configuración permite autorizar el puerto, copiar la lectura actual a cada punto y escuchar los recorridos de vino y cerveza.
- **Prueba manual:** un deslizador simula el vertido sin necesidad de sensor.

### Hallazgos del prototipado

Tres comportamientos del hardware obligaron a cambiar decisiones de diseño y quedan documentados porque explican la forma final:

1. **El buzzer disponible resultó ser activo**, es decir, de frecuencia fija: `tone()` no puede variar su altura. El parámetro de sonificación del montaje físico pasó entonces de **tono a ritmo** (más lleno, más rápido). El tono se conserva solo en la capa digital, donde sí hay síntesis.
2. **El sensor es marcadamente no lineal.** En la calibración final, del primer contacto a la marca de 2022 (26 ml) la lectura sube unos 360 puntos, y de ahí a la marca de 1972 (130 ml) sube solo unos 85. Casi todo su rango se consume en los primeros milímetros, de modo que los mililitros intermedios son aproximados; los exactos son los de las dos marcas.
3. **La lectura deriva y el valor estabilizado no discrimina.** Al alcanzar un nivel el sensor marca un máximo y luego cae lentamente; tras estabilizarse, dos niveles distintos pueden dar el mismo número. Por eso la referencia es el máximo alcanzado y no el valor en reposo, y por eso se recomienda servir de forma continua.

Además, **el líquido cambia la respuesta**: el vino conduce bastante más que el agua y desplaza toda la escala hacia arriba, lo que obliga a recalibrar al cambiar de líquido.

### Limitaciones

- Se comparan solo dos bebidas: no es válido inferir el consumo total de alcohol ni las causas de las variaciones.
- La respuesta del sensor depende del líquido y debe recalibrarse en cada montaje.
- Los mililitros intermedios entre las dos marcas son aproximados por la no linealidad del sensor.
- Las pruebas de usuario se hicieron con una sola persona.

## Historial de versiones — Entrega 2 (físico-digital)

### V1 — La idea completa, aunque simulada

Una barra de LEGO movida por un servo (cada 1 cm = 1 L) y una perilla para elegir un año en cada costado. El brindis codificaba el consumo con el tono, más agudo a mayor consumo. La conexión Arduino–computador se simulaba: se priorizó validar la idea completa a baja fidelidad antes de invertir en la electrónica.

### V2 — Vasos con agua

R1 (equipo docente): la barra repetía la altura del gráfico y el tono agudo era mejor para cantidades menores. Cambios: se elimina la barra con servo; la cantidad de agua en vasos representa el consumo (aproximada, sin balanza); el tono se invierte a grave = más consumo, con escala de raíz cuadrada de ±1,5 octavas.

### V3 — Copas plásticas y balanza

R2 (entre pares): la perilla era reemplazable por la pantalla. Cambios: desaparecen la perilla y las piezas de LEGO; se comparan solo dos años, el máximo (1972, 9,79 L) y el mínimo (2017, 1,04 L), con botones de atajo. Una balanza hace proporcional el volumen servido a los litros (9,79 L = copa de 200 ml llena).

### V4 — Un vaso con sensor, dos bebidas, 51 años (versión final)

R3 (equipo docente): faltaban instrucciones y una interacción completa entre sensor y computador, y el profesor pidió que el usuario se llevara algo más de la experiencia. Evaluación con usuarios: la persona no sabía qué hacer, no leía los textos pequeños y concluyó que "los chilenos toman menos ahora que antes", algo que una sola serie no permite afirmar.

**Qué cambió.**

- Sensor de nivel con Arduino reemplaza la balanza, que no enviaba señales rápidas y precisas al computador.
- Un solo vaso controla el tiempo, no el valor. El nivel recorre los años y los vasos digitales entregan el dato exacto con escala común desde cero.
- Se agrega la cerveza y se pasa de dos años extremos a los 51 años. El título pasa a ser una pregunta: ¿Dejamos de tomar o cambiamos de trago?
- Texto más grande e instrucciones antes de empezar, más «Qué se mide» y «Cómo leerlo».
- El brindis usa una escala única de 0 a 21 L para ambas bebidas. Más grave y más largo con más litros. Vino por defecto; la cerveza se escucha desde la configuración.
- Se descarta la copa cónica en favor de un vaso de paredes casi rectas: en un cono el volumen crece con el cubo de la altura, de modo que el 19,7 % del volumen se lee a un 58 % de la altura (factor de mentira ≈ 3). En el vaso usado la distorsión baja a ≈ 1,3.
- En el montaje físico el buzzer sonifica por ritmo, por la razón explicada en "Hallazgos del prototipado".
- Cada gota produce un cambio inmediato en pantalla, en respuesta a la evaluación con usuarios.

**Qué se descartó.** Balanzas y detección con el celular (no enviaban señales precisas); las dos copas con extremos fijos; que el volumen servido fuera proporcional al consumo; interpolar años sin dato; una propuesta de autos de juguete que chocaban al llegar a cada marca, porque sugería una relación causal entre consumo de vino y accidentes que los datos no respaldan.

**Qué se mantuvo.** El brindis como icono auditivo con lo grave para más consumo; el acto de servir como interacción central; la escala común desde cero y la unidad (litros de alcohol puro por persona de 15 años o más).

### Resumen de la evolución — Entrega 2

| | V1 | V2 | V3 | V4 (final) |
|---|---|---|---|---|
| Qué se fisicaliza | Barra LEGO con servo | Agua en vasos | Copas con balanza | Tiempo: el nivel del vaso recorre los años |
| Control del año | Perilla | Perilla | Botones en pantalla | Nivel del líquido (sensor) |
| Datos | Vino | Vino | Vino, 2 años extremos | Vino y cerveza, 1972–2022 |
| Sensor | Ninguno (simulado) | Ninguno | Balanza (sin conexión) | Sensor de nivel + Arduino (Web Serial) |
| Sonido en el montaje | — | — | — | Buzzer por ritmo |
| Tono del brindis | Agudo = más | Grave = más | Grave = más | Grave = más y más largo; escala 0–21 L |

## Historial de versiones — Entrega 1 (pantalla)

### V1 — Mapa coroplético mundial

**Qué era.** Mapa del mundo con Plotly 3.3.1. El consumo se codificaba en la intensidad de color (escala de rosados a burdeo), con un slider de año 1960–2022. Al hacer clic en un país se llenaba una copa de vino en pantalla y sonaba una grabación de vertido cuya duración (0,45 a 4,50 s) dependía del consumo.

**Pregunta que respondía.** ¿Dónde se consume vino? — una pregunta espacial.

**Problemas detectados.**

- La escala de color se recalculaba cada año. El código fijaba `zmax: maxValue(year)`, es decir, el máximo del año consultado. El mismo burdeo significaba 20 L en 1960 y mucho menos en 2022. Como el slider invita precisamente a comparar entre años, la visualización rompía la comparación que ella misma proponía.
- El color es un canal de baja precisión. En la jerarquía de Cleveland y McGill, la posición sobre una escala común es el canal más preciso y la intensidad de color está entre los menos precisos. El color sirve bien para identidad (categorías), no para cantidad.
- La duración del sonido también era relativa al año. Se mapeaba el porcentaje respecto del máximo del año, con el mismo defecto del punto 1.
- La copa que se llenaba era decoración. Codificaba el mismo dato una segunda vez en un canal peor (área/altura de líquido) y no agregaba información: razón dato-tinta baja.

### V2 — Series de tiempo en paneles (small multiples)

**Qué cambió.**

- Cambia la pregunta, de *dónde* a *cómo ha cambiado en el tiempo y respecto de quién*. Al cambiar la pregunta, cambia la codificación.
- Mapa → gráfico de líneas. El consumo pasa de codificarse en color a codificarse en posición sobre una escala común: el canal más preciso de la jerarquía. El tiempo se codifica en posición horizontal.
- Dominio fijo 0–21 L, idéntico para todos los países y todos los años. Una misma altura significa siempre la misma cantidad.
- Eje vertical desde 0. Al no truncar el eje, el efecto visual coincide con el efecto real (factor de mentira ≈ 1).
- Se elimina la copa que se llenaba y el resto del chartjunk.
- Los huecos de datos se dibujan como huecos, no se interpolan: la línea se corta donde no hay dato.
- Sonificación absoluta. El vertido pasa a durar 0,35 + 4,15 · v / 21 segundos, es decir, 0,35 s a 4,5 s mapeados al valor en litros, igual para todos los países y años. Cero y "sin dato" son silencio, y se distinguen en pantalla.
- Se agrega selector de período, lectura del año bajo el cursor y recorrido sonoro por período.

**Qué quedó pendiente.** Cada país de comparación tenía su propio panel. Aunque todos compartían la escala, comparar exigía mover la vista de un panel a otro y recordar alturas, en vez de leerlas juntas.

### V3 — Un solo gráfico multilínea

**Qué cambió.**

- Paneles separados → una sola área de dibujo. Todas las series se superponen en los mismos ejes. Ahora la comparación entre países es una lectura directa de posición sobre una escala común, sin memoria visual de por medio.
- Codificación redundante para accesibilidad. Cada serie se distingue por color y a la vez por patrón de línea (`#8d2247` continua para el país principal; `#0072b2`, `#d55e00` y `#00836e` con distintos guiones para las comparaciones). La paleta es segura para daltonismo y, aunque el color no se distinga, el patrón sigue separando las series.
- La serie principal se dibuja al final, para que no quede tapada en los cruces.
- Anotaciones con halo blanco (`paint-order: stroke`) en el máximo de 1972 (9,79 L) y en 2022 (1,93 L), legibles sobre las líneas.
- El título pasa de conclusión a pregunta. De «Chile registra un 80,2 % menos…» a «¿Cómo ha cambiado el consumo de vino en Chile y cómo se compara con otros países?», acorde al propósito mixto: la conclusión sigue estando, pero baja al subtítulo.

### V4 — Sonificación por tono y lista de valores (versión final de la Entrega 1)

**Qué cambió.**

**1. El parámetro sonoro pasa de duración a tono.** Es el cambio principal de la versión.

- *Problema de la duración.* El mapeo lineal 0–21 L → 0,35–4,5 s daba unos 0,2 s por litro. El recorrido completo de Chile (1,93 a 9,79 L) ocupaba apenas entre 0,7 y 2,3 s, y en países de consumo bajo la diferencia entre un año y otro quedaba por debajo del umbral perceptible. Además, en el recorrido por período las muestras arrancaban cada 4,8 s fijos, de modo que la duración de cada una casi no se notaba.
- *Por qué tono.* Entre los parámetros de mapeo (tono, volumen, ritmo, timbre, duración), el tono es el que mejor resuelve diferencias pequeñas. El volumen es el más débil, porque depende del dispositivo y del ambiente de escucha, así que queda fuera de la codificación y es solo un control del usuario.
- *Escala comprimida (raíz cuadrada).* El rango va de −18 a +18 semitonos (una octava y media hacia cada lado), con el tono original alrededor de 5,3 L. Entre 0 y 5 L cada litro cambia el tono entre 3 y 8 semitonos; sobre 10 L, poco más de 1 semitono por litro. Dos razones: la percepción de altura tonal es aproximadamente logarítmica respecto de la frecuencia, y los datos están fuertemente concentrados en valores bajos, de modo que un mapeo lineal desperdiciaba casi todo el rango audible.
- *Recorrido encadenado.* Cada muestra empieza apenas termina la anterior más una pausa breve, en lugar de la grilla fija de 4,8 s.

**2. Cambia el icono auditivo.** De una grabación de vertido de líquido a un brindis con copas de vidrio. El brindis tiene un ataque tonal claro, que es lo que permite percibir el cambio de tono; un vertido alterado en tono suena artificial.

**3. Se agrega una lista de valores ordenada,** con barras proporcionales y transición animada al cambiar de año. Aporta el ranking y el valor exacto (detalles bajo demanda) sin recargar el gráfico.

**4. Se elimina el botón «Comparar Chile: 1972 y 2022»,** porque con tono el contraste entre ambos años se escucha directamente en cualquier recorrido.

**Limitación conocida.** El audio de V2 y V3 era CC0 verificado (Freesound 579752). El brindis de V4 proviene de un archivo cuyos metadatos indican autor y título, pero cuya licencia no está verificada. Queda declarado en el pie de página.

### Resumen de la evolución — Entrega 1

| | V1 | V2 | V3 | V4 |
|---|---|---|---|---|
| Tipo de gráfico | Mapa coroplético | Líneas en paneles | Líneas superpuestas | Líneas superpuestas + lista |
| Canal para el consumo | Color (intensidad) | Posición | Posición | Posición |
| Escala | Relativa al año | 0–21 L fija | 0–21 L fija | 0–21 L fija |
| Comparación entre países | Visual, por color | Entre paneles | Directa, mismos ejes | Directa + ranking |
| Parámetro sonoro | Duración (relativa) | Duración (absoluta) | Duración (absoluta) | Tono (comprimido) |
| Sonido | Vertido | Vertido (CC0) | Vertido (CC0) | Brindis |
| Tecnología | Plotly 3.3.1 | SVG a mano + Web Audio | SVG a mano + Web Audio | SVG a mano + Web Audio |

## Cómo ejecutar

**Parte digital.** Abrir cualquiera de los archivos `.html` en el navegador. Los datos y el audio van incrustados, así que no se necesitan dependencias. El sonido requiere una interacción del usuario antes de reproducirse (restricción de los navegadores), por eso se activa al pulsar cualquiera de los botones de escucha.

**Prototipo físico (versión final de la Entrega 2).**

1. Conectar el Arduino al computador por USB y subir el sketch `VersionFinal/copa_vino.ino`, que envía una lectura del sensor por línea a 9600 baudios y controla el ritmo del buzzer. Conexiones: sensor `S` → `A0`, `+` → pin `7`, `−` → `GND`; buzzer `+` → pin `8`, `−` → `GND`.
2. Abrir `VersionFinal/index.html` en Chrome o Edge desde GitHub Pages (HTTPS) o localhost. Web Serial exige un contexto seguro y no funciona en otros navegadores. El Monitor Serial del Arduino IDE debe estar cerrado: solo un programa puede tomar el puerto a la vez.
3. En el panel de configuración, pulsar **Autorizar Arduino** (solo la primera vez) y elegir el puerto.
4. Calibrar con el mismo líquido de la demostración: con *Usar lectura actual*, registrar la lectura al tocar el líquido y en las marcas de 2022 y 1972.
5. Servir lentamente y de forma continua: al llegar a la primera marca comienza el recorrido de 2022 a 1972. Sin Arduino, la parte digital funciona con el deslizador de prueba manual.

## Equipo

- Matías Sepúlveda
- Martina Hernández
- Eilenne Jaque
