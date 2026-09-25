# Integración

## Proyecto de Integración IoT

**Proyecto:** Integración de equipos industriales, Gateway y AWS IoT

**Responsable:** Katherinne Gómez

**Fecha de inicio:** 18/08/2026

**Fecha de finalización:** [DD/MM/AAAA]

**Versión del documento:** 1.0

---

## 1. Descripción

Esta documentación sobre la integración de los componentes industriales, el saftware desarrollado y las variables medidas. 

Cada actividad se documenta individualmente para mantener trazabilidad sobre las configuraciones utilizadas, resultados obtenidos y evidencias generadas.

---

## 2. Estructura de la documentación de integración

Las actividades se encuentran organizadas por la evolución en la integración:

| Actividad                           | Archivo                                          |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| Establecer la comunicación de señales capturadas por un arduino  Mega 2560 hacia la Nube de AWS utilizando AWS IoT Core como Broker. | [Ver documentación](./PythonGateway-AWSIoTCore.md) |
| Establecer la lectura de una variable digital proveniente del arduino Mega 2560 por medio del gateway GAOTek WHG 151 | [Ver documentación](./Arduino2560-Gateway151-Digital.md) |
| Establecer la lectura de una variables analógicas proveniente de distintos sensores por medio del gateway GAOTek WHG 151 | [Ver documentación](./Gateway151-LecturaAnalogica.md) |
| Integración del Gateway WHG-151 al Broker MQTT en AWS EC2 | [Ver documentación](./Gateway151-BrokerEC2.md) |
| Integración del Gateway WHG-151 al Broker MQTT en AWS EC2 V2 | [Ver documentación](./Gateway151-BrokerEC2_V2.md) |
| [Descripción breve de la actividad] | [Ver documentación](./AAAA-MM-DD-nombre-actividad.md) |

---

## 3. Etapas del proyecto

### Etapa 1 — Comunicación con equipos industriales

*  Identificación de equipos y protocolos de comunicación.
*  Identificación de variables disponibles.
*  Configuración de comunicación con el equipo industrial.
*  Pruebas de lectura de variables.
*  Documentación de configuración.

### Etapa 2 — Comunicación Gateway → AWS

*  Configuración del Gateway.
*  Configuración de MQTT.
*  Configuración de AWS IoT Core.
*  Configuración de certificados y políticas.
*  Pruebas de publicación.
*  Pruebas de suscripción.
*  Validación de recepción de mensajes.
*  Pruebas de reconexión y manejo de errores.

### Etapa 3 — Integración y validación

*  Integración completa: equipo industrial → Gateway → AWS.
*  Pruebas de funcionamiento continuo.
*  Pruebas ante pérdida de comunicación.
*  Validación de datos.
*  Documentación final.
*  Preparación de entrega.

---

## 4. Evidencias

Las evidencias asociadas a cada actividad deben almacenarse en la carpeta correspondiente y referenciarse desde su archivo de bitácora.

Ejemplos:

* Capturas de pantalla.
* Fotografías del equipo.
* Diagramas.
* Logs.
* Archivos de configuración.
* Resultados de pruebas.
* Registros de comunicación.
* Código utilizado.
* Documentación técnica.

---
