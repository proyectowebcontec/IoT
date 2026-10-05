# Bitácora — 16-09-2026

**Fecha:** 16/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Configuración de internet por SIM en el Gateway 206 y actualización del software WinIFDesigner

---

## 1. Objetivo

**Objetivo:**

Configurar el acceso a internet mediante la tarjeta SIM en el gateway NE-206, utilizando la nueva versión del software de configuración compartida por Sherlyn, y resolver el error de compatibilidad detectado al intentar cargar actualizaciones al gateway. Adicionalmente, finalizar las bitácoras correspondientes al primer mes del proyecto.

---

## 2. Actividad realizada

1. Se finalizaron las bitácoras correspondientes al primer mes del proyecto.
2. Se recibió de parte de Sherlyn una nueva versión del software de configuración (WinIFDesigner), en respuesta al video previamente enviado sobre el problema de reconocimiento del gateway NE-206 (el software no reconocía la IP del gateway, a pesar de que sí se podía hacer ping y el dispositivo a veces aparecía reconocido).
3. Se intentó cargar la nueva versión del software (5.16.0) al gateway, obteniendo un error de incompatibilidad: la versión del software era demasiado alta respecto a la versión instalada en el gateway (5.10.7).
4. Se resolvió el error de compatibilidad abriendo, desde el software nuevo, un archivo de proyecto correspondiente a la versión instalada en el gateway (5.10.7).
5. Con el software ya funcionando, se intentó configurar el acceso a internet mediante la tarjeta SIM en el gateway NE-206, sin éxito.
6. Se probaron múltiples configuraciones de red: distintos nombres de APN, así como la activación y desactivación de la opción 5G para cada uno de ellos.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función |
| ----------------- | -------------- | --------------- | -------- |
| Gateway industrial | GAOTek NE-206 | 7IOT161-0002 | Equipo sobre el cual se intentó configurar el acceso a internet por SIM |
| Tarjeta SIM | Claro | — | Proveer conectividad de datos móviles al gateway NE-206 |
| WinIFDesigner | Versión nueva: 5.16.0 / Versión del gateway: 5.10.7 | — | Software de configuración del gateway NE-206 |
| PC | Dell Core i5 | — | Ejecutar el software WinIFDesigner para configurar el gateway |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** 24 V
* **Conexiones:** No aplica

### Software

* **Sistema operativo:** [Placeholder — completar]
* **Software utilizado:** WinIFDesigner, versión nueva 5.16.0 (compartida por Sherlyn); versión instalada en el gateway: 5.10.7
* **Librerías / dependencias:** No aplica

### Comunicación

* **Protocolo:** Red móvil (tarjeta SIM) — APN
* **IP / dirección:** [Placeholder — no se confirma la IP del gateway de forma consistente desde el software]
* **Puerto:** No aplica
* **Endpoint / servidor:** No aplica
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** Se probaron múltiples combinaciones de configuración: distintos nombres de APN, con la opción 5G activada y desactivada en cada caso

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Software WinIFDesigner | Versión anterior (no compatible con el reconocimiento del gateway) | Versión 5.16.0, compartida por Sherlyn | Intentar resolver el problema de reconocimiento del gateway reportado previamente |
| Archivo de proyecto en WinIFDesigner | Proyecto creado directamente en la versión 5.16.0 (incompatible con la versión 5.10.7 del gateway) | Archivo de proyecto correspondiente a la versión 5.10.7, abierto desde el software 5.16.0 | Evitar el error de incompatibilidad de versiones al cargar configuraciones al gateway |
| Configuración de APN / 5G | Sin configurar | Múltiples combinaciones probadas (distintos nombres de APN, con 5G activado y desactivado) | Intentar establecer el acceso a internet mediante la tarjeta SIM |

---

## 6. Resultados obtenidos

**Resultado general:**
Parcial

### Resultados específicos

* Se finalizaron exitosamente las bitácoras del primer mes del proyecto.
* Se resolvió el error de incompatibilidad de versión entre el software WinIFDesigner (5.16.0) y el gateway NE-206 (5.10.7), mediante el uso de un archivo de proyecto con la versión correspondiente al gateway.
* No se logró configurar el acceso a internet mediante la tarjeta SIM en el gateway NE-206, a pesar de haber probado múltiples combinaciones de APN y de la opción 5G.

### Datos relevantes

```text
Versión del software (nueva, compartida por Sherlyn): 5.16.0
Versión instalada en el gateway NE-206: 5.10.7
Configuraciones probadas para SIM: múltiples nombres de APN, con 5G activado y desactivado en cada caso
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ------------------ | ------- | ------- | --------- |
| El software WinIFDesigner no reconocía la IP del gateway (aunque sí respondía al ping y a veces aparecía reconocido) — reportado previamente mediante video a Sherlyn | Antecedente al 16/09/2026 | Alto — impedía cargar cualquier configuración al gateway | Configuracion-RedPuertoWAN.png |
| Error de incompatibilidad al cargar la nueva versión del software (5.16.0) al gateway, cuya versión instalada era 5.10.7 | Al intentar cargar la configuración con el software nuevo | Alto — impedía continuar con la configuración del gateway | Error_CargarActualizaciones-Compatibilidad.png, Informacion-CargarActualizacion-VersionDispositivo.png |
| No fue posible configurar el acceso a internet mediante la tarjeta SIM, a pesar de probar múltiples combinaciones de APN y 5G | Durante las pruebas de configuración de red SIM | Alto — bloquea la conectividad a internet del gateway NE-206 | Configuracion-RedSIM.png |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
Al intentar cargar la nueva versión del software WinIFDesigner (5.16.0) al gateway NE-206, se obtenía un error de incompatibilidad, ya que la versión del software era demasiado alta respecto a la versión instalada en el gateway (5.10.7).

**Causa identificada:**
Diferencia significativa entre la versión del software y la versión de firmware/programa instalada en el gateway.

**Solución aplicada:**
Se abrió, desde el software nuevo (5.16.0), un archivo de proyecto correspondiente a la versión instalada en el gateway (5.10.7).

**Resultado posterior:**
Se logró evitar el error de incompatibilidad y continuar con el uso del software para intentar la configuración del gateway.

### Problema 2

**Problema:**
No fue posible configurar el acceso a internet mediante la tarjeta SIM en el gateway NE-206.

**Causa identificada:**
Aún no identificada. Se descartaron varias combinaciones de configuración sin éxito.

**Solución aplicada:**
Se probaron múltiples configuraciones, variando el nombre del APN y activando/desactivando la opción 5G en cada una, sin lograr establecer la conexión.

**Resultado posterior:**
El problema persiste; no se ha logrado configurar el acceso a internet por SIM en el gateway NE-206.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Configuracion-RedPuertoWAN.png | Configuración de red del puerto WAN del gateway NE-206 | ./imgs/2026-09-16/Configuracion-RedPuertoWAN.png |
| Configuracion-RedSIM.png | Configuración de red de la tarjeta SIM (APN y opción 5G) | ./imgs/2026-09-16/Configuracion-RedSIM.png |
| Error_CargarActualizaciones-Compatibilidad.png | Error de incompatibilidad al cargar la actualización al gateway | ./imgs/2026-09-16/Error_CargarActualizaciones-Compatibilidad.png |
| Informacion-CargarActualizacion-VersionDispositivo.png | Información de versiones (software 5.16.0 vs. dispositivo 5.10.7) | ./imgs/2026-09-16/Informacion-CargarActualizacion-VersionDispositivo.png |

---

## 10. Próximos pasos

* Continuar investigando la configuración correcta de APN y 5G para lograr el acceso a internet mediante la tarjeta SIM en el gateway NE-206, posiblemente con apoyo adicional de Sherlyn o del fabricante.
* Dar seguimiento con Sherlyn sobre el comportamiento intermitente del reconocimiento de la IP del gateway en el software.

---

## 11. Observaciones

El error de incompatibilidad de versiones (software 5.16.0 vs. gateway 5.10.7) resultó ser un obstáculo distinto al problema original de reconocimiento de IP reportado previamente a Sherlyn, aunque relacionado: surgió como consecuencia directa de la nueva versión del software entregada para intentar resolver dicho problema. Se logró una solución práctica (abrir un archivo de proyecto con la versión del gateway), pero el objetivo principal de la jornada —lograr la conectividad a internet por SIM— no se consiguió, a pesar de las múltiples combinaciones de APN y 5G probadas.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** 16/09/2026

**Pendientes:**
Lograr la configuración exitosa del acceso a internet mediante la tarjeta SIM en el gateway NE-206.