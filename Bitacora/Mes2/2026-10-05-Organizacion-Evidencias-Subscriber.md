# Bitácora — 05-10-2026

**Fecha:** 05/10/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Organización de evidencias, investigación de WebSockets y actualización del subscriber para soportar alta frecuencia de publicación

---

## 1. Objetivo

**Objetivo:**

Organizar las evidencias generadas durante el proyecto hasta la fecha. Avanzar en la documentación del proyecto. Investigar WebSockets como posible mecanismo de comunicación en tiempo real. Analizar y actualizar el subscriber del sistema para que soporte correctamente la velocidad de publicación de 100 ms del gateway, y validar su funcionamiento junto con la actualización del mecanismo de activación de notificaciones.

---

## 2. Actividad realizada

1. Se organizaron las evidencias generadas durante todo el proyecto hasta la fecha (fotografías, capturas de pantalla, videos, entre otras), separándolas por fecha y asignándoles nombres representativos.
2. Se avanzó en la documentación del proyecto.
3. Se investigó el uso de WebSockets.
4. Se realizó un análisis de las características que debía tener el subscriber para soportar correctamente la velocidad de 100 ms a la que el gateway publica los datos. Se identificó la necesidad de:
   * Separar la recepción de los datos del proceso de almacenamiento.
   * Utilizar colas acotadas.
   * Incorporar workers dedicados.
   * Implementar logging con muestreo, en lugar de registrar cada evento individualmente.
5. Se actualizó el subscriber conforme a este análisis y se probó con un envío de datos a una frecuencia de 1 segundo, funcionando correctamente.
6. Se actualizó también la forma de activar las notificaciones, la cual funcionó correctamente en las pruebas realizadas.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Subscriber | Python | — | Proceso que recibe los mensajes del broker MQTT y los almacena en la base de datos; actualizado para soportar alta frecuencia de publicación |
| Broker MQTT | AWS EC2 | — | Origen de los mensajes publicados por el gateway, consumidos por el subscriber |
| Repositorio de documentación/evidencias | — | — | Organización de fotografías, capturas y videos del proyecto por fecha |

---

## 4. Configuración

### Hardware

No aplica para esta actividad.

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Python (subscriber); logging, queue librería de colas/workers utilizada, trheading
* **Librerías / dependencias:** logging, queue, threading

### Comunicación

* **Protocolo:** MQTT (recepción de datos por el subscriber)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** Frecuencia de publicación objetivo: 100 ms (frecuencia real del gateway); frecuencia utilizada en la prueba de esta jornada: 1 s

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Arquitectura del subscriber | Recepción y almacenamiento de datos realizados de forma conjunta, sin colas ni workers dedicados | Recepción separada del almacenamiento, con colas acotadas, workers dedicados y logging con muestreo | Soportar correctamente la velocidad de publicación de 100 ms del gateway, sin perder mensajes ni saturar el sistema |
| Activación de notificaciones | Mecanismo anterior | Mecanismo actualizado | Mejorar el funcionamiento de la activación de notificaciones, validado junto con la actualización del subscriber |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se organizaron exitosamente las evidencias del proyecto generadas hasta la fecha, separadas por fecha y con nombres representativos.
* Se avanzó en la documentación del proyecto.
* Se investigó el uso de WebSockets como posible mecanismo de comunicación en tiempo real.
* Se identificaron las características necesarias para que el subscriber soporte la velocidad de 100 ms del gateway: separación de recepción/almacenamiento, colas acotadas, workers y logging con muestreo.
* Se actualizó exitosamente el subscriber, probándose correctamente con un envío de datos a 1 segundo.
* Se actualizó exitosamente la forma de activar las notificaciones, validada en las mismas pruebas.

### Datos relevantes

```text
Frecuencia de publicación del gateway (objetivo): 100 ms
Frecuencia utilizada en la prueba del subscriber actualizado: 1 s
Características incorporadas al subscriber: recepción/almacenamiento separados, colas acotadas, workers, logging con muestreo
```

---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes durante la actividad.

---

## 8. Solución aplicada

No aplica, ya que no se presentaron errores u obstáculos durante esta actividad.

---

## 9. Evidencias

No se cuenta con evidencias para esta jornada.

---

## 10. Próximos pasos

* Probar el subscriber actualizado a la frecuencia real de publicación del gateway (100 ms), en lugar de la frecuencia de prueba utilizada en esta jornada (1 s).
* Evaluar la implementación de WebSockets, según lo investigado en esta jornada, para la comunicación en tiempo real del sistema.
* Continuar avanzando en la documentación general del proyecto.
* Mantener organizadas las evidencias generadas en las jornadas siguientes, siguiendo el esquema de nombres y fechas definido en esta actividad.

---

## 11. Observaciones

El análisis realizado sobre las características necesarias del subscriber (separación de recepción y almacenamiento, colas acotadas, workers y logging con muestreo) responde directamente al objetivo del segundo mes del proyecto, definido en la reunión del 21/09/2026 con el Ing. Carlos Arias: lograr el envío seguro y estable de datos desde el gateway hacia AWS, considerando la frecuencia real de publicación de 100 ms. La prueba realizada en esta jornada se limitó a una frecuencia de 1 segundo, por lo que queda pendiente validar el comportamiento del subscriber actualizado a la frecuencia real objetivo.

No se generaron evidencias fotográficas, capturas ni videos durante esta jornada.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 05/10/2026

**Pendientes:**
Validar el subscriber actualizado a la frecuencia real de publicación del gateway (100 ms) y evaluar la implementación de WebSockets.