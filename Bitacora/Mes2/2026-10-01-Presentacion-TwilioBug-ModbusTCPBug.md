# Bitácora — 01-10-2026

**Fecha:** 01/10/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Preparación de la presentación de avances, validación de Twilio y continuación del problema de Modbus TCP

---

## 1. Objetivo

**Objetivo:**

Preparar la presentación y el guion para exponer los avances del proyecto ante las autoridades involucradas. Integrar y validar todos los cambios recientes mediante merge. Probar la integración con Twilio utilizando las nuevas credenciales proporcionadas por el ingeniero Carlos Arias. Continuar investigando el problema de comunicación Modbus TCP entre el gateway físico NE-206 y el servidor Modbus simulado, identificado el 30/09/2026.

---

## 2. Actividad realizada

1. Durante la mañana se preparó la presentación y el guion correspondiente para exponer los avances del proyecto ante las autoridades involucradas, con motivo de la reunión programada para este día.
2. Se realizó el merge de todos los cambios nuevos desarrollados hasta la fecha, validando que todo funcionara correctamente.
3. El ingeniero Carlos Arias proporcionó las nuevas credenciales de Twilio (comprometidas el 29/09/2026).
4. Se probó la integración con Twilio utilizando las nuevas credenciales; el endpoint falló inicialmente.
5. Se identificó que el número de teléfono debe enviarse siempre siguiendo un formato específico, por lo que se agregó la validación correspondiente en el endpoint.
6. La reunión de presentación de avances con las autoridades fue reagendada nuevamente.
7. A pesar del reagendamiento, se presentaron los avances del proyecto al ingeniero Carlos Arias.
8. Se intentó, junto con el ingeniero Carlos Arias, resolver el problema de comunicación Modbus TCP identificado el 30/09/2026 (el gateway físico NE-206 no lograba comunicarse con el servidor Modbus simulado, a diferencia de la simulación del gateway generada por WinIFDesigner, que sí accedía correctamente), sin lograr resolverlo en esta jornada.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo físico sobre el cual se continuó investigando el problema de comunicación Modbus TCP |
| WinIFDesigner | Software de configuración: 5.16.0, software instalado en el gateway: 5.10.7 | — | Software de configuración; su simulación del gateway se utilizó como referencia de comparación frente al gateway físico |
| Twilio | — | — | Servicio de notificaciones probado con las nuevas credenciales proporcionadas |
| Backend | Python | — | Endpoint de envío de notificaciones vía Twilio, ajustado con validación de formato del número telefónico |
| Repositorio de código | Git | — | Integración (merge) de todos los cambios nuevos del proyecto |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** No aplica
* **Conexiones:** Sin cambios respecto a la configuración Modbus TCP documentada el 30/09/2026

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Git (merge de cambios); Twilio (API de notificaciones); WinIFDesigner
* **Librerías / dependencias:** twilio

### Comunicación

* **Protocolo:** API REST (Twilio); Modbus TCP (en investigación, bloqueado para el gateway físico)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** http://localhost:8000/api/alarmas/sms/{numero_destino}
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** numero de área + numero de telefono sin espacios

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Credenciales de Twilio | Credenciales no disponibles (eliminadas/expiradas desde el 29/09/2026) | Nuevas credenciales proporcionadas por el Ing. Carlos Arias | Permitir probar la integración con Twilio |
| Endpoint de envío de notificaciones (Twilio) | Sin validación de formato del número telefónico | Validación agregada para exigir el formato específico requerido | El endpoint fallaba al no recibir el número de teléfono en el formato esperado por Twilio |
| Fecha de la reunión con las autoridades del proyecto | Jueves, 2:00 p. m. (acordado el 29/09/2026) | Reagendada nuevamente | No se detalla el motivo específico del nuevo reagendamiento |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se preparó exitosamente la presentación y el guion para exponer los avances del proyecto.
* Se completó exitosamente el merge de todos los cambios nuevos, validando su correcto funcionamiento.
* Se logró probar y validar la integración con Twilio, tras corregir el endpoint con la validación del formato del número telefónico.
* La reunión de presentación de avances con las autoridades fue reagendada nuevamente; no obstante, se presentaron los avances al Ing. Carlos Arias de forma directa.
* No se logró resolver el problema de comunicación Modbus TCP entre el gateway físico NE-206 y el servidor Modbus simulado, a pesar de trabajar en ello junto con el Ing. Carlos Arias.


---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto |
| ------------------ | ------- | ------- |
| El endpoint de envío de notificaciones vía Twilio falló al probarlo con las nuevas credenciales | Durante la prueba de la integración con Twilio | Medio — impedía el envío correcto de notificaciones |
| El gateway físico NE-206 no logra comunicarse con el servidor Modbus TCP simulado, a diferencia de la simulación del gateway generada por WinIFDesigner (identificado el 30/09/2026) | Durante el intento de resolución junto con el Ing. Carlos Arias | Alto — bloquea, por el momento, la comunicación real del gateway físico mediante Modbus TCP | 
| Reagendamiento de la reunión de presentación de avances con las autoridades del proyecto | Durante la jornada, antes de la hora prevista | Bajo — no impidió presentar los avances al Ing. Carlos Arias de forma directa |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El endpoint de envío de notificaciones vía Twilio falló al probarlo con las nuevas credenciales.

**Causa identificada:**
El número de teléfono no se estaba enviando en el formato específico requerido por Twilio.

**Solución aplicada:**
Se agregó una validación en el endpoint para exigir que el número de teléfono se envíe siguiendo el formato específico requerido.

**Resultado posterior:**
La integración con Twilio quedó funcionando correctamente tras aplicar la validación.

### Problema 2

**Problema:**
El gateway físico NE-206 no logra comunicarse con el servidor Modbus TCP simulado (mbserver), a diferencia de la simulación del gateway generada por el propio WinIFDesigner, que sí logra acceder correctamente al servidor.

**Causa identificada:**
No identificada en esta jornada, a pesar de trabajar en ello junto con el Ing. Carlos Arias.

**Solución aplicada:**
No se aplicó una solución en esta jornada; el problema queda pendiente de investigación.

**Resultado posterior:**
La comunicación entre el gateway físico NE-206 y el servidor Modbus TCP simulado permanece bloqueada por el momento.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Captura 01 | Presentación/guion preparado para la exposición de avances | ./imgs/2026-10-01/Imagen-Presentacion-Portada.png |
| Captura 02 | Validación de formato del número telefónico en el endpoint de Twilio | ./imgs/2026-10-01/Imagen-Validacion-Formato-Numero.png |
| Captura 03 | Dashboard actual incluido en la presentación | ./imgs/2026-10-01/Imagen-Presentacion-DashboardCompleto.png |

* [Captura 01](./imgs/2026-10-01/Imagen-Presentacion-Portada.png)
* [Captura 02](./imgs/2026-10-01/Imagen-Validacion-Formato-Numero.png)
* [Captura 03](./imgs/2026-10-01/Imagen-Presentacion-DashboardCompleto.png)

---

## 10. Próximos pasos

* Continuar investigando la causa por la cual el gateway físico NE-206 no logra comunicarse con el servidor Modbus TCP simulado, a diferencia de la simulación del gateway en WinIFDesigner (problema identificado el 30/09/2026, aún bloqueado).
* Confirmar la nueva fecha de la reunión de presentación de avances con las autoridades del proyecto.
* Continuar validando la integración con Twilio en escenarios adicionales (por ejemplo, el botón de alarma de demostración implementado el 30/09/2026).

---

## 11. Observaciones

La comunicación entre el gateway físico NE-206 y el servidor Modbus TCP simulado continúa bloqueada por el momento: se confirmó el 30/09/2026 que únicamente la simulación del gateway generada por WinIFDesigner lograba acceder al servidor Modbus simulado, no así el gateway físico, y en esta jornada tampoco se logró identificar la causa a pesar de trabajar en ello junto con el Ing. Carlos Arias. Este problema queda como un bloqueo activo a resolver en próximas jornadas.

Por otro lado, se logró destrabar y validar exitosamente la integración con Twilio, que había quedado pendiente desde el 29/09/2026 por la falta de credenciales vigentes.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 01/10/2026

**Pendientes:**
Resolver el problema de comunicación Modbus TCP entre el gateway físico NE-206 y el servidor Modbus simulado, y confirmar la nueva fecha de la reunión de presentación de avances con las autoridades del proyecto.