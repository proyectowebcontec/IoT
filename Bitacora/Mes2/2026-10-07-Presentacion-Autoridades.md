# Bitácora — 07-10-2026

**Fecha:** 07/10/2026

**Responsable:** Katherinne Gómez

**Etapa del proyecto:** Etapa 1

**Actividad:** Presentación de avances del proyecto a las autoridades

---

## 1. Objetivo

**Objetivo:**

Actualizar la presentación y el guion del discurso con los cambios producidos desde la última exposición, preparar el equipo necesario, ensayar y presentar los avances del proyecto a las autoridades involucradas.

---

## 2. Actividad realizada

1. Se ajustaron la presentación (PPT) y el guion del discurso para incluir los cambios producidos desde la última fecha en que se había preparado, de modo que reflejara el estado actual del proyecto.
2. Se preparó el equipo necesario para la presentación: cableado y levantamiento de los servidores correspondientes.
3. Se realizó un ensayo de la presentación.
4. Se presentaron los avances del proyecto a las autoridades.
5. Durante la presentación, se observó que una de las tres fases monitoreadas arrojaba valores de corriente muy cercanos a 0.
6. Se intentó diagnosticar la falla durante la presentación, sin éxito.
7. Se identificó, en el comportamiento registrado, un pico de 40 A justo antes de que los valores de dicha fase comenzaran a fallar.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Sistema de monitoreo del motor | — | — | Equipo utilizado para la demostración en vivo durante la presentación; presentó la falla en una de las tres fases monitoreadas |
| Servidores del proyecto | — | — | Levantados previamente a la presentación para soportar el sistema durante la demostración |
| Presentación (PPT) | — | — | Material utilizado para exponer los avances del proyecto a las autoridades |

---

## 4. Configuración

No aplica una configuración técnica adicional para esta actividad, más allá del levantamiento de los servidores y el cableado ya documentados en jornadas previas (dona de corriente, transductor, PLC, gateways).

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Presentación (PPT) y guion | Versión preparada el 01/10/2026 | Actualizada con los avances producidos desde esa fecha | Reflejar el estado actual del proyecto en la presentación a las autoridades |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se actualizó exitosamente la presentación y el guion del discurso.
* Se preparó correctamente el equipo necesario (cableado y servidores) para la presentación.
* Se realizó el ensayo de la presentación.
* Se presentaron exitosamente los avances del proyecto a las autoridades.
* Durante la demostración en vivo, una de las tres fases monitoreadas arrojó valores de corriente muy cercanos a 0, sin lograr diagnosticar la causa en el momento.
* Se identificó un pico de 40 A en dicha fase justo antes de que comenzaran a presentarse los valores erróneos.

### Datos relevantes

```text
Comportamiento observado en la fase afectada:
- Pico de corriente: 40 A
- Posteriormente: valores muy cercanos a 0
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| Una de las tres fases monitoreadas arrojó valores de corriente muy cercanos a 0 durante la demostración en vivo | Durante la presentación de avances a las autoridades | Alto — afectó la demostración en vivo del sistema ante las autoridades | Prueba-comportamiento-variables.png |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Una de las tres fases monitoreadas comenzó a arrojar valores de corriente muy cercanos a 0 durante la presentación.

**Causa identificada:**
No identificada durante la presentación. Se observó un pico de 40 A en dicha fase inmediatamente antes de que comenzaran a presentarse los valores erróneos, lo cual podría estar relacionado con la causa del fallo, pero no se confirmó.

**Solución aplicada:**
No se aplicó una solución durante la presentación; se continuó con la demostración y la falla quedó pendiente de diagnóstico.

**Resultado posterior:**
El problema permanece sin resolver al cierre de esta jornada.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Diapositiva-presentación.png | Diapositiva de la presentación de avances expuesta a las autoridades | ./imgs/2026-10-07/Diapositiva-presentación.png |
| Prueba-comportamiento-variables.png | Comportamiento de las variables monitoreadas durante la prueba antes de la presentación | ./imgs/2026-10-07/Prueba-comportamiento-variables.png |
|Comportamiento-Variables-Presentacion.png | Comportamiento de las variables monitoreadas durante la presentación, incluyendo el pico de 40 A y la posterior caída a valores cercanos a 0 en una de las fases | ./imgs/2026-10-07/Comportamiento-Variables-Presentacion.png |

* [Diapositiva-presentación.png ](./imgs/2026-10-07/Diapositiva-presentación.png )
* [Prueba-comportamiento-variables.png ](./imgs/2026-10-07/Prueba-comportamiento-variables.png )
* [Comportamiento-Variables-Presentacion.png](./imgs/2026-10-07/Comportamiento-Variables-Presentacion.png)

---

## 10. Próximos pasos

* Diagnosticar la causa de la falla observada en la fase que arrojó valores cercanos a 0 durante la presentación, considerando el pico de 40 A detectado previamente.
* Revisar el cableado y la conexión de la dona/transductor correspondientes a dicha fase, para descartar un problema físico.
* Documentar los hallazgos y la resolución de esta falla en una próxima bitácora.
* Recopilar retroalimentación de las autoridades sobre la presentación de avances.

---

## 11. Observaciones

A pesar del inconveniente presentado con una de las fases monitoreadas, la presentación de avances a las autoridades se llevó a cabo según lo planificado, con el equipo y los servidores correctamente preparados. El comportamiento observado (un pico de 40 A seguido de valores cercanos a 0) es un indicio relevante que debe investigarse en una próxima jornada, ya que podría tratarse de un problema físico en la conexión de esa fase (dona, transductor o cableado) o de un comportamiento relacionado con el escalado de la señal, similar a lo documentado previamente el 09/09/2026 y el 10/09/2026.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 07/10/2026

**Pendientes:**
Diagnosticar y resolver la falla de la fase que arrojó valores de corriente cercanos a 0 durante la presentación, considerando el pico de 40 A detectado previamente.