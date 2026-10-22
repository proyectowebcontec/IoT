# Bitácora — 29-09-2026

**Fecha:** 29/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Implementación de Twilio, mejoras estéticas del frontend y reunión de seguimiento

---

## 1. Objetivo

**Objetivo:**

Investigar e implementar la integración de Twilio para el envío de notificaciones ante eventos industriales, utilizando una cola y un worker que no afecten el proceso de inserción de datos en la base de datos. Realizar mejoras estéticas en el frontend (identidad visual, claridad de etiquetas y navegación en el historial de registros). Dar seguimiento, junto con el ingeniero Carlos Arias, a la planificación de la reunión con los jefes y a la definición de las alarmas del sistema.

---

## 2. Actividad realizada

1. Se investigó cómo implementar Twilio en el proyecto para el envío de notificaciones.
2. Se creó el código de integración con Twilio, incluyendo una cola y un worker, de modo que el envío de notificaciones no perjudique el proceso de inserción de datos en la base de datos.
3. Se intentó probar la integración con Twilio, sin poder completarse correctamente: las credenciales compartidas para su uso habían sido eliminadas o habían expirado.
4. Se notificó al ingeniero responsable sobre el problema con las credenciales de Twilio; este se comprometió a generar nuevas credenciales para el día siguiente.
5. Se realizaron cambios estéticos en el frontend:
   * Se añadió el logo de Contec a la página web.
   * Se reemplazaron etiquetas genéricas por etiquetas claras y específicas.
   * Se agregó navegación (paginación) en la tabla de registros históricos, mostrando una cantidad limitada de registros por página y permitiendo avanzar a las siguientes páginas para ver el resto.
6. Se trasladó la reunión de presentación de avances con los jefes de Contec.
7. Se realizó una reunión de seguimiento con el ingeniero Carlos Arias, en la que se trataron los siguientes puntos:
   * Se confirmó que la reunión con los jefes se movió para el jueves a las 2:00 p. m., debido a que no estarían disponibles todos los involucrados e interesados.
   * Se revisó el tema de las alarmas, acordando usar umbrales específicos por variable/fase, y ajustar el valor de dichos umbrales de modo que la alarma pueda demostrarse durante la presentación.
   * El ingeniero Carlos Arias propuso simplificar la demostración incorporando un botón en el dashboard que dispare una notificación/alarma de prueba al presionarlo.
   * Se mencionó la necesidad de estandarizar la visualización de los datos: reducir la cantidad de decimales mostrados, mejorar el formato general y agregar el logo de la empresa (en línea con el cambio ya realizado en el frontend este mismo día).

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Twilio | — | — | Servicio utilizado para el envío de notificaciones ante eventos industriales |
| Backend | Python | — | Implementación de la cola y el worker para el envío de notificaciones vía Twilio |
| Frontend | Vite + React | — | Interfaz web sobre la que se realizaron los cambios estéticos (logo, etiquetas, paginación) |

---

## 4. Configuración

### Hardware

No aplica para esta actividad.

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Twilio (API de notificaciones); Vite + React (frontend)
* **Librerías / dependencias:** twilio, queue, logging, threading; librería/SDK de Twilio y de manejo de colas/worker utilizados

### Comunicación

* **Protocolo:** API REST (Twilio)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** API de Twilio
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Credenciales de Twilio pendientes de renovación (ver sección de errores/obstáculos)

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Envío de notificaciones | Sin integración con Twilio | Código de integración con Twilio implementado, con cola y worker dedicados | Permitir el envío de notificaciones ante eventos industriales sin afectar el proceso de inserción de datos en la base de datos |
| Identidad visual del frontend | Sin logo de la empresa | Logo de Contec añadido a la página web | Mejorar la identidad visual del sistema |
| Etiquetas del frontend | Etiquetas genéricas | Etiquetas claras y específicas | Mejorar la claridad y comprensión de la interfaz para el usuario |
| Tabla de registros históricos | Sin navegación, mostrando todos los registros | Navegación (paginación) agregada, mostrando una cantidad limitada de registros por página | Mejorar el rendimiento y la usabilidad de la tabla de historial |
| Fecha de la reunión con los jefes de Contec | Fecha original | Trasladada al jueves a las 2:00 p. m. | No todos los involucrados e interesados estarían disponibles en la fecha original |
| Configuración de alarmas (acordado, pendiente de implementar) | Sin definir | Umbrales específicos por variable/fase, ajustables para fines de demostración | Permitir una demostración controlada de las alarmas durante la presentación con los jefes |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se completó la investigación y el desarrollo del código de integración con Twilio, incluyendo la cola y el worker.
* No fue posible probar correctamente la integración con Twilio debido a que las credenciales compartidas estaban eliminadas o expiradas.
* Se notificó oportunamente al ingeniero responsable, quien se comprometió a generar nuevas credenciales al día siguiente.
* Se completaron exitosamente los cambios estéticos del frontend: logo de Contec, etiquetas claras y navegación en la tabla de registros históricos.
* Se gestionó el traslado de la reunión con los jefes de Contec al jueves a las 2:00 p. m.
* Se realizó la reunión de seguimiento con el ingeniero Carlos Arias, definiendo acuerdos clave sobre las alarmas, la simplificación de la demo y la estandarización de la visualización de datos.

### Datos relevantes

```text
Acuerdos de la reunión de seguimiento con el Ing. Carlos Arias:
- Reunión con los jefes de Contec: trasladada al jueves, 2:00 p. m.
- Alarmas: umbrales específicos por variable/fase, ajustables para la demostración
- Demo simplificada: botón en el dashboard para disparar una notificación/alarma de prueba
- Estandarización de visualización: menos decimales, mejor formato, logo de la empresa
```

```text
Mensaje de error de twilio

HTTP Error Your request was:

POST /Accounts/AccountID/Messages.json

Twilio returned the following information:

Unable to create record: authentication failed, account AcountID with status 4 is not active

More information may be available here:

https://www.twilio.com/docs/errors/20003
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto |
| ------------------ | ------- | ------- |
| Las credenciales compartidas para el uso de Twilio estaban eliminadas o habían expirado | Al intentar probar la integración con Twilio | Alto — impidió probar correctamente el envío de notificaciones |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
No fue posible probar correctamente la integración con Twilio, ya que las credenciales compartidas para su uso habían sido eliminadas o habían expirado.

**Causa identificada:**
Vencimiento o eliminación de las credenciales de Twilio previamente compartidas.

**Solución aplicada:**
Se notificó al ingeniero responsable sobre el problema; este se comprometió a generar nuevas credenciales para el día siguiente (30/09/2026).

**Resultado posterior:**
Pendiente de confirmar al recibir las nuevas credenciales; la prueba de la integración con Twilio queda como tarea para la siguiente jornada.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Captura 01 | Frontend con el logo de Contec y etiquetas actualizadas. | ./imgs/2026-09-29/Cambios_frontend.jpg |
| Captura 02 | Definición de reglas para activar las alarmas. | ./imgs/2026-09-29/Cambios_frontend.jpg |

* [Captura 01](./imgs/2026-09-29/Cambios_frontend.jpg)
* [Captura 02](./imgs/2026-09-29/DeclaracionReglasAlarmaMonitoreo.png)


---

## 10. Próximos pasos

* Probar la integración con Twilio una vez recibidas las nuevas credenciales (comprometidas para el 30/09/2026).
* Implementar los umbrales de alarma por variable/fase acordados con el Ing. Carlos Arias, ajustables para la demostración.
* Implementar el botón en el dashboard para disparar una notificación/alarma de prueba.
* Estandarizar la visualización de datos en el frontend: reducir decimales y mejorar el formato general.
* Confirmar la asistencia de todos los involucrados e interesados a la reunión reprogramada con los jefes de Contec (jueves, 2:00 p. m.).

---

## 11. Observaciones

A pesar de no haber podido probar la integración con Twilio por el problema de credenciales, el desarrollo del código (incluyendo la cola y el worker) quedó completado y listo para pruebas tan pronto se reciban las nuevas credenciales. La reunión de seguimiento con el ingeniero Carlos Arias dejó una hoja de ruta clara de cara a la presentación con los jefes de Contec, trasladada al jueves a las 2:00 p. m., enfocada en demostrar el sistema de alarmas de forma controlada y con una visualización de datos más pulida.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 29/09/2026

**Pendientes:**
Probar la integración con Twilio con las nuevas credenciales, implementar los umbrales de alarma y el botón de prueba en el dashboard, y estandarizar la visualización de datos antes de la reunión reprogramada con las autoridades involucradas en el proyecto de Contec.