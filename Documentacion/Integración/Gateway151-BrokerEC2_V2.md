# Integración del Gateway WHG-151 al Broker MQTT en AWS EC2

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

### 2.1 Objetivo general

Implementar y validar la comunicación del **Gateway GAOTek WHG-151** con un **broker MQTT desplegado en AWS EC2**, utilizando señales digitales y analógicas como datos de prueba y verificando su recepción mediante un cliente MQTT suscrito al tópico correspondiente.

### 2.2 Objetivos específicos

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

| Equipo / Componente    | Modelo / Identificación | Función                                                               |
| ---------------------- | ----------------------- | --------------------------------------------------------------------- |
| Arduino                | 2560                    | Generar y controlar la señal utilizada para la entrada digital        |
| Módulo de relé         | JQC3F-05VDC-C / KY-019  | Interfaz eléctrica entre Arduino y entrada DI3 del gateway            |
| Gateway industrial     | GAOTek WHG-151          | Adquirir señales digitales y analógicas y transmitirlas mediante MQTT |
| Botón pulsador         | —                       | Generar la señal digital de prueba                                    |
| Potenciómetro          | 10 kΩ                   | Generar una señal analógica de tensión                                |
| Joystick               | HW-504                  | Generar señales analógicas correspondientes a sus ejes                |
| Fuente de alimentación | 5 VDC                   | Alimentar Arduino y módulo de relé                                    |
| Broker MQTT            | AWS EC2                 | Recibir los mensajes MQTT publicados por el gateway                   |
| Cliente MQTT           | MQTTX                   | Suscribirse al tópico y verificar los mensajes recibidos              |
| Cableado               | —                       | Interconexión entre los diferentes dispositivos                       |

---

## 5. Arquitectura de conexión

La arquitectura implementada fue:

```text
                         GENERACIÓN DE SEÑALES

              ┌─────────────────┐
              │  Botón pulsador │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Arduino      │
              │      2560       │
              └────────┬────────┘
                       │
                       │ Señal de control
                       ▼
              ┌─────────────────┐
              │  Módulo de relé│
              │     KY-019      │
              └────────┬────────┘
                       │
                       │ Contacto del relé
                       ▼
                    ┌───────┐
                    │ DI3   │
                    └───────┐
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        │         GATEWAY GAOTek WHG-151       │
        │                                       │
        │ DI3  ◄── Señal digital               │
        │ AVI6 ◄── Joystick X                  │
        │ AVI7 ◄── Joystick Y                  │
        │ AVI8 ◄── Potenciómetro               │
        │                                       │
        └───────────────────┬───────────────────┘
                            │
                            │ MQTT
                            │ Puerto 1883
                            │
                            ▼
                  ┌────────────────────┐
                  │    Broker MQTT     │
                  │      AWS EC2       │
                  └─────────┬──────────┘
                            │
                            │ MQTT
                            │ topic: test/mqtt
                            │
                            ▼
                  ┌────────────────────┐
                  │      MQTTX         │
                  │    Suscriptor      │
                  └────────────────────┘
```

---

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

## 8. Configuración del hardware

### 8.1 Arduino

El Arduino 2560 se utilizó como elemento de generación y control de la señal digital.

Su función dentro de esta prueba no es comunicarse directamente con AWS, sino generar una señal que permita comprobar el funcionamiento de la entrada digital del gateway.

La cadena utilizada fue:

```text
Botón
  ↓
Arduino 2560
  ↓
Módulo KY-019
  ↓
DI3 del WHG-151
```

### 8.2 Módulo de relé

Se utilizó un módulo de relé **JQC3F-05VDC-C / KY-019** como interfaz eléctrica.

La conexión utilizada para la señal digital fue:

```text
KY-019                  WHG-151

NO ───────────────────► DI3

COM ──────────────────► Tierra / referencia
```

El relé permite evitar la conexión directa de una salida lógica del Arduino con la entrada industrial del gateway.

### 8.3 Joystick

El joystick **HW-504** fue utilizado como fuente de dos señales analógicas:

```text
Joystick X ─────► AVI6
Joystick Y ─────► AVI7
```

Estas señales representan variables analógicas que permiten verificar el comportamiento de las entradas AVI del gateway.

### 8.4 Potenciómetro

Se utilizó un potenciómetro de **10 kΩ** como fuente de una señal analógica adicional.

```text
Potenciómetro ─────► AVI8
```

La modificación de su posición produce una variación de la señal aplicada a la entrada AVI8.

---

## 9. Configuración de comunicación MQTT

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

1. Preparar el Arduino 2560.
2. Conectar el botón al Arduino.
3. Conectar el módulo de relé al Arduino.
4. Conectar el contacto del relé a la entrada DI3 del gateway.
5. Conectar el joystick a las entradas AVI6 y AVI7.
6. Conectar el potenciómetro a la entrada AVI8.
7. Verificar las conexiones eléctricas antes de energizar los equipos.

### 12.2 Configuración del Gateway

1. Acceder a la interfaz de configuración del WHG-151.
2. Configurar los parámetros correspondientes a las entradas utilizadas.
3. Configurar la comunicación MQTT.
4. Establecer el broker correspondiente a la instancia EC2.
5. Configurar el puerto MQTT **1883**.
6. Configurar el tópico **`test/mqtt`**.
7. Guardar la configuración.
8. Reiniciar el gateway si la configuración lo requiere.

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
* Dos entradas analógicas mediante **AVI6 y AVI7**.
* Una entrada analógica mediante **AVI8**.

La recepción de los mensajes mediante MQTTX permite comprobar que la información adquirida por el gateway puede ser transmitida hacia la infraestructura MQTT ubicada en AWS.

---

## 15. Consideraciones técnicas

### 15.1 Interfaz entre Arduino y Gateway

No se debe conectar directamente una salida digital del Arduino con una entrada industrial del gateway sin verificar previamente las características eléctricas de la entrada.

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

Durante la implementación se debe registrar cualquier inconveniente relacionado con:

| Error / Obstáculo                | Posible área de revisión                      |
| -------------------------------- | --------------------------------------------- |
| Gateway no conecta con el broker | Configuración MQTT / red / puerto             |
| No se reciben mensajes en MQTTX  | Tópico / conexión / suscripción               |
| DI3 no cambia de estado          | Cableado / relé / configuración de entrada    |
| AVI6 no presenta variación       | Cableado / señal del joystick / configuración |
| AVI7 no presenta variación       | Cableado / señal del joystick / configuración |
| AVI8 no presenta variación       | Cableado / potenciómetro / configuración      |
| Broker no recibe conexiones      | Servicio MQTT / red / firewall / EC2          |

Los valores específicos de errores, horarios y evidencias deben registrarse durante cada ejecución de prueba.

---

## 17. Evidencias

Las evidencias de la integración deberían incluir, como mínimo:

| Evidencia                 | Descripción                                                   |
| ------------------------- | ------------------------------------------------------------- |
| Fotografía del montaje    | Conexión del Arduino, relé, joystick, potenciómetro y gateway |
| Configuración del WHG-151 | Parámetros MQTT configurados                                  |
| Estado de DI3             | Entrada digital activada/desactivada                          |
| Estado de AVI6            | Variación producida por el joystick                           |
| Estado de AVI7            | Variación producida por el joystick                           |
| Estado de AVI8            | Variación producida por el potenciómetro                      |
| MQTTX conectado           | Conexión del cliente al broker                                |
| Mensajes MQTT             | Mensajes recibidos en `test/mqtt`                             |
| Broker EC2                | Evidencia de recepción de mensajes                            |

Ejemplo de estructura:

```text
evidencias/
└── AAAA-MM-DD/
    ├── montaje_gateway.jpg
    ├── configuracion_mqtt.png
    ├── di3_activada.png
    ├── avi6.png
    ├── avi7.png
    ├── avi8.png
    └── mqttx_mensajes.png
```

---

## 18. Relación con la arquitectura final del proyecto

Los componentes utilizados en esta prueba tienen carácter de **simulación de señales**.

La arquitectura probada:

```text
Botón
Joystick
Potenciómetro
   ↓
WHG-151
   ↓
MQTT
   ↓
AWS EC2
   ↓
MQTTX
```

representa conceptualmente la arquitectura que posteriormente podrá utilizarse con equipos industriales:

```text
PLC / Instrumentos
        ↓
   WHG-151 Gateway
        ↓
       MQTT
        ↓
    AWS / Broker
        ↓
 Servicios / Aplicaciones
```

Por lo tanto, la sustitución de los componentes de prueba por señales reales del PLC constituirá una etapa posterior de integración.

---

## 19. Próximos pasos

* [ ] Validar de forma individual cada entrada analógica del WHG-151.
* [ ] Documentar los rangos eléctricos de AVI6, AVI7 y AVI8 con base en el manual del equipo.
* [ ] Validar la correspondencia entre valores físicos y valores transmitidos por MQTT.
* [ ] Definir una estructura de tópicos MQTT para la implementación final.
* [ ] Validar el comportamiento del gateway ante pérdida temporal de conexión con el broker.
* [ ] Probar la reconexión después de una interrupción de red.
* [ ] Evaluar la implementación de MQTT sobre una conexión segura.
* [ ] Sustituir las señales de prueba por señales provenientes del PLC.
* [ ] Validar la integración completa del flujo **PLC → Gateway → AWS**.
* [ ] Documentar los mecanismos de seguridad definitivos.

---

## 20. Observaciones

La implementación permitió validar la función del **WHG-151 como dispositivo de adquisición y comunicación**, utilizando señales digitales y analógicas generadas artificialmente para representar las señales que posteriormente podrán provenir de equipos industriales.

El **Arduino 2560** no forma parte de la ruta MQTT. Su función dentro de esta prueba se limita a generar/controlar la señal digital utilizada para validar la entrada **DI3** mediante el módulo de relé.

El **Gateway WHG-151** constituye el punto de integración entre las señales físicas y la infraestructura MQTT.

El **broker MQTT en AWS EC2** funciona como intermediario de comunicación entre el gateway y los clientes MQTT suscritos al tópico.

---

## 21. Conclusión

La integración del **Gateway industrial GAOTek WHG-151** con el broker MQTT desplegado en **AWS EC2** permitió validar el flujo de comunicación desde señales físicas hasta la infraestructura MQTT.

Mediante el uso de un botón, un joystick y un potenciómetro se generaron señales de prueba que fueron recibidas por las entradas **DI3, AVI6, AVI7 y AVI8** del gateway. Posteriormente, el gateway transmitió la información mediante MQTT utilizando el **puerto 1883** y el tópico **`test/mqtt`**.

La recepción de los mensajes mediante **MQTTX** permitió verificar la comunicación entre el gateway y el broker, validando experimentalmente la cadena:

**Señales físicas → Gateway WHG-151 → Broker MQTT en AWS EC2 → MQTTX.**

Esta prueba constituye una etapa importante para la arquitectura del proyecto, ya que demuestra la capacidad de utilizar el WHG-151 como punto de adquisición de señales y como enlace de comunicación hacia la infraestructura MQTT. El siguiente paso consiste en reemplazar progresivamente las señales de prueba por señales provenientes del **PLC y/o instrumentos reales**, además de completar las validaciones de seguridad, reconexión, escalamiento de señales y estabilidad requeridas para una implementación industrial.
