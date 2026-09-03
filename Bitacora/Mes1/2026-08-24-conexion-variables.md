# Bitácora — 24-08-2026

**Fecha:** 24/08/2026  
**Responsable:** Katherinne Gómez  
**Etapa del proyecto:** Etapa 1  
**Actividad:** Integración de variables analógicas y comunicación MQTT del Gateway WHG-151

---

## 1. Objetivo

**Objetivo:**

Implementar y validar la adquisición de señales analógicas provenientes de un potenciómetro y un joystick mediante las entradas **AVI6, AVI7 y AVI8** del Gateway industrial **GAOTek WHG-151**, así como configurar y verificar la transmisión de las variables adquiridas hacia el broker MQTT desplegado en **AWS EC2**.

---

## 2. Actividad realizada

Durante la jornada se realizaron las siguientes actividades:

1. Se realizó el montaje y conexión del **potenciómetro de 10 kΩ** y del **joystick HW-504** como fuentes de señales analógicas para el Gateway WHG-151.

2. Se conectaron las señales del joystick a las entradas analógicas **AVI6** y **AVI7**, correspondientes a los ejes X y Y respectivamente.

3. Se conectó el potenciómetro a la entrada analógica **AVI8** para generar una tercera señal de tensión variable.

4. Se verificó el funcionamiento de las entradas analógicas del gateway mediante la modificación de las posiciones del joystick y del potenciómetro.

5. Se realizó la configuración de comunicación **MQTT** del Gateway WHG-151 para establecer comunicación con el broker ubicado en una instancia **AWS EC2**.

---

## 3. Equipo utilizado

| Equipo / Componente    | Modelo / Identificación | Función                                          |
| ---------------------- | ----------------------- | ------------------------------------------------ |
| Gateway industrial     | GAOTek WHG-151          | Recibir la señal mediante las entradas analógicas AVI6, AVI7 Y AVI8 |
| Potenciometro          | 10 k ohm                | Generar la señal de entrada analoga de tensión   |
| Joystick               | HW 504                  | Generar las señales de entrada analoga de tensión|
| Fuente de alimentación | 5 VDC                   | Alimentar el potenciometro y el joystick         |
| Cableado               | —                       | Interconexión entre los dispositivos             |
| Broker MQTT | AWS EC2 | Recibir los mensajes publicados por el gateway |

---

## 4. Configuración
### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek WHG-151
* **Alimentación:** Alimentación correspondiente al gateway y 5 VDC para los componentes de prueba.
* **Conexiones:**
  * **AVI6:** Joystick X.
  * **AVI7:** Joystick Y.
  * **AVI8:** Potenciómetro.
  * Referencia común de las señales según el montaje realizado.

La distribución de las señales fue:

```text
Joystick X ─────────► AVI6
Joystick Y ─────────► AVI7
Potenciómetro ──────► AVI8
```

### Software

* **Software utilizado:** Herramienta de configuración del Gateway WHG-151.
* **Librerías / dependencias:** No aplica para la configuración directa del gateway.

### Comunicación

* **Protocolo:** MQTT.
* **IP / dirección:** Dirección del servidor donde se encuentra desplegado el broker MQTT en AWS EC2.
* **Puerto:** `8883`.
* **Endpoint / servidor:** Broker MQTT desplegado en AWS EC2.
* **Tópico:** `test/mqtt`.
* **QoS:** 1
* **Otros parámetros:** El Gateway WHG-151 actúa como publicador.

> No se incluyen contraseñas, claves privadas, tokens ni credenciales.

---

## 5. Cambios realizados


| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ---------------------- | ------------------- | ------ |
| AVI6 | Sin señal de prueba | Joystick X | Validar adquisición de una variable analógica |
| AVI7 | Sin señal de prueba | Joystick Y | Validar adquisición de una segunda variable analógica |
| AVI8 | Sin señal de prueba | Potenciómetro de 10 kΩ | Validar adquisición de una tercera variable analógica |
| Comunicación | Sin comunicación MQTT validada | Broker MQTT en AWS EC2, puerto 1883 | Validar transmisión de las variables hacia la nube |
| Tópico MQTT | No configurado | `test/mqtt` | Establecer el canal de publicación de datos |

---

## 6. Resultados obtenidos

**Resultado general:**

**Parcialmente exitoso.**

### Resultados específicos

* Se logró conectar el joystick y el potenciómetro a las entradas analógicas **AVI6, AVI7 y AVI8** del Gateway WHG-151.

* Se verificó la generación de señales analógicas variables mediante el movimiento de los ejes del joystick y la modificación de la posición del potenciómetro.

* Se configuró el gateway para utilizar comunicación **MQTT mediante el puerto 1883** y el tópico **`test/mqtt`**.

### Datos relevantes

```text
Entradas utilizadas:

AVI6 → Joystick X
AVI7 → Joystick Y
AVI8 → Potenciómetro 10 kΩ

Comunicación:

Protocolo → MQTT
Puerto   → 1883
Tópico   → test/mqtt
Broker   → AWS EC2
```
---

## 7. Errores encontrados / Obstáculos


| Error / Obstáculo | Momento | Impacto | Evidencia |
| ----------------- | -------- | ------- | --------- |
| El usuario de AWS asignado no tenía los permisos necesarios para conectarse o visualizar la instancia EC2 donde se encuentra desplegado el broker. | 9:42 a. m. | Impidió inicialmente validar la transmisión de señales desde el gateway hacia el broker. | `./imgs/obtaculoPermisosEC2` |
| Limitación en la extensión del nombre de dominio del broker en el gateway. | 4:43 p. m. | El dominio no podía registrarse correctamente en el campo de configuración disponible en el gateway. | `./imgs/limitacionDominioWHG151` |

---

## 8. Solución aplicada


### Problema 1

**Problema:**

El usuario de AWS disponible no contaba con los permisos necesarios para acceder o visualizar la instancia EC2 donde se encontraba desplegado el broker MQTT.

**Causa identificada:**

El usuario IAM solamente tenía permisos habilitados para tareas específicas relacionadas con IoT Core y monitoreo, sin contar inicialmente con los permisos requeridos para acceder a la instancia EC2.

**Solución aplicada:**

Se contactó al ingeniero **Carlos Arias** para solicitar apoyo con la habilitación de los permisos necesarios para acceder a la instancia.

**Resultado posterior:**

Se obtuvo acceso exitoso una vez habilitados los permisos necesarios.

---

### Problema 2

**Problema:**

El campo utilizado para configurar el servidor MQTT en el Gateway WHG-151 presentaba una limitación en la cantidad de caracteres admitidos, impidiendo registrar correctamente el nombre de dominio del servidor.

**Causa identificada:**

El nombre de dominio utilizado para acceder al broker excedía la cantidad de caracteres permitida por el campo de configuración disponible en el gateway.

**Solución aplicada:**

Se sustituyó el nombre de dominio por la dirección IP del servidor como alternativa para establecer la conexión con el broker.

**Resultado posterior:**

No fue posible comprobar completamente la efectividad de esta modificación debido a las limitaciones de acceso al servidor durante la prueba. Adicionalmente, el monitor serial utilizado durante la configuración no proporcionaba información suficiente para confirmar la conexión MQTT.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ----------- | --------- |
| Captura 01 | Limitación de permisos para acceder a la instancia EC2. | `./imgs/obtaculoPermisosEC2` |
| Captura 02 | Limitación en la longitud del dominio configurable en el WHG-151. | `./imgs/limitacionDominioWHG151` |
| Fotografía 01 | Montaje del joystick, potenciómetro y Gateway WHG-151. | Pendiente |
| Captura 03 | Configuración de comunicación MQTT del gateway. | Pendiente |
| Captura 04 | Mensajes recibidos mediante MQTTX. | Pendiente |

### Evidencias

* [Evidencia de limitación de permisos de EC2](./imgs/obtaculoPermisosEC2)
* [Evidencia de limitación del dominio en WHG-151](./imgs/limitacionDominioWHG151)
* [Fotografía del montaje de las entradas analógicas](./evidencias/2026-08-24/montaje_variables_analogicas.png)
* [Configuración MQTT del Gateway](./evidencias/2026-08-24/configuracion_mqtt.png)
* [Mensajes recibidos mediante MQTTX](./evidencias/2026-08-24/mqttx_mensajes.png)

---


*  Confirmar la comunicación entre el Gateway WHG-151 y el broker MQTT de AWS EC2 utilizando la dirección IP configurada.

*  Verificar la recepción de las variables **AVI6, AVI7 y AVI8** mediante un cliente MQTT.

*  Registrar ejemplos de los mensajes MQTT generados por el gateway.

*  Validar la correspondencia entre los cambios físicos de las señales y los valores transmitidos mediante MQTT.

*  Documentar los rangos y características eléctricas de las entradas analógicas AVI6, AVI7 y AVI8.

*  Evaluar una alternativa para solucionar la limitación de longitud del dominio en la configuración del gateway.

*  Realizar pruebas de reconexión ante una pérdida temporal de comunicación con el broker.

*  Continuar con la integración de señales provenientes del PLC.

---

## 11. Observaciones

Las señales generadas mediante el joystick y el potenciómetro se utilizaron como **señales de prueba** para representar las variables que posteriormente podrán ser proporcionadas por el PLC u otros instrumentos industriales.

La arquitectura implementada durante esta actividad permite validar el flujo:

```text
Señales analógicas
       ↓
Gateway WHG-151
       ↓
MQTT
       ↓
Broker AWS EC2
```

El Arduino y el módulo de relé utilizados para la señal digital forman parte de una prueba independiente de integración con **DI3** y no son necesarios para la generación de las variables analógicas AVI6, AVI7 y AVI8.

Para una implementación definitiva se deberá validar que las características eléctricas de las señales provenientes del PLC sean compatibles con las entradas analógicas del gateway.

---

## 12. Estado de la actividad

**Estado:** Parcialmente completada

**Fecha de cierre:** 24/08/2026

**Pendientes:**

Queda pendiente completar la validación de extremo a extremo de las variables analógicas, verificando que los valores adquiridos por **AVI6, AVI7 y AVI8** sean publicados correctamente por el Gateway WHG-151 y recibidos por el broker MQTT ubicado en AWS EC2.

También queda pendiente realizar las pruebas de estabilidad, reconexión y validación con señales provenientes del PLC.