# Lectura de entradas analógicas al Gateway

## 1. Descripción

Se realizó el envío directo de señales analógicas a las entradas **AVI6**, **AVI7** y **AVI8** del gateway industrial **GAOTek WHG-151**, utilizando un potenciometro y un joystick como emisores.

El objetivo de esta implementación fue enviar señales analógicas provenientes de un potenciometro de 10k ohm y un joystick hacia el Gateway WGH-151 simulando comunicación de señales que se realizará con el PLC. No fue necesario evitar la conexión directa entre las salidas de voltaje de los compoenentes y la entrada industrial del gateway porque estos no superaban el umbral de 5 V para las entradas AVI.

La señal generada por el potenciometro al girar la perilla o el microcontrolador del joystick al mover la palanca de izquierda a derecha, arriba hacia abajo es detectada por el gateway en sus entradas **AVI6**, **AVI7** y **AVI8**.

---

## 2. Objetivo

Implementar la lectura segura y funcional de la transmición del estado de un potenciometro y un joystick conectados hacia ls entradas **AVI6**, **AVI7** y **AVI8** del gateway.

Los objetivos específicos fueron:

* Detectar el estado del potenciometro a través de la entrada **AVI8** del gateway.
* Detectar el cambio de tensión del joystick al realizar movimientos de izquierda a derecha a través de la entrada **AVI7** del gateway.
* Detectar el cambio de tensión del joystick al realizar movimientos de arriba a abajo a través de la entrada **AVI6** del gateway.

---

## 3. Equipos y componentes

| Equipo / Componente    | Modelo / Identificación | Función                                          |
| ---------------------- | ----------------------- | ------------------------------------------------ |
| Gateway industrial     | GAOTek WHG-151          | Recibir la señal mediante las entradas analógicas AVI6, AVI7 Y AVI8 |
| Potenciometro          | 10 k ohm                | Generar la señal de entrada analoga de tensión   |
| Joystick               | HW 504                  | Generar las señales de entrada analoga de tensión|
| Fuente de alimentación | 5 VDC                   | Alimentar el potenciometro y el joystick         |
| Cableado               | —                       | Interconexión entre los dispositivos             |

---

## 4. Arquitectura de conexión

La arquitectura implementada fue:

```text
                                          CONTROL
┌──────────────┐         ┌──────────────┐
│ Potenciometro│         │   Joystick   │
└──────┬───────┘         └──────┬───────┘
       │                        |
       │                        │
       │ Señal analógica        │ Señal analógica
       ▼                        ▼
       ┌─────────────────────────┐
       │     Gateway GAOTek      │
       │                         │
       │ AVI6 ◄── JoystickY      │
       │ AVI7 ◄── JoystickY      │
       │ AVI8 ◄── Potenciometro  │
       │                         │
       │                         |
       └─────────────────────────┘
            
```

> **Nota:** Debido a que los voltajes de salida de los componentes se encontraban dentro de los parámetros permitidos para las entradas analógicas del gateway no hubo necesidad de tener una interfaz intermedia o agregar resistencias.

---

## 5. Funcionamiento

El funcionamiento se basa en una cadena de eventos:

- Para el potenciometro
```text
Giro en la perilla 
       ↓
Cambio en la tensión de salida
       ↓
AVI8 del Gateway recibe la señal
       ↓
Gateway registra AVI8 = 0 - 5 V
```

- Para el joystick
```text
Desplazamiento en el eje X 
       ↓
Cambio en la tensión de salida
       ↓
AVI7 del Gateway recibe la señal
       ↓
Gateway registra AVI7 = 0 - 5 V
```


- Para el joystick
```text
Desplazamiento en el eje Y 
       ↓
Cambio en la tensión de salida
       ↓
AVI6 del Gateway recibe la señal
       ↓
Gateway registra AVI6 = 0 - 5 V
```

---

## 6. Configuración de la entrada AVI

La entrada digital **AVI** del gateway fue utilizada como punto de recepción de la señal proveniente del potenciometro o del joystick.

La conexión realizada fue:

```text
Potenciometro/Joystick              Gateway

OUTPUT ───────────────────────► AVI

COM ──────────────────────► Tierra / referencia
```

Con esta configuración, al cambiar la tesión de salida el gateway detecte la entrada.

### Evidencias

[Botón liberado](./imgs/EnvioSeñal_arduino_gateway/Gateway151_LecturaAnalogica.jpeg)


---

## 7. Resultado de la integración

La integración permitió transmitir correctamente en las señales transmitidas por el potenciometro y el joystick hasta las entradas analógicas **AVI6**, **AVI7** Y **AVI8** del gateway.

El comportamiento validado fue:

| Acción                    | Gateway AVI |
| ------------------------- | ----------: | 
| Giro en la perilla        |     0 - 5 V | 
| Desplazamiento en eje X   |     0 - 5 V | 
|  Desplazamiento en eje Y  |     0 - 5 V |

La prueba permitió verificar la cadena de señal:

**Componente → AVI del Gateway.**

---

## 8. Consideraciones técnicas

### 8.1 Verificación eléctrica

Antes de conectar las entradas AVI se debe verificar:

* Tensión nominal de entrada.
* Rango permitido.
* Tipo de entrada digital.
* Referencia eléctrica utilizada por las AVI.
* Polaridad.
* Corriente de entrada.
* Si la entrada admite contacto seco o requiere alimentación externa.

La configuración utilizada en esta prueba funcionó correctamente, pero estos parámetros deben validarse contra especificaciones del modelo instalado antes de replicar la conexión en otro equipo.

---

## 9. Diagrama funcional de la integración

```text
┌───────────────────────┐
│    Potenciometro /    │
│    Joystick           │
└──────┬────────────────┘
       │
       │ 0 - 5 V señal analógica
       ▼
┌─────────────┐
│   GATEWAY   │
│             │
│     AVI     │
└──────┬──────┘
       │
       │ Variable analógica
       ▼
   AVI = 0 - 5
```

## 10. Conclusión

Esta integración constituye una etapa de prueba para la posterior utilización de entradas analógicas del gateway dentro de la arquitectura de comunicación del proyecto.
