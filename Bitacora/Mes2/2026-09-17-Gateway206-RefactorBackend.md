# Bitácora — 17-09-2026

**Fecha:** 17/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Configuración de red del Gateway 206, refactorización del backend y reunión de avances

---

## 1. Objetivo

**Objetivo:**

Lograr la conexión a internet del gateway NE-206 mediante un router, resolviendo el problema de aplicación de cambios en la configuración de red. Continuar con la refactorización del backend, agregando validaciones de datos por esquemas. Reportar avances del primer mes al ingeniero Carlos Arias y coordinar los siguientes pasos de comunicación del proyecto.

---

## 2. Actividad realizada

1. Se trabajó en las configuraciones de red del gateway NE-206, logrando la conexión a internet por medio de un router (la conexión mediante la tarjeta SIM queda pendiente).
2. Se identificó y resolvió el problema por el cual los cambios de configuración de red no se aplicaban: era necesario marcar la casilla "network update" para que los cambios tuvieran efecto. El ingeniero Hernán verificó esta parte.
3. Tras aplicar el cambio, la IP del gateway pasó de 192.168.1.223 a 192.168.1.250, y la red LAN pasó de su configuración anterior a 192.168.2.250; el resto de las redes/interfaces se deshabilitaron.
4. Se inició la refactorización del backend, agregando validaciones de datos por medio de esquemas: se implementó Pydantic y validaciones de fecha.
5. Se estandarizaron los mensajes de error del backend.
6. Se realizó una reunión con el ingeniero Carlos Arias (jefe directo) para comentar los avances del proyecto.
7. Se enviaron, a solicitud del ingeniero Carlos Arias, dos correos: uno dirigido a él sobre los logros del primer mes y el cumplimiento del KPI, y otro para convocar una reunión de avances con los superiores.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo configurado para la conexión a internet mediante router |
| Router | [Placeholder] | — | Proveer conectividad a internet al gateway NE-206 |
| WinIFDesigner | [Placeholder — versión] | — | Software utilizado para la configuración de red del gateway |
| Backend | [Placeholder] | — | Proyecto sobre el cual se implementó Pydantic y la estandarización de mensajes de error |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Gateway conectado a internet mediante router

### Software

* **Sistema operativo:** [Placeholder — completar]
* **Software utilizado:** WinIFDesigner (configuración de red del gateway); Pydantic (validaciones de esquemas en el backend)
* **Librerías / dependencias:** Pydantic (validaciones de datos y de fecha en el backend)

### Comunicación

* **Protocolo:** Ethernet / internet mediante router
* **IP / dirección:** Gateway NE-206 — anterior: 192.168.1.223; nueva: 192.168.1.250. Red LAN: 192.168.2.250 (las demás interfaces de red se deshabilitaron)
* **Puerto:** [Placeholder — completar]
* **Endpoint / servidor:** No aplica
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Es necesario marcar la casilla "network update" para que los cambios de configuración de red se apliquen correctamente en el gateway NE-206

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Aplicación de cambios de red en el gateway NE-206 | Cambios no se aplicaban | Se marca la casilla "network update" para aplicar los cambios | Los cambios de configuración de red no surtían efecto sin marcar esta opción |
| IP del gateway NE-206 | 192.168.1.223 | 192.168.1.250 | Resultado de aplicar correctamente el cambio de configuración de red |
| Red LAN del gateway NE-206 | [Placeholder — configuración anterior] | 192.168.2.250 | Resultado de aplicar correctamente el cambio de configuración de red |
| Otras interfaces de red del gateway | Habilitadas | Deshabilitadas | Consecuencia de aplicar la nueva configuración de red |
| Validación de datos en el backend | Sin esquema de validación formal | Implementación de Pydantic, incluyendo validaciones de fecha | Mejorar la robustez y consistencia de los datos procesados por el backend |
| Mensajes de error del backend | Sin estandarizar | Estandarizados | Mejorar la claridad y consistencia de las respuestas de error del backend |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se logró la conexión a internet del gateway NE-206 mediante un router.
* Se resolvió el problema de aplicación de cambios en la configuración de red del gateway, identificando que era necesario marcar la casilla "network update".
* Se inició exitosamente la refactorización del backend con la implementación de Pydantic y validaciones de fecha.
* Se estandarizaron los mensajes de error del backend.
* Se realizó la reunión de avances con el ingeniero Carlos Arias y se enviaron los dos correos solicitados (reporte del primer mes/KPI y convocatoria de reunión con los superiores).

### Datos relevantes

```text
IP del gateway NE-206 — anterior: 192.168.1.223 / nueva: 192.168.1.250
Red LAN del gateway NE-206: 192.168.2.250
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Los cambios realizados en la configuración de red del gateway NE-206 no se aplicaban | Durante la configuración de red para la conexión por router | Alto — impedía avanzar con la conexión a internet del gateway | Fotografía del checkbox "network update" |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Los cambios realizados en la configuración de red del gateway NE-206 no se aplicaban.

**Causa identificada:**
No se estaba marcando la casilla "network update", requerida para que los cambios de configuración de red tuvieran efecto. Esta parte fue verificada por el ingeniero Hernán.

**Solución aplicada:**
Se marcó la casilla "network update" al aplicar la configuración.

**Resultado posterior:**
Los cambios se aplicaron correctamente: la IP del gateway pasó de 192.168.1.223 a 192.168.1.250, la red LAN pasó a 192.168.2.250, y las demás interfaces de red se deshabilitaron, logrando la conexión a internet mediante el router.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Fotografía del checkbox | Casilla "network update" marcada, verificada por el ingeniero Hernán | [Placeholder — ruta del archivo] |

---

## 10. Próximos pasos

* [ ] Configurar la conexión a internet del gateway NE-206 mediante la tarjeta SIM (queda pendiente).
* [ ] Continuar la refactorización del backend, extendiendo las validaciones por esquema y la estandarización de mensajes de error al resto de los endpoints.
* [ ] Dar seguimiento a la reunión de avances convocada con los superiores del proyecto.

---

## 11. Observaciones

La resolución del problema de aplicación de cambios en el gateway NE-206 (marcar "network update") es un hallazgo importante para la documentación del proceso de configuración de este equipo, ya que no es evidente a simple vista y fue necesaria la verificación del ingeniero Hernán para identificarlo.

Esta jornada combinó avances técnicos (red del gateway NE-206 y refactorización del backend) con avances de gestión del proyecto: la reunión con el ingeniero Carlos Arias y el envío de los correos sobre los logros del primer mes, el cumplimiento del KPI y la convocatoria de la reunión de avances con los superiores.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 17/09/2026

**Pendientes:**
Configurar la conexión a internet del gateway NE-206 mediante la tarjeta SIM.