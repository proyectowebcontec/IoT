# Bitácora — 18-08-2026

**Fecha:** 18-08-2026

**Responsable:** Katherinne Gomez

**Etapa del proyecto:** Etapa 1

**Actividad:** Comunicación arduino/AWS, investigación y documentación.

---

## 1. Objetivo

**Objetivo:**

Establecer una comunicación entre un Arduino Mega 2560 y AWS IoT Core mediante un programa desarrollado en Python, utilizando comunicación serial entre el Arduino y el equipo de cómputo y el protocolo MQTT sobre TLS para el envío de datos hacia AWS.

Como parte de la actividad, se buscó validar la recepción de las variables obtenidas desde el Arduino en AWS IoT Core, definir una estructura de tópicos MQTT y analizar alternativas para la visualización de los datos mediante servicios de AWS.

---

## 2. Actividad realizada

1. Se revisó la configuración inicial de la cuenta de AWS proporcionada para determinar los permisos disponibles para trabajar con AWS IoT Core.
2. Se identificó que la cuenta proporcionada no contaba con los permisos IAM necesarios para crear y administrar políticas de AWS IoT Core.
3. Debido a la necesidad de avanzar con las pruebas durante la jornada, se utilizó temporalmente una cuenta propia de AWS para realizar la configuración y validación del prototipo.
4. Se configuró AWS IoT Core en la región **us-east-2 (Ohio)**.
5. Se creó un Thing denominado `ArduinoMega2560` para representar el dispositivo dentro de AWS IoT Core.
6. Se creó una política de AWS IoT denominada `ArduinoMega2560Policy`, con permisos para establecer conexiones MQTT, publicar, suscribirse y recibir mensajes.
7. Se generaron y configuraron los certificados necesarios para establecer una conexión MQTT segura mediante TLS.
8. Se obtuvo el endpoint correspondiente al Device Gateway de AWS IoT Core.
9. Se definió el Client ID `ArduinoMega2560`.
10. Se definió el tópico MQTT `arduino/mega2560/sensores` para el envío de datos del dispositivo.
11. Se desarrolló y configuró un programa Python para establecer comunicación serial con el Arduino mediante el puerto `COM8`, utilizando una velocidad de `9600 baudios`.
12. El programa Python recibe los datos enviados por el Arduino, los separa y valida para identificar cinco variables:

    * Potenciómetro.
    * Eje X del joystick.
    * Eje Y del joystick.
    * Botón del joystick.
    * Push button.
13. Se estructuraron los datos recibidos en formato JSON.
14. Se implementó la publicación de los datos mediante MQTT utilizando AWS IoT Device SDK para Python v2.
15. Se configuró MQTT con QoS 1 (`AT_LEAST_ONCE`) para la publicación de los mensajes.
16. Se verificó la conexión real entre Python y AWS IoT Core mediante MQTT/TLS.
17. Se utilizó el MQTT Test Client de AWS IoT Core para verificar la recepción de los mensajes publicados por el programa Python.
18. Se verificó que los mensajes fueran recibidos en tiempo real en el tópico configurado.
19. Se investigaron alternativas para transformar los datos de IoT en visualizaciones y dashboards utilizando **AWS IoT SiteWise** y **Amazon Managed Grafana**.
20. Se inició la documentación técnica de la configuración y de las pruebas realizadas.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo                   | Identificación                                | Función                                                     |
| ---------------- | -------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| Microcontrolador | Arduino Mega 2560                | ArduinoMega2560                               | Adquisición de variables mediante sensores y botones        |
| Computadora      | —                                | —                                             | Ejecución del programa Python y comunicación con el Arduino |
| Software         | Python                           | Versión utilizada en el entorno de desarrollo | Procesamiento de datos y comunicación con AWS               |
| Software         | AWS IoT Core                     | Región us-east-2                              | Recepción y gestión de mensajes MQTT                        |
| Software         | AWS IoT Device SDK for Python v2 | —                                             | Establecimiento de comunicación MQTT/TLS                    |
| Software         | PySerial                         | —                                             | Comunicación serial entre Python y Arduino                  |
| Software         | MQTT Test Client                 | AWS IoT Core                                  | Validación de recepción de mensajes MQTT                    |
| Servicio         | AWS IoT SiteWise                 | —                                             | Investigación para modelado y visualización de datos IoT    |
| Servicio         | Amazon Managed Grafana           | —                                             | Investigación para modelado y visualización                |

---

## 4. Configuración

### Hardware

* **Equipo:** Arduino Mega 2560
* **Modelo:** Mega 2560
* **Alimentación:** Alimentación mediante conexión USB al equipo de cómputo durante las pruebas.
* **Conexiones:** Comunicación serial USB entre el Arduino y el equipo de cómputo.
* **Puerto serial:** `COM8`
* **Velocidad de comunicación:** `9600 baudios`

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Python
* **Librerías / dependencias:**

  * `pyserial`
  * `json`
  * `time`
  * `awscrt`
  * `awsiot`
* **SDK utilizado:** AWS IoT Device SDK for Python v2.

### Comunicación Arduino — Python

* **Protocolo:** Comunicación serial
* **Puerto:** `COM8`
* **Baud rate:** `9600`
* **Formato de datos recibido:** Valores separados por comas.
* **Cantidad de variables:** 5.

La estructura recibida desde el Arduino corresponde conceptualmente a:

```text
potenciometro,joystick_x,joystick_y,boton_joystick,push_button
```

### Comunicación Python — AWS IoT Core

* **Protocolo:** MQTT sobre TLS
* **Región AWS:** `us-east-2` — Ohio
* **Endpoint:** Device Data Endpoint de AWS IoT Core configurado para la cuenta.
* **Client ID:** `ArduinoMega2560`
* **Puerto MQTT seguro:** `8883`
* **Tópico:** `arduino/mega2560/sensores`
* **QoS:** `AT_LEAST_ONCE` (QoS 1)
* **Clean session:** `False`
* **Keep alive:** `30 segundos`
* **Autenticación:** Certificado X.509, clave privada y Amazon Root CA.

> No se registran en esta bitácora certificados, claves privadas, tokens, contraseñas ni otras credenciales de autenticación.

### Estructura del mensaje

Los datos obtenidos del Arduino son transformados a JSON antes de ser publicados en AWS IoT Core.

Ejemplo de estructura:

```json
{
  "potenciometro": 512,
  "joystick": {
    "x": 498,
    "y": 523,
    "boton": 1
  },
  "push_button": 0,
  "timestamp": 1750000000
}
```

El valor de `timestamp` corresponde al tiempo Unix generado por Python al momento de procesar la lectura.

---

## 5. Cambios realizados

| Elemento             | Configuración anterior                                | Configuración nueva                                | Motivo                                                                   |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| Cuenta AWS utilizada | Cuenta AWS proporcionada sin permisos IAM suficientes | Cuenta AWS propia utilizada temporalmente          | Permitir avanzar con la configuración y pruebas de AWS IoT Core          |
| AWS IoT Core         | Sin configuración del dispositivo                     | Thing `ArduinoMega2560` creado                     | Representar el dispositivo dentro de AWS IoT Core                        |
| Política IoT         | No configurada                                        | `ArduinoMega2560Policy`                            | Permitir operaciones MQTT necesarias para el prototipo                   |
| Autenticación        | No configurada                                        | Certificado X.509 + clave privada + Amazon Root CA | Establecer comunicación MQTT segura                                      |
| Client ID            | No definido                                           | `ArduinoMega2560`                                  | Identificar la conexión MQTT                                             |
| Tópico MQTT          | No definido                                           | `arduino/mega2560/sensores`                        | Establecer el canal lógico para el envío de datos                        |
| Comunicación Arduino | No integrada con AWS                                  | Arduino → Python → MQTT → AWS IoT Core             | Implementar comunicación extremo a extremo                               |
| Formato de datos     | Datos seriales separados por comas                    | JSON                                               | Estructurar la información para su transmisión y posterior procesamiento |
| QoS MQTT             | No configurado                                        | QoS 1 (`AT_LEAST_ONCE`)                            | Mejorar la confiabilidad de entrega de los mensajes                      |

---

## 6. Resultados obtenidos

**Resultado general:**

Exitoso.

### Resultados específicos

* Se estableció correctamente la configuración inicial de AWS IoT Core para representar el Arduino Mega 2560 como un dispositivo IoT.
* Se creó y configuró el Thing `ArduinoMega2560`.
* Se creó la política `ArduinoMega2560Policy` con los permisos MQTT requeridos para las pruebas.
* Se configuró la autenticación mediante certificados X.509.
* Se estableció correctamente una conexión MQTT real desde Python hacia AWS IoT Core mediante TLS.
* Python logró recibir datos del Arduino mediante comunicación serial.
* Se validó la lectura de las cinco variables definidas: potenciómetro, joystick X, joystick Y, botón del joystick y push button.
* Los datos fueron transformados correctamente a formato JSON.
* Los mensajes fueron publicados en el tópico `arduino/mega2560/sensores`.
* El MQTT Test Client de AWS IoT Core recibió correctamente los mensajes publicados por Python en tiempo real.
* Se confirmó el funcionamiento de la cadena de comunicación:

```text
Arduino Mega 2560
        ↓
Comunicación Serial
        ↓
Python
        ↓
MQTT / TLS
        ↓
AWS IoT Core
        ↓
MQTT Test Client
```

* Se investigó la integración de AWS IoT SiteWise y Amazon Managed Grafana como posibles herramientas para la visualización de los datos.
* Se inició la documentación técnica de la configuración, pruebas y resultados.

### Datos relevantes

```text
Thing:
ArduinoMega2560

Client ID:
ArduinoMega2560

Región:
us-east-2

Tópico MQTT:
arduino/mega2560/sensores

QoS:
AT_LEAST_ONCE (QoS 1)

Puerto serial:
COM8

Baud rate:
9600

Variables transmitidas:
1. Potenciómetro
2. Joystick X
3. Joystick Y
4. Botón del joystick
5. Push button
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo                                                                                                                                        | Momento                               | Impacto                                                                                      | Evidencia                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| La cuenta de AWS proporcionada no contaba con los permisos IAM necesarios para crear y administrar políticas de AWS IoT Core                             | Configuración inicial de AWS IoT Core | Impidió avanzar inicialmente con la creación de las políticas requeridas para el dispositivo | Mensaje de permisos de AWS IAM / IoT Core          |
| Se presentó inicialmente un error al intentar utilizar una funcionalidad de conexión de la consola al Device Gateway debido a permisos IAM insuficientes | Pruebas iniciales de conectividad     | Impidió utilizar esa modalidad de conexión desde la consola                                  | Mensaje: `Unable to connect to the Device Gateway` |
| No se contaba inicialmente con una configuración de comunicación entre Arduino y AWS IoT Core                                                            | Inicio de integración                 | Fue necesario desarrollar la comunicación mediante Python como intermediario                 | Código Python de integración                       |

---

## 8. Solución aplicada

### Problema 1

**Problema:**

La cuenta de AWS proporcionada no contaba con los permisos IAM necesarios para crear y administrar políticas dentro de AWS IoT Core.

**Causa identificada:**

La identidad utilizada para acceder a AWS no disponía de los permisos requeridos para realizar las operaciones administrativas necesarias en AWS IoT Core.

**Solución aplicada:**

Debido a la premura para avanzar con la implementación y las pruebas del prototipo, se utilizó temporalmente una cuenta propia de AWS para realizar la configuración de AWS IoT Core, crear el Thing, configurar la política y realizar las pruebas de conectividad.

**Resultado posterior:**

Fue posible completar la configuración de AWS IoT Core y continuar con la implementación y validación de la comunicación MQTT.

> **Observación:** El uso de una cuenta personal se considera una solución temporal para fines de desarrollo/prueba. Para una implementación formal se deberá utilizar la cuenta institucional correspondiente con los permisos IAM definidos bajo el principio de mínimo privilegio.

### Problema 2

**Problema:**

La consola de AWS presentó el mensaje `Unable to connect to the Device Gateway` al intentar utilizar una funcionalidad de conexión desde la interfaz de AWS IoT Core.

**Causa identificada:**

La funcionalidad utilizada desde la consola requería permisos IAM adicionales para establecer la conexión con el Device Gateway. Esto es diferente de la autenticación MQTT mediante certificado X.509 utilizada posteriormente por el programa Python.

**Solución aplicada:**

Se verificó el funcionamiento del MQTT Test Client y posteriormente se implementó la conexión MQTT directamente desde Python utilizando AWS IoT Device SDK for Python v2, autenticación mediante certificado X.509 y comunicación TLS.

**Resultado posterior:**

La conexión MQTT desde Python hacia AWS IoT Core funcionó correctamente y permitió publicar los datos obtenidos desde el Arduino.

### Problema 3

**Problema:**

Era necesario transmitir hacia AWS los datos obtenidos por el Arduino y estructurarlos en un formato adecuado para su procesamiento posterior.

**Causa identificada:**

El Arduino proporciona los valores mediante comunicación serial en una cadena de datos delimitada por comas.

**Solución aplicada:**

Python se utilizó como gateway de software entre el Arduino y AWS. El programa recibe la cadena serial, separa los valores, valida que existan cinco variables, convierte los valores numéricos y genera un objeto JSON antes de publicarlo mediante MQTT.

**Resultado posterior:**

Los datos fueron publicados correctamente en el tópico:

```text
arduino/mega2560/sensores
```

y se visualizaron en tiempo real mediante el MQTT Test Client de AWS IoT Core.


---

## 9. Evidencias

Relacionar las evidencias generadas durante la actividad.

| Evidencia     | Descripción   | Ubicación          |
| ------------- | ------------- | ------------------ |
| Captura 01    | Error de permisos | Bitacora\Mes1\imgs\ErrorCreacionPoliticas.png |
| Captura 02    | Envio de datos | Bitacora\Mes1\imgs\ServidorMQTT.png |
| Captura 03        | Captura en AWS IOT Core | Bitacora\Mes1\imgs\ClienteMQTT.png |

---

## 10. Próximos pasos

Registrar las actividades que deben realizarse posteriormente.


1. Validar la configuración de AWS utilizando la cuenta institucional correspondiente.
2. Definir y aplicar políticas IAM e IoT siguiendo el principio de mínimo privilegio.
3. Separar las credenciales y parámetros de configuración del código fuente.
4. Implementar mecanismos de reconexión ante pérdida de conectividad.
5. Implementar manejo de errores de comunicación serial y MQTT.
6. Evaluar la frecuencia adecuada de publicación de datos.
7. Definir formalmente la estructura de los tópicos MQTT.
8. Evaluar la utilización de AWS IoT SiteWise para el modelado de activos y variables industriales.
9. Configurar un dashboard mediante Amazon Managed Grafana.
10. Documentar la arquitectura final del flujo:

```text
Arduino Mega 2560
        ↓
Gateway / Python
        ↓
MQTT + TLS
        ↓
AWS IoT Core
        ↓
AWS IoT SiteWise
        ↓
Amazon Managed Grafana
```

---

## 11. Observaciones


---

## 12. Estado de la actividad

**Arduino → Python → AWS IoT Core.** Implementado

**publicación MQTT y recepción en tiempo real** Implementado

**IoT SiteWise + Managed Grafana** Investigado

**dashboard funcional, integración institucional, endurecimiento de permisos y manejo de reconexiones** Pendiente

**Pendientes:**
- Continuar desarrollando la documentación
- Endurecer permisos y refina código para hacerlo más seguro y escalable