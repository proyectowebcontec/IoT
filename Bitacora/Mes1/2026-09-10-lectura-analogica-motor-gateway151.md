# Bitácora — 10-09-2026

**Fecha:** 10/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Resolución del problema de lectura de corriente y transmisión de la señal del motor al Gateway 151

---

## 1. Objetivo

**Objetivo:**

Resolver el problema de lectura de corriente identificado el 09/09/2026, capturar exitosamente la señal analógica de corriente del motor mediante una dona y su transductor, y transmitir dicha señal a través del gateway hacia el broker MQTT, MongoDB y el dashboard, validando además el comportamiento del sistema ante un uso agresivo simulado del polipasto.

---

## 2. Actividad realizada

1. Antes de contactar al proveedor por el problema con las donas (detallado en la bitácora del 09/09/2026), el equipo de taller realizó pruebas y revisiones adicionales, logrando resolver el problema: no se trataba del rango de la dona, sino de un error de cableado.
2. Se cableó únicamente una dona para realizar las pruebas, capturando exitosamente la señal analógica de corriente del motor y escalándola a voltaje por medio del transductor (la dona escala la corriente de 0 a 5 A, y el transductor la convierte de 0 a 5 V).
3. Carlos Muñoz creó un programa en el PLC para mostrar gráficamente, mediante una barra de progreso, la corriente del motor.
4. Una vez validado el correcto funcionamiento de la lectura y visualización en el PLC, se agregó el cableado necesario para transmitir las señales de los transductores al gateway.
5. Los valores fueron capturados por el gateway y transmitidos al broker MQTT alojado en la EC2; el script de Python los capturó y almacenó en MongoDB, lo que permitió visualizarlos en el dashboard elaborado con Vite + React.
6. Buscando simular el mal uso de un polipasto, Wanderley realizó cambios bruscos en el encendido, apagado y cambio de velocidades del motor. Debido a la limitación del intervalo de 10 s del gateway, solo se capturaron algunas de estas señales. Durante estas pruebas también se disparó el flipón (breaker), dejando al taller sin luz por un período de tiempo.
7. Se grabaron algunas partes del video solicitado por Sherlyn, para mostrarle el error ocurrido con WinIFDesigner en el gateway NE-206.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Dona de corriente | 100/5 AMP. 30I | — | Capturar la corriente del motor y escalarla de 0 a 5 A |
| Transductor de corriente | RMS 85-26 | — | Escalar la señal de la dona (0–5 A) a voltaje (0–5 V) |
| PLC | Siemens LOGO! 8 | — | Recibir la señal del transductor y mostrarla gráficamente mediante una barra de progreso |
| Gateway industrial | GAOTek WHG-151 | — | Capturar la señal del transductor y transmitirla al broker MQTT |
| Broker MQTT | AWS EC2 | — | Recibir los mensajes publicados por el gateway |
| Script suscriptor | Python | — | Capturar los mensajes del broker y almacenarlos en MongoDB |
| Base de datos | MongoDB | — | Almacenar los valores de corriente capturados |
| Frontend | Vite + React | — | Visualizar los valores de corriente en el dashboard |
| Motor | [Placeholder] | — | Equipo monitoreado; sometido a cambios bruscos de encendido, apagado y velocidad para simular mal uso |

---

## 4. Configuración

### Hardware

* **Equipo:** Dona de corriente, transductor, PLC
* **Modelo:** 100/5 AMP. 30I, RMS 85-26, Siemens LOGO! 8
* **Alimentación:** _, 110V, 24V
* **Conexiones:** Dona de corriente → transductor → entrada analógica del PLC → cableado adicional hacia el gateway WHG-151

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Software de programación en bloques del PLC (programa creado por Carlos Muñoz para visualización con barra de progreso), Python (script suscriptor), Vite + React (dashboard)
* **Librerías / dependencias:** DesarrolloAplicacion/client/package.json; DesarrolloAplicacion/Backend/requirements.txt;

### Comunicación

* **Protocolo:** MQTT (gateway → broker)
* **IP / dirección:** 44.219.190.29
* **Puerto:** 1883 (habilitado temporalmente; originalmente configurado en 8883 para TLS)
* **Endpoint / servidor:** Broker MQTT desplegado en instancia AWS EC2
* **Tópico:** `test/mqtt`
* **QoS:** 0
* **Otros parámetros:** Escalado de la señal: dona 0–5 A → transductor 0–5 V. Intervalo de captura del gateway: 10 s (limitante detectada durante las pruebas de cambios bruscos de velocidad)

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Cableado de la dona de corriente | Cableado incorrecto (causa real del problema del 09/09/2026) | Cableado corregido | El equipo de taller identificó un error de cableado, no un problema de rango en la dona como se había supuesto inicialmente |
| Cableado del sistema | Señal limitada al PLC (sin llegar al gateway) | Se agregó cableado para transmitir la señal del transductor también al gateway | Permitir la transmisión de la señal de corriente hacia el broker MQTT y el dashboard |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se resolvió el problema de lectura de corriente identificado el 09/09/2026: la causa real fue un error de cableado, no el rango de la dona.
* Se logró capturar exitosamente la señal analógica de corriente del motor mediante una dona, escalada a voltaje por el transductor.
* Se validó la visualización gráfica de la corriente del motor en el PLC mediante el programa creado por Carlos Muñoz.
* Se completó exitosamente el flujo de extremo a extremo: dona → transductor → PLC/gateway → broker MQTT → script en Python → MongoDB → dashboard en Vite + React.
* Se identificó una limitación del sistema: debido al intervalo de captura de 10 s del gateway, no todos los cambios bruscos simulados por Wanderley (encendido, apagado y cambio de velocidad) fueron capturados.
* Se grabaron partes del video solicitado por Sherlyn sobre el error de WinIFDesigner con el gateway NE-206.

### Datos relevantes

```text
Escalado: dona 0-5 A -> transductor 0-5 V
Intervalo de captura del gateway: 10 s (limitante para cambios bruscos y de corta duración)
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | 
| ------------------ | ------- | ------- |
| Error de cableado en la dona (causa real del problema reportado el 09/09/2026) | Antes de contactar al proveedor | Alto — impedía la lectura correcta de corriente |
| Intervalo de captura de 10 s del gateway insuficiente para registrar cambios bruscos y de corta duración | Durante la simulación de mal uso del polipasto por parte de Wanderley | Medio — se perdió el registro de algunas de las señales simuladas |
| Se disparó el flipón (breaker), dejando al taller sin luz por un período de tiempo | Durante la simulación de cambios bruscos de encendido, apagado y velocidad del motor | Alto — interrupción del suministro eléctrico del taller |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
No era posible leer correctamente la señal de corriente del motor (problema reportado el 09/09/2026, inicialmente atribuido al rango de la dona).

**Causa identificada:**
Error de cableado, no un problema de rango en la dona de corriente.

**Solución aplicada:**
El equipo de taller realizó pruebas y revisiones adicionales antes de contactar al proveedor, identificando y corrigiendo el error de cableado.

**Resultado posterior:**
Se logró capturar exitosamente la señal analógica de corriente del motor, escalada correctamente a voltaje por el transductor.

### Problema 2

**Problema:**
El intervalo de captura de 10 s del gateway no permitió registrar todos los cambios bruscos simulados en el encendido, apagado y velocidad del motor.

**Causa identificada:**
Limitación propia del intervalo de muestreo/captura configurado en el gateway.

**Solución aplicada:**
No se aplicó una solución en esta jornada; queda identificada como una limitante a evaluar a futuro.

**Resultado posterior:**
Solo se capturó una parte de las señales generadas durante la simulación de mal uso del polipasto.

### Problema 3

**Problema:**
Se disparó el flipón (breaker) durante las pruebas de cambios bruscos, dejando al taller sin luz por un período de tiempo.

**Causa identificada:**
Las pruebas que simulan el mal manejo de un polipasto.

**Solución aplicada:**
Se verificó que no hubiera daños y posteriormente se subió el flipón a ON.

**Resultado posterior:**
Sestauró la electricidad en el taller.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Circuito | Circuito de prueba empleado | ./imgs/ConexionPLC/Circuito_Monitoreo1Variable.jpeg |
| Lectura de velocidad en el PLC 1 | Lectura de corriente en el PLC a velocidad lenta (barra de progreso) | ./imgs/ConexionPLC/PLC_Medicion1VariableA_VelocidadLenta.jpeg |
| Lectura de velocidad en el PLC 2 | Lectura de corriente en el PLC a velocidad rápida (barra de progreso) | ./imgs/ConexionPLC/PLC_Medicion1VariableA_VelocidadRapida.jpeg |
| Lectura de velocidad en el gateway 1 | Lectura de corriente en el gateway a velocidad lenta | ./imgs/ConexionPLC/Gateway_Medicion1VariableA_VelocidadLenta.jpeg |
| Lectura de velocidad en el gateway 2 | Lectura de corriente en el gateway a velocidad rápida | ./imgs/ConexionPLC/Gateway_Medicion1VariableA_VelocidadRapida.jpeg |
| Dashboard de monitoreo | Visualización en el dashboard (Vite + React) | ./imgs/ConexionPLC/DashboardMonitoreoVariableAnalogica_10_09_2026.png |
| Gráfica de valores analógicos capturados | Visualización del registro histórico de los valores capturados por el gateway WHG 151 | ./imgs/ConexionPLC/MonitoreoVariableAnalogica_10_09_2026.png |
| Modificación de velocidades | Operación del circuito para manipular la velocidad del motor | ./imgs/ConexionPLC/PruebasMedicion1Variable.jpeg |

* [Circuito](./imgs/ConexionPLC/Circuito_Monitoreo1Variable.jpeg)
* [Lectura de velocidad en el PLC 1](./imgs/ConexionPLC/PLC_Medicion1VariableA_VelocidadLenta.jpeg)
* [Lectura de velocidad en el PLC 2](./imgs/ConexionPLC/PLC_Medicion1VariableA_VelocidadRapida.jpeg)
* [Lectura de velocidad en el gateway 1](./imgs/ConexionPLC/Gateway_Medicion1VariableA_VelocidadLenta.jpeg)
* [Lectura de velocidad en el gateway 2](./imgs/ConexionPLC/Gateway_Medicion1VariableA_VelocidadRapida.jpeg)
* [Dashboard de monitoreo](./imgs/ConexionPLC/DashboardMonitoreoVariableAnalogica_10_09_2026.png)
* [Gráfica de valores analógicos capturados](./imgs/ConexionPLC/MonitoreoVariableAnalogica_10_09_2026.png)
* [Modificación de velocidades](./imgs/ConexionPLC/PruebasMedicion1Variable.jpeg)

---

## 10. Próximos pasos

* Evaluar la posibilidad de reducir el intervalo de captura del gateway (idealmente a 100 ms, según lo conversado el 09/09/2026) para no perder señales de corta duración.
* Documentar y prevenir la causa del disparo del flipón durante pruebas de cambios bruscos en el motor.
* Extender la lectura de corriente a las 3 donas del circuito (según avances del 11/09/2026), integrándolas al flujo completo validado hoy con una sola dona.
* Completar y enviar a Sherlyn el video sobre el error de WinIFDesigner en el gateway NE-206.

---

## 11. Observaciones

El problema reportado el 09/09/2026, que se había atribuido al rango de la dona de corriente (5 A–5000 A) frente a la corriente real del motor (5.7 A), resultó finalmente ser un error de cableado. Esto valida el circuito de escalado planteado originalmente (dona 0–5 A → transductor 0–5 V) y permite continuar con el monitoreo de corriente sin necesidad de sustituir la dona.

Durante la simulación de mal uso del polipasto realizada por Wanderley se evidenció una limitación relevante: el intervalo de captura de 10 s del gateway no es suficiente para registrar cambios bruscos y de corta duración, lo que representa un punto a mejorar de cara a un monitoreo más preciso ante condiciones reales de mal uso. Asimismo, durante estas pruebas se disparó el flipón del taller, interrumpiendo el suministro eléctrico por un período de tiempo.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 10/09/2026

**Pendientes:**
Evaluar la reducción del intervalo de captura del gateway y dar seguimiento a la causa del disparo del flipón durante las pruebas de cambios bruscos.