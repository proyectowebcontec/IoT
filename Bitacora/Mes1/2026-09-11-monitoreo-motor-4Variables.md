# Bitácora — 11-09-2026

**Fecha:** 11/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Monitoreo del motor con 4 variables (3 donas de corriente + monitor de fase)

---

## 1. Objetivo

**Objetivo:**

Dejar en funcionamiento las 3 donas de corriente en el circuito de monitoreo del motor y agregar el monitor de fase, sumando así 4 variables monitoreadas en total. Adicionalmente, dar seguimiento a la problemática con el gateway NE-206.

---

## 2. Actividad realizada

1. Se editó y compartió con Sherlyn el video sobre la problemática presentada con el gateway NE-206.
2. Se aprovechó la comunicación con Sherlyn para realizar otras consultas relacionadas.
3. Se puso en funcionamiento la segunda y tercera dona de corriente, completando así las 3 donas operativas (el día anterior únicamente 1 se encontraba en funcionamiento).
4. Se agregó el monitor de fase al circuito de monitoreo del motor.
5. Se simuló el fallo de fase retirando la conexión de una de las fases, para validar la detección del monitor de fase.
6. Se utilizó un botón para simular las pulsaciones correspondientes a la variable digital del circuito.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Donas de corriente (x3) | 100/5 AMP. 30I | — | Capturar la corriente en las 3 fases del motor |
| Monitor de fase | 3x 160-690 VAC, 15-70 Hz 2 | — | Detectar fallos de fase en la alimentación del motor |
| Pulsador | -- | — | Simular pulsaciones de la variable digital del circuito |
| PLC | Siemens LOGO! 8  | — | Recibir y procesar las señales de las donas y el monitor de fase |
| Motor | [Placeholder] | — | Equipo monitoreado |
| Transductores de corriente | RMS 85-26 | — | Convertir la señal capturada por las donas en una señal utilizable por el PLC |
| Gateway industrial | GAOTek WHG-151 | — | Candidato para publicar a internet la lectura de corriente, pendiente de solución técnica |
| Control de velocidad | -- | — | Modificar la velocidad de trabajo del motor |

---

## 4. Configuración

### Hardware

* **Equipo:** Donas de corriente, transductores de corriente, PLC, monitor de fase, gateway industrial
* **Modelo:** 100/5 AMP. 30I, RMS 85-26, Siemens LOGO! 8, 3x 160-690 VAC, 15-70 Hz 2, GaoTek WHG-151
* **Alimentación:** _, 110V, 24V, _, 24V
* **Conexiones:** 3 donas de corriente conectadas a las fases del motor; monitor de fase agregado al circuito; pulsador conectado para simular la señal digital

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Vite, React, Axios; Python
* **Librerías / dependencias:** DesarrolloAplicacion/client/package.json; DesarrolloAplicacion/Backend/requirements.txt; --

### Comunicación
* **Protocolo:** MQTT
* **IP / dirección:** 44.219.190.29
* **Puerto:** 1883 (habilitado temporalmente; originalmente configurado en 8883 para TLS)
* **Endpoint / servidor:** Broker MQTT desplegado en instancia AWS EC2
* **Tópico:** `test/mqtt`
* **QoS:** 0
* **Otros parámetros:** Comunicación en MQTT plano (sin TLS) mientras se usó el puerto 1883

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Donas de corriente en funcionamiento | 1 dona operativa | 3 donas operativas | Completar el monitoreo de corriente en las 3 fases del motor |
| Variables monitoreadas | 3 variables (donas de corriente) | 4 variables (3 donas + monitor de fase) | Ampliar el monitoreo para incluir la detección de fallos de fase |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se logró dejar las 3 donas de corriente funcionando correctamente.
* Se agregó y validó el monitor de fase, detectando correctamente el fallo simulado al retirar la conexión de una fase.
* Se validó correctamente la simulación de pulsaciones mediante el botón conectado al circuito.
* Se compartió con Sherlyn el video sobre la problemática del gateway NE-206 y se aprovechó la comunicación para resolver otras consultas.

---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes durante la actividad.

---

## 8. Solución aplicada

No aplica, ya que no se presentaron errores u obstáculos durante esta actividad.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Video Error en WinIfDesigner | Video compartido con Sherlyn sobre la problemática del gateway NE-206 | https://drive.google.com/file/d/1-H5zWcOljrAdOKCMKXZVt18jArl57EXp/view |
| Circuito de monitoreo | Cicuito de monitoreo elaborado por el equipo de taller incluyendo las donas, los transductores, pulsadores, luces de control y un relé de monitoreo de fase | ./imgs/ConexionPLC/CircuitoCompleto_Monitoreo4Variables.jpeg |
| Dashboard de monitoreo | Dashboard de monitoreo en el que se pueden observar la corriente en las tres fases del motor y un pulsador | ./imgs/ConexionPLC/DashboardMonitoreoVariables_11_09_2026.png |

* [Video Error en WinIfDesigner](https://drive.google.com/file/d/1-H5zWcOljrAdOKCMKXZVt18jArl57EXp/view)
* [Circuito de monitoreo](./imgs/ConexionPLC/CircuitoCompleto_Monitoreo4Variables.jpeg)
* [Dashboard de monitoreo](./imgs/ConexionPLC/DashboardMonitoreoVariables_11_09_2026.png)

---

## 10. Próximos pasos

* Continuar con el seguimiento de la problemática del gateway NE-206 junto con Sherlyn.
* Integrar las 4 variables monitoreadas (3 donas + monitor de fase) al flujo completo de comunicación con el PLC y el gateway.
* Retomar la búsqueda de alternativas para extraer las lecturas analógicas del PLC hacia el gateway, según lo identificado en la jornada del 09/09/2026.

---

## 11. Observaciones

Esta jornada representa un avance directo sobre lo identificado el 09/09/2026, completando el circuito de monitoreo de corriente con las 3 donas operativas y sumando el monitor de fase como una cuarta variable. La simulación de fallos de fase y de pulsaciones permitió validar el correcto funcionamiento del circuito sin necesidad de provocar una falla real en el motor.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 11/09/2026

**Pendientes:**
Ninguno relevante para esta actividad puntual; continúa pendiente la integración completa de las variables al flujo de comunicación PLC–gateway y la resolución de la problemática del gateway NE-206.