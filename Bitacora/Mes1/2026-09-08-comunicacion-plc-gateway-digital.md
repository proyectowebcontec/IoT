# Bitácora — 08-09-2026

**Fecha:** 08/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Establecer comunicación entre el PLC y el Gateway 151 para el envío de una variable digital

---

## 1. Objetivo

**Objetivo:**

Realizar la captura de una variable digital enviada por el PLC en el gateway WHG-151, mismo que transmitirá la señal a un broker alojado en una EC2. Un script de Python actuará como suscriptor al tópico `mqtt/test` y enviará los registros a una base de datos en MongoDB, la cual alimentará los dashboards desarrollados con Vite + React a través de una API desarrollada igualmente en Python. Realizar mediciones de corriente de prueba para validar las conexiones de los componentes (dona y transductor)

---

## 2. Actividad realizada

1. Se conectó el PLC Logo! a una fuente de poder de 300 W, 100/200–24 VDC, 12.5 A, verificando previamente el voltaje y la corriente antes de realizar cualquier conexión.
2. Se verificó la IP y máscara de red del PLC, siendo estas 192.168.0.3/24.
3. Se configuró la entrada Ethernet con la dirección 192.168.0.12/24 y se verificó la comunicación mediante ping tanto a la entrada Ethernet como al PLC. Para establecer correctamente la comunicación fue necesario deshabilitar el internet y las máquinas virtuales levantadas.
4. Se creó un programa lógico sencillo para el PLC: un temporizador que envía pulsos cada dos segundos con una duración de 300 ms.
5. Se cargó el programa al PLC.
6. Se evaluó la forma correcta de enviar la señal del PLC al gateway: inicialmente se consideró necesario un potenciómetro o un transformador para llevar la señal a 5 V. Al medir el único transformador disponible (nominal de 6 V) se obtuvieron 11 V, por lo que se identificó que, para una entrada digital, lo necesario era completar el circuito conectando a tierra (ground) y a la salida del PLC, en lugar de regular el voltaje.
7. Se conectó el cable de la salida del PLC a la entrada digital DI3 del gateway, utilizando la conexión a ground descrita en el punto anterior.
8. Se levantó el script de Python para la captura y envío de datos a MongoDB, junto con el frontend y el backend, para visualizar los datos en tiempo real.
9. Se realizó el cableado de un motor al que se añadieron una dona y un transductor.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| PLC | Siemens LOGO! | — | Generar y enviar la señal digital mediante un programa de temporizador (pulsos cada 2 s, duración 300 ms) |
| Fuente de alimentación | 300 W, 100/200–24 VDC, 12.5 A | — | Alimentar el PLC |
| Transformador | 6 V (nominal) | — | Evaluado inicialmente para adecuar la señal; descartado tras medir 11 V reales |
| Gateway industrial | GAOTek WHG-151 | — | Recibir la señal digital del PLC mediante la entrada DI3 y publicarla al broker MQTT |
| Broker MQTT | AWS EC2 | — | Recibir los mensajes publicados por el gateway en el tópico `mqtt/test` |
| Script suscriptor | Python | — | Suscribirse al tópico `mqtt/test` y almacenar los registros en MongoDB |
| Base de datos | MongoDB | — | Almacenar los registros recibidos del PLC |
| API | Python | — | Consultar la base de datos y alimentar los dashboards del frontend |
| Frontend | Vite + React | — | Visualizar los datos en tiempo real mediante dashboards |
| PC | DELL icore 5 | Configuración del PLC, ejecución del script de Python, frontend y backend |
| Dona | 100/5 AMP. 30I | 7IOT999-00014 | Medición de la corriente que fulye hacia el motor |
| Transductor de corriente true | RMS 85-26 | 7IOT999-00013 | Escalar la señal de la variable real de la corriente | 

---

## 4. Configuración

### Hardware

* **Equipo:** PLC Siemens LOGO!
* **Modelo:** DM0 12/24R
* **Alimentación:** Fuente de 300 W, 100/200–24 VDC, 12.5 A
* **Conexiones:** Salida digital del PLC conectada a la entrada DI3 del gateway WHG-151, completando el circuito mediante conexión a ground (sin uso de potenciómetro ni transformador, al tratarse de una entrada digital)

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Software de programación del PLC LOGO! (LOGO! Soft Comfort u otro), Python (script suscriptor y API), Vite + React (frontend)
* **Librerías / dependencias:** DesarrolloAplicacion/Backend/requirements.txt, DesarrolloAplicacion/client/package.json

### Comunicación

* **Protocolo:** Ethernet (PC ↔ PLC) / MQTT (gateway → broker → script suscriptor)
* **IP / dirección:** PLC: 192.168.0.3/24 — Entrada Ethernet (PC): 192.168.0.12/24
* **Puerto:** 1883
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** `mqtt/test`
* **QoS:** 0
* **Otros parámetros:** Se deshabilitaron temporalmente el internet y las máquinas virtuales activas en la PC para establecer correctamente la comunicación Ethernet con el PLC

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Conexión de la señal PLC → Gateway | Se contemplaba usar un potenciómetro o transformador para llevar la señal a 5 V | Conexión directa de la salida del PLC a la entrada digital DI3, completando el circuito con ground | Se identificó que, al ser una entrada digital, no se requiere regular el voltaje sino completar el circuito |
| Configuración de red de la PC | Internet y máquinas virtuales activas | Internet y máquinas virtuales deshabilitadas temporalmente | Necesario para establecer correctamente la comunicación Ethernet entre la PC y el PLC |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se estableció correctamente la comunicación Ethernet entre la PC y el PLC.
* Se cargó y ejecutó correctamente el programa lógico del temporizador en el PLC.
* Se logró la captura de la variable digital enviada por el PLC en la entrada DI3 del gateway WHG-151.
* Se completó exitosamente el flujo de extremo a extremo: PLC → gateway → broker MQTT (tópico `mqtt/test`) → script suscriptor en Python → MongoDB → API en Python → frontend (Vite + React), visualizando los datos en tiempo real.

### Datos relevantes

```text
Connected to MQTT Broker!
Escuchando
Monitoreo almacenado: ad078156-4238-4082-9eb4-f2eeb9925973
Escuchando
Escuchando
Monitoreo almacenado: f8a6d141-96f2-4954-8d70-f3bc8651cab5
Escuchando
Escuchando
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto |
| ------------------ | ------- | ------- |
| Incertidumbre sobre el método correcto para adecuar la señal del PLC al gateway (se consideró necesario un potenciómetro o transformador a 5 V) | Antes de conectar la salida del PLC al gateway | Medio — generó duda sobre si sería posible avanzar con el hardware disponible |
| El transformador disponible (nominal de 6 V) midió 11 V reales | Durante la verificación de voltaje previa a la conexión | Medio — el transformador no era apto para el uso que se había planeado inicialmente |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Se creía necesario un potenciómetro o un transformador para adecuar la señal del PLC a 5 V antes de conectarla al gateway, y el único transformador disponible (nominal de 6 V) midió 11 V al verificarlo, por lo que se pensó que no sería posible avanzar.

**Causa identificada:**
Se asumió que la entrada del gateway requería una señal regulada en voltaje, como si fuera una entrada analógica, sin considerar que se trataba de una entrada digital.

**Solución aplicada:**
Se identificó que, al tratarse de una entrada digital (DI3), lo necesario no era regular el voltaje sino completar el circuito. Se conectó la entrada del gateway a ground y a la salida del PLC para lograr una lectura digital correcta.

**Resultado posterior:**
La entrada digital del gateway detectó correctamente los pulsos generados por el PLC, permitiendo continuar con el flujo completo de captura y visualización de la señal.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| PLC Siemens LOGO! | La imagen muestra el PLC LOGO! que se utilizará durante la realización de las pruebas debido a su facilidad de configuración y disponibilidad de entradas y salidas digitales y analógicas              | ./imgs/ConexionPLC/PLCLogo.jpeg |
| Circuito completo | El circuito completo consiste en la fuente de poder de 24 V protegida, el PLC y el gateway. También se observa la PC con la que se configuró el PLC. | ./imgs/ConexionPLC/circuitoCompleto.jpeg |
| Evidencia de la señal recibida en el gateway | Se muestra la recepción de una entrada dgital. | ./imgs/ConexionPLC/RecepcionSenial.jpeg |
| Monitoreo en tiempo real | En la imagen se muestra el dashboard con la opción de monitoreo en tiempo real seleccionada. | ./imgs/ConexionPLC/DashboardTiempoReal.png |
| Graficas en tiempo real | Se muestran las gráficas realizadas en tiempo real. | ./imgs/ConexionPLC/GraficasTiempoReal.png |
| Medición de corriente de prueba | Se utilizó un motor, una dona y un transductor para realizar las primeras mediciones de corriente | ./imgs/ConexionPLC/MedicionCorriente_DonaTransductor.jpeg |

* [PLC Siemens LOGO!](./imgs/ConexionPLC/PLCLogo.jpeg)
* [Circuito completo](./imgs/ConexionPLC/GraficasTiempoReal.png)
* [Evidencia de la señal recibida en el gateway](./imgs/ConexionPLC/RecepcionSenial.jpeg)
* [Monitoreo en tiempo real](./imgs/ConexionPLC/DashboardTiempoReal.png)
* [Graficas en tiempo real](./imgs/ConexionPLC/GraficasTiempoReal.png)
* [Medición de corriente de prueba](./imgs/ConexionPLC/MedicionCorriente_DonaTransductor.jpeg)

---

## 10. Próximos pasos

* Documentar formalmente la conexión utilizada para entradas digitales del gateway (a ground y salida del PLC), como referencia para futuras conexiones.
* Ampliar la captura de señales del PLC hacia variables analógicas o adicionales, según lo requiera el proyecto.
* Continuar integrando el PLC Schneider (en exploración desde el 31/08/2026) siguiendo un enfoque similar de verificación de voltaje y corriente antes de cada conexión.

---

## 11. Observaciones

Antes de cualquier conexión se verificó el voltaje y la corriente correspondientes, práctica que permitió detectar a tiempo que el transformador disponible no entregaba el voltaje nominal esperado (6 V) y en su lugar medía 11 V, evitando así una conexión incorrecta. Esta jornada permitió confirmar de forma práctica la diferencia entre el acondicionamiento de señales analógicas y digitales en el gateway WHG-151.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 08/09/2026

**Pendientes:**
Ninguno relevante; el flujo completo (PLC → gateway → broker → MongoDB → API → dashboard) quedó funcionando de extremo a extremo.