# Bitácora — 09-09-2026

**Fecha:** 09/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Monitoreo de corriente del motor mediante PLC y Gateway 151

---

## 1. Objetivo

**Objetivo:**

Leer la corriente empleada por el motor, comunicarla al PLC y posteriormente al gateway, para que este la publique a internet.

---

## 2. Actividad realizada

1. El equipo de taller armó el cableado y montaje del circuito para monitorear la corriente en las fases del motor, incluyendo un control para modificar la velocidad a la que trabaja.
2. Se realizó la conexión del PLC a la computadora de escritorio que se utilizará de forma definitiva y se probó un programa sencillo; Wanderley lo utilizó para explicar el funcionamiento de la programación en bloques del PLC.
3. Se recibió una explicación sobre cómo operar el circuito y las precauciones a tener en consideración.
4. Se envió la señal capturada por las donas a los transductores de corriente.
5. Se detectó un error en los transductores y se corrigió.
6. Se conectaron las señales de los transductores a las entradas analógicas del PLC.
7. Mediante el software de programación del PLC se intentó visualizar los valores analógicos, sin obtener lecturas.
8. Se utilizó un potenciómetro para simular una entrada analógica más directa al PLC, obteniéndose lectura exitosa.
9. Se detectó que no era posible leer el valor desde el gateway, ya que el PLC no cuenta con salidas analógicas ni protocolos configurables.
10. Se conversó con los encargados de taller sobre las limitaciones reales del proyecto, las expectativas y los alcances. Se identificó que la mayoría de las grúas de Contec no poseen PLC y son controladas completamente por contactores, lo que convertiría al gateway WHG-151 en la mejor opción si se lograra acortar el tiempo de envío a 100 ms.
11. Se informó al ingeniero Carlos Arias sobre las limitaciones actuales y los avances logrados; Wanderley también conversó con el ingeniero Henry al respecto.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Motor | [Placeholder] | — | Equipo cuya corriente se desea monitorear |
| Donas de corriente | 100/5 AMP. 30I | — | Capturar la señal de corriente en las fases del motor |
| Transductores de corriente | RMS 85-26 | — | Convertir la señal capturada por las donas en una señal utilizable por el PLC |
| Potenciómetro | 5k | — | Simular una entrada analógica directa al PLC para pruebas |
| PLC | PLC Siemens LOGO! | — | Recibir y procesar las señales analógicas de corriente |
| Computadora de escritorio | core i5 | — | Programación definitiva del PLC |
| Gateway industrial | GAOTek WHG-151 | — | Candidato para publicar a internet la lectura de corriente, pendiente de solución técnica |
| Control de velocidad | -- | — | Modificar la velocidad de trabajo del motor |

---

## 4. Configuración

### Hardware

* **Equipo:** Motor, donas de corriente, transductores de corriente, PLC
* **Modelo:** [Placeholder — completar]
* **Alimentación:** 440VAC, _, 110V, 24V
* **Conexiones:** Donas de corriente → transductores → entradas analógicas del PLC; potenciómetro conectado como entrada analógica alternativa para pruebas

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Software de programación en bloques del PLC LogoSoft
* **Librerías / dependencias:** No aplica

### Comunicación

* **Protocolo:** a definir; el PLC actual no cuenta con protocolos configurables para exportar las lecturas analógicas
* **IP / dirección:** No aplica en esta actividad
* **Puerto:** No aplica
* **Endpoint / servidor:** No aplica
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Rango de la dona de corriente: 5 A–5000 A; corriente real del motor: 5.7 A (valor bajo respecto al rango de la dona, lo que dificulta el escalado)

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Rango de lectura del transductor | Perilla configurada para lecturas superiores a 5 A | Ajustada para leer hasta 4 A | El transductor marcaba error al esperar lecturas por encima de 5 A |
| Entrada analógica del PLC | Señal proveniente del transductor (dona 5 A–5000 A) | Señal proveniente de un potenciómetro | La lectura real del motor (5.7 A) resultaba demasiado pequeña frente al rango de la dona, generando un valor de escalado imperceptible para el PLC |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se armó y montó correctamente el circuito de monitoreo de corriente en las fases del motor, incluyendo el control de velocidad.
* Se conectó el PLC a la computadora de escritorio definitiva y se validó un programa sencillo de prueba.
* Se corrigió el error inicial de los transductores de corriente.
* Se logró obtener lectura analógica exitosa en el PLC utilizando un potenciómetro como entrada de prueba.
* No se logró leer la corriente real del motor a través de los transductores, debido al desajuste entre el rango de la dona (5 A–5000 A) y la corriente real del motor (5.7 A).
* No fue posible extraer la lectura desde el gateway, ya que el PLC no cuenta con salidas analógicas ni protocolos configurables.

### Datos relevantes

```text
Rango de la dona de corriente: 5 A - 5000 A
Corriente real del motor: 5.7 A
Ajuste del transductor: de >5 A a lectura hasta 4 A
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| El transductor marcaba error | Durante la conexión inicial de los transductores | Medio — impedía continuar con la lectura de corriente | ./imgs/ConexionPLC/ErrorTransductor.jpeg |
| La lectura del transductor no era detectada por el PLC | Al intentar visualizar los valores analógicos en el software de programación | Alto — impedía monitorear la corriente real del motor |
| El PLC no cuenta con salidas analógicas ni protocolos configurables para extraer las lecturas ingresadas | Al intentar leer el valor desde el gateway | Alto — bloquea la publicación de la señal a internet mediante el gateway | ./imgs/ConexionPLC/PLCLogo.jpeg |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El transductor marcaba error.

**Causa identificada:**
La perilla del transductor estaba configurada para esperar lecturas superiores a 5 A.

**Solución aplicada:**
Se modificó la configuración de la perilla para leer hasta 4 A.

**Resultado posterior:**
El transductor dejó de marcar error.

### Problema 2

**Problema:**
La lectura del transductor no era detectada por el PLC.

**Causa identificada:**
La dona de corriente tiene un rango demasiado amplio (5 A–5000 A) en comparación con la corriente real del motor (5.7 A), por lo que el escalado resultante arroja un valor demasiado pequeño y se pierde.

**Solución aplicada:**
Se conectó un potenciómetro para manipular manualmente las lecturas analógicas del PLC como alternativa de prueba.

**Resultado posterior:**
Se logró obtener lectura analógica exitosa en el PLC utilizando el potenciómetro, confirmando que la entrada analógica del PLC funciona correctamente; el problema de fondo permanece en el escalado de la dona frente a la corriente real del motor.

### Problema 3

**Problema:**
El PLC no tiene salidas analógicas ni protocolos configurables para extraer las lecturas ingresadas hacia el gateway.

**Causa identificada:**
Limitación de hardware/firmware del PLC utilizado.

**Solución aplicada:**
Se están investigando alternativas (solución aún en curso).

**Resultado posterior:**
Pendiente; el problema no ha sido resuelto a la fecha.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Error en el transductor |  | Al intentar leer el valor desde el gateway |
| Tablero prelimianar armado completamente | Se montó en el taller un circuito con la disposición final del tablero para emplearlo en las pruebas | ./imgs/ConexionPLC/TableroPreliminar.jpeg |
| Fotografía 01 | [Descripción] | [Ruta del archivo] |

---

## 10. Próximos pasos

* Investigar y definir alternativas para extraer las lecturas analógicas del PLC hacia el gateway (dado que el PLC actual no tiene salidas analógicas ni protocolos configurables).
* Evaluar el uso de una dona de corriente con un rango más adecuado a la corriente real del motor (5.7 A), para evitar la pérdida de la señal por escalado.
* Evaluar la posibilidad de reducir el tiempo de envío del gateway WHG-151 a 100 ms, dado que la mayoría de las grúas de Contec son controladas por contactores (sin PLC) y este gateway sería la mejor opción para esos casos.
* Dar seguimiento con el ingeniero Carlos Arias y el ingeniero Henry sobre las limitaciones y decisiones a tomar respecto al alcance del proyecto.

---

## 11. Observaciones

Durante esta jornada se evidenció una limitación importante de hardware: el PLC utilizado no dispone de salidas analógicas ni protocolos configurables, lo que impide, por ahora, extraer hacia el gateway las lecturas de corriente ingresadas. Adicionalmente, se identificó que el rango de la dona de corriente disponible (5 A–5000 A) es demasiado amplio para la corriente real del motor (5.7 A), lo que provoca que la señal se pierda en el escalado.

Se conversó con los encargados de taller sobre los alcances reales del proyecto: dado que la mayoría de las grúas de Contec no cuentan con PLC y son controladas completamente por contactores, el gateway WHG-151 podría ser la mejor opción para esos casos si se logra acortar el tiempo de envío a 100 ms. Se informó de estas limitaciones y avances al ingeniero Carlos Arias, y Wanderley conversó también con el ingeniero Henry al respecto.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 09/09/2026

**Pendientes:**
Definir una alternativa para extraer las lecturas analógicas del PLC hacia el gateway (el PLC actual no cuenta con salidas analógicas ni protocolos configurables) y evaluar un transductor/dona con un rango más adecuado a la corriente real del motor.