# Bitácora — 25-08-2026 y 26-08-2026

**Fecha:** 25/08/2026 y 26/08/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Conexión MQTT del Gateway HWG-151 al broker en AWS EC2

---

## 1. Objetivo

Conectar correctamente el gateway HWG-151 al broker MQTT ubicado en una instancia EC2, verificar la conexión, el envío de señales y su formato. Asimismo, validar su comportamiento cuando se realiza una llamada al número de la tarjeta SIM y comprender el flujo de los componentes en un polipasto a través de una visita técnica guiada por Wanderley.

---

## 2. Actividad realizada

1. Configuración del gateway GAOTek WHG-151 para conectarse al broker MQTT desplegado en una instancia AWS EC2.
2. Diagnóstico y solución del problema de conexión relacionado con el puerto MQTT (8883 con TLS vs. 1883 sin TLS), habilitando temporalmente el puerto 1883.
3. Conexión de señales de prueba (botón, joystick y potenciómetro) a las entradas DI3, AVI6, AVI7 y AVI8 del gateway.
4. Verificación de la publicación de mensajes en el tópico `test/mqtt` mediante suscripción con el cliente MQTTX.
5. Realización de múltiples llamadas al número de la tarjeta SIM del gateway, monitoreando la consola del equipo durante las mismas.
6. Visita técnica guiada por Wanderley para observar el diagnóstico de un polipasto averiado y comprender el flujo de sus componentes.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ---------------- | -------------- | -------------- | ------- |
| Gateway industrial | GAOTek WHG-151 | — | Recibir la señal mediante las entradas analógicas AVI6, AVI7 y AVI8, y la entrada digital DI3 |
| Potenciómetro | 10 kΩ | — | Generar la señal de entrada analógica de tensión (AVI8) |
| Joystick | HW-504 | — | Generar las señales de entrada analógica de tensión (AVI6, AVI7) |
| Fuente de alimentación | 5 VDC | — | Alimentar el potenciómetro y el joystick |
| Cableado | — | — | Interconexión entre los dispositivos |
| Relé | JQC3F-05VDC-C / KY-019 | — | Interfaz de conmutación entre el circuito del pulsador y el gateway (DI3) |
| Pulsador | — | — | Generación de la señal digital de entrada |
| Broker MQTT | AWS EC2 | — | Recibir los mensajes publicados por el gateway |
| Cliente MQTT | MQTTX | — | Suscribirse al tópico y verificar los mensajes recibidos |
| Tarjeta SIM | — | — | Prueba de comportamiento del gateway ante llamadas entrantes |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek WHG-151
* **Alimentación:** 5 VDC (para potenciómetro y joystick); gateway con su alimentación propia
* **Conexiones:**
  * DI3 ← salida NO del módulo de relé (activado por el pulsador)
  * AVI6 ← Joystick eje X
  * AVI7 ← Joystick eje Y
  * AVI8 ← Potenciómetro

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** MQTTX (cliente MQTT), consola/interfaz de configuración del gateway WHG-151
* **Librerías / dependencias:** No aplica

### Comunicación

* **Protocolo:** MQTT
* **IP / dirección:** 44.219.190.29
* **Puerto:** 1883 (habilitado temporalmente; originalmente configurado en 8883 para TLS)
* **Endpoint / servidor:** Broker MQTT desplegado en instancia AWS EC2
* **Tópico:** `test/mqtt`
* **QoS:** 0
* **Otros parámetros:** Comunicación en MQTT plano (sin TLS) mientras se usó el puerto 1883

> No se incluyen contraseñas, claves privadas, tokens ni credenciales en este documento.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Puerto MQTT en EC2 | 8883 (único puerto habilitado, pensado para TLS) | 1883 habilitado temporalmente | El gateway enviaba los datos mediante MQTT plano y no aplicaba TLS, por lo que no lograba conectar por el 8883 |
| DNS del broker | Apuntaba a una IP incorrecta | Se configuró la IP correcta | Fallos de conexión desde MQTTX debido a una redirección DNS errónea |
| Acceso a la instancia EC2 | Sin acceso / sin permisos | Se concedieron permisos y se compartieron las claves de conexión | Imposibilidad de visualizar la conexión del gateway al broker (logs, CloudWatch) |

---

## 6. Resultados obtenidos

**Resultado general:** Exitoso

### Resultados específicos

* Se logró establecer la conexión del gateway WHG-151 al broker MQTT en AWS EC2 mediante el puerto 1883.
* Se verificó la publicación correcta de los mensajes en el tópico `test/mqtt`, recibidos exitosamente mediante el cliente MQTTX.
* Se comprobó la adquisición simultánea de una señal digital (DI3) y tres señales analógicas (AVI6, AVI7, AVI8).
* Se realizaron múltiples llamadas al número de la tarjeta SIM del gateway; no se observó ningún comportamiento anómalo en la consola durante las llamadas, y estas pasaron a buzón de voz tras el tiempo normal de espera.
* Se completó una visita técnica guiada por Wanderley, en la que se observó el diagnóstico de un polipasto averiado (contactor quemado) y se comprendió el rol de los tres contactores (K21, K22, K23) encargados del movimiento de la grúa.

### Datos relevantes

```text
[Placeholder — logs de conexión del broker, mensajes recibidos en test/mqtt y capturas de consola del gateway durante las llamadas a la SIM]
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Gateway no conecta con el broker | Configuración inicial de conexión MQTT | Alto — impedía cualquier prueba de comunicación | --- |
| Fallos de conexión desde MQTTX | Etapa de suscripción al tópico | Medio — impedía verificar la recepción de mensajes | /imgs/conexion_broker/Error_MQTTX.png |
| Imposibilidad de visualizar la conexión del gateway al broker | Revisión de logs / CloudWatch en EC2 | Medio — impedía diagnosticar el estado de la conexión |  |

### Evidencias
[Fallos de conexión desde MQTTX](./imgs/conexion_broker/Error_MQTTX.png)

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El gateway no lograba conectarse al broker MQTT.

**Causa identificada:**
El único puerto habilitado en la instancia EC2 era el 8883, pensado para conexión con TLS. Sin embargo, el gateway enviaba los datos mediante MQTT plano, sin aplicar TLS.

**Solución aplicada:**
Se habilitó temporalmente el puerto 1883 en el broker para permitir la conexión MQTT plana.

**Resultado posterior:**
El gateway logró conectarse correctamente al broker y publicar mensajes en el tópico `test/mqtt`.

### Problema 2

**Problema:**
MQTTX presentaba fallos de conexión al broker.

**Causa identificada:**
El dominio DNS del broker estaba redirigiendo hacia una IP equivocada.

**Solución aplicada:**
Se configuró la IP correcta de la instancia EC2.

**Resultado posterior:**
MQTTX logró conectarse y suscribirse correctamente al tópico `test/mqtt`.

### Problema 3

**Problema:**
No era posible visualizar el estado de la conexión del gateway al broker desde la EC2.

**Causa identificada:**
Falta de acceso a la instancia EC2 desplegada.

**Solución aplicada:**
Se concedieron los permisos correspondientes y se compartieron las claves de conexión necesarias.

**Resultado posterior:**
Se logró revisar los logs del broker y confirmar la conexión del gateway.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Configuración del gateway | Parámetros MQTT configurados en el WHG-151 | ./imgs/conexion_broker/configuraciones_mqtt_gateway151.jpeg |
| Habilitación del puerto 1883 | Captura de la configuración de seguridad en EC2 | ./imgs/conexion_broker/politicas_entrada_ec2.png |
| Logs de conexión del broker | Evidencia de la conexión del gateway al broker | ./imgs/conexion_broker/conexion_gateway_broker.png |
| Mensajes recibidos en MQTTX | Captura de los mensajes recibidos al suscribirse al tópico `test/mqtt` | ./imgs/conexion_broker/mensaje_publicado_gateway_1.png |

### Evidencias
[Configuración del gateway](./imgs/conexion_broker/configuraciones_mqtt_gateway151.jpeg)
[Habilitación del puerto 1883](./imgs/conexion_broker/politicas_entrada_ec2.png)
[Logs de conexión del broker](./imgs/conexion_broker/conexion_gateway_broker.png)
[Mensajes recibidos en MQTTX](./imgs/conexion_broker/mensaje_publicado_gateway_1.png)
[Mensajes recibidos en MQTTX](./imgs/conexion_broker/mensaje_publicado_gateway_2.png)

---

## 10. Próximos pasos

* Implementar la conexión mediante TLS y desactivar el puerto 1883 (queda pendiente como mejora de seguridad).
* Reemplazar progresivamente las señales de prueba por señales reales provenientes del PLC / instrumentos del polipasto.
* Evaluar el monitoreo de corriente y voltaje del motor de izaje, según lo conversado con Wanderley, para prevenir daños en los contactores (K21, K22, K23).

---

## 11. Observaciones

Durante la visita técnica guiada por Wanderley se observó el diagnóstico de un polipasto averiado por un contactor quemado. Se explicó que el movimiento de la grúa depende de tres contactores (K21, K22 y K23), y se identificó como necesidad futura del proyecto el monitoreo de la corriente y el voltaje del motor de izaje, con el fin de prevenir este tipo de daños en los equipos.

Respecto a las llamadas realizadas al número de la tarjeta SIM del gateway, no se detectó ningún comportamiento anómalo en la consola; las llamadas pasaron a buzón de voz tras el tiempo de espera habitual, lo cual se considera un comportamiento normal.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 26/08/2026

**Pendientes:**
Queda pendiente implementar la conexión mediante TLS (actualmente se usa el puerto 1883 sin cifrado de forma temporal) como mejora de seguridad antes de pasar a un entorno productivo.