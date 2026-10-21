# Bitácora — 23-09-2026

**Fecha:** 23/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Envío de variables numéricas por MQTT, definición de comunicación Modbus TCP/RTU/RS485 y seguimiento del tablero de montaje

---

## 1. Objetivo

**Objetivo:**

Ampliar las pruebas de envío de mensajes MQTT incluyendo variables numéricas, asegurando que todas las variables se transmitan de forma conjunta al broker. Definir la configuración de cableado para la comunicación Modbus TCP/RTU mediante las entradas RS485 de los gateways, como paso previo a leer datos de un dispositivo externo (PLC). Dar seguimiento, junto con el ingeniero Carlos Arias, al estado del tablero de montaje de los componentes de monitoreo.

---

## 2. Actividad realizada

1. Se añadieron variables numéricas a la prueba de envío de mensajes MQTT, utilizando un script para cambiar los valores de las variables(un bucle `for` que los incrementa). Esto provocó que cada variable se enviara al broker por separado, y en algunos casos de forma conjunta, de manera inconsistente.
2. Para continuar las pruebas, se modificó el script de modo que primero se realizaran todas las operaciones y, posteriormente, se asignara el valor resultante a las variables que envían los datos al broker (script de variables unificadas). Esto permitió que todas las variables se enviaran de forma conjunta.
3. Una vez verificada la correcta comunicación de las variables, se evaluó cómo empezar a pasar lecturas provenientes de otro dispositivo. Dado que aún no se había definido qué PLC se utilizaría, se decidió, para validar las primeras configuraciones, leer los valores que el gateway WHG-151 recibía de un potenciómetro y un joystick.
4. Tras investigar alternativas, se decidió utilizar la comunicación Modbus TCP/RTU a través de las entradas RS485 presentes en ambos gateways (WHG-151 y NE-206).
5. Se definió, en este día, la configuración del cableado para la conexión RS485 entre el gateway NE-206 y el gateway WHG-151.
6. Se buscó, en la documentación disponible, un mapa de las variables de memoria correspondientes a las entradas del gateway WHG-151, sin encontrarlo. Se inició la revisión de opciones para mapear dichas variables.
7. Se compartió con el ingeniero Carlos Arias el tablero ya ordenado de los componentes que se usarán para el monitoreo, junto con el cableado correspondiente (propuesta de orden del tablero).
8. Se conversó con Wanderley sobre el tablero adquirido, identificando que:
   * El tablero fue fabricado con las medidas finales y resulta muy pequeño: ya no cabe el gateway.
   * Faltan conexiones para los relés; se necesitan 3 relés adicionales si se desea monitorear los tres contactores (K21, K22, K23) y todos sus movimientos.
   * Tampoco cabe el PLC, en caso de que este forme parte de la arquitectura final.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek WHG-151 | — | Lectura de variables del potenciómetro y joystick; extremo de la conexión RS485/Modbus TCP/RTU |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Envío de variables numéricas al broker MQTT; extremo de la conexión RS485/Modbus TCP/RTU |
| Broker MQTT | AWS EC2 | — | Recibir las variables numéricas publicadas por el gateway |
| Cliente MQTT | MQTTX | — | Verificar la recepción de las variables (dispersas y unificadas) |
| Potenciómetro | — | — | Fuente de señal analógica leída por el gateway WHG-151 |
| Joystick | HW-504 | — | Fuente de señal analógica leída por el gateway WHG-151 |
| Tablero de montaje | — | — | Alojar los componentes de monitoreo y su cableado; en evaluación por limitaciones de espacio |
| Relés | — | — | Interfaz para el monitoreo de los contactores K21, K22 y K23 (faltan 3 según lo identificado con Wanderley) |
| PLC | Siemens LOGO! 8 | — | Dispositivo externo cuyas lecturas se planea incorporar mediante Modbus TCP/RTU/RS485 |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateways WHG-151 y NE-206
* **Modelo:** GAOTek WHG-151 / GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Conexión RS485 definida entre el gateway NE-206 y el gateway WHG-151, como medio físico para la comunicación Modbus TCP/RTU

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Script generador de variables dispersas; script generador de variables unificadas; MQTTX
* **Librerías / dependencias:** WinIf Designer, entorno de los scripts generadores

### Comunicación

* **Protocolo:** MQTT (envío de variables al broker); Modbus TCP/RTU sobre RS485 (comunicación entre gateways, en definición)
* **IP / dirección:** 44.219.190.29
* **Puerto:** 1883
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** Pendiente definir el mapa de variables de memoria de las entradas del gateway WHG-151 para la lectura por Modbus TCP/RTU

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Script de envío de variables MQTT | Script de variables dispersas (bucle `for` que incrementa valores y los envía por separado) | Script de variables unificadas (se realizan todas las operaciones y luego se asignan los valores antes de enviar) | Lograr que todas las variables numéricas se enviaran de forma conjunta al broker, en lugar de hacerlo de manera dispersa e inconsistente |
| Medio de comunicación para lecturas externas | Sin definir | Comunicación Modbus TCP/RTU mediante las entradas RS485 de ambos gateways | Permitir la lectura de variables provenientes de un dispositivo externo (PLC u otro instrumento), aprovechando una interfaz disponible en ambos gateways |
| Tablero de montaje | Tablero adquirido con las medidas finales propuestas | En revisión: no caben el gateway, el PLC, ni las conexiones para los 3 relés necesarios | Hallazgo reportado por Wanderley tras fabricar el tablero con las medidas finales |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se logró el envío de variables numéricas al broker MQTT, inicialmente de forma dispersa y, tras el ajuste del script, de forma unificada y consistente.
* Se verificó, mediante MQTTX, la recepción correcta de las variables tanto en su forma dispersa como unificada.
* Se definió la configuración del cableado para la comunicación Modbus TCP/RTU mediante las entradas RS485 entre los gateways WHG-151 y NE-206.
* No se encontró, en la documentación disponible, un mapa de las variables de memoria de las entradas del gateway WHG-151, por lo que esta tarea quedó pendiente.
* Se identificaron limitaciones importantes en el tablero de montaje adquirido (espacio insuficiente para el gateway, el PLC y los relés necesarios), comunicadas por Wanderley tras la revisión del tablero ya ordenado y compartido con el ingeniero Carlos Arias.

### Datos relevantes

```text
Ejemplo de los mensajes envíados por el gateway NE 206

{"sensorDatas": [ {"flag": "U1", "value": 60600}, {"flag":"Name", "str": "Prueba"}, {"flag":"U3","value":1212}, {"flag":"U2", "value": 121200} ] }
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Las variables numéricas se enviaban de forma dispersa (por separado) al broker, en lugar de hacerlo de manera conjunta | Durante las primeras pruebas con el script generador de variables dispersas | Medio — dificultaba la consistencia de los datos recibidos en el broker | Script_Generador_Variables_Dispersas.png, Recepcion_Variables_MQTTX_Dispersas.png |
| No se encontró en la documentación disponible un mapa de las variables de memoria de las entradas del gateway WHG-151 | Al intentar definir la lectura de variables mediante Modbus TCP/RTU/RS485 | Alto — bloquea, por el momento, la lectura de variables externas mediante este protocolo | No se cuenta con evidencia específica para este hallazgo |
| El tablero de montaje adquirido resultó muy pequeño: no caben el gateway, el PLC ni las conexiones de los 3 relés necesarios para monitorear los contactores K21, K22 y K23 | Al revisar el tablero junto con Wanderley, tras haberlo compartido ya ordenado con el Ing. Carlos Arias | Alto — condiciona la arquitectura física final del sistema de monitoreo | Propuesta_Orden_Tablero.jpeg, Disposicion_Circuito.jpeg |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Las variables numéricas se enviaban de forma dispersa (cada una por separado, a veces juntas, a veces no) al broker MQTT.

**Causa identificada:**
El script generador de variables utilizaba un bucle `for` que incrementaba y enviaba cada variable de manera independiente, sin sincronizar el envío conjunto de todas ellas.

**Solución aplicada:**
Se modificó el script para que primero se realizaran todas las operaciones necesarias y, solo después, se asignara el valor final a las variables que se envían al broker (script de variables unificadas).

**Resultado posterior:**
Todas las variables se enviaron de forma conjunta y consistente al broker, verificado mediante MQTTX.

### Problema 2

**Problema:**
No se encontró, en la documentación disponible, un mapa de las variables de memoria correspondientes a las entradas del gateway WHG-151, necesario para la lectura mediante Modbus TCP/RTU.

**Causa identificada:**
Ausencia de esta información en la documentación técnica disponible del gateway.

**Solución aplicada:**
Se comenzaron a revisar opciones alternativas para mapear las variables de memoria (solución en curso, no concluida en esta jornada).

**Resultado posterior:**
Pendiente; el mapeo de variables de memoria del gateway WHG-151 queda como tarea abierta.

### Problema 3

**Problema:**
El tablero de montaje adquirido, fabricado con las medidas finales, resultó insuficiente: no caben el gateway, el PLC ni las conexiones necesarias para los 3 relés adicionales requeridos para monitorear los contactores K21, K22 y K23.

**Causa identificada:**
Las medidas finales utilizadas para fabricar el tablero no consideraron el espacio necesario para todos los componentes de la arquitectura final (gateway, PLC y relés adicionales).

**Solución aplicada:**
No se aplicó una solución en esta jornada; el hallazgo fue comunicado por Wanderley y queda pendiente de definir una solución (por ejemplo, un tablero de mayor tamaño o una redistribución de componentes).

**Resultado posterior:**
Pendiente de resolución; condiciona los próximos pasos de montaje físico del sistema.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Script_Generador_Variables_Dispersas.png | Script generador de variables numéricas dispersas (bucle `for`) | ./imgs/2026-09-23/Script_Generador_Variables_Dispersas.png |
| Recepcion_Variables_MQTTX_Dispersas.png | Recepción en MQTTX de las variables enviadas de forma dispersa | ./imgs/2026-09-23/Recepcion_Variables_MQTTX_Dispersas.png |
| Script_Generador_Variables_Unificadas.png | Script generador de variables unificadas (operaciones primero, asignación después) | ./imgs/2026-09-23/Script_Generador_Variables_Unificadas.png |
| Recepcion_Varables_MQTTX_Unificadas.png | Recepción en MQTTX de las variables enviadas de forma unificada | ./imgs/2026-09-23/Recepcion_Varables_MQTTX_Unificadas.png |
| Conexion_RS485_Gateway206_Gatewa151.jpeg | Conexión RS485 definida entre el gateway NE-206 y el gateway WHG-151 | ./imgs/2026-09-23/Conexion_RS485_Gateway206_Gatewa151.jpeg |
| Gateway151_Lector_Variables.jpeg | Gateway WHG-151 leyendo las variables del potenciómetro y el joystick | ./imgs/2026-09-23/Gateway151_Lector_Variables.jpeg |
| Disposicion_Circuito.jpeg | Disposición de la simulación de un circuito de monitoreo | ./imgs/2026-09-23/Disposicion_Circuito.jpeg |
| Propuesta_Orden_Tablero.jpeg | Propuesta de orden del tablero, compartida con el Ing. Carlos Arias | ./imgs/2026-09-23/Propuesta_Orden_Tablero.jpeg |

* [Script_Generador_Variables_Dispersas.png](./imgs/2026-09-23/Script_Generador_Variables_Dispersas.png)
* [Recepcion_Variables_MQTTX_Dispersas.png](./imgs/2026-09-23/Recepcion_Variables_MQTTX_Dispersas.png)
* [Script_Generador_Variables_Unificadas.png](./imgs/2026-09-23/Script_Generador_Variables_Unificadas.png)
* [Recepcion_Varables_MQTTX_Unificadas.png ](./imgs/2026-09-23/Recepcion_Varables_MQTTX_Unificadas.png )
* [Conexion_RS485_Gateway206_Gatewa151.jpeg](./imgs/2026-09-23/Conexion_RS485_Gateway206_Gatewa151.jpeg)
* [Gateway151_Lector_Variables.jpeg](./imgs/2026-09-23/Gateway151_Lector_Variables.jpeg)
* [Disposicion_Circuito.jpeg](./imgs/2026-09-23/Disposicion_Circuito.jpeg)
* [Propuesta_Orden_Tablero.jpeg](./imgs/2026-09-23/Propuesta_Orden_Tablero.jpeg)

---

## 10. Próximos pasos

* Definir e implementar el mapeo de las variables de memoria de las entradas del gateway WHG-151, necesario para la lectura mediante Modbus TCP/RTU.
* Completar la configuración de la comunicación Modbus TCP/RTU sobre RS485 entre los gateways WHG-151 y NE-206.
* Definir con el Ing. Carlos Arias y Wanderley una solución para las limitaciones de espacio del tablero (tablero de mayor tamaño, redistribución de componentes, o definición final de si el PLC formará parte de la arquitectura).
* Gestionar la adquisición de los 3 relés adicionales necesarios para monitorear los contactores K21, K22 y K23.
* Confirmar qué PLC se utilizará finalmente, para avanzar con la lectura de variables externas reales (en lugar de las pruebas con potenciómetro y joystick).

---

## 11. Observaciones

Esta jornada combinó avances técnicos relevantes (consistencia en el envío de variables MQTT, definición del cableado Modbus TCP/RTU/RS485) con un hallazgo crítico a nivel de infraestructura física: el tablero de montaje adquirido no tiene espacio suficiente para el gateway, el PLC ni los relés adicionales requeridos. Este hallazgo, reportado por Wanderley justo después de compartir la propuesta de orden del tablero con el ingeniero Carlos Arias, condiciona directamente los próximos pasos de montaje del proyecto y debe resolverse antes de avanzar con la instalación física definitiva.

Asimismo, la ausencia de un mapa de variables de memoria documentado para las entradas del gateway WHG-151 es un vacío de documentación técnica que limita, por ahora, el avance de la comunicación Modbus TCP/RTU.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 23/09/2026

**Pendientes:**
Mapear las variables de memoria del gateway WHG-151, completar la configuración Modbus TCP/RTU/RS485, y definir una solución para las limitaciones de espacio del tablero de montaje (gateway, PLC y relés adicionales).