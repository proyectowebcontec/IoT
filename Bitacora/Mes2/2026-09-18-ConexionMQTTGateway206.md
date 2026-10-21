# Bitácora — 18-09-2026

**Fecha:** 18/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Configuración MQTT en el Gateway 206, refactorización del backend y recuperación de cambios con Git

---

## 1. Objetivo

**Objetivo:**

Recuperar cambios de código perdidos mediante herramientas de Git. Configurar y verificar la conexión MQTT del gateway NE-206 al broker alojado en AWS. Continuar la refactorización del backend, estandarizando mensajes de error y construyendo esquemas y modelos de datos con Pydantic. Iniciar las configuraciones necesarias para leer o enviar un mensaje desde el gateway NE-206.

---

## 2. Actividad realizada

1. Se recuperaron cambios de código que se habían perdido, mediante los comandos `git stash` y `git reflog`.
2. Se configuró MQTT en el gateway NE-206 y se verificó la conexión al broker alojado en AWS, confirmando la conexión tanto en la configuración del gateway como en la consola de AWS.
3. Se continuó la refactorización del backend:
   * Se estandarizaron los mensajes de error.
   * Se construyeron esquemas para los datos recibidos por el gateway y la forma en que estos se almacenan en la base de datos.
   * Se construyeron modelos para la recepción y el envío de mensajes.
   * Todo lo anterior se apoyó en la librería Pydantic.
4. Se iniciaron las configuraciones para intentar leer o enviar un mensaje desde el gateway NE-206, sin lograrlo.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo configurado para la conexión MQTT al broker de AWS y para las pruebas de lectura/envío de mensajes |
| Broker MQTT | AWS EC2 | — | Recibir la conexión y los mensajes del gateway NE-206 |
| Repositorio de código | Git | — | Control de versiones; recuperación de cambios perdidos mediante `git stash` y `git reflog` |
| Backend | Python / Pydantic | — | Proyecto sobre el cual se implementaron los esquemas, modelos y estandarización de mensajes de error |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Gateway conectado a internet (configuración de red establecida previamente el 17/09/2026)

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Git (`git stash`, `git reflog`); WinIFDesigner (configuración MQTT del gateway); Pydantic (esquemas y modelos del backend)
* **Librerías / dependencias:** Pydantic (esquemas de datos del gateway y de la base de datos, modelos de recepción/envío de mensajes)

### Comunicación

* **Protocolo:** MQTT
* **IP / dirección:** 44.219.190.29
* **Puerto:** 1883
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** No aplica

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Código del proyecto | Cambios perdidos | Cambios recuperados mediante `git stash` y `git reflog` | Recuperar trabajo previamente realizado que se había perdido |
| Conexión MQTT del gateway NE-206 | Sin configurar | Configurada y verificada la conexión al broker de AWS | Habilitar la comunicación MQTT del gateway NE-206, replicando el flujo del gateway WHG-151 |
| Validación y estructura de datos del backend | Mensajes de error sin estandarizar; sin esquemas ni modelos formales | Mensajes de error estandarizados; esquemas para datos del gateway y la base de datos; modelos para recepción y envío de mensajes (todo con Pydantic) | Mejorar la robustez, consistencia y mantenibilidad del backend |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se recuperaron exitosamente los cambios de código que se habían perdido, mediante `git stash` y `git reflog`.
* Se configuró y verificó exitosamente la conexión MQTT del gateway NE-206 al broker de AWS, confirmada tanto en el gateway como en la consola de AWS.
* Se avanzó exitosamente en la refactorización del backend: estandarización de mensajes de error, esquemas de datos y modelos de mensajes con Pydantic.
* No se logró completar la configuración para leer o enviar un mensaje desde el gateway NE-206.

### Datos relevantes

```text
1789755020: New client connected from 190.56.173.52:33010 as d0b8e6cd2c3e4df6bac78781961678e5 (p2, c1, k60, u'mqttuser').
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto |
| ------------------ | ------- | ------- |
| No se logró completar la configuración para leer o enviar un mensaje desde el gateway NE-206 | Al iniciar las configuraciones de lectura/envío de mensajes | Medio — impide, por el momento, replicar en el gateway NE-206 el flujo completo logrado con el gateway WHG-151 | 

---

## 8. Solución aplicada

### Problema 1

**Problema:**
No se logró leer ni enviar un mensaje desde el gateway NE-206, a pesar de haber iniciado las configuraciones correspondientes.

**Causa identificada:**
Aún no identificada.

**Solución aplicada:**
No se aplicó una solución en esta jornada; queda pendiente para una próxima sesión.

**Resultado posterior:**
El problema persiste; no se ha logrado leer ni enviar mensajes desde el gateway NE-206.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Captura 01 | Configuración del IO Link MQTT en el gateway NE-206 | ./imgs/2026-09-18/Configuracion-IOLinkMQTT-Configuracion.png|
| Captura 02 | Configuración del IO Device MQTT en el gateway NE-206 | ./imgs/2026-09-18/Configuracion-IODeviceMqtt-parametros.png |
| Captura 03 | Consola de AWS mostrando la conexión del gateway NE-206 al broker | ./imgs/2026-09-18/ClienteMqttGateway206.png |


* [Captura 01](./imgs/2026-09-18/Configuracion-IOLinkMQTT-Configuracion.png)
* [Captura 02](./imgs/2026-09-18/Configuracion-IODeviceMqtt-parametros.png)
* [Captura 03](./imgs/2026-09-18/ClienteMqttGateway206.png)

---

## 10. Próximos pasos

* Continuar y completar la configuración para leer o enviar un mensaje desde el gateway NE-206.
* Continuar la refactorización del backend, extendiendo los esquemas y modelos de Pydantic al resto de los endpoints.
* Revisar y documentar las buenas prácticas de uso de Git aplicadas (`git stash`, `git reflog`) para evitar pérdidas de cambios en el futuro.

---

## 11. Observaciones

La conexión MQTT del gateway NE-206 al broker de AWS quedó verificada exitosamente, lo cual representa un avance importante hacia replicar con este gateway el flujo ya logrado con el gateway WHG-151. Sin embargo, aún queda pendiente lograr la lectura o el envío efectivo de mensajes desde el gateway NE-206, por lo que el resultado general de la jornada se considera parcial.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 18/09/2026

**Pendientes:**
Completar la configuración para leer o enviar un mensaje desde el gateway NE-206.