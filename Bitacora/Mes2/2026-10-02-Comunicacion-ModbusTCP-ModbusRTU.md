# Bitácora — 02-10-2026

**Fecha:** 02/10/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Resolución del bloqueo Modbus TCP y mapeo exitoso de las entradas analógicas del Gateway 151 vía Modbus RTU

---

## 1. Objetivo

**Objetivo:**

Resolver el problema de comunicación entre el gateway físico NE-206 y el servidor Modbus TCP simulado, identificado el 30/09/2026. Una vez resuelto, configurar la lectura de las variables reales a través del gateway WHG-151 (recepción por sus entradas incorporadas) y el gateway NE-206 (lectura mediante Modbus RTU), utilizando el mapa de registros de memoria proporcionado por Sherlyn.

---

## 2. Actividad realizada

1. Se trabajó en el problema de comunicación entre el gateway físico NE-206 y el servidor Modbus TCP simulado (bloqueo identificado el 30/09/2026 y no resuelto el 01/10/2026).
2. Con ayuda del ingeniero Herbert, se descubrió que la causa del problema era el firewall.
3. Se deshabilitó el firewall, y el flujo completo de comunicación Modbus TCP funcionó correctamente también para el gateway físico.
4. Una vez resuelto este problema, se inició la configuración para leer las variables reales a través del gateway WHG-151:
   * El gateway WHG-151 se utilizó para recibir los valores, aprovechando sus entradas incorporadas.
   * El gateway NE-206 se configuró para leer dichos valores por medio de Modbus RTU.
5. Gracias a la documentación proporcionada por Sherlyn, se obtuvo el mapa de registros de memoria del gateway WHG-151.
6. Se utilizó la dirección descrita en dicha documentación (por ejemplo, `00010H`), la cual podía interpretarse como la dirección 16 en hexadecimal o simplemente como la dirección 10.
7. Dada la "H" en la notación, se probó primero la dirección 16, con decodificación AB CD y CD AB, sin obtener la lectura correcta.
8. Se probó después la dirección 10, con decodificación AB CD, obteniéndose esta vez el valor correcto.
9. Se agregó la misma configuración (dirección en base 10, decodificación AB CD) para las demás entradas analógicas del gateway WHG-151.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo maestro Modbus RTU/TCP; lectura de las variables reales del gateway WHG-151 |
| Gateway industrial | GAOTek WHG-151 | — | Recepción de los valores reales mediante sus entradas analógicas incorporadas |
| Simulador de servidor Modbus TCP | mbserver | — | Servidor utilizado para confirmar la resolución del problema de comunicación Modbus TCP |
| WinIFDesigner |  Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software utilizado para la configuración de las variables Modbus RTU (direcciones y decodificación) |
| Firewall | — | — | Elemento identificado como causa del bloqueo de comunicación Modbus TCP; deshabilitado para resolver el problema |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateways WHG-151 y NE-206
* **Modelo:** GAOTek WHG-151 / GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Comunicación Modbus RTU entre el gateway NE-206 y el gateway WHG-151 (vía RS485, según cableado definido el 23/09/2026)

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner; mbserver (simulador Modbus TCP, usado para confirmar la corrección del problema de firewall)
* **Librerías / dependencias:** No aplica

### Comunicación

* **Protocolo:** Modbus TCP (confirmación de la corrección del bloqueo); Modbus RTU (lectura de las entradas analógicas reales del gateway WHG-151)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** No aplica
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Dirección de registro de memoria documentada como `00010H`, interpretada finalmente como dirección 10 (no 16 hexadecimal); decodificación correcta: AB CD

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Firewall | Habilitado (bloqueaba la comunicación Modbus TCP del gateway físico NE-206) | Deshabilitado | Identificado, con ayuda del Ing. Herbert, como la causa del bloqueo de comunicación Modbus TCP del gateway físico |
| Dirección del registro de memoria (entradas analógicas del gateway WHG-151) | Dirección 16 (interpretación hexadecimal de `00010H`), decodificación AB CD / CD AB — sin resultado correcto | Dirección 10 (interpretación decimal), decodificación AB CD | La notación `00010H` de la documentación de Sherlyn correspondía a la dirección 10, no a su equivalente hexadecimal (16) |
| Configuración de variables para entradas analógicas adicionales | Sin configurar | Misma configuración exitosa (dirección en base 10, decodificación AB CD) aplicada a las demás entradas analógicas | Replicar la configuración que arrojó lectura correcta en la primera variable |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se resolvió el problema de comunicación Modbus TCP entre el gateway físico NE-206 y el servidor Modbus simulado, identificando el firewall como la causa.
* Se validó el flujo completo de comunicación Modbus TCP también para el gateway físico, no solo para la simulación de WinIFDesigner.
* Se obtuvo, gracias a la documentación compartida por Sherlyn, el mapa de registros de memoria del gateway WHG-151.
* Se identificó la interpretación correcta de la notación de direcciones de la documentación (`00010H` = dirección 10, no 16 hexadecimal) y la decodificación correcta (AB CD).
* Se logró la lectura correcta de la primera entrada analógica y se replicó exitosamente la configuración para las demás entradas analógicas del gateway WHG-151.

### Datos relevantes

```text
Dirección documentada: 00010H
Interpretación correcta: dirección 10 (decimal), NO dirección 16 (hexadecimal)
Decodificación correcta: AB CD
Decodificaciones/direcciones probadas sin éxito: dirección 16 con AB CD y con CD AB
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| El gateway físico NE-206 no lograba comunicarse con el servidor Modbus TCP simulado (bloqueo arrastrado desde el 30/09/2026) | Al retomar las pruebas de comunicación Modbus TCP | Alto — bloqueaba la validación del flujo completo con el gateway físico | Desactivacion-Firewall.png, Comunicacion-Gateway206-SimuladorModbusServer.jpeg |
| Interpretación incorrecta inicial de la dirección de registro de memoria (`00010H` interpretada como dirección hexadecimal 16) | Durante las primeras pruebas de lectura con el mapa de registros proporcionado por Sherlyn | Medio — generó lecturas incorrectas hasta identificar la interpretación correcta de la dirección para su replicación | Configuracion-IOVariableModbus-Declaracion.png, Configuracion-IOVariableModbus-Lectura.png |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El gateway físico NE-206 no lograba comunicarse con el servidor Modbus TCP simulado, a diferencia de la simulación del gateway generada por WinIFDesigner.

**Causa identificada:**
El firewall estaba bloqueando la comunicación Modbus TCP del gateway físico. Esta causa fue identificada con ayuda del ingeniero Herbert.

**Solución aplicada:**
Se deshabilitó el firewall.

**Resultado posterior:**
El flujo completo de comunicación Modbus TCP funcionó correctamente también para el gateway físico NE-206.

### Problema 2

**Problema:**
No se obtenía la lectura correcta de las entradas analógicas del gateway WHG-151 utilizando la dirección de registro de memoria documentada (`00010H`), interpretada inicialmente como dirección 16 (hexadecimal), con decodificación AB CD ni CD AB.

**Causa identificada:**
La notación `00010H` de la documentación proporcionada por Sherlyn correspondía a la dirección 10 (decimal), y no a su equivalente en hexadecimal (16), como se había interpretado inicialmente.

**Solución aplicada:**
Se probó la dirección 10 con decodificación AB CD, obteniéndose la lectura correcta. Esta misma configuración se replicó exitosamente para las demás entradas analógicas del gateway WHG-151.

**Resultado posterior:**
Se logró la lectura correcta de todas las entradas analógicas configuradas del gateway WHG-151 mediante Modbus RTU.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Desactivacion-Firewall.png | Desactivación del firewall que bloqueaba la comunicación Modbus TCP del gateway físico | ./imgs/2026-10-02/Desactivacion-Firewall.png |
| Comunicacion-Gateway206-SimuladorModbusServer.jpeg | Comunicación exitosa del gateway NE-206 con el servidor Modbus simulado (mbserver), tras deshabilitar el firewall y visualización del cableado| ./imgs/2026-10-02/Comunicacion-Gateway206-SimuladorModbusServer.jpeg |
| Comunicacion-Gateway206Simulado-ModbusServerSimulado-MQTT.jpeg | Comunicación entre la simulación del gateway NE-206 (WinIFDesigner), el servidor Modbus simulado y MQTT | ./imgs/2026-10-02/Comunicacion-Gateway206Simulado-ModbusServerSimulado-MQTT.jpeg |
| Configuracion-IODeviceModbus-Declaracion.png | Declaración del IO Device Modbus | ./imgs/2026-10-02/Configuracion-IODeviceModbus-Declaracion.png |
| Configuracion-IODeviceModbus-DeviceAddress.png | Dirección del IO Device Modbus | ./imgs/2026-10-02/Configuracion-IODeviceModbus-DeviceAddress.png |
| Configuracion-IODeviceModbus-Latency.png | Configuración de latencia del IO Device Modbus | ./imgs/2026-10-02/Configuracion-IODeviceModbus-Latency.png |
| Configuracion-IOLinkModbus-Declaracion.png | Declaración del IO Link Modbus RTU | ./imgs/2026-10-02/Configuracion-IOLinkModbus-Declaracion.png |
| Configuracion-IOLinkModbus-Parametros.png | Parámetros del IO Link Modbus RTU | ./imgs/2026-10-02/Configuracion-IOLinkModbus-Parametros.png |
| Configuracion-IOVariableModbus-Declaracion.png | Declaración de la variable Modbus (dirección de registro) | ./imgs/2026-10-02/Configuracion-IOVariableModbus-Declaracion.png |
| Configuracion-IOVariableModbus-Tipo.png | Tipo de dato y decodificación configurados para la variable Modbus (AB CD) | ./imgs/2026-10-02/Configuracion-IOVariableModbus-Tipo.png |
| Configuracion-IOVariableModbus-Lectura.png | Lectura correcta obtenida con la dirección 10 y decodificación AB CD | ./imgs/2026-10-02/Configuracion-IOVariableModbus-Lectura.png |
| Configuracion-IOVariableMqtt-Declaracion.png | Declaración de la variable MQTT usada para publicar la lectura | ./imgs/2026-10-02/Configuracion-IOVariableMqtt-Declaracion.png |
| Configuracion-IOVariableMqtt-Identificacion.png | Identificación de la variable MQTT | ./imgs/2026-10-02/Configuracion-IOVariableMqtt-Identificacion.png |
| Configuracion-IOVariableMQTT-Type.png | Tipo configurado para la variable MQTT | ./imgs/2026-10-02/Configuracion-IOVariableMQTT-Type.png |
| Flujo-LecturaRegistrosModbus-PublicacionMqtt.png | Flujo completo: lectura de registros Modbus y publicación vía MQTT | ./imgs/2026-10-02/Flujo-LecturaRegistrosModbus-PublicacionMqtt.png |
| Recepcion-Mensajes-Gateway206.png | Recepción de los mensajes publicados por el gateway NE-206 | ./imgs/2026-10-02/Recepcion-Mensajes-Gateway206.png |
| Comunicacion-Gateway151-Gatewa206-MQTT.jpeg | Flujo final: comunicación del gateway WHG-151 (entradas analógicas) al gateway NE-206 y publicación vía MQTT | ./imgs/2026-10-02/Comunicacion-Gateway151-Gatewa206-MQTT.jpeg |

---

## 10. Próximos pasos

* Documentar formalmente, como referencia técnica del proyecto, la equivalencia entre la notación de direcciones de la documentación del fabricante (`0000XH`) y la dirección decimal real a utilizar en la configuración (en este caso, `00010H` = dirección 10).
* Validar la estabilidad de las lecturas de todas las entradas analógicas configuradas del gateway WHG-151 en pruebas más prolongadas.
* Evaluar si el firewall deshabilitado requiere una configuración más específica (en lugar de deshabilitarlo por completo) para un entorno productivo, considerando las implicaciones de seguridad.
* Integrar las lecturas obtenidas al flujo completo del sistema (MQTT, almacenamiento en MongoDB, visualización en el dashboard).

---

## 11. Observaciones

Esta jornada resolvió dos bloqueos importantes que habían persistido desde el 30/09/2026: la comunicación Modbus TCP del gateway físico (causada por el firewall) y, posteriormente, el mapeo correcto de los registros de memoria de las entradas analógicas del gateway WHG-151 mediante Modbus RTU, gracias a la documentación proporcionada por Sherlyn. Es un hallazgo relevante que la notación de direcciones de la documentación del fabricante (`00010H`) no debía interpretarse directamente como un valor hexadecimal, sino como la dirección decimal 10, lo cual explica por qué los intentos previos de mapeo (bitácoras del 24 y 25/09/2026) no habían tenido éxito.

Queda pendiente evaluar, de cara a una implementación productiva, si deshabilitar completamente el firewall es una solución aceptable a largo plazo o si debe sustituirse por una regla más específica que permita el tráfico Modbus TCP sin exponer innecesariamente el sistema.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 02/10/2026

**Pendientes:**
Documentar la equivalencia de direcciones de memoria del fabricante, evaluar una configuración de firewall más específica para producción, e integrar las lecturas de las entradas analógicas al flujo completo del sistema.