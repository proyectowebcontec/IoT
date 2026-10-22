# Bitácora — 28-09-2026

**Fecha:** 28/09/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Página de visualización de dispositivos, investigación del IxRouter, video demostrativo y reunión de avances

---

## 1. Objetivo

**Objetivo:**

Diseñar e implementar en el frontend una página para visualizar el estado de los dispositivos del sistema. Iniciar la investigación del IxRouter como alternativa frente a las limitaciones de tiempo de envío del gateway WHG-151 y los problemas de lectura del gateway NE-206. Ensamblar el tablero ordenado con el gateway WHG-151 y grabar un video demostrativo del sistema. Presentar los avances del proyecto a los ingenieros Carlos Arias, José Morales y Henry Arreaga.

---

## 2. Actividad realizada

1. Se diseñó e implementó una página en el frontend para visualizar los dispositivos del sistema, mostrando:
   * Total de dispositivos registrados.
   * Cantidad de dispositivos en línea y desconectados.
   * Fecha del último reporte de cada dispositivo.
   * Fecha del último mantenimiento de cada dispositivo.
2. Se incluyeron filtros por nombre y por estado del dispositivo.
3. Dadas las limitaciones del gateway WHG-151 (envío de datos cada 10 s como mínimo) y los problemas persistentes para leer valores con el gateway NE-206, se inició una investigación sobre el dispositivo IxRouter, por recomendación de Wanderley.
4. Se ensambló, en el taller, el tablero ya ordenado junto con el gateway WHG-151, con el fin de grabar un video demostrativo para utilizar en una próxima reunión.
5. Durante las pruebas realizadas para la grabación, se hicieron evidentes varios errores relacionados con la implementación de Pydantic y con las nuevas características del frontend:
   * Nombres de variables que no coincidían entre el backend y el frontend.
   * Datos que no coincidían con el esquema definido en Pydantic.
   * Conversión errónea de fechas.
6. Se corrigieron todos los errores identificados y se grabó exitosamente el video demostrativo.
7. Se realizó una reunión con los ingenieros Carlos Arias, José Morales y Henry Arreaga, en la cual se presentaron los avances del proyecto, se hizo una demostración del funcionamiento del sistema y se comunicaron las limitaciones actuales.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek WHG-151 | — | Equipo ensamblado en el tablero para la demostración en video |
| Tablero de montaje | — | — | Alojar el gateway WHG-151 y el cableado correspondiente para la demostración |
| Frontend | Vite + React | — | Página de visualización de dispositivos (estado, filtros, fechas de reporte y mantenimiento) |
| Backend | Python / Pydantic | — | Proveer los datos consumidos por la página de dispositivos; origen de los errores de esquema detectados |
| IxRouter | Ixon | — | Dispositivo en investigación como alternativa ante las limitaciones de los gateways WHG-151 y NE-206 |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway WHG-151, tablero de montaje
* **Modelo:** GAOTek WHG-151
* **Alimentación:** Alimentación propia.
* **Conexiones:** Ensamble del gateway WHG-151 en el tablero ya ordenado, según la propuesta compartida el 23/09/2026

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Vite + React (frontend); Pydantic (backend)
* **Librerías / dependencias:** Pydantic (esquemas de datos del backend)

### Comunicación

* **Protocolo:** No aplica directamente a esta actividad (visualización de estado de dispositivos a partir de datos ya almacenados)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** http://127.0.0.1:8000
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Limitación conocida del gateway WHG-151: envío de datos cada 10 s como mínimo

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Página de dispositivos en el frontend | No existía | Página con total de dispositivos, estado (en línea/desconectado), fecha de último reporte, fecha de último mantenimiento y filtros por nombre y estado | Permitir visualizar de forma centralizada el estado de todos los dispositivos del sistema |
| Nombres de variables entre backend y frontend | Inconsistentes entre sí | Corregidos para que coincidieran | Eliminar errores de visualización detectados durante las pruebas previas a la grabación |
| Validación de datos según esquema Pydantic | Datos que no coincidían con el esquema definido | Corregidos para cumplir con el esquema | Evitar errores de validación en el backend |
| Conversión de fechas | Conversión errónea | Corregida | Mostrar correctamente las fechas de último reporte y último mantenimiento en la página de dispositivos |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se implementó exitosamente la página de visualización de dispositivos, con sus filtros por nombre y estado.
* Se inició la investigación del IxRouter como alternativa ante las limitaciones de tiempo de envío del gateway WHG-151 y los problemas de lectura del gateway NE-206.
* Se identificaron y corrigieron los errores relacionados con Pydantic y con el frontend (nombres de variables, datos no coincidentes con el esquema, conversión errónea de fechas).
* Se grabó exitosamente el video demostrativo del sistema, con el gateway WHG-151 ensamblado en el tablero ordenado.
* Se realizó la reunión con los ingenieros Carlos Arias, José y Henry, presentando los avances, la demostración del funcionamiento y las limitaciones actuales del proyecto.

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto |
| ------------------ | ------- | ------- |
| Nombres de variables que no coincidían entre el backend y el frontend | Durante las pruebas previas a la grabación del video demostrativo | Medio — generaba datos no visibles o incorrectos en la página de dispositivos |
| Datos que no coincidían con el esquema definido en Pydantic | Durante las pruebas previas a la grabación del video demostrativo | Medio — generaba errores de validación en el backend |
| Conversión errónea de fechas | Durante las pruebas previas a la grabación del video demostrativo | Medio — las fechas de último reporte y mantenimiento no se mostraban correctamente |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Los nombres de variables no coincidían entre el backend y el frontend, los datos no coincidían con el esquema de Pydantic, y la conversión de fechas era errónea.

**Causa identificada:**
Inconsistencias surgidas durante la implementación reciente de Pydantic en el backend y de las nuevas características del frontend (página de dispositivos), que no habían sido validadas de forma conjunta hasta estas pruebas.

**Solución aplicada:**
Se corrigieron los nombres de variables para que coincidieran entre backend y frontend, se ajustaron los datos para cumplir con el esquema definido en Pydantic, y se corrigió la lógica de conversión de fechas.

**Resultado posterior:**
La página de dispositivos funcionó correctamente, permitiendo completar con éxito la grabación del video demostrativo.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Captura 01 | Página de visualización de dispositivos (estado, filtros, fechas) | ./imgs/2026-09-28/Frontend_dispositivos.png |
| Video 01 | Video demostrativo del sistema, con el gateway WHG-151 ensamblado en el tablero | PresentacionAvances_ExplicacionTablero.mp4 |

---

## 10. Próximos pasos

* Continuar la investigación del IxRouter como alternativa a las limitaciones de tiempo de envío del gateway WHG-151 y a los problemas de lectura del gateway NE-206.
* Dar seguimiento a los acuerdos y comentarios recibidos en la reunión con los ingenieros Carlos Arias, José y Henry.
* Continuar validando la consistencia entre el backend (esquemas Pydantic) y el frontend conforme se agreguen nuevas funcionalidades, para prevenir errores similares a los detectados en esta jornada.

---

## 11. Observaciones

Las pruebas realizadas antes de grabar el video demostrativo resultaron valiosas para detectar y corregir, de forma oportuna, errores de consistencia entre el backend (esquemas Pydantic) y las nuevas funcionalidades del frontend, que de otro modo hubieran quedado expuestos durante la reunión con los ingenieros Carlos Arias, José y Henry.

La investigación del IxRouter, iniciada por recomendación de Wanderley, responde directamente a dos limitaciones identificadas en jornadas previas: el intervalo mínimo de envío de 10 s del gateway WHG-151 (ver bitácora del 10/09/2026) y los problemas de lectura del gateway NE-206.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 28/09/2026

**Pendientes:**
Continuar la investigación del IxRouter como alternativa tecnológica, y dar seguimiento a los temas tratados en la reunión con los ingenieros Carlos Arias, José Morales y Henry Arreaga.