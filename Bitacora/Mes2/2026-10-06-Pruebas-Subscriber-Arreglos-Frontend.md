# Bitácora — 06-10-2026

**Fecha:** 06/10/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Pruebas de conteo de recepción/almacenamiento y corrección de errores de renderizado en el frontend

---

## 1. Objetivo

**Objetivo:**

Validar, mediante pruebas de conteo, que la recepción, el almacenamiento y el envío de alarmas funcionen correctamente incluso cuando los datos llegan divididos en distintos paquetes. Corregir los errores de renderizado identificados en el frontend relacionados con las diferencias de comportamiento entre los gateways WHG-151 y NE-206, así como los mensajes de error que aparecían al no haber valores registrados.

---

## 2. Actividad realizada

1. Se realizaron más pruebas de recepción, almacenamiento y envío de alarmas.
2. Se utilizaron conteos de documentos almacenados para demostrar que, aunque los datos lleguen divididos en paquetes diferentes, siempre se almacena la misma cantidad total de registros.
3. Se revisaron los errores en el renderizado del frontend relacionados con el historial de monitoreos, identificando que:
   * El gateway WHG-151 siempre envía todas sus entradas, estén o no obteniendo información.
   * El gateway NE-206, en cambio, solo envía las entradas cuyo valor cambia (se actualizan).
4. Se corrigió el renderizado del historial para manejar correctamente esta diferencia de comportamiento entre ambos gateways.
5. Se corrigió el dashboard principal.
6. Se corrigieron los mensajes de error que aparecían cuando no había valores registrados (comportamiento válido, por ejemplo, cuando en un día no se obtienen mediciones), dejando esta corrección funcionando de forma independiente del gateway con el que finalmente se trabaje.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek WHG-151 | — | Origen de datos utilizado para evidenciar su comportamiento de envío (todas las entradas, cambien o no de valor) |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Origen de datos utilizado para evidenciar su comportamiento de envío (solo entradas que cambian de valor) |
| Subscriber | Python | — | Proceso de recepción y almacenamiento utilizado en las pruebas de conteo de paquetes |
| Base de datos | MongoDB | — | Almacenamiento de los documentos utilizados para el conteo |
| Frontend | Vite + React | — | Interfaz corregida: historial de monitoreos, dashboard principal y manejo de mensajes de error sin datos |

---

## 4. Configuración

### Hardware

No aplica para esta actividad.

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Python (subscriber); MongoDB; Vite + React (frontend)
* **Librerías / dependencias:** DesarrolloAplicacion/Backend/requirements.txt, DesarrolloAplicacion/client/package.json

### Comunicación

* **Protocolo:** MQTT (recepción de datos por el subscriber)
* **IP / dirección:** No aplica
* **Puerto:** No aplica
* **Endpoint / servidor:** Broker MQTT alojado en AWS EC2
* **Tópico:** test/mqtt
* **QoS:** 0
* **Otros parámetros:** No aplica

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Renderizado del historial en el frontend | Fallaba al no considerar la diferencia de comportamiento entre gateways (WHG-151 envía todas las entradas; NE-206 solo las que cambian) | Corregido para manejar correctamente ambos comportamientos | El historial de monitoreos presentaba errores de renderizado al recibir datos de ambos tipos de gateway |
| Dashboard principal | Presentaba errores | Corregido | Asegurar el correcto funcionamiento del dashboard principal |
| Manejo de mensajes de error sin valores registrados | Mensajes de error inapropiados ante la ausencia válida de datos (por ejemplo, un día sin mediciones) | Corregido, funcionando de forma independiente del gateway utilizado | Evitar mensajes de error incorrectos ante un comportamiento válido del sistema (ausencia de mediciones en un período) |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se validó, mediante pruebas de conteo de documentos almacenados, que la cantidad total de registros se mantiene correcta aunque los datos lleguen divididos en distintos paquetes.
* Se identificó y corrigió el error de renderizado del historial en el frontend, originado por la diferencia de comportamiento de envío entre los gateways WHG-151 y NE-206.
* Se corrigió el dashboard principal.
* Se corrigieron los mensajes de error ante la ausencia de valores registrados, dejando este manejo independiente del gateway utilizado.

### Datos relevantes

```text
Comportamiento de envío de entradas:
- Gateway WHG-151: envía siempre todas sus entradas, tengan o no información actualizada.
- Gateway NE-206: envía únicamente las entradas cuyo valor cambia (se actualizan).
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| El historial en el frontend fallaba al renderizar los datos, debido a la diferencia de comportamiento entre el gateway WHG-151 (envía todas las entradas) y el gateway NE-206 (envía solo las que cambian) | Al revisar el historial de monitoreos en el frontend | Medio — afectaba la visualización correcta del historial | No se cuenta con evidencia gráfica (corrección de backend/frontend) |
| El dashboard principal presentaba errores | Al revisar el funcionamiento general del frontend | Medio — afectaba la visualización del dashboard principal | No se cuenta con evidencia gráfica (corrección de backend/frontend) |
| Aparecían mensajes de error cuando no había valores registrados, a pesar de ser un comportamiento válido del sistema (por ejemplo, un día sin mediciones) | Al revisar el manejo de ausencia de datos en el frontend | Medio — generaba mensajes de error confusos ante una situación normal del sistema | No se cuenta con evidencia gráfica (corrección de backend/frontend) |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El historial en el frontend fallaba al renderizar los datos.

**Causa identificada:**
El gateway WHG-151 envía siempre todas sus entradas (tengan o no información actualizada), mientras que el gateway NE-206 solo envía las entradas cuyo valor cambia, lo que generaba inconsistencias no contempladas en el renderizado del historial.

**Solución aplicada:**
Se corrigió la lógica de renderizado del historial para manejar correctamente ambos comportamientos de envío.

**Resultado posterior:**
El historial de monitoreos se renderiza correctamente para datos provenientes de ambos gateways.

### Problema 2

**Problema:**
El dashboard principal presentaba errores.

**Causa identificada:**
Acceso a índices inexistentes. 

**Solución aplicada:**
Se corrigió el dashboard principal.

**Resultado posterior:**
El dashboard principal funciona correctamente.

### Problema 3

**Problema:**
Aparecían mensajes de error cuando no había valores registrados, a pesar de tratarse de un comportamiento válido del sistema (por ejemplo, un día sin mediciones).

**Causa identificada:**
El manejo de la ausencia de datos no distinguía entre un error real y una ausencia válida de mediciones.

**Solución aplicada:**
Se corrigió el manejo de estos casos, dejándolo funcionando de forma independiente del gateway con el que finalmente se trabaje.

**Resultado posterior:**
El sistema deja de mostrar mensajes de error ante la ausencia válida de datos, manejando correctamente este escenario.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Conteo-Documentos-almacenados-EntradaU5.png | Conteo de documentos almacenados para la entrada U5, validando que la cantidad total coincide aunque los datos lleguen en paquetes distintos | ./evidencias/2026-10-06/Conteo-Documentos-almacenados-EntradaU5.png |
| Conteo-Documentos-almacenados-EntradaU6-U7.png | Conteo de documentos almacenados para las entradas U6 y U7 | ./evidencias/2026-10-06/Conteo-Documentos-almacenados-EntradaU6-U7.png |
| Prueba-Almacenamiento-Notificaciones.png | Prueba de almacenamiento y envío de notificaciones/alarmas | ./evidencias/2026-10-06/Prueba-Almacenamiento-Notificaciones.png |

No se cuenta con evidencia gráfica de las correcciones realizadas en el frontend (historial, dashboard principal y manejo de mensajes de error), al tratarse de cambios de programación en el backend/frontend sin captura asociada.

---

## 10. Próximos pasos

* Continuar validando el comportamiento del historial y el dashboard con datos provenientes de ambos gateways en escenarios adicionales.
* Extender las pruebas de conteo de recepción/almacenamiento a la frecuencia real de publicación del gateway (100 ms), en línea con lo pendiente desde el 05/10/2026.
* Documentar formalmente la diferencia de comportamiento de envío entre los gateways WHG-151 y NE-206, como referencia técnica del proyecto.

---

## 11. Observaciones

Las pruebas de conteo realizadas en esta jornada permitieron confirmar la integridad de los datos almacenados, incluso cuando estos llegan divididos en paquetes diferentes. Asimismo, se identificó y documentó una diferencia de comportamiento relevante entre los dos gateways del proyecto: el WHG-151 envía siempre el estado completo de sus entradas, mientras que el NE-206 únicamente envía aquellas que cambian de valor. Esta diferencia fue la causa raíz de los errores de renderizado en el historial del frontend, y su corrección deja al sistema preparado para trabajar de forma consistente con cualquiera de los dos gateways.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 06/10/2026

**Pendientes:**
Validar el comportamiento del historial y el dashboard con datos reales a la frecuencia de publicación de 100 ms, y documentar formalmente la diferencia de comportamiento entre los gateways WHG-151 y NE-206.