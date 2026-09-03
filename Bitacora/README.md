# BITÁCORA DE ACTIVIDADES

## Proyecto de Integración IoT

**Proyecto:** Integración de equipos industriales, Gateway y AWS IoT

**Responsable:** Katherinne Gómez

**Fecha de inicio:** 18/08/2026

**Fecha de finalización:** [DD/MM/AAAA]

**Versión del documento:** 1.0

---

## 1. Descripción

Esta bitácora tiene como finalidad registrar de manera cronológica las actividades realizadas durante el desarrollo, configuración, integración y validación del proyecto.

Cada actividad se documenta individualmente para mantener trazabilidad sobre las configuraciones utilizadas, cambios realizados, resultados obtenidos, errores encontrados, soluciones aplicadas y evidencias generadas.

---

## 2. Estructura de la bitácora

Las actividades se encuentran organizadas por fecha:

| Fecha        | Actividad                           | Archivo                                          |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| 18-08-2026 | Se estableció la comunicación de señales capturadas por un arduino  Mega 2560 hacia la Nube de AWS utilizando AWS IoT Core como Broker. Se investigó la creación de dashboards utilizando IoT SiteWise y Managed Grafana. Se inició la documentación del proyecto y la propia bitácora. | [Ver bitácora](./Mes1/2026-08-18-comunicacion-arduino-aws.md) |
| [DD/MM/AAAA] | [Descripción breve de la actividad] | [Ver bitácora](./AAAA-MM-DD-nombre-actividad.md) |
| [DD/MM/AAAA] | [Descripción breve de la actividad] | [Ver bitácora](./AAAA-MM-DD-nombre-actividad.md) |

> Agregar una nueva fila por cada jornada o actividad documentada.

---

## 3. Etapas del proyecto

### Etapa 1 — Comunicación con equipos industriales

* Identificación de equipos y protocolos de comunicación.
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

## 5. Convención de nombres

Se utilizará el siguiente formato:

```text
AAAA-MM-DD-nombre-actividad.md
```

Ejemplo:

```text
2026-08-18-configuracion-mqtt.md
2026-08-19-prueba-comunicacion-plc.md
2026-08-20-lectura-variables-plc.md
```

Para las evidencias:

```text
evidencias/
├── 2026-08-18/
│   ├── captura-01.png
│   ├── captura-02.png
│   └── log-mqtt.txt
├── 2026-08-19/
│   └── captura-01.png
└── 2026-08-20/
    └── fotografia-01.jpg
```
