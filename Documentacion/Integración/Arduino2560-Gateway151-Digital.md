# Integración de Arduino mediante módulo de relé con entrada digital DI3 del Gateway

## 1. Descripción

Se implementó una interfaz entre un **Arduino 2560** y la entrada digital **DI3** del gateway industrial **GAOTek WHG-151**, utilizando un módulo de relé **JQC3F-05VDC-C / KY-019 de 5 V y un canal**.

El objetivo de esta implementación fue enviar una señal digital proveniente del Arduino hacia el Gateway WGH-151 simulando comunicación de señales que se realizará con el PLC. Fue necesario evitar la conexión directa entre una salida digital del Arduino y la entrada industrial del gateway para protegerlo. El módulo de relé permite utilizar el Arduino como elemento de control y el propio contacto del relé como interfaz eléctrica entre ambos dispositivos.

La señal generada por el botón conectado al Arduino se convierte en una conmutación del contacto del relé. Al presionar el botón, el relé cambia de estado y el gateway detecta la activación de la entrada **DI3**.

---

## 2. Objetivo

Implementar una interfaz segura y funcional para transmitir el estado de un botón conectado al Arduino hacia la entrada digital **DI3** del gateway mediante un contacto de relé.

Los objetivos específicos fueron:

* Detectar el estado del botón mediante una entrada digital del Arduino.
* Utilizar la lógica `INPUT_PULLUP` para detectar la pulsación.
* Controlar el módulo de relé desde una salida digital del Arduino.
* Utilizar el contacto normalmente abierto (`NO`) del relé para activar la entrada DI3.
* Verificar que el gateway detecte la activación de DI3 al presionar el botón.
* Evitar la aplicación directa de la señal lógica del Arduino sobre la entrada industrial del gateway.

---

## 3. Equipos y componentes

| Equipo / Componente    | Modelo / Identificación | Función                                          |
| ---------------------- | ----------------------- | ------------------------------------------------ |
| Arduino                | 2560                    | Leer el estado del botón y controlar el relé     |
| Módulo de relé         | JQC3F-05VDC-C / KY-019  | Interfaz eléctrica entre Arduino y gateway       |
| Gateway industrial     | GAOTek WHG-151          | Recibir la señal mediante la entrada digital DI3 |
| Botón pulsador         | --------                | Generar la señal de entrada al Arduino           |
| Fuente de alimentación | 5 VDC                   | Alimentar el módulo de relé / Arduino            |
| Cableado               | —                       | Interconexión entre los dispositivos             |

---

## 4. Arquitectura de conexión

La arquitectura implementada fue:

```text
                 CONTROL
┌──────────────┐
│    Botón     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Arduino    │
│              │
│ D13: Entrada │
│ D6: Salida   │
└──────┬───────┘
       │
       │ Señal de control
       ▼
┌────────────────────────┐
│ Módulo de relé KY-019  │
│ JQC3F-05VDC-C          │
│                        │
│ IN  ◄── Arduino D8     │
│ VCC ◄── 5 V            │
│ GND ◄── GND            │
│                        │
│ COM ───────────────────┤
│ NO  ──────┐            |
└───────────┼────────────┘
            │
            ▼
┌────────────────────────────┐
│      Gateway GAOTek        │
│                            │
│ Tierra / COM ──────────────┤
│ DI3        ◄── NO del relé │
└────────────────────────────┘
```

> **Nota:** En la implementación realizada, el contacto `NO` del relé se conectó a la entrada **DI3** del gateway y el borne central utilizado como referencia se conectó a **Tierra**. De esta forma, el cierre del contacto permitió que el gateway detectara el estado activo de DI3.

---

## 5. Funcionamiento

El funcionamiento se basa en una cadena de eventos:

```text
Botón presionado
       ↓
Arduino detecta LOW en D13
       ↓
Arduino activa D6
       ↓
Módulo KY-019 energiza el relé
       ↓
Contacto COM–NO cambia de estado
       ↓
DI3 del Gateway recibe la señal
       ↓
Gateway registra DI3 = 1
```

Cuando el botón no está presionado:

```text
Botón liberado
      ↓
D13 = HIGH
      ↓
D6 = LOW
      ↓
Relé desactivado
      ↓
DI3 = 0
```

Cuando el botón está presionado:

```text
Botón presionado
      ↓
D13 = LOW
      ↓
D6 = HIGH
      ↓
Relé activado
      ↓
Contacto COM–NO cerrado
      ↓
DI3 = 1
```

---

## 6. Configuración del Arduino

El botón fue configurado mediante la resistencia **pull-up interna** del Arduino:

```cpp
const int PUSH_BUTTON_PIN = 13;
const int RELAY_PIN = 6;

void setup() {
  pinMode(PUSH_BUTTON_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
}

void loop() {
  bool pressed = digitalRead(PUSH_BUTTON_PIN) == LOW;

  digitalWrite(RELAY_PIN, pressed ? HIGH : LOW);

  delay(50);
}
```

### Funcionamiento de `INPUT_PULLUP`

Al utilizar:

```cpp
pinMode(PUSH_BUTTON_PIN, INPUT_PULLUP);
```

la entrada D13 utiliza la resistencia pull-up interna del Arduino.

Por lo tanto:

| Estado del botón |    D13 | Interpretación |
| ---------------- | -----: | -------------- |
| Liberado         | `HIGH` | No presionado  |
| Presionado       |  `LOW` | Presionado     |

Por esta razón se utiliza:

```cpp
// Push button
  int pushButton = digitalRead(PUSH_BUTTON_PIN);

  bool pressed = pushButton == LOW;
```

para determinar que el botón se encuentra presionado.

---

## 7. Control del relé

El pin **D6** se utilizó como salida de control del módulo KY-019.

```text
Arduino D6
    │
    ▼
IN - KY-019
    │
    ▼
Relé
```

Cuando D6 se activa, el módulo energiza el relé y modifica el estado de sus contactos.

El contacto utilizado para la interfaz con el gateway fue:

* **NO (Normally Open):** conectado a DI3.
* **COM / borne común:** conectado a la referencia de Tierra utilizada en la implementación.

El uso del contacto del relé permite separar la señal lógica de control del Arduino de la interfaz de entrada del gateway.

---

## 8. Configuración de la entrada DI3

La entrada digital **DI3** del gateway fue utilizada como punto de recepción de la señal proveniente del relé.

La conexión realizada fue:

```text
Módulo KY-019              Gateway

NO ───────────────────────► DI3

COM ──────────────────────► Tierra / referencia
```

Con esta configuración, al activarse el relé se establece la condición eléctrica necesaria para que el gateway detecte la entrada.

El comportamiento observado fue:

```text
Botón liberado  → DI3 = 0
Botón presionado → DI3 = 1
```
### Evidencias

[Botón liberado](./imgs/EnvioSeñal_arduino_gateway/Gateway151_0.jpeg)

[Botón presionado](./imgs/EnvioSeñal_arduino_gateway/Gateway151_1.jpeg)

---

## 9. Secuencia de operación

### Estado inicial

```text
D13 = HIGH
D8  = LOW
Relé = Desactivado
DI3 = 0
```

### Al presionar el botón

```text
D13 = LOW
     ↓
Arduino identifica pulsación
     ↓
D8 = HIGH
     ↓
Relé activado
     ↓
NO se cierra respecto a COM
     ↓
DI3 = 1
```

### Al liberar el botón

```text
D13 = HIGH
     ↓
Arduino identifica botón liberado
     ↓
D8 = LOW
     ↓
Relé desactivado
     ↓
NO vuelve a estado abierto
     ↓
DI3 = 0
```

---

## 10. Resultado de la integración

La integración permitió transmitir correctamente el estado del botón desde el Arduino hasta la entrada digital **DI3** del gateway.

El comportamiento validado fue:

| Acción                    | Arduino D13 | Arduino D8 | Relé        | Gateway DI3 |
| ------------------------- | ----------: | ---------: | ----------- | ----------: |
| Botón liberado            |        HIGH |        LOW | Desactivado |           0 |
| Botón presionado          |         LOW |       HIGH | Activado    |           1 |
| Botón liberado nuevamente |        HIGH |        LOW | Desactivado |           0 |

La prueba permitió verificar la cadena de señal:

**Botón → Arduino → Relé → DI3 del Gateway.**

---

## 11. Consideraciones técnicas

### 11.1 No conectar directamente Arduino → DI3

No se recomienda conectar directamente un pin digital del Arduino a una entrada industrial del gateway sin verificar previamente las características eléctricas de dicha entrada. La documentación disponible del gateway no indica tensión máxima, umbrales ni tipo eléctrico exacto de las entradas digitales.

El Arduino trabaja con niveles lógicos de baja tensión, mientras que una entrada digital industrial puede utilizar niveles de tensión diferentes y requerir una referencia o alimentación externa.

El módulo de relé permite realizar la interfaz mediante sus contactos eléctricos.


### 11.2 Relé activo en LOW

Algunos módulos KY-019 pueden utilizar una lógica de activación **activa en LOW**.

Si el relé permanece activado cuando el Arduino inicia, debe verificarse la lógica del módulo y adaptar el código:

```cpp
digitalWrite(RELAY_PIN, pressed ? HIGH : LOW);
```

por la lógica correspondiente al comportamiento real del módulo.

### 11.3 Antirrebote

El programa incorpora:

```cpp
delay(50);
```

como mecanismo básico de antirrebote del pulsador.

Para una implementación industrial definitiva, podría utilizarse un mecanismo de **debounce por temporización no bloqueante** o realizar el filtrado directamente en el PLC/Gateway, dependiendo de los requerimientos del sistema.

### 11.4 Verificación eléctrica

Antes de conectar la entrada DI3 se debe verificar:

* Tensión nominal de entrada.
* Rango permitido.
* Tipo de entrada digital.
* Referencia eléctrica utilizada por las DI.
* Polaridad.
* Corriente de entrada.
* Si la entrada admite contacto seco o requiere alimentación externa.

La configuración utilizada en esta prueba funcionó correctamente, pero estos parámetros deben validarse contra especificaciones del modelo instalado antes de replicar la conexión en otro equipo.

---

## 12. Diagrama funcional de la integración

```text
┌─────────────┐
│    BOTÓN    │
└──────┬──────┘
       │
       │ Estado físico
       ▼
┌─────────────┐
│   ARDUINO   │
│             │
│ D13 INPUT   │
│ D8 OUTPUT   │
└──────┬──────┘
       │
       │ 5 V / señal lógica
       ▼
┌─────────────┐
│   KY-019    │
│    RELÉ     │
└──────┬──────┘
       │
       │ Contacto
       ▼
┌─────────────┐
│   GATEWAY   │
│             │
│     DI3     │
└──────┬──────┘
       │
       │ Variable digital
       ▼
   DI3 = 1 / 0
```

## 13. Conclusión

La implementación del módulo de relé **JQC3F-05VDC-C / KY-019** permitió utilizar el Arduino como dispositivo de generación de la señal y el gateway como dispositivo receptor de una entrada digital.

La solución permitió validar experimentalmente que la pulsación del botón conectado al Arduino puede reflejarse correctamente como un cambio de estado en **DI3 del gateway**, obteniéndose `DI3 = 1` durante la activación del botón y `DI3 = 0` cuando este se encuentra liberado.

Esta integración constituye una etapa de prueba para la posterior utilización de entradas digitales del gateway dentro de la arquitectura de comunicación del proyecto.
