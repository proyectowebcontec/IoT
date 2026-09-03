# Integración del Gateway WGH-151 al broker MQTT en AWS EC2

## 1. Descripción

Se implementó la comunicación entre el **Gateway industrial GAOTek WHG-151** y un **broker MQTT desplegado en una instancia AWS EC2**, utilizando el protocolo MQTT mediante el **puerto 1883**.

El objetivo de esta implementación fue validar el flujo de información desde señales físicas generadas mediante componentes electrónicos, recibidas por las entradas del gateway, hasta su publicación en el broker MQTT ubicado en AWS EC2.

Para realizar la prueba se utilizaron tres tipos de señales:

* Una señal digital generada mediante un **botón pulsador**, conectada a la entrada digital **DI3** del gateway mediante un módulo de relé.
* Una señal analógica generada mediante un **joystick HW-504**, utilizando sus ejes como fuentes de señal para las entradas **AVI6** y **AVI7**.
* Una señal analógica generada mediante un **potenciómetro de 10 kΩ**, conectada a la entrada **AVI8**.

El gateway adquiere estas señales y las transmite mediante MQTT hacia el broker ubicado en AWS EC2. Los mensajes publicados en el tópico **`test/mqtt`** pueden ser recibidos por clientes MQTT suscritos al mismo tópico, como **MQTTX**.

La implementación permite validar una arquitectura de comunicación representativa del flujo que posteriormente podrá utilizarse con un **PLC u otros instrumentos industriales** asociados al monitoreo y control de un motor de polipasto.


---

## 2. Objetivo

Implementar y validar la comunicación del **Gateway GAOTek WHG-151** con un **broker MQTT desplegado en AWS EC2**, utilizando señales digitales y analógicas como datos de prueba y verificando su recepción mediante un cliente MQTT suscrito al tópico correspondiente.

Los objetivos específicos fueron:

* Recibir una señal digital mediante la entrada **DI3** del gateway.
* Recibir señales analógicas mediante las entradas **AVI6, AVI7 y AVI8**.
* Utilizar un botón, un joystick y un potenciómetro como fuentes de señales para las pruebas.
* Verificar la adquisición de las señales por parte del Gateway WHG-151.
* Configurar el gateway para establecer comunicación con el broker MQTT ubicado en AWS EC2.
* Utilizar el puerto **1883** para la comunicación MQTT.
* Publicar los datos adquiridos por el gateway en el tópico **`test/mqtt`**.
* Verificar mediante **MQTTX** que los mensajes publicados por el gateway sean recibidos correctamente.
* Validar el flujo de comunicación **señal física → gateway → MQTT → broker AWS EC2 → suscriptor**.
* Establecer una base funcional para la posterior integración con señales provenientes de un PLC o instrumentos industriales.

---
## 3. Alcance

La presente implementación comprende:

1. Generación de señales de prueba mediante componentes electrónicos.
2. Interconexión de las señales con las entradas del Gateway WHG-151.
3. Configuración de la comunicación MQTT del gateway.
4. Comunicación entre el gateway y el broker MQTT alojado en AWS EC2.
5. Publicación de los datos en el tópico `test/mqtt`.
6. Suscripción al tópico mediante MQTTX.
7. Verificación de la recepción de los mensajes.

La implementación corresponde a una **prueba de integración y comunicación**. Los componentes utilizados para generar las señales representan las señales que posteriormente podrán provenir de un PLC u otros dispositivos de instrumentación.

---

## 4. Equipos y componentes

| Equipo / Componente    | Modelo / Identificación | Función                                          |
| ---------------------- | ----------------------- | ------------------------------------------------ |
| Módulo de relé         | JQC3F-05VDC-C / KY-019  | Enviar de forma segura el pulso del botón al gateway       |
| Gateway industrial     | GAOTek WHG-151          | Recibir la señal mediante la entrada digital DI3 y señales analógicas en las entradas AVI6, AVI7 Y AVI8  y transmitirlas vía MQTT|
| Botón pulsador         | --------                | Generar la señal de entrada digital           |
| Potenciometro          | 10 k ohm                | Generar la señal de entrada analoga de tensión   |
| Joystick               | HW 504                  | Generar las señales de entrada analoga de tensión|
| Fuente de alimentación | 5 VDC                   | Alimentar los componentes            |
| Cableado               | —                       | Interconexión entre los dispositivos             |
| Broker MQTT            | AWS EC2                 | Recibir los mensajes MQTT publicados por el gateway                   |
| Cliente MQTT           | MQTTX                   | Suscribirse al tópico y verificar los mensajes recibidos              |

---

## 5. Arquitectura de conexión

La arquitectura implementada fue:

```text
                 CONTROL
┌──────────────┐
│    Botón     │
└──────┬───────┘
       │
       │
       │ Señal de control
       ▼
┌────────────────────────┐
│ Módulo de relé KY-019  │
│ JQC3F-05VDC-C          │
│                        │
│ IN  ◄── Boton          │
│ VCC ◄── 5 V            │
│ GND ◄── GND            │
│                        │  ┌──────────────┐    ┌──────────────┐
│ COM ───────────────────┤  │ Potenciometro│    │   Joystick   │
│ NO  ─────────────────┐ |  └──────┬───────┘    └──────┬───────┘
└──────────────────────┼─┘         |                   |
                       │           |                   |
                       ▼           ▼                   ▼
                         ┌────────────────────────────┐
                         │      Gateway GAOTek        │
                         │                            │
                         │ Tierra / COM ──────────────┤
                         │ DI3        ◄── NO del relé │
                         │ AVI6 ◄── JoystickX         │
                         │ AVI7 ◄── JoystickY         │
                         │ AVI8 ◄── Potenciometro     │
                         │                            │
                         └────────────────────────────┘
                                        │
                                        │
                                        │ MQTT Puerto: 1883
                                        │ topic: test/mqtt 
                                        ▼
                              ┌────────────────────┐
                              │    Broker MQTT     │
                              |      AWS EC2       |
                              └────────────────────┘
                                        │
                                        │
                                        │ MQTT
                                        │ topic: test/mqtt                                        
                                        ▼
                              ┌────────────────────┐
                              │  Suscriptor MQTT   │
                              |       MQTTX        |
                              └────────────────────┘


```

## 6. Distribución de entradas

Las señales utilizadas durante la prueba fueron distribuidas de la siguiente manera:

| Entrada del WHG-151 | Fuente de señal        | Tipo de señal | Función en la prueba            |
| ------------------- | ---------------------- | ------------- | ------------------------------- |
| DI3                 | Botón + módulo de relé | Digital       | Simular una señal de activación |
| AVI6                | Joystick X             | Analógica     | Simular variable analógica      |
| AVI7                | Joystick Y             | Analógica     | Simular variable analógica      |
| AVI8                | Potenciómetro          | Analógica     | Simular variable analógica      |

La distribución permite probar simultáneamente entradas digitales y analógicas del gateway.

---

## 7. Funcionamiento

El funcionamiento general de la integración se basa en la siguiente cadena:

```text
Generación de señal
        ↓
Adquisición en el Gateway
        ↓
Procesamiento de las entradas
        ↓
Configuración MQTT
        ↓
Publicación en test/mqtt
        ↓
Broker MQTT en AWS EC2
        ↓
Suscripción MQTTX
        ↓
Visualización de los datos
```

---


## 7. Funcionamiento

El funcionamiento general de la integración se basa en la siguiente cadena:

```text
Generación de señal
        ↓
Adquisición en el Gateway
        ↓
Procesamiento de las entradas
        ↓
Configuración MQTT
        ↓
Publicación en test/mqtt
        ↓
Broker MQTT en AWS EC2
        ↓
Suscripción MQTTX
        ↓
Visualización de los datos
```

### 7.1 Señal digital

La señal digital se genera mediante el botón conectado al Arduino.

El Arduino controla el módulo de relé, y el contacto del relé funciona como interfaz eléctrica entre el circuito de control y la entrada **DI3** del gateway.

La secuencia es:

```text
Botón presionado
       ↓
Arduino detecta la pulsación
       ↓
Arduino activa el relé
       ↓
El contacto NO del relé se cierra
       ↓
DI3 recibe la condición de activación
       ↓
Gateway registra el cambio de estado
```

Al liberar el botón, el proceso ocurre de manera inversa:

```text
Botón liberado
       ↓
Arduino desactiva el relé
       ↓
Contacto NO vuelve a estar abierto
       ↓
DI3 deja de estar activa
       ↓
Gateway registra el cambio de estado
```

### 7.2 Señales analógicas

El **joystick HW-504** proporciona señales de tensión variables mediante sus ejes. Estas señales se conectaron a:

```text
Joystick X ───────► AVI6
Joystick Y ───────► AVI7
```

El potenciómetro de **10 kΩ** se utilizó como fuente de una tercera señal analógica:

```text
Potenciómetro ────► AVI8
```

Al modificar la posición del joystick o del potenciómetro, cambia la señal eléctrica aplicada a la entrada correspondiente del gateway.

El gateway adquiere estos valores y los incorpora a la información transmitida mediante MQTT.

---

## 8. Configuración de comunicación MQTT

La comunicación entre el Gateway WHG-151 y el broker desplegado en AWS EC2 utiliza el protocolo **MQTT**.

Los parámetros principales utilizados fueron:

| Parámetro  | Configuración     |
| ---------- | ----------------- |
| Protocolo  | MQTT              |
| Broker     | Instancia AWS EC2 |
| Puerto     | 1883              |
| Tópico     | `test/mqtt`       |
| Publicador | Gateway WHG-151   |
| Broker     | MQTT en AWS EC2   |
| Suscriptor | MQTTX             |

El gateway actúa como **cliente MQTT publicador**, mientras que la instancia EC2 aloja el **broker MQTT**.

MQTTX se utiliza como cliente suscriptor para verificar que los mensajes publicados por el gateway lleguen correctamente al broker y puedan ser recibidos por un suscriptor.

---

## 10. Flujo de comunicación MQTT

La comunicación se puede representar de la siguiente forma:

```text
WHG-151
   │
   │ Publicación MQTT
   │
   │ topic: test/mqtt
   │ port: 1883
   ▼
┌─────────────────────┐
│   Broker MQTT       │
│      AWS EC2        │
└──────────┬──────────┘
           │
           │ Mensaje MQTT
           ▼
       ┌─────────┐
       │  MQTTX  │
       │Subscriptor
       └─────────┘
```

El broker recibe los mensajes publicados por el gateway y los distribuye a los clientes que se encuentren suscritos al tópico correspondiente.

Por lo tanto, MQTTX no constituye el destino directo del gateway; ambos dispositivos utilizan el broker como intermediario de comunicación.

---
### Evidencias

[Botón liberado](./imgs/EnvioSeñal_arduino_gateway/Gateway151_0.jpeg)

[Botón presionado](./imgs/EnvioSeñal_arduino_gateway/Gateway151_1.jpeg)

---

## 11. Configuración de AWS EC2

El broker MQTT se encuentra desplegado en una instancia **Amazon EC2**.

Para permitir la comunicación con el gateway, la instancia debe encontrarse accesible desde la red donde se encuentra instalado el gateway y el puerto utilizado por MQTT debe estar disponible.

La configuración utilizada en esta implementación fue:

```text
Servicio:       Broker MQTT
Plataforma:     AWS EC2
Protocolo:      MQTT
Puerto:         1883
Tópico:         test/mqtt
```

> No se incluyen en esta documentación direcciones IP públicas, credenciales, contraseñas, claves privadas ni tokens.

---

## 12. Procedimiento de integración

### 12.1 Preparación del hardware

1. Conectar el botón al relé.
2. Conectar el contacto del relé a la entrada DI3 del gateway.
3. Conectar el joystick a las entradas AVI6 y AVI7.
4. Conectar el potenciómetro a la entrada AVI8.
5. Verificar las conexiones eléctricas antes de energizar los equipos.

### 12.2 Configuración del Gateway

1. Acceder a la interfaz de configuración del WHG-151.
2. Configurar los parámetros correspondientes a las entradas utilizadas.
3. Configurar la comunicación MQTT.
4. Establecer el broker correspondiente a la instancia EC2.
5. Configurar el puerto MQTT **1883**.
6. Configurar el tópico **`test/mqtt`**.
7. Guardar la configuración.
8. Reiniciar el gateway.

### 12.3 Preparación del suscriptor

En MQTTX:

1. Configurar una conexión hacia el broker MQTT.
2. Establecer la información correspondiente al broker.
3. Conectarse al broker.
4. Crear una suscripción al tópico:

```text
test/mqtt
```

5. Mantener la suscripción activa durante las pruebas.

### 12.4 Ejecución de las pruebas

1. Energizar los equipos.
2. Verificar el estado inicial de DI3.
3. Presionar y liberar el botón.
4. Verificar el cambio de estado de DI3.
5. Mover el joystick en el eje X.
6. Mover el joystick en el eje Y.
7. Modificar la posición del potenciómetro.
8. Observar los mensajes publicados en el broker.
9. Verificar en MQTTX la recepción de los mensajes.
10. Comparar los cambios físicos realizados con los datos recibidos.

---

## 13. Resultado esperado

Se espera que la integración permita establecer la siguiente cadena de comunicación:

```text
Botón / Joystick / Potenciómetro
              ↓
       Entradas del WHG-151
              ↓
         Gateway WHG-151
              ↓
          MQTT :1883
              ↓
        Broker AWS EC2
              ↓
      topic: test/mqtt
              ↓
            MQTTX
```

Al modificar una señal de entrada, el valor correspondiente debe reflejarse en los mensajes MQTT publicados por el gateway.

Para la entrada digital:

```text
Botón liberado   → DI3 desactivada
Botón presionado → DI3 activada
```

Para las entradas analógicas:

```text
Movimiento Joystick X → variación en AVI6
Movimiento Joystick Y → variación en AVI7
Potenciómetro          → variación en AVI8
```

---

## 14. Resultados obtenidos

La implementación permitió establecer la comunicación entre el **Gateway WHG-151** y el broker MQTT desplegado en **AWS EC2**, utilizando el puerto **1883** y el tópico **`test/mqtt`**.

Se validó la arquitectura:

**Señales físicas → WHG-151 → MQTT → Broker EC2 → MQTTX.**

La prueba permitió utilizar simultáneamente:

* Una entrada digital mediante **DI3**.
* Tress entradas analógicas mediante **AVI6, AVI7** y **AVI8**.

La recepción de los mensajes mediante MQTTX permite comprobar que la información adquirida por el gateway puede ser transmitida hacia la infraestructura MQTT ubicada en AWS.

---

## 15. Consideraciones técnicas

### 15.1 Interfaz entrada digital y Gateway

No se debe conectar directamente una salida digital de cualquier dispositivo con una entrada industrial del gateway sin verificar previamente las características eléctricas de la entrada.

En esta implementación se utilizó un módulo de relé como interfaz:

```text
Arduino
   ↓
Módulo de relé
   ↓
Contacto eléctrico
   ↓
DI3
```

Esta consideración mantiene el mismo criterio utilizado en la integración digital previamente documentada.

### 15.2 Entradas analógicas

Antes de conectar señales analógicas provenientes de un PLC o instrumento industrial, se deben verificar las características eléctricas específicas de las entradas **AVI6, AVI7 y AVI8**, incluyendo:

* Rango de tensión admitido.
* Tipo de señal esperado.
* Referencia eléctrica.
* Polaridad.
* Límites de operación.
* Correspondencia entre tensión de entrada y valor reportado.

Los valores específicos de estos parámetros no se establecen en la información utilizada para esta documentación y, por lo tanto, deben verificarse en la documentación técnica correspondiente al modelo instalado.

### 15.3 Puerto MQTT 1883

La implementación utiliza el puerto:

```text
1883
```

Este puerto corresponde al servicio MQTT utilizado en la prueba.

Cualquier firewall, grupo de seguridad o mecanismo de filtrado de red situado entre el gateway y la instancia EC2 debe permitir la comunicación necesaria para establecer la conexión con el broker.

### 15.4 Seguridad

La implementación descrita utiliza el puerto MQTT **1883**. En esta documentación no se establece el uso de TLS para esta conexión.

Para una implementación productiva se debe evaluar la utilización de mecanismos de seguridad apropiados, incluyendo:

* Cifrado de la comunicación.
* Autenticación del cliente MQTT.
* Control de acceso al broker.
* Restricción del acceso al puerto MQTT.
* Uso de credenciales independientes para los dispositivos.
* Políticas de firewall y reglas de seguridad de AWS.
* Evitar la exposición innecesaria del broker a Internet.
* Rotación y protección de credenciales.

No deben incluirse en la documentación contraseñas, tokens, claves privadas u otras credenciales.

### 15.5 Tópico MQTT

El tópico utilizado durante la prueba fue:

```text
test/mqtt
```

Este tópico debe considerarse un tópico de prueba. Para una implementación productiva se recomienda establecer una estructura de tópicos que permita identificar de forma clara el dispositivo, planta, equipo, variable o tipo de información transmitida.

### 15.6 Validación de datos

El hecho de recibir mensajes MQTT confirma la comunicación entre el gateway y el broker, pero no necesariamente garantiza que los valores de las señales representen correctamente las variables físicas del proceso.

Para una implementación industrial se debe validar:

```text
Valor físico
     ↓
Señal eléctrica
     ↓
Entrada del gateway
     ↓
Valor adquirido
     ↓
Mensaje MQTT
     ↓
Valor recibido
```

Esta validación será especialmente importante cuando las entradas sean reemplazadas por señales provenientes del PLC o de instrumentos de medición reales.

---


## 16. Errores y obstáculos

Durante la implementación ocurrieron los siguientes inconvenientes:

| Error / Obstáculo                | Posible área de revisión                      | Causa | Solución |
| -------------------------------- | --------------------------------------------- | ----- | -------- | 
| Gateway no conecta con el broker | Configuración MQTT / red / puerto / Logs EC2  | Inicialmente el puerto configurado era el 8883 para incluir TLS en la conexión, sin embargo el gateway intentaba comunicar MQTT plano | Se habilitó el puerto 1883 para evaluar la conexión |
| Fallos de conexión desde MQTTX  | Conexión / suscripción / Dominio              | El dominio del DNS estaba redirigiendo a la IP equivocada | Se configuró la IP correcta |
| Imposibilidad para visualizar la conexión del Gateway al broker | EC2 / Cloudwatch / Logs | Falta de acceso a la EC2 desplegada | Se concedieron los permisos y se compartieron las claves de conexión |

---

## 17. Evidencias

| Evidencia                 | Descripción                                                   |  Ubicación          |
| ------------------------- | ------------------------------------------------------------- | ------------------- |
| Fotografía del montaje    | Conexión del Arduino, relé, joystick, potenciómetro y gateway |
| Configuración del WHG-151 | Parámetros MQTT configurados                                  |
| Estado de DI3             | Entrada digital activada/desactivada                          |
| Estado de AVI6            | Variación producida por el joystick                           |
| Estado de AVI7            | Variación producida por el joystick                           |
| Estado de AVI8            | Variación producida por el potenciómetro                      |
| MQTTX conectado           | Conexión del cliente al broker                                |
| Mensajes MQTT             | Mensajes recibidos en `test/mqtt`                             |
| Broker EC2                | Evidencia de recepción de mensajes                            |

---

## 18. Conclusión

La integración del **Gateway industrial GAOTek WHG-151** con el broker MQTT desplegado en **AWS EC2** permitió validar el flujo de comunicación desde señales físicas hasta la infraestructura MQTT.

Mediante el uso de un botón, un joystick y un potenciómetro se generaron señales de prueba que fueron recibidas por las entradas **DI3, AVI6, AVI7 y AVI8** del gateway. Posteriormente, el gateway transmitió la información mediante MQTT utilizando el **puerto 1883** y el tópico **`test/mqtt`**.

La recepción de los mensajes mediante **MQTTX** permitió verificar la comunicación entre el gateway y el broker, validando experimentalmente la cadena:

**Señales físicas → Gateway WHG-151 → Broker MQTT en AWS EC2 → MQTTX.**

Esta prueba constituye una etapa importante para la arquitectura del proyecto, ya que demuestra la capacidad de utilizar el WHG-151 como punto de adquisición de señales y como enlace de comunicación hacia la infraestructura MQTT. El siguiente paso consiste en reemplazar progresivamente las señales de prueba por señales provenientes del **PLC y/o instrumentos reales**, además de completar las validaciones de seguridad, reconexión, escalamiento de señales y estabilidad requeridas para una implementación industrial.
