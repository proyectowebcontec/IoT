# Bitácora — 22-09-2026

**Fecha:** 22/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Frontend de historial de monitoreos y publicación de mensajes MQTT desde el Gateway 206

---

## 1. Objetivo

**Objetivo:**

Crear en el frontend la vista de historial de monitoreos, con su funcionalidad y la opción de exportar los resultados en formato CSV. Lograr la publicación de un mensaje al broker MQTT desde el gateway NE-206, resolviendo los errores de transmisión que se presenten en el proceso.

---

## 2. Actividad realizada

1. Se creó el frontend para mostrar el historial de monitoreos.
2. Se dio funcionalidad a la vista de historial de monitoreos.
3. Se incluyó la opción de exportar los resultados del historial en formato CSV.
4. Se realizaron pruebas de publicación de un mensaje al broker MQTT desde el gateway NE-206 mediante un script de prueba (`Left button press`).
5. Durante las pruebas se presentó un error de transmisión (`error 256 [Invalid transmission]`), el cual fue solventado modificando un parámetro de la configuración del gateway.
6. Se logró publicar exitosamente un mensaje al broker MQTT desde el gateway NE-206 y se verificó su recepción en MQTTX, suscrito al tópico `test/mqtt`.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo desde el cual se publicó el mensaje de prueba al broker MQTT |
| Broker MQTT | AWS EC2 (44.219.190.29) | — | Recibir el mensaje publicado por el gateway NE-206 |
| Cliente MQTT | MQTTX | — | Suscribirse al tópico `test/mqtt` y verificar la recepción del mensaje |
| Frontend | Vite + React | — | Mostrar el historial de monitoreos y permitir su exportación en CSV |
| WinIFDesigner | — | — | Software utilizado para la configuración del gateway NE-206 y el script de prueba `Left button press` |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** No aplica

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner (script `Left button press`), MQTTX, Vite + React
* **Librerías / dependencias:** Blob, librería usada para la exportación a CSV en el frontend.

### Comunicación

* **Protocolo:** MQTT
* **IP / dirección:** Broker: 44.219.190.29
* **Puerto:** 1883
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** `test/mqtt`
* **QoS:** 0
* **Otros parámetros:** Script de prueba: `Left button press`

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Historial de monitoreos en el frontend | No existía | Vista de historial de monitoreos, funcional, con opción de exportación a CSV | Permitir consultar y exportar el histórico de datos monitoreados |
| Parámetro de configuración MQTT del gateway NE-206 | Parámetro que generaba el error `256 [Invalid transmission]` (no se registró cuál) | Parámetro modificado, resolviendo el error de transmisión | Corregir el error de transmisión que impedía mantener la publicación/conexión MQTT de forma estable |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se creó exitosamente el frontend de historial de monitoreos, con funcionalidad completa y opción de exportación a CSV.
* Se logró publicar exitosamente un mensaje al broker MQTT desde el gateway NE-206.
* Se verificó la recepción del mensaje publicado mediante MQTTX, suscrito al tópico `test/mqtt`.
* Se identificó y solventó un error de transmisión (`error 256 [Invalid transmission]`) presentado durante las pruebas, mediante la modificación de un parámetro de configuración del gateway.

### Datos relevantes

```text
Logs relevantes del script Mqtt_Prueba:

15:14:45.998  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 1 [Connecting now.]
15:14:46.144  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 2 [Connected]
15:14:48.058  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 0 [Disconnected]
15:14:48.058  Error        liner error [Mqtt_Prueba] : mqtt 44.219.190.29 error 256 [Invalid transmission]
15:14:56.004  Error        liner error [Mqtt_Prueba] : linker diagnose disconnected and now connecting.....
15:14:56.004  Information  liner message [Mqtt_Prueba] : mqtt reset subscribe
15:14:56.004  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 1 [Connecting now.]
15:14:56.212  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 2 [Connected]
15:14:56.212  Information  liner message [Mqtt_Prueba] : subscribe topic [test/mqtt] succeed
15:14:56.295  Information  liner message [Mqtt_Prueba] : [test/mqtt] subscribed
15:14:57.274  Information  liner message [Mqtt_Prueba] : mqtt 44.219.190.29 state 0 [Disconnected]
15:14:57.274  Error        liner error [Mqtt_Prueba] : mqtt 44.219.190.29 error 256 [Invalid transmission]
15:15:04.241  Error        liner error [Mqtt_Prueba] : linker diagnose disconnected and now connecting.....
15:15:04.241  Information  liner message [Mqtt_Prueba] : mqtt reset subscribe
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Error de transmisión `256 [Invalid transmission]`, con desconexiones y reconexiones repetidas del cliente MQTT (`Left button press`) en el gateway NE-206 | Durante las pruebas de conexión y suscripción al broker MQTT, 22/09/2026 ~15:14–15:15 | Alto — impedía mantener una conexión MQTT estable para publicar mensajes | Captura del log de eventos (ver evidencias) |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Al conectar el gateway NE-206 al broker MQTT, se presentaba el error `256 [Invalid transmission]`, seguido de desconexiones y ciclos de reconexión repetidos (`linker diagnose disconnected and now connecting.....`), incluso después de lograr la suscripción exitosa al tópico `test/mqtt`.

**Causa identificada:**
No se registró con precisión la causa raíz; se identificó que estaba asociada a un parámetro específico de la configuración MQTT del gateway, pero no quedó anotado cuál fue.

**Solución aplicada:**
Se modificó un parámetro de la configuración MQTT del gateway (parámetro no registrado), lo que permitió estabilizar la conexión.

**Resultado posterior:**
Se logró publicar exitosamente un mensaje al broker MQTT desde el gateway NE-206, verificado mediante su recepción en MQTTX.

> **Nota:** No quedó documentado el parámetro específico que se modificó para resolver este error. Se revisó la configuración actual del gateway NE-206, tratando de identificar y registrar dicho parámetro para referencia futura, pero no fue posible. Probablemente, fue el tipo de variable que estuvo configurada como numero, pero en el script de prueba se intentó enviar un texto o emplear el mismo topic para publicar y suscribir al gateway. 

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Log 01 | Captura del log de eventos mostrando el error `256 [Invalid transmission]` y los ciclos de reconexión | ./imgs/2026-09-22/Error_Transmision_Mqtt.png |
| Captura 01 | Script de prueba (`Mqtt_Prueba`) utilizado para enviar el mensaje desde el gateway NE-206 | ./imgs/2026-09-22/Script_Mensaje_Prueba_Mqtt.png |
| Captura 02 | Recepción del mensaje en MQTTX, suscrito al tópico `test/mqtt` | ./imgs/2026-09-22/Recepcion_Mensajes_MqttX.png |
| Captura 03 | Vista del historial de monitoreos en el frontend, con opción de exportación a CSV | ./imgs/2026-09-22/Frontend_Historial.png |

* [Log 01](./imgs/2026-09-22/Error_Transmision_Mqtt.png)
* [Captura 01](./imgs/2026-09-22/Script_Mensaje_Prueba_Mqtt.png)
* [Captura 02](./imgs/2026-09-22/Recepcion_Mensajes_MqttX.png)
* [Captura 03](./imgs/2026-09-22/Frontend_Historial.png)

---

## 10. Próximos pasos

* Identificar y documentar con precisión el parámetro de configuración MQTT del gateway NE-206 que resolvió el error `256 [Invalid transmission]`, para referencia en futuras configuraciones.
* Continuar validando la estabilidad de la conexión MQTT del gateway NE-206 en pruebas más prolongadas.
* Integrar el envío de datos reales (no solo de prueba) desde el gateway NE-206 hacia el broker MQTT.

---

## 11. Observaciones

Si bien se logró resolver el error de transmisión y publicar exitosamente un mensaje desde el gateway NE-206, no quedó registrado el parámetro de configuración específico que se modificó para solucionarlo. Esto representa un vacío en la documentación que podría dificultar el diagnóstico de un problema similar en el futuro, por lo que se deja como próximo paso identificar y documentar dicho parámetro.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 22/09/2026

**Pendientes:**
Documentar el parámetro de configuración MQTT que resolvió el error `256 [Invalid transmission]` en el gateway NE-206.