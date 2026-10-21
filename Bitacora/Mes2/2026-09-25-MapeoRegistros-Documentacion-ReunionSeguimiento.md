# Bitácora — 25-09-2026

**Fecha:** 25/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Continuación del mapeo de registros Modbus RTU, documentación del proyecto y reunión de seguimiento con el Ing. Carlos Arias

---

## 1. Objetivo

**Objetivo:**

Continuar el mapeo de los registros de memoria de las entradas del gateway WHG-151 mediante Modbus RTU, probando las combinaciones de configuración que no se alcanzaron a evaluar el día anterior. Avanzar en la documentación del proyecto y presentar al ingeniero Carlos Arias la problemática generada por la falta de un mapa de variables oficial.

---

## 2. Actividad realizada

1. Se continuaron las pruebas de mapeo de los registros de memoria del gateway WHG-151, retomando las combinaciones de configuración (Register Interval, tipo de dato, orden de decodificación) que no dio tiempo de probar el día 24/09/2026.
2. Se avanzó en la documentación del proyecto.
3. Se realizó una reunión de seguimiento con el ingeniero Carlos Arias, en la que se le presentó la problemática generada por la falta de un mapa de variables de memoria para las entradas del gateway WHG-151.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek WHG-151 | — | Equipo cuyas entradas se continuaba intentando mapear mediante registros de memoria Modbus RTU |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo configurado como maestro Modbus RTU (IO Link / IO Device) |
| WinIFDesigner | Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software utilizado para continuar las pruebas de configuración de variables Modbus RTU |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateways WHG-151 y NE-206
* **Modelo:** GAOTek WHG-151 / GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Comunicación mediante las entradas RS485 de ambos gateways (sin cambios respecto a lo definido el 23/09/2026)

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
* **Otros parámetros:** Continuación de las pruebas de combinaciones de Register Interval, tipo de dato y orden de decodificación iniciadas el 24/09/2026

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

No se registraron cambios de configuración adicionales a los ya documentados el 24/09/2026; en esta jornada se continuó probando combinaciones dentro del mismo esquema de configuración (IO Link / IO Device Modbus RTU), sin llegar a una combinación funcional.

---

## 6. Resultados obtenidos

**Resultado general:**
No exitoso

### Resultados específicos

* Se continuaron probando las combinaciones de configuración pendientes del 24/09/2026 (Register Interval, tipo de dato, orden de decodificación) para el mapeo de los registros de memoria del gateway WHG-151, sin obtener lecturas distintas de 0.
* Se avanzó en la documentación del proyecto.
* Se presentó al ingeniero Carlos Arias la problemática relacionada con la falta de un mapa de variables de memoria oficial para las entradas del gateway WHG-151, acordando contactar al fabricante/soporte para solicitar dicha documentación.


---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Persistencia del problema de mapeo de registros de memoria del gateway WHG-151: ninguna combinación adicional probada arrojó lecturas distintas de 0 | Durante la continuación de las pruebas iniciadas el 24/09/2026 | Alto — impide, por el momento, leer las entradas del gateway WHG-151 mediante Modbus RTU | -- |
| Falta de un mapa de variables de memoria oficial para las entradas del gateway WHG-151 | Identificado desde el 23/09/2026; confirmado y escalado en esta jornada | Alto — es la causa raíz que impide avanzar con el mapeo mediante prueba y error | No aplica (hallazgo de documentación, no de software) |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
No se logró mapear los registros de memoria de las entradas del gateway WHG-151 mediante las combinaciones de configuración probadas (Register Interval, tipo de dato, orden de decodificación).

**Causa identificada:**
Falta de un mapa de variables de memoria oficial del fabricante para las entradas del gateway WHG-151, lo que impedía acertar la combinación correcta por prueba y error.

**Solución aplicada:**
Se presentó la problemática al ingeniero Carlos Arias en la reunión de seguimiento, acordando como siguiente paso contactar al fabricante o su soporte técnico para solicitar la documentación faltante.

**Resultado posterior:**
En esta jornada el problema permaneció sin resolver. Posteriormente, ya fuera de esta fecha, se logró completar el mapeo gracias a que se compartió la documentación técnica faltante por parte del fabricante/soporte.


---

## 09. Próximos pasos

* Contactar al fabricante/soporte del gateway WHG-151 para solicitar el mapa de variables de memoria de sus entradas (acordado con el Ing. Carlos Arias).
* Una vez obtenida la documentación, aplicar la configuración correcta de Register Interval, tipo de dato y orden de decodificación para completar el mapeo.
* Continuar avanzando en la documentación general del proyecto.

---

## 10. Observaciones

La falta de un mapa de variables de memoria oficial para las entradas del gateway WHG-151, identificada el 23/09/2026, se confirmó en esta jornada como la causa raíz que impedía avanzar por el método de prueba y error con las combinaciones de Register Interval, tipo de dato y orden de decodificación. Esto motivó a escalar el tema con el ingeniero Carlos Arias, quien acordó gestionar el contacto con el fabricante o su soporte técnico para obtener la documentación faltante. Cabe señalar que, posteriormente, se logró completar el mapeo exitosamente una vez que dicha documentación técnica fue compartida.

---

## 11. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 25/09/2026

**Pendientes:**
Obtener del fabricante/soporte el mapa de variables de memoria de las entradas del gateway WHG-151 y aplicar la configuración correcta en WinIFDesigner.