# Bitácora — 30-09-2026

**Fecha:** 30/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Botón de alarma de demostración, endpoint de estado de la API y lectura exitosa de registros Modbus TCP en el Gateway 206

---

## 1. Objetivo

**Objetivo:**

Implementar en el frontend un botón y un cuadro de texto para simular en vivo el envío de una alarma durante la presentación, a solicitud del ingeniero Carlos Arias. Agregar un endpoint que permita conocer el estado de la API y reflejarlo en el frontend. Investigar el protocolo Modbus TCP y realizar una prueba de lectura de registros de memoria utilizando el gateway NE-206 y un simulador.

---

## 2. Actividad realizada

1. Se atendió la solicitud del ingeniero Carlos Arias de agregar, en el frontend, un botón y un cuadro de texto (para ingresar el número de teléfono) que permitan simular en vivo el envío de una alarma durante la presentación.
2. Se agregó un endpoint en el backend que permite conocer el estado de la API, con el fin de reflejar en el frontend si el sistema está listo o si se ha caído.
3. Se investigó el protocolo Modbus TCP, con el objetivo de realizar una prueba de lectura de registros de memoria.
4. Se configuró, en WinIFDesigner, el IO Device y el IO Link para la comunicación Modbus TCP.
5. Se configuraron las variables correspondientes (enlace, declaración y parámetros) para extraer la lectura de los registros de memoria.
6. Se configuraron las variables MQTT (identificación y declaración) necesarias para enviar la lectura obtenida hacia el broker.
7. Se utilizó un simulador de servidor Modbus TCP (mbserver), configurando sus parámetros y asignando un valor conocido a un registro de memoria.
8. Durante las pruebas se presentaron errores en la lectura de registros desde el servidor Modbus simulado (errores en la vista de datos y en la lectura de registros), los cuales fueron corregidos.
9. Se logró la lectura exitosa de registros de memoria por medio del gateway NE-206 y el protocolo Modbus TCP (mediante cable Ethernet), validando las configuraciones de la comunicación: servidor Modbus simulado (mbserver) → gateway NE-206.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo utilizado como cliente Modbus TCP para la lectura de registros de memoria |
| Simulador de servidor Modbus TCP | mbserver | — | Simular un servidor Modbus TCP con un valor conocido asignado a un registro de memoria |
| WinIFDesigner | Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software utilizado para configurar el IO Device, el IO Link y las variables Modbus/MQTT |
| Broker MQTT | AWS EC2 | — | Recibir la lectura del registro de memoria enviada desde el gateway NE-206 |
| Frontend | Vite + React | — | Interfaz donde se implementó el botón/cuadro de texto de alarma de demostración y el indicador de estado de la API |
| Backend | Python | — | Implementación del endpoint de estado de la API |
| PC | Dell core i5 | — | Ejecución del simulador mbserver y configuración del gateway |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Comunicación Modbus TCP entre el gateway NE-206 y el simulador mbserver mediante cable Ethernet

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner (configuración IO Device/IO Link Modbus TCP y variables MQTT); mbserver (simulador de servidor Modbus TCP); Vite + React (frontend); Python (backend, endpoint de estado)
* **Librerías / dependencias:** DesarrolloAplicacion/client/package.json; DesarrolloAplicacion/Backend/requirements.txt; https://github.com/serhmarch/ModbusTools/releases/tag/v0.5.0

### Comunicación

* **Protocolo:** Modbus TCP (gateway ↔ simulador mbserver, vía Ethernet); MQTT (gateway → broker)
* **IP / dirección:** 192.168.2.172, IP del simulador mbserver y 192.168.2.250, IP del gateway.
* **Puerto:** 502 y 1883
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2; http://localhost:8000/api/health
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** 11 (Valor conocido asignado a un registro de memoria en el simulador mbserver, utilizado para validar la lectura)

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Frontend (dashboard) | Sin opción de simular alarmas | Botón y cuadro de texto para ingresar un número de teléfono y simular en vivo el envío de una alarma | Solicitud del Ing. Carlos Arias para simplificar la demostración del sistema de alarmas |
| Backend (API) | Sin endpoint de estado | Endpoint agregado para conocer el estado de la API | Permitir reflejar en el frontend si el sistema está listo o si se ha caído |
| Comunicación con el gateway NE-206 | Sin comunicación Modbus TCP validada | IO Device, IO Link y variables Modbus TCP configurados y validados mediante el simulador mbserver | Lograr la lectura de registros de memoria mediante Modbus TCP, como alternativa validada frente a Modbus RTU |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se implementó exitosamente el botón y el cuadro de texto en el frontend para simular el envío de una alarma durante la presentación.
* Se agregó exitosamente el endpoint de estado de la API en el backend.
* Se investigó el protocolo Modbus TCP y se configuró exitosamente el IO Device, el IO Link y las variables necesarias en WinIFDesigner.
* Se presentaron errores durante la lectura de registros desde el servidor Modbus simulado, los cuales fueron corregidos.
* Se logró la lectura exitosa de un registro de memoria con valor conocido, mediante el gateway NE-206 y el protocolo Modbus TCP (por cable Ethernet), validando: servidor Modbus simulado (mbserver) → gateway NE-206.

### Datos relevantes

```text
Flujo validado:
mbserver (valor conocido en registro de memoria)
    -> Gateway NE-206 (Modbus TCP, vía Ethernet)
    -> Variable MQTT configurada en WinIFDesigner
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Error en la vista de datos (dataview) del servidor Modbus simulado | Durante la configuración y prueba del simulador mbserver | Medio — dificultaba verificar el valor asignado al registro de memoria | Error-ModbusServer-Dataview.png |
| Error en la lectura de registros desde el servidor Modbus simulado | Durante las pruebas de lectura mediante el gateway NE-206 | Alto — impedía inicialmente obtener la lectura correcta del registro de memoria | ErrorModbusServer-LecturaRegistros.png |
| Error conexión duplicada al broker bajo el mismo ID | Durante las pruebas de lectura mediante el gateway NE-206 | Alto -  dos conexiones con el mismo ID intentando vincularse al mismo tiempo provocaba que una cerrara a la otra en un bucle infinito. | ErrorConexionDuplicada-BrokerMqtt.png |
| El gateway NE-206 no establece comunicación con el servidor Modbus TCP | Durante las pruebas de lectura mediante el gateway NE-206 | Alto - El gateway NE-206 no logra acceder a los registros de memoria del servidor Modbus TCP | No aplica |
---

## 8. Solución aplicada

### Problema 1

**Problema:**
Se presentó un error en la vista de datos (dataview) del servidor Modbus simulado (mbserver).

**Causa identificada:**
Había dos errores, y cualquiera de ellos por sí solo impidió leer el valor del registro en mbserver. 
1. La dirección se está enviando literal. WinIF no convertía el 40001 en el offset 0: manda la dirección 40001 tal cual y por esto el campo solo admitía 5 dígitos. No espera una dirección con prefijo, sino el offset dentro de la tabla, porque la tabla se elige en “Register interval”.
2. La función no coincide con la tabla donde se encuentra el valor. WinIF está usando la función 04, que lee la tabla 3x (input registers), aunque la etiqueta diga “Hold Registers [Read Only]”. El 10 está en la pestaña 4x de mbserver, que corresponde a la función 03. Existían dos opciones:
    2.1 En mbserver, escribir el valor en la pestaña 3x.
    2.2 O en WinIF elegir la opción del desplegable que termina en [03], que lee holding registers.

**Solución aplicada:**
Escribir el valor de lectura en la pestaña 3x y de este modo no se cambió la configuración em WinIf Designer.

**Resultado posterior:**
Se logró visualizar correctamente los datos del servidor Modbus simulado, permitiendo continuar con las pruebas.

### Problema 2

**Problema:**
Se presentó un error en la lectura de registros desde el servidor Modbus simulado a través del gateway NE-206.

**Causa identificada:**
En mbserver el Device no estaba asociado al puerto PruebaMonbus, estos solo atienden peticiones si están colgado de un puerto con una dirección de unidad asignada. Sin el puerto, mbserver acepta la conexión TCP, recibe la trama y no sabe a qué dispositivo entregarla. Por eso se observa el timeout y Tx: 0.

**Solución aplicada:**
Se creó el Device de nuevo esta vez partiendo del puerto.

**Resultado posterior:**
Se logró la lectura exitosa del registro de memoria con el valor conocido. Esto permitió identificar otro error al no visualizar el valor leído en el suscriptor MQTTX.

### Problema 3

**Problema:**
Se presentó una conexión duplicada al broker MQTT alojado en la EC2 utilizando el mismo ID que el gateway NE-206.

**Causa identificada:**
La conexión se duplicaba al ejecutar el proyecto desde WinIf Designer, ya que se levantaba una simulación completa del gateway NE-206.

**Solución aplicada:**
Se detuvo la ejecución del software y se dejó operando solamente el gateway NE-206 físico.

**Resultado posterior:**
El problema persistía, no llegaba nada al broker MQTT menos al suscriptor en MQTTX y también se identificó que no se estaba leyendo la variable en mbserver puesto que en los logs se registró la desconexión y dejaron de enviarse paquetes Tx.

### Problema 4

**Problema:**
La lectura de simulada de registros por medio del gateway NE-206 dejó de funcionar (más bien, se identificó que nunca funcionó físicamente, la simulación de WinIf Designer era quien lo había logrado).

**Causa identificada:**
Era la simulación que WinIf Designer levantaba la que lograba la comunicación con el servidor Modbus TCP, esto confirma que las configuraciones son correctas, pero planteó la pregunta de qué lo impedía para el gateway físico.

**Solución aplicada:**
No se llegó a una solución durante esta jornada.

**Resultado posterior:**
Quedó pendiente averiguar qué impide la comunicación entre el gateway NE-206 físico y el servidor modbus simulado por mbserver.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Configuracion-IODeviceModbus-Declaracion.png | Declaración del IO Device para Modbus TCP | ./evidencias/2026-09-30/Configuracion-IODeviceModbus-Declaracion.png |
| Configuracion-IODeviceModbus-DeviceAddress.png | Dirección del IO Device Modbus TCP | ./evidencias/2026-09-30/Configuracion-IODeviceModbus-DeviceAddress.png |
| Configuracion-IODeviceModbus-Parametros.png | Parámetros del IO Device Modbus TCP | ./evidencias/2026-09-30/Configuracion-IODeviceModbus-Parametros.png |
| Configuracion-IOLinkModbus-Declaracion.png | Declaración del IO Link Modbus TCP | ./evidencias/2026-09-30/Configuracion-IOLinkModbus-Declaracion.png |
| Configuracion-IOLinkModbus-Parametros.png | Parámetros del IO Link Modbus TCP | ./evidencias/2026-09-30/Configuracion-IOLinkModbus-Parametros.png |
| Configuracion-IOVariable-Enlace.png | Enlace de la variable Modbus configurada | ./evidencias/2026-09-30/Configuracion-IOVariable-Enlace.png |
| Configuracion-IOVariableModbus-Declaracion.png | Declaración de la variable Modbus | ./evidencias/2026-09-30/Configuracion-IOVariableModbus-Declaracion.png |
| Configuracion-IOVariableModbus-Parametros.png | Parámetros de la variable Modbus | ./evidencias/2026-09-30/Configuracion-IOVariableModbus-Parametros.png |
| Configuracion-IOVariableMqtt-Identificacion.png | Identificación de la variable MQTT utilizada para enviar la lectura | ./evidencias/2026-09-30/Configuracion-IOVariableMqtt-Identificacion.png |
| Configuracion-IOVarieableMqtt-Declaracion-.png | Declaración de la variable MQTT | ./evidencias/2026-09-30/Configuracion-IOVarieableMqtt-Declaracion-.png |
| Configuracion-ModbusServer-Parametros.png | Parámetros del servidor Modbus simulado (mbserver) | ./evidencias/2026-09-30/Configuracion-ModbusServer-Parametros.png |
| Error-ModbusServer-Dataview.png | Error en la vista de datos del servidor Modbus simulado | ./evidencias/2026-09-30/Error-ModbusServer-Dataview.png |
| ErrorModbusServer-LecturaRegistros.png | Error en la lectura de registros desde el servidor Modbus simulado | ./evidencias/2026-09-30/ErrorModbusServer-LecturaRegistros.png |
| LecturaExitosa-ModbusServer-Gatway206.png | Lectura exitosa del registro de memoria mediante el gateway NE-206 | ./evidencias/2026-09-30/LecturaExitosa-ModbusServer-Gatway206.png |
| Error conexión duplicada al broker bajo el mismo ID | El broker registra dos conexiones con el mismo ID intentando vincularse al mismo tiempo | ErrorConexionDuplicada-BrokerMqtt.png |

---

## 10. Próximos pasos

* Resolver el problema de comunicación entre el gateway NE-206 y el simulador de un servidor Modbus TCP.
* Extender la prueba de lectura Modbus TCP de un registro conocido (simulador) a las entradas reales del gateway WHG-151 o de un PLC, aplicando el mismo flujo validado.
* Probar en conjunto el botón/cuadro de texto de alarma de demostración y el endpoint de estado de la API de cara a la presentación con los jefes de Contec.
* Continuar con los pendientes definidos en la reunión del 29/09/2026 (umbrales de alarma, estandarización de visualización).

---

## 11. Observaciones

La validación exitosa de la lectura de registros de memoria mediante Modbus TCP en el gateway NE-206 representa un avance significativo, al tratarse de una alternativa funcional frente a las dificultades previamente documentadas con Modbus RTU (bitácoras del 24 y 25/09/2026). El uso del simulador mbserver permitió aislar y validar el flujo de comunicación (Modbus TCP → variable) sin depender de un PLC físico, antes de extenderlo a los dispositivos reales del proyecto.

Las mejoras implementadas en el frontend y el backend (botón de alarma de demostración y endpoint de estado de la API) responden directamente a los acuerdos tomados en la reunión de seguimiento del 29/09/2026 con el Ing. Carlos Arias, de cara a la presentación con los jefes de Contec.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 30/09/2026

**Pendientes:**
Documentar las causas específicas de los errores del servidor Modbus simulado y extender la prueba de lectura Modbus TCP a dispositivos reales del proyecto.