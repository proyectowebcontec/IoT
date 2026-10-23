# Bitácora — 08-10-2026

**Fecha:** 08/10/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Cambio de puerto MQTT, pruebas a 100 ms y envío unificado de variables mediante script cronometrado

---

## 1. Objetivo

**Objetivo:**

Cambiar la conexión del gateway del puerto 1883 al puerto 8883 del broker, en atención a los acuerdos de la reunión de avances del 07/10/2026 (responsabilidad asignada a Katherinne Gómez: revisar la estructura técnica, cambiar el puerto MQTT, reestructurar la base de datos, organizar los tópicos y analizar las mejores prácticas de almacenamiento). Realizar pruebas de recepción, almacenamiento y disparo de alarmas a la velocidad real de publicación del gateway (100 ms), diagnosticando los resultados obtenidos. Corregir el envío inconsistente de variables del gateway NE-206 para que las tres variables lleguen siempre juntas. Iniciar la refactorización del frontend para incorporar un login con redirección según el rol del usuario.

---

## 2. Actividad realizada

1. Se cambió la conexión del gateway del puerto 1883 al puerto 8883 del broker.
2. Se realizaron pruebas de recepción, almacenamiento y disparo de alarmas a la velocidad de publicación de 100 ms, con los siguientes resultados:
   * El worker de la base de datos trabaja perfectamente a esa velocidad.
   * Las gráficas del frontend se distorsionan: no se logra apreciar el movimiento, ya que el gráfico se muestra totalmente diferente o se inserta un bloque grande de datos nuevos de una sola vez.
   * El worker de alarmas no disparó ninguna alarma, a pesar de que se esperaba que generara varias.
3. Las mejoras a las alarmas y al frontend quedaron pendientes en esta jornada; el objetivo de las pruebas era obtener un diagnóstico de los problemas, no corregirlos todavía.
4. Se observó que no todos los registros publicados por el gateway NE-206 contenían las tres variables monitoreadas (comportamiento ya documentado previamente para este gateway).
5. Se intentó corregir este comportamiento para lograr el envío conjunto de las tres variables. La configuración que dio resultado fue utilizar un script cronometrado que, cada 100 ms, asigna los valores leídos mediante Modbus RTU a una única variable de publicación MQTT, como una cadena de texto en la que los valores se separan mediante una barra (`|`).
6. Esta misma configuración permitió concatenar, en la misma cadena, la fecha y hora de la lectura, utilizando la función `$SYS.getSysDatetimeMsString()`.
7. Se intentó también agregar la fecha y hora en una variable separada, pero se presentó el mismo problema de inconsistencia: en ocasiones llegaba junto con las demás variables, y en otras ocasiones llegaba por separado o agrupada en subconjuntos.
8. Durante las pruebas con el script cronometrado, se identificó un límite inferior de tiempo de 10 ms para su ejecución, evidenciado por el error disparado y registrado en la captura correspondiente.
9. Una vez lograda la publicación unificada de las variables, se inició la refactorización del frontend para incluir un login que redirija al usuario a un dashboard distinto según su rol (en esta etapa del proyecto se desarrollará únicamente el rol de administrador).

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo cuya conexión MQTT se cambió al puerto 8883 y en el que se configuró el script cronometrado de publicación unificada |
| Gateway industrial | GAOTek WHG-151 | — | Origen de las lecturas Modbus RTU utilizadas en las pruebas |
| Broker MQTT | AWS EC2 | — | Broker al que se conecta el gateway, ahora mediante el puerto 8883 |
| Cliente MQTT | MQTTX | — | Verificación de la recepción de la cadena de valores unificada |
| Subscriber (worker BD) | Python | — | Worker de base de datos probado a la velocidad de publicación de 100 ms |
| Worker de alarmas | Python | — | Worker evaluado en las pruebas de disparo de alarmas a 100 ms; no disparó ninguna alarma |
| Frontend | Vite + React | — | Interfaz cuyas gráficas se distorsionaron en las pruebas a 100 ms; inicio de la refactorización para login por rol |
| WinIFDesigner | Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software utilizado para configurar el script cronometrado y las variables Modbus/MQTT |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Sin cambios respecto a la configuración Modbus RTU/RS485 documentada previamente

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner (script cronometrado); MQTTX; Python (subscriber/worker de BD y worker de alarmas); Vite + React (frontend)
* **Librerías / dependencias:** DesarrolloAplicacion/Backend/requirements.txt, DesarrolloAplicacion/client/package.json

### Comunicación

* **Protocolo:** MQTT (publicación mediante script cronometrado); Modbus RTU (lectura de variables)
* **IP / dirección:** 44.219.190.29
* **Puerto:** 8883 (anteriormente 1883)
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** Frecuencia de publicación probada: 100 ms. Formato de la cadena publicada: valores separados por `|`, incluyendo fecha y hora obtenida con `$SYS.getSysDatetimeMsString()`. Límite identificado para el script cronometrado: 10 ms

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Puerto de conexión MQTT del gateway | 1883 | 8883 | Acuerdo de la reunión de avances del 07/10/2026 (evaluar el cambio del puerto MQTT de 1883 a 8883) |
| Envío de variables del gateway NE-206 | Variables enviadas de forma inconsistente (a veces juntas, a veces separadas o en subconjuntos) | Script cronometrado (cada 100 ms) que concatena las tres variables y la fecha/hora en una sola cadena de texto, separada por `|`, publicada en una única variable MQTT | Garantizar que las tres variables y su marca de tiempo lleguen siempre juntas en un mismo mensaje |
| Frontend | Sin sistema de login ni dashboards diferenciados por rol | Inicio de la refactorización para incluir login con redirección según el rol del usuario (rol admin, por ahora) | Preparar el sistema para distintos niveles de acceso, conforme a la evolución del proyecto |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se completó exitosamente el cambio de puerto MQTT, de 1883 a 8883.
* En las pruebas a 100 ms, el worker de la base de datos funcionó perfectamente.
* Las gráficas del frontend se distorsionaron severamente a 100 ms, sin poder apreciar el movimiento de los datos de forma adecuada.
* El worker de alarmas no disparó ninguna alarma a pesar de que se esperaban varias, quedando como un problema a corregir en una próxima jornada.
* Se logró, mediante un script cronometrado, que las tres variables del gateway NE-206 (y su fecha/hora de lectura) se publicaran siempre juntas en una sola cadena de texto.
* Se identificó un límite inferior de 10 ms en la ejecución del script cronometrado.
* Se inició exitosamente la refactorización del frontend para incluir el login con redirección por rol (rol admin).

### Datos relevantes

```text
Formato de la cadena publicada por el script cronometrado:
fecha_hora (obtenida con $SYS.getSysDatetimeMsString())|valor1|valor2|valor3

Límite inferior identificado para el script cronometrado: 10 ms (ver Limite-Tiempo-Script-Cronometrado.png)

Resultados de pruebas a 100 ms:
- Worker de BD: funciona correctamente
- Gráficas del frontend: distorsionadas (no se aprecia el movimiento)
- Worker de alarmas: no disparó ninguna alarma (comportamiento esperado: varias alarmas)
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Las variables del gateway NE-206 llegaban de forma inconsistente (a veces juntas, a veces separadas o agrupadas en subconjuntos), incluso al intentar enviar la fecha/hora en una variable separada | Durante las pruebas de envío conjunto de variables | Alto — impedía garantizar que los registros almacenados contuvieran siempre las tres variables completas | Monitoreo-CadenaValores-RecepcionMQTTX.png |
| Las gráficas del frontend se distorsionan al recibir datos a una frecuencia de 100 ms | Durante las pruebas de recepción, almacenamiento y alarmas a 100 ms | Alto — impide visualizar correctamente el comportamiento de las variables en tiempo real a esa frecuencia | No aplica |
| El worker de alarmas no disparó ninguna alarma a 100 ms, a pesar de que se esperaban varias | Durante las pruebas de disparo de alarmas a 100 ms | Alto — impide validar el funcionamiento del sistema de alarmas a la frecuencia real de publicación | No aplica |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Las variables del gateway NE-206 no llegaban siempre juntas en un mismo mensaje, dificultando que los registros almacenados contuvieran la información completa.

**Causa identificada:**
El envío de variables por separado, mediante la configuración estándar del gateway, no garantizaba su sincronización en un mismo ciclo de publicación.

**Solución aplicada:**
Se implementó un script cronometrado que, cada 100 ms, asigna los valores leídos por Modbus RTU a una única variable de publicación MQTT, concatenados como una cadena de texto separada por `|`, incluyendo también la fecha y hora de la lectura mediante `$SYS.getSysDatetimeMsString()`.

**Resultado posterior:**
Se logró que las tres variables y su marca de tiempo se publicaran siempre juntas, en un único mensaje MQTT, verificado mediante MQTTX.

### Problema 2

**Problema:**
El script cronometrado presentó un error relacionado con un límite de tiempo de ejecución.

**Causa identificada:**
El script cronometrado tiene un límite inferior de ejecución de 10 ms, identificado a partir del error disparado durante las pruebas.

**Solución aplicada:**
No se aplicó una solución en esta jornada; el límite de 10 ms queda documentado como una restricción a considerar en el diseño del script si a futuro se desea disminuir el tiempo de 100 ms.

**Resultado posterior:**
El script cronometrado continuó funcionando dentro del margen permitido para el envío unificado de variables, pero el límite inferior de 10 ms queda como un parámetro crítico a tener en cuenta en ajustes futuros.

### Problema 3

**Problema:**
Las gráficas del frontend se distorsionan al recibir datos a 100 ms, y el worker de alarmas no disparó ninguna alarma a esa misma frecuencia.

**Causa identificada:**
No identificada en esta jornada; el objetivo de las pruebas era diagnosticar el comportamiento del sistema a 100 ms, no corregirlo.

**Solución aplicada:**
No se aplicó una solución en esta jornada. Las mejoras al frontend y al worker de alarmas quedaron pendientes para una próxima jornada.

**Resultado posterior:**
Ambos problemas permanecen sin resolver al cierre de esta jornada.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Configuracion-IOVariableMqtt-Declaracion.png | Declaración de la variable MQTT utilizada para publicar la cadena unificada | ./evidencias/2026-10-08/Configuracion-IOVariableMqtt-Declaracion.png |
| Configuracion-IOVariableMqtt-Identificacion.png | Identificación de la variable MQTT de publicación | ./evidencias/2026-10-08/Configuracion-IOVariableMqtt-Identificacion.png |
| Configuracion-IOVariableMqtt-Tipo.png | Tipo de dato configurado para la variable MQTT (cadena de texto) | ./evidencias/2026-10-08/Configuracion-IOVariableMqtt-Tipo.png |
| Configuracion-IOVariableRtu-Declaracion.png | Declaración de las variables Modbus RTU leídas | ./evidencias/2026-10-08/Configuracion-IOVariableRtu-Declaracion.png |
| Configuracion-IOVariableRtu-ParametrosLectura.png | Parámetros de lectura de las variables Modbus RTU | ./evidencias/2026-10-08/Configuracion-IOVariableRtu-ParametrosLectura.png |
| Configuracion-IOVariableRtu-Tipo.png | Tipo de dato configurado para las variables Modbus RTU | ./evidencias/2026-10-08/Configuracion-IOVariableRtu-Tipo.png |
| Script-Cronometrado-CadenaValores.png | Script cronometrado que concatena los valores y la fecha/hora en la cadena de publicación | ./evidencias/2026-10-08/Script-Cronometrado-CadenaValores.png |
| Limite-Tiempo-Script-Cronometrado.png | Error mostrando el límite de 10 ms en la ejecución del script cronometrado | ./evidencias/2026-10-08/Limite-Tiempo-Script-Cronometrado.png |
| Monitoreo-CadenaValores-RecepcionMQTTX.png | Recepción en MQTTX de la cadena de valores unificada (valores + fecha/hora, separados por `\|`) | ./evidencias/2026-10-08/Monitoreo-CadenaValores-RecepcionMQTTX.png |

No se cuenta con evidencia gráfica de las pruebas de almacenamiento a 100 ms, del comportamiento de las alarmas ni de la distorsión de las gráficas del frontend; estos resultados quedan documentados a partir de las anotaciones registradas durante la jornada.

---

## 10. Próximos pasos

* Diagnosticar y corregir la distorsión de las gráficas del frontend al recibir datos a una frecuencia de 100 ms.
* Diagnosticar por qué el worker de alarmas no disparó ninguna alarma durante las pruebas a 100 ms, y corregirlo.
* Continuar la refactorización del frontend para completar el login con redirección por rol (rol admin en esta etapa).
* Continuar con los demás acuerdos de la reunión del 07/10/2026 asignados a Katherinne Gómez: reestructurar la base de datos, organizar los tópicos MQTT (`/Alarmas`, `/Dispositivo`) y analizar las mejores prácticas de almacenamiento de la información proveniente de MQTT.

---

## 11. Observaciones

Esta jornada atendió varios de los acuerdos definidos en la reunión de avances del 07/10/2026, en particular el cambio de puerto MQTT (de 1883 a 8883) y el inicio de las pruebas de estabilidad del prototipo a la velocidad real de publicación del gateway (100 ms), en línea con el enfoque de validación acordado con las autoridades.

Las pruebas a 100 ms evidenciaron que, si bien el almacenamiento en base de datos es estable a esa frecuencia, tanto la visualización en el frontend como el sistema de alarmas requieren ajustes importantes antes de poder operar de forma confiable a esta velocidad. Por otro lado, el hallazgo del script cronometrado con un límite inferior de 10 ms de ejecución resultará de utilidad en el escenario en el que se desee evaluar disminuir el tiempo de 100 ms. Lograr, dentro del ciclo de 100 ms, un envío unificado y consistente de las tres variables junto con su marca de tiempo, permitió solventar el problema de variables dispersas o incompletas que se venía observando en el gateway NE-206.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 08/10/2026

**Pendientes:**
Corregir la distorsión de las gráficas del frontend y el disparo del worker de alarmas a 100 ms; continuar la refactorización del login por rol; y avanzar en los demás acuerdos de la reunión del 07/10/2026 (reestructuración de la base de datos, organización de tópicos MQTT y mejores prácticas de almacenamiento).