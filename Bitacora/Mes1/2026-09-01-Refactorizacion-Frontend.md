# Bitácora — 01-09-2026

**Fecha:** 01/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Refactorización del Frontend

---

## 1. Objetivo

**Objetivo:**

Reestructurar el frontend desarrollado previamente en HTML, CSS y JavaScript hacia una arquitectura basada en Vite + React, descomponiendo el archivo único en componentes reutilizables y reorganizando la conexión con el backend mediante Axios.

---

## 2. Actividad realizada

1. Reestructuración completa del frontend utilizando Vite + React.
2. Descomposición del archivo HTML único en componentes reutilizables.
3. Reorganización de la conexión al backend utilizando Axios.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función   |
| ---------------- | -------------- | -------------- | --------- |
| PC | DELL core i5 | — | Desarrollo de la refactorización del frontend |
| Vite | 8.2.2 | — | Herramienta de construcción del proyecto frontend |
| React | 19.2.8 | — | Librería utilizada para la creación de componentes reutilizables |
| Axios | 1.20.0 | — | Librería utilizada para la conexión con el backend |

---

## 4. Configuración

### Hardware

* **Equipo:** PC
* **Modelo:** DELL Core i5
* **Alimentación:** No aplica
* **Conexiones:** No aplica

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** Vite, React, Axios
* **Librerías / dependencias:** DesarrolloAplicacion/client/package.json

### Comunicación

* **Protocolo:** HTTP (frontend–backend, mediante Axios)
* **IP / dirección:** localhost
* **Puerto:** 5172
* **Endpoint / servidor:** http://localhost:8000/docs
* **Tópico:** No aplica
* **QoS:** No aplica
* **Otros parámetros:** No aplica

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento | Configuración anterior | Configuración nueva | Motivo |
| -------- | ----------------------- | -------------------- | ------ |
| Arquitectura del frontend | Archivo único en HTML, CSS y JavaScript | Aplicación estructurada con Vite + React, dividida en componentes reutilizables | Mejorar la organización, mantenibilidad y escalabilidad del frontend |
| Conexión al backend | Peticiones realizadas directamente desde JavaScript | Conexión reorganizada utilizando Axios | Estandarizar y simplificar el manejo de las peticiones al backend |

---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Se reestructuró exitosamente el frontend utilizando Vite + React.
* Se descompuso el archivo HTML único en componentes reutilizables.
* Se reorganizó y estandarizó la conexión al backend utilizando Axios.

### Datos relevantes

```text
[Placeholder — completar si aplica, por ejemplo estructura final de componentes]
```

---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes durante la actividad.

---

## 8. Solución aplicada

No aplica, ya que no se presentaron errores u obstáculos durante esta actividad.

---

## 9. Evidencias

| Evidencia | Descripción | Ubicación |
| --------- | ------------ | --------- |
| Dashboard refactorizado | Dashboard optimizado con implementación de componentes reutilizables | ./imgs/Desarrollo/DashboardMonitoreoReact.png |

---

## 10. Próximos pasos

* Continuar el desarrollo de nuevas funcionalidades sobre la nueva arquitectura React.
* Continuar la exploración e integración del PLC Schneider al flujo de datos del sistema.

---

## 11. Observaciones

A diferencia de las jornadas de desarrollo del backend y del frontend preliminar, en esta actividad de refactorización no se presentó el obstáculo relacionado con el bloqueo de ejecución de scripts, dado que dicho problema ya había sido resuelto previamente.

---

## 12. Estado de la actividad

**Estado:** Completada

**Fecha de cierre:** 01/09/2026

**Pendientes:**
Ninguno relevante; el desarrollo del frontend continúa sobre la nueva arquitectura basada en React.