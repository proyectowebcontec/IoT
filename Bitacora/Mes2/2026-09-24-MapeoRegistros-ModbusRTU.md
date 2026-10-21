# Bitácora — 24-09-2026

**Fecha:** 24/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Configuración de IO Link / IO Device y mapeo de registros de memoria Modbus RTU en el Gateway 151

---

## 1. Objetivo

**Objetivo:**

Configurar, en WinIFDesigner, el IO Link y el IO Device necesarios para la comunicación por Modbus RTU, y mapear los registros de memoria correspondientes a las entradas del gateway WHG-151, con el fin de continuar con la lectura de variables externas mediante este protocolo.

---

## 2. Actividad realizada

1. Se configuró, en WinIFDesigner, el IO Link para la comunicación por Modbus RTU (declaración y parámetros).
2. Se configuró, en WinIFDesigner, el IO Device para la comunicación por Modbus RTU (declaración, parámetros y dirección del dispositivo).
3. Buscando mapear los registros de memoria de las entradas del gateway WHG-151, se crearon 31 variables para intentar localizarlas.
4. Se realizaron múltiples pruebas de configuración; cada cambio requería eliminar la variable existente, ya que el software bloqueaba las configuraciones tras crearlas haciendo imposible modificarlas directamente.
5. Se probaron las siguientes combinaciones de configuración para cada variable:
   * Register Interval: Input registers [Read Write] [03/06/10] y Hold Registers [Read Only] [04].
   * Tipo de dato: int16 y float.
   * Orden de decodificación: AB y BA (para int16); AB CD y CD AB (para float).
6. Ninguna de las combinaciones probadas este día arrojó resultados: todas las variables mostraban valor 0, a pesar de existir valores reales en las entradas del gateway.
7. Parte de estas combinaciones de configuración quedaron pendientes y se continuaron probando el día 25/09/2026.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek WHG-151 | — | Equipo cuyas entradas se buscaba mapear mediante registros de memoria Modbus RTU |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo configurado como maestro Modbus RTU (IO Link / IO Device) |
| WinIFDesigner | Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software utilizado para configurar el IO Link, el IO Device y las variables de mapeo |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateways WHG-151 y NE-206
* **Modelo:** GAOTek WHG-151 / GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Comunicación mediante las entradas RS485 de ambos gateways (conexión definida el 23/09/2026)

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner
* **Librerías / dependencias:** No aplica

### Comunicación

* **Protocolo:** Modbus RTU (sobre RS485)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** No aplica
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** 31 variables creadas para el mapeo de registros de memoria. Combinaciones probadas: Register Interval: Input registers [Read Write] [03/06/10] y Hold Registers [Read Only] [04]; tipo de dato int16 y float; orden de decodificación AB y BA (int16), AB CD y CD AB (float)

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Comunicación Modbus RTU en WinIFDesigner | Sin configurar | IO Link e IO Device configurados (declaración, dirección y parámetros) | Habilitar la comunicación Modbus RTU entre los gateways para la lectura de variables externas |
| Variables de mapeo de registros de memoria | No existían | 31 variables creadas, probando distintas combinaciones de Register Interval, tipo de dato y orden de decodificación | Intentar localizar los registros de memoria correspondientes a las entradas del gateway WHG-151 |

---

## 6. Resultados obtenidos

**Resultado general:**
No exitoso

### Resultados específicos

* Se completó la configuración del IO Link y el IO Device en WinIFDesigner para la comunicación Modbus RTU.
* Se crearon 31 variables de prueba para intentar mapear los registros de memoria de las entradas del gateway WHG-151.
* Ninguna de las combinaciones de Register Interval (Input registers [Read Write] [03/06/10] y Hold Registers [Read Only] [04]), tipo de dato (int16, float) y orden de decodificación (AB, BA, AB CD, CD AB) probadas en este día permitió obtener lecturas distintas de 0, a pesar de existir valores reales en las entradas del gateway.
* El trabajo de prueba de combinaciones continuó el día 25/09/2026.

### Datos relevantes

```text
Combinaciones probadas (todas con resultado 0):
Register Interval: Input registers [Read Write] [03/06/10] y Hold Registers [Read Only] [04]
Tipo de dato: int16, float
Orden de decodificación: AB, BA (int16) / AB CD, CD AB (float)
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| El software WinIFDesigner bloqueaba las configuraciones al intentar modificar una variable existente, siendo necesario eliminarla y volver a crearla para cada cambio | Durante las pruebas de mapeo de las 31 variables | Medio — ralentizó considerablemente el proceso de prueba de combinaciones | Configuracion-IODeviceModbusRTU-Declaracion.png, Configuracion-IODeviceModbusRTU-Parametros.png |
| Ninguna combinación de Register Interval, tipo de dato y orden de decodificación probada arrojó lecturas distintas de 0 | Durante todas las pruebas de mapeo realizadas en el día | Alto — impide, por el momento, leer las entradas del gateway WHG-151 mediante Modbus RTU | Configuracion-IODeviceModbusRTU-DeviceAddress.png, Configuracion-IOLinkModbusRTU-Declaracion.png, Configuracion-IOLinkModbusRTU-Parametros.png |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El software WinIFDesigner bloqueaba las configuraciones al intentar modificar directamente una variable ya creada.

**Causa identificada:**
Comportamiento propio del software al editar variables existentes dentro de la configuración Modbus.

**Solución aplicada:**
Se adoptó como método de trabajo eliminar la variable y crearla nuevamente cada vez que se requería probar una nueva combinación de parámetros.

**Resultado posterior:**
Se logró continuar probando las distintas combinaciones, aunque de forma más lenta de lo esperado.

### Problema 2

**Problema:**
Ninguna de las combinaciones probadas (Register Interval 03/04, tipo de dato int16/float, orden de decodificación AB/BA/AB CD/CD AB) permitió obtener lecturas distintas de 0 en las 31 variables creadas, a pesar de existir valores reales en las entradas del gateway WHG-151.

**Causa identificada:**
Aún no identificada; no se ha determinado la combinación correcta de parámetros Modbus RTU para mapear correctamente los registros de memoria de las entradas del gateway WHG-151.

**Solución aplicada:**
No se aplicó una solución en esta jornada; se continuó probando combinaciones adicionales el día 25/09/2026.

**Resultado posterior:**
El problema persiste al cierre de esta jornada.

### Problema 3 (Heredado de la jornada anterior)

**Problema:**
El tablero de montaje adquirido, fabricado con las medidas finales, resultó insuficiente: no caben el gateway, el PLC ni las conexiones necesarias para los 3 relés adicionales requeridos para monitorear los contactores K21, K22 y K23.

**Causa identificada:**
Las medidas finales utilizadas para fabricar el tablero no consideraron el espacio necesario para todos los componentes de la arquitectura final (gateway, PLC y relés adicionales).

**Solución aplicada:**
En esta jornada Wanderley comunicó como propuesta de solución para el prototipo el crear un segundo nivel desmontable para colocar el gateway, adherirlo a la tapadera con suficiente cable para poder abrirlo y cerrarlo y posteriormente, para el producto final adquirir un tablero de mayor tamaño.

**Resultado posterior:**
Resolución propuesta.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Configuracion-IODeviceModbusRTU-Declaracion.png | Declaración del IO Device para Modbus RTU | ./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-Declaracion.png |
| Configuracion-IODeviceModbusRTU-DeviceAddress.png | Configuración de la dirección del IO Device | ./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-DeviceAddress.png |
| Configuracion-IODeviceModbusRTU-Parametros.png | Parámetros del IO Device (Register Interval, tipo de dato, orden de decodificación) | ./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-Parametros.png |
| Configuracion-IOLinkModbusRTU-Declaracion.png | Declaración del IO Link para Modbus RTU | ./imgs/2026-09-24/Configuracion-IOLinkModbusRTU-Declaracion.png |
| Configuracion-IOLinkModbusRTU-Parametros.png | Parámetros del IO Link | ./imgs/2026-09-24/Configuracion-IOLinkModbusRTU-Parametros.png |

* [Configuracion-IODeviceModbusRTU-Declaracion.png](./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-Declaracion.png)
* [Configuracion-IODeviceModbusRTU-DeviceAddress.png](./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-DeviceAddress.png)
* [Configuracion-IODeviceModbusRTU-Parametros.png](./imgs/2026-09-24/Configuracion-IODeviceModbusRTU-Parametros.png)
* [Configuracion-IOLinkModbusRTU-Declaracion.png](./imgs/2026-09-24/Configuracion-IOLinkModbusRTU-Declaracion.png)
* [Configuracion-IOLinkModbusRTU-Parametros.png](./imgs/2026-09-24/Configuracion-IOLinkModbusRTU-Parametros.png)

---

## 10. Próximos pasos

* Continuar probando combinaciones de Register Interval, tipo de dato y orden de decodificación para lograr el mapeo correcto de las entradas del gateway WHG-151 (continuado el 25/09/2026).
* Evaluar si el problema está relacionado con el Register Interval (función Modbus) utilizado, más allá del tipo de dato y el orden de decodificación.
* Documentar la combinación de parámetros que finalmente funcione, para evitar repetir este proceso de prueba y error en configuraciones futuras.

---

## 11. Observaciones

El proceso de mapeo de los registros de memoria del gateway WHG-151 resultó más complejo de lo esperado, principalmente por la ausencia de documentación oficial sobre el mapa de variables (identificada el 23/09/2026) y por el comportamiento del software WinIFDesigner, que exige eliminar y recrear cada variable ante cualquier cambio de configuración. Se probaron de forma sistemática las combinaciones más comunes de Register Interval, tipo de dato y orden de decodificación sin éxito, por lo que el trabajo continuó al día siguiente.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 24/09/2026

**Pendientes:**
Continuar y completar el mapeo de los registros de memoria de las entradas del gateway WHG-151 mediante Modbus RTU (trabajo que continuó el 25/09/2026).