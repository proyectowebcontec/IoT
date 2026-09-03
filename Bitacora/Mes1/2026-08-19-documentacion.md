# Bitácora — 19-08-2026

**Fecha:** 19/08/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Documentación de avances e investigación de los sieguientes pasos

---

## 1. Objetivo


**Objetivo:**

Documentar técnica y estructuradamente los avances realizados hasta el momento en el proyecto, establecer una base documental para el seguimiento de las actividades y analizar las alternativas disponibles para continuar el flujo de comunicación desde la generación de señales hasta su procesamiento y posterior visualización.

---

## 2. Actividad realizada
Las tareas ejecutadas durante la jornada fueron las siguientes:

1. Se creó la estructura de la documentación del proyecto, incluyendo plantillas para las secciones de generalidades, pruebas, registro de bitácoras, inventario e integraciones.
2. Se documentó técnicamente el progreso alcanzado hasta el momento, correspondiente a la integración del Arduino Mega 2560 con AWS IoT Core, mediante el envío de cinco señales hacia el broker MQTT.
3. Se realizó el ordenamiento y reemplazo de algunos cables del circuito conectado al Arduino Mega 2560, utilizando cables ajustados a la medida con el objetivo de mejorar la presentación física del montaje, facilitar su movilización y reducir la posibilidad de interferencias electromagnéticas.
4. Se investigaron diferentes alternativas para continuar el flujo de comunicación del proyecto. Debido a que las señales ya pueden ser enviadas al broker, se analizó el siguiente paso de la arquitectura, correspondiente a la recepción, procesamiento, almacenamiento y posterior presentación de los datos.

---
## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
|---|---|---|---|
| Microcontrolador | Arduino Mega 2560 | — | Generación y envío de señales |
| Computadora | — | — | Configuración, programación y documentación |
| Circuito de pruebas | — | — | Simulación/generación de señales para validar la comunicación |
| Plataforma IoT | AWS IoT Core | — | Recepción de mensajes mediante MQTT |
| Software | Arduino IDE | — | Programación y configuración del Arduino |
| Software | AWS IoT MQTT Test Client | — | Validación de recepción de mensajes enviados al broker |

---

## 4. Configuración

Registrar los parámetros técnicos utilizados durante la actividad.

### Hardware

* **Equipo:** Arduino Mega 2560
* **Modelo:** Mega 2560
* **Alimentación:** Según configuración del circuito de pruebas
* **Conexiones:** El Arduino se encuentra conectado al circuito de pruebas para la generación de cinco señales utilizadas durante las pruebas de comunicación.

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Arduino IDE, AWS Management Console
* **Librerías / dependencias:** Librerías requeridas por el código de comunicación MQTT del prototipo.

### Comunicación

* **Protocolo:** MQTT
* **IP / dirección:** No aplica / gestionada mediante la conexión de red utilizada.
* **Puerto:** Configurado según el mecanismo de conexión utilizado con AWS IoT Core.
* **Endpoint / servidor:** Endpoint de AWS IoT Core configurado para el proyecto.
* **Tópico:** Tópico MQTT configurado para las pruebas del prototipo.
* **QoS:** Según la configuración utilizada durante las pruebas.
* **Otros parámetros:** Se verificó la recepción de los mensajes publicados por el Arduino mediante el cliente MQTT de AWS IoT Core.

> No se incluyen credenciales, certificados privados, claves, tokens ni información sensible de conexión.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
|---|---|---|---|
| Cableado | Cables de puente 22 AWG | Cable cortado a la medida | Mejorar la presentación, facilitar la movilización del circuito y disminuir la posibilidad de interferencias electromagnéticas. |
| Documentación | Información distribuida y sin una estructura uniforme | Estructura documental con secciones y plantillas | Facilitar el seguimiento, mantenimiento y consulta de la información técnica del proyecto. |

---

## 6. Resultados obtenidos

**Resultado general:**

**Exitoso**

### Resultados específicos

* Se estableció una estructura inicial para la documentación técnica del proyecto.
* Se documentó el estado actual de la integración entre el Arduino Mega 2560 y AWS IoT Core.
* Se verificó que el prototipo es capaz de enviar cinco señales hacia AWS IoT Core mediante MQTT.
* Se mejoró el ordenamiento físico del circuito mediante la reorganización y sustitución de parte del cableado.
* Se identificaron como siguientes componentes del flujo la recepción, procesamiento, almacenamiento y visualización de los datos provenientes del broker MQTT.

### Datos relevantes

```text
Dispositivo origen: Arduino Mega 2560
Cantidad de señales: 5
Protocolo de comunicación: MQTT
Plataforma de recepción: AWS IoT Core
Estado de comunicación: Mensajes recibidos correctamente durante las pruebas
```

---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes durante la actividad.

El principal aspecto pendiente corresponde a la definición e implementación de la siguiente etapa del flujo de datos, particularmente el mecanismo mediante el cual los mensajes recibidos en AWS IoT Core serán procesados, almacenados y posteriormente utilizados para visualización.

---

## 8. Solución aplicada

> No fue necesaria la aplicación de una solución correctiva, debido a que no se presentaron errores relevantes durante las pruebas.

Como acción preventiva y de mejora, se reorganizó parte del cableado del circuito para obtener un montaje más ordenado y facilitar futuras pruebas y modificaciones.

---

## 9. Evidencias

Relacionar las evidencias generadas durante la actividad.

| Evidencia | Descripción | Ubicación |
|---|---|---|
| Circuito | Circuito conectado al Arduino Mega 2560 con reordenamiento del cableado | `./evidencias/2026-08-19/` |
| Recepción MQTT | Evidencia de mensajes enviados por el Arduino y recibidos en AWS IoT Core | `./evidencias/2026-08-19/` |
| Documentación | Estructura inicial de la documentación técnica del proyecto | `./documentacion/` |

### Evidencias

* [Circuito](./evidencias/2026-08-19/circuito-arduino-mega-2560.png)
* [Recepción de mensajes MQTT](./evidencias/2026-08-19/recepcion-mensajes-mqtt.png)

> Las rutas de las evidencias deben ajustarse a los nombres reales de los archivos almacenados en el proyecto.

---

## 10. Próximos pasos

*  Definir la arquitectura para el procesamiento de los mensajes recibidos desde AWS IoT Core.
*  Analizar las alternativas para almacenar de forma persistente las señales recibidas.
*  Implementar el mecanismo de recepción y procesamiento de los mensajes MQTT.
*  Definir la estructura de datos que será utilizada para almacenar las mediciones.
*  Diseñar la estrategia para presentar las mediciones mediante una interfaz de visualización.
*  Realizar pruebas de extremo a extremo desde la generación de señales hasta su almacenamiento y visualización.

---

## 11. Observaciones

La comunicación entre el Arduino Mega 2560 y AWS IoT Core constituye un avance importante para la primera etapa del prototipo, ya que permite establecer el flujo inicial de adquisición y transmisión de datos.

A partir de este punto, el trabajo debe enfocarse en completar el flujo de datos posterior al broker, procurando que la arquitectura permita recibir, procesar, almacenar y consultar las mediciones de manera confiable.

La documentación generada durante esta actividad servirá como base para registrar las configuraciones, pruebas y cambios realizados durante las siguientes etapas del proyecto.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 19/08/2026

**Pendientes:**

No existen pendientes correspondientes a las actividades realizadas durante esta jornada. Las actividades indicadas en la sección de próximos pasos corresponden a tareas posteriores del proyecto.