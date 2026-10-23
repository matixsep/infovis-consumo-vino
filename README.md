# Consumo de vino en el mundo · Visualización de información

Proyecto del curso **Visualización de Información (IIC2026)** — Pontificia Universidad Católica de Chile.

**Pregunta que responde la visualización:** ¿Cómo ha cambiado el consumo de vino en Chile entre 1963 y 2022, y cómo se compara con el de otros países?

**Propósito:** mixto. Explicativo, porque afirma y respalda una conclusión (la caída del 80,2 % entre 1972 y 2022); y exploratorio, porque el usuario puede cambiar el país principal, los países de comparación y el período.

**Audiencia:** público general con lectura básica de gráficos, sin formación en estadística.

---

## Demo

| Versión | Enlace | Commit / tag |
|---|---|---|
| V1 | https://matixsep.github.io/infovis-consumo-vino/V1.html | `v1` |
| V2 | https://matixsep.github.io/infovis-consumo-vino/V2.html | `v2` |
| V3 | https://matixsep.github.io/infovis-consumo-vino/V3.html | `v3` |
| V4 (final) | https://matixsep.github.io/infovis-consumo-vino/V4.html | `v4` |

---

## Datos

- **Fuente:** indicador de consumo registrado de alcohol por tipo de bebida (OMS), distribuido por [Our World in Data](https://ourworldindata.org/).
- **Archivo:** `wine-consumption-per-capita(1).csv` — 10.598 observaciones, 187 entidades, 1960–2022.
- **Unidad:** litros de alcohol puro proveniente del vino, por persona de 15 años o más, al año. **No** son litros de bebida ni número de copas.
- **Máximo del archivo:** 20,56 L. Por eso el dominio fijo de las escalas es **0–21 L** (techo redondeado).
- La cobertura varía entre países y años. **Ausencia de dato no equivale a cero**, y ambas cosas se distinguen en pantalla y en el audio.

Los datos y el audio van incrustados en cada HTML: los archivos funcionan sin conexión y sin servidor.

---

## Historial de versiones

### V1 — Mapa coroplético mundial

**Qué era.** Mapa del mundo con Plotly 3.3.1. El consumo se codificaba en la **intensidad de color** (escala de rosados a burdeo), con un *slider* de año 1960–2022. Al hacer clic en un país se llenaba una copa de vino en pantalla y sonaba una grabación de vertido cuya **duración** (0,45 a 4,50 s) dependía del consumo.

**Pregunta que respondía.** *¿Dónde se consume vino?* — una pregunta espacial.

**Problemas detectados.**

1. **La escala de color se recalculaba cada año.** El código fijaba `zmax: maxValue(year)`, es decir, el máximo del año consultado. El mismo burdeo significaba 20 L en 1960 y mucho menos en 2022. Como el slider invita precisamente a comparar entre años, la visualización rompía la comparación que ella misma proponía.
2. **El color es un canal de baja precisión.** En la jerarquía de Cleveland y McGill, la posición sobre una escala común es el canal más preciso y la intensidad de color está entre los menos precisos. El color sirve bien para identidad (categorías), no para cantidad.
3. **La duración del sonido también era relativa al año.** Se mapeaba el porcentaje respecto del máximo del año, con el mismo defecto del punto 1.
4. **La copa que se llenaba era decoración.** Codificaba el mismo dato una segunda vez en un canal peor (área/altura de líquido) y no agregaba información: razón dato-tinta baja.

---

### V2 — Series de tiempo en paneles (small multiples)

**Qué cambió.**

- **Cambia la pregunta**, de *dónde* a *cómo ha cambiado en el tiempo y respecto de quién*. Al cambiar la pregunta, cambia la codificación.
- **Mapa → gráfico de líneas.** El consumo pasa de codificarse en **color** a codificarse en **posición sobre una escala común**: el canal más preciso de la jerarquía. El tiempo se codifica en posición horizontal.
- **Dominio fijo 0–21 L**, idéntico para todos los países y todos los años. Una misma altura significa siempre la misma cantidad.
- **Eje vertical desde 0.** Al no truncar el eje, el efecto visual coincide con el efecto real (factor de mentira ≈ 1).
- **Se elimina la copa que se llenaba** y el resto del chartjunk.
- **Los huecos de datos se dibujan como huecos**, no se interpolan: la línea se corta donde no hay dato.
- **Sonificación absoluta.** El vertido pasa a durar `0,35 + 4,15 · v / 21` segundos, es decir, 0,35 s a 4,5 s mapeados al valor en litros, igual para todos los países y años. Cero y "sin dato" son silencio, y se distinguen en pantalla.
- Se agrega selector de período, lectura del año bajo el cursor y recorrido sonoro por período.

**Qué quedó pendiente.** Cada país de comparación tenía **su propio panel**. Aunque todos compartían la escala, comparar exigía mover la vista de un panel a otro y recordar alturas, en vez de leerlas juntas.

---

### V3 — Un solo gráfico multilínea

**Qué cambió.**

- **Paneles separados → una sola área de dibujo.** Todas las series se superponen en los mismos ejes. Ahora la comparación entre países es una lectura directa de posición sobre una escala común, sin memoria visual de por medio.
- **Codificación redundante para accesibilidad.** Cada serie se distingue por **color y a la vez por patrón de línea** (`#8d2247` continua para el país principal; `#0072b2`, `#d55e00` y `#00836e` con distintos guiones para las comparaciones). La paleta es segura para daltonismo y, aunque el color no se distinga, el patrón sigue separando las series.
- **La serie principal se dibuja al final**, para que no quede tapada en los cruces.
- **Anotaciones con halo blanco** (`paint-order: stroke`) en el máximo de 1972 (9,79 L) y en 2022 (1,93 L), legibles sobre las líneas.
- **El título pasa de conclusión a pregunta.** De «Chile registra un 80,2 % menos…» a «¿Cómo ha cambiado el consumo de vino en Chile y cómo se compara con otros países?», acorde al propósito mixto: la conclusión sigue estando, pero baja al subtítulo.

---

### V4 — Sonificación por tono y lista de valores (versión final)

**Qué cambió.**

**1. El parámetro sonoro pasa de duración a tono.** Es el cambio principal de la versión.

- *Problema de la duración.* El mapeo lineal 0–21 L → 0,35–4,5 s daba unos 0,2 s por litro. El recorrido completo de Chile (1,93 a 9,79 L) ocupaba apenas entre 0,7 y 2,3 s, y en países de consumo bajo la diferencia entre un año y otro quedaba por debajo del umbral perceptible. Además, en el recorrido por período las muestras arrancaban cada 4,8 s fijos, de modo que la duración de cada una casi no se notaba.
- *Por qué tono.* Entre los parámetros de mapeo (tono, volumen, ritmo, timbre, duración), el tono es el que mejor resuelve diferencias pequeñas. El volumen es el más débil, porque depende del dispositivo y del ambiente de escucha, así que **queda fuera de la codificación** y es solo un control del usuario.
- *Escala comprimida (raíz cuadrada).* El rango va de −18 a +18 semitonos (una octava y media hacia cada lado), con el tono original alrededor de 5,3 L. Entre 0 y 5 L cada litro cambia el tono entre 3 y 8 semitonos; sobre 10 L, poco más de 1 semitono por litro. Dos razones: la percepción de altura tonal es aproximadamente logarítmica respecto de la frecuencia, y los datos están fuertemente concentrados en valores bajos, de modo que un mapeo lineal desperdiciaba casi todo el rango audible.
- *Recorrido encadenado.* Cada muestra empieza apenas termina la anterior más una pausa breve, en lugar de la grilla fija de 4,8 s.

**2. Cambia el icono auditivo.** De una grabación de vertido de líquido a un **brindis con copas de vidrio**. El brindis tiene un ataque tonal claro, que es lo que permite percibir el cambio de tono; un vertido alterado en tono suena artificial.

**3. Se agrega una lista de valores ordenada**, con barras proporcionales y transición animada al cambiar de año. Aporta el ranking y el valor exacto (detalles bajo demanda) sin recargar el gráfico.

**4. Se elimina el botón «Comparar Chile: 1972 y 2022»**, porque con tono el contraste entre ambos años se escucha directamente en cualquier recorrido.

**Limitación conocida.** El audio de V2 y V3 era CC0 verificado (Freesound 579752). El brindis de V4 proviene de un archivo cuyos metadatos indican autor y título, pero **cuya licencia no está verificada**. Queda declarado en el pie de página.

---

## Resumen de la evolución

| | V1 | V2 | V3 | V4 |
|---|---|---|---|---|
| Tipo de gráfico | Mapa coroplético | Líneas en paneles | Líneas superpuestas | Líneas superpuestas + lista |
| Canal para el consumo | Color (intensidad) | Posición | Posición | Posición |
| Escala | Relativa al año | 0–21 L fija | 0–21 L fija | 0–21 L fija |
| Comparación entre países | Visual, por color | Entre paneles | Directa, mismos ejes | Directa + ranking |
| Parámetro sonoro | Duración (relativa) | Duración (absoluta) | Duración (absoluta) | **Tono** (comprimido) |
| Sonido | Vertido | Vertido (CC0) | Vertido (CC0) | Brindis |
| Tecnología | Plotly 3.3.1 | SVG a mano + Web Audio | SVG a mano + Web Audio | SVG a mano + Web Audio |

---

## Cómo ejecutar

Abrir cualquiera de los archivos `.html` directamente en el navegador. No requiere servidor, conexión ni dependencias: datos y audio van incrustados.

El sonido necesita una interacción del usuario antes de reproducirse (restricción de los navegadores), por eso se activa al pulsar cualquiera de los botones de escucha.

---

## Equipo

- Matías Sepúlveda
- Martina Hernández
- Eilenne Jaque