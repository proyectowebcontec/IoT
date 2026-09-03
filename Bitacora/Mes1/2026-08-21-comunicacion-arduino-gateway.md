# Bitácora — 21-08-2026

**Fecha:** 21/08/2026  
**Responsable:** Katherinne Gómez  
**Etapa del proyecto:** Etapa 1  
**Actividad:** Documentación, integración de señal digital y elaboración de diagramas de arquitectura

---

## 1. Objetivo

**Objetivo:**

Dar continuidad a la documentación técnica del proyecto, investigar e implementar el mecanismo de comunicación de una señal digital generada desde el Arduino hacia el gateway, y representar mediante diagramas la arquitectura y el flujo de comunicación del sistema.

---

## 2. Actividad realizada

Las tareas ejecutadas durante la jornada fueron las siguientes:

1. Se finalizó la documentación correspondiente a las actividades realizadas durante la jornada anterior, completando y organizando la información técnica recopilada.

2. Se investigó el procedimiento necesario para transmitir una variable digital generada desde el Arduino hacia el gateway, con el objetivo de establecer el mecanismo de comunicación entre ambos dispositivos.

3. Se incorporó un relé al circuito de pruebas para establecer la comunicación entre el pulsador (**pushbutton**) y el gateway.

4. Se realizaron las conexiones y configuraciones necesarias para realizar la prueba de transmisión de la señal digital.

5. Se efectuaron pruebas de comunicación y se logró enviar correctamente la señal digital generada a partir de la activación del pulsador.

6. Se elaboraron diagramas de arquitectura para representar los componentes involucrados, sus conexiones y el flujo de comunicación dentro del sistema.

7. Los diagramas de arquitectura elaborados fueron presentados para su revisión y validación.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
|---|---|---|---|
| Microcontrolador | Arduino Mega 2560 | — | Generación y procesamiento de la señal digital |
| Gateway | 7IOT161-00020 | — | Recepción y comunicación de la señal proveniente del Arduino |
| Relé | JQC3F-05VDC-C / KY-019 | — | Interfaz de conmutación entre el circuito del pulsador y el sistema |
| Pulsador | — | — | Generación de la señal digital de entrada |
| Computadora | — | — | Programación, configuración y elaboración de documentación |
| Software de programación | Arduino IDE | — | Desarrollo y carga del programa del Arduino |
| Software de diagramación | Draw.io | — | Elaboración de diagramas de arquitectura |

---

## 4. Configuración

### Hardware

* **Equipo:** Arduino Mega 2560
* **Modelo:** Mega 2560
* **Alimentación:** Según configuración del circuito de pruebas.
* **Conexiones:** Se incorporó un relé al circuito para establecer la interfaz entre el pulsador y el sistema. La señal digital generada por el pulsador fue utilizada para realizar las pruebas de comunicación con el gateway.

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Arduino IDE y herramientas de documentación/diagramación.
* **Librerías / dependencias:** Según las utilizadas en el programa del Arduino.

### Comunicación

* **Origen de la señal:** Pulsador conectado al circuito.
* **Tipo de señal:** Digital.
* **Dispositivo de origen:** Arduino Mega 2560.
* **Dispositivo destino:** Gateway.
* **Protocolo / mecanismo de comunicación:** Según la interfaz configurada entre el Arduino y el gateway.
* **Estado de la comunicación:** Se logró transmitir la señal digital durante las pruebas.

### Variables utilizadas

| Componente | Origen de la señal | Entrada | Salida |
| ---------- | ------------------ | ------- | ------ |
| Pulsador   | Interacción humana | ---     | D13    |
| Arduino    | Pulsador           | D13     | D6     |
| Relé       | Arduino Mega 2560  | D6      | DI3    |
| Gateway WHG-151 | Relé          | DI3     | ---    |

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
|---|---|---|---|
| Circuito | Circuito sin relé para esta prueba | Se incorporó un relé | Permitir la interfaz entre el pulsador y el sistema de comunicación. |
| Comunicación | Sin transmisión de la señal digital del pulsador hacia el gateway | Señal digital transmitida hacia el gateway | Validar el flujo de comunicación entre el Arduino y el gateway. |
| Documentación | Documentación correspondiente a la jornada anterior pendiente de finalizar | Documentación completada y organizada | Mantener actualizado el registro técnico del proyecto. |
| Arquitectura | Sin diagramas completos de la arquitectura | Diagramas de arquitectura elaborados y presentados | Representar visualmente los componentes y flujo de comunicación del sistema. |

---

## 6. Resultados obtenidos

**Resultado general:**

**Exitoso**

### Resultados específicos

* Se finalizó la documentación correspondiente a la jornada anterior.
* Se investigó el mecanismo necesario para transmitir una señal digital desde el Arduino hacia el gateway.
* Se incorporó correctamente un relé al circuito de pruebas.
* Se logró generar y transmitir la señal digital asociada al pulsador.
* Se elaboraron y presentaron diagramas de arquitectura que representan el funcionamiento y flujo de comunicación del sistema.

### Datos relevantes

```text
Dispositivo de origen: Arduino Mega 2560
Tipo de señal: Digital
Entrada: Pulsador (pushbutton)
Interfaz incorporada: Relé
Dispositivo destino: Gateway
Resultado de la prueba: Señal transmitida correctamente
```

---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes que impidieran completar las actividades planificadas.

Durante la jornada fue necesario investigar el mecanismo adecuado para realizar la comunicación de la señal digital entre el Arduino y el gateway antes de efectuar la prueba correspondiente.

---

## 8. Solución aplicada

Se investigó el mecanismo de comunicación requerido y se incorporó un relé al circuito para establecer la interfaz necesaria entre el pulsador y el sistema.

Posteriormente, se realizaron las conexiones y pruebas correspondientes, logrando transmitir correctamente la señal digital generada por el pulsador hacia el gateway.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
|---|---|---|
| Circuito con relé | Circuito de pruebas con el relé incorporado para la comunicación del pulsador | `./evidencias/2026-08-21/` |
| Prueba de señal | Evidencia de la transmisión de la señal digital desde el Arduino hacia el gateway | `./evidencias/2026-08-21/` |
| Diagrama de arquitectura | Diagrama elaborado para representar los componentes y flujo de comunicación | `./evidencias/2026-08-21/` |

### Evidencias

* [Circuito con relé](./evidencias/2026-08-21/circuito-con-rele.png)
* [Prueba de transmisión de señal](./evidencias/2026-08-21/prueba-senal-digital.png)
* [Diagrama de arquitectura](./evidencias/2026-08-21/diagrama-arquitectura.png)


---

## 10. Próximos pasos

*  Documentar las variables de entrada y salida utilizadas en el Arduino.
*  Documentar técnicamente la comunicación entre el Arduino y el gateway.
*  Realizar pruebas adicionales con las diferentes señales digitales utilizadas en el sistema.
*  Validar el comportamiento de la comunicación ante diferentes estados de las entradas digitales.
*  Continuar con la integración del gateway dentro del flujo general de comunicación del proyecto.
*  Actualizar los diagramas de arquitectura conforme avance la integración de los componentes.

---

## 11. Observaciones

La jornada permitió avanzar de la etapa de investigación hacia una prueba práctica de comunicación de señales digitales. La incorporación del relé permitió establecer la interfaz necesaria para trabajar con la señal generada por el pulsador.

La transmisión exitosa de la señal representa un avance en la integración entre el Arduino y el gateway, permitiendo continuar con la incorporación y validación de las demás variables utilizadas en el sistema.

Los diagramas de arquitectura elaborados servirán como referencia para documentar las siguientes etapas de integración y facilitar la comprensión del flujo de comunicación del proyecto.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 21/08/2026

**Pendientes:**

Queda pendiente documentar las variables de entrada y salida utilizadas en el Arduino y continuar con las pruebas de comunicación de las demás señales del sistema.
