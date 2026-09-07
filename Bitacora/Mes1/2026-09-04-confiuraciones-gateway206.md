# Bitácora — 04-09-2026

**Fecha:** 04/09/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Configuraciones del gateway 206

---

## 1. Objetivo

**Objetivo:**

Configurar el gateway 206 de modo que este pueda replicar el trabajo logrado con el gateway 151 capturando las señales provenientes del Arduino Mega 2560, transmitirlas por medio del protocolo MQTT al broker desplegado en la nube y para posteriormente almacenarlas en un registro histórico y mostrarlas en un sistema de monitoreo.

---

## 2. Actividad realizada

1. Validar el voltaje de la fuente de alimentación.
2. Extraer la tarjeta SIM del gateway WHG-151 e insertarla en el gateway NE-206.
3. Cablear el gateway NE-206 y energizarlo.
4. Validar la dirección IP del gateway NE-206 puesto que en los manuales de configuración existe una contradicción. Se indican dos IP: 192.168.1.222 y 192.168.1.223.
5. Identificar la IP 192.168.1.223 como la correcta tras colocar a la PC y el adaptador USB/Ethernet a la misma red para realizar pruebas de comunicación con un Ping.
6. Ingresar al software de configuración.
7. Configurar la conexión a la red de la tarjeta SIM.
8. Configurar la conexión al broker MQTT.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función   |
| ---------------- | -------------- | -------------- | --------- |
| Industrial Edge Computing Remote Management Gateway | GAOTek NE-206 | 7IOT161-0002 | Adquirir señales digitales y analógicas y transmitirlas mediante MQTT |
| PC | DELL | --- | Configurar el gateway, almacenar los datos y ser el servidor local de la página web |
| WinIFDesigner | --- | — | Software de configuración del gateway NE-206 |

---

## 4. Configuración

### Hardware

* **Equipo:** Gateway industrial de comunicaciones
* **Modelo:** GAOTek NE-206 (7IOT161-0002)
* **Alimentación:** Voltaje validado previo al cableado (según manual del equipo)
* **Conexiones:** Cableado de alimentación y conexión Ethernet entre la PC (adaptador USB/Ethernet) y el gateway NE-206, dentro de la misma subred

### Software

* **Sistema operativo:** Windows
* **Software utilizado:** WinIFDesigner
* **Librerías / dependencias:** [No reportado]

### Comunicación

* **Protocolo:** Ethernet (configuración local) / MQTT (comunicación con el broker) / Red 4G (conexión mediante tarjeta SIM)
* **IP / dirección:** PC: 192.168.1.100/24 — Gateway NE-206: 192.168.1.223/24 (dirección confirmada como activa; la 192.168.1.222 indicada en el manual no responde)
* **Puerto:** COM8
* **Endpoint / servidor:** Broker MQTT desplegado en la nube (AWS)
* **Tópico:** `test/mqtt`
* **QoS:** 0
* **Otros parámetros:** APN de la red 4G: `internet.ideasclaro`; usuario y contraseña predeterminados del gateway: `admin/admin`

> No se incluyen contraseñas, claves privadas, tokens o credenciales.

---

## 5. Cambios realizados

| Elemento   | Configuración anterior | Configuración nueva | Motivo   |
| ---------- | ---------------------- | ------------------- | -------- |
| Red 4G | Deshabilitada | Habilitada | Permitir la conexión del gateway a WIFI |
| APN red 4G | --- | internet.ideasclaro | Configurar la conexión de la red 4G del gateway |
| Link MQTT | --- | Name: MQTT · Type: Mqtt | Configurar la conexión del gateway al broker MQTT de AWS |

---

## 6. Resultados obtenidos

**Resultado general:**
No exitoso

### Resultados específicos

* El cableado para energizar y configurar el gateway se realizó correctamente.
* El ping de comunicación de la PC (`192.168.1.100/24`) al gateway (`192.168.1.223/24`) fue exitoso.
* Cargar cualquier tipo de configuración al gateway fue imposible.

### Datos relevantes

```text
[Logs, mensajes, valores medidos o resultados relevantes]
```

---

## 7. Errores encontrados / Obstáculos

| Error / Obstáculo | Momento | Impacto | Evidencia |
| ----------------- | -------------- | --------- | ------------------- |
| El software de configuración WinIFDesigner no reconoce que exista el gateway | 11:20 am | Elevado | ./imgs/conf/errorWinif.jpg |

---

## 8. Solución aplicada

### Problema 1

**Problema:**
El software WinIFDesigner no reconoce la existencia del gateway NE-206 y, por lo tanto, no permite cargar ningún tipo de configuración al equipo.

**Causa identificada:**
Aún no ha sido identificada. Se descartaron varias causas probables sin éxito.

**Solución aplicada:**
Se realizaron las siguientes verificaciones y pruebas, sin lograr resolver el problema:

* Se confirmó que el gateway responde continuamente al ping.
* Se verificó que la computadora y el gateway estén en la misma subred.
* Se probó la dirección 192.168.1.222, la cual no respondió.
* Se confirmó que 192.168.1.223 es la dirección activa del gateway.
* Se utilizó el usuario y contraseña predeterminados `admin/admin`.
* Se desactivaron temporalmente otras interfaces de red para evitar que WinIFDesigner seleccionara una conexión incorrecta.
* Se revisaron posibles bloqueos del firewall.
* Se intentó ejecutar WinIFDesigner como administrador.

Dado que ninguna de estas acciones resolvió el problema, se contactó a los fabricantes del equipo para solicitar soporte.

**Resultado posterior:**
El problema persiste; no se ha logrado solventar. Se está a la espera de la respuesta del fabricante.

---

## 9. Evidencias

| Evidencia     | Descripción   | Ubicación          |
| ------------- | ------------- | ------------------ |
| Configuración de la red 4G    | En la imágen se puede observar la configuración de red 4G correspondiente al SIM Claro | ./imgs/ConfiguracionGateway206/ConfiguracionRed4G.png |
| Error al cargar configuraciones    | La imágen muestra el error que el software WInIfDesigner muestra al momento de intentar cargar las configuraciones al gateawy y la evidencia de comunicación a su IP. | ./imgs/ConfiguracionGateway206/WinIFDesignerConnectionError.png |
| Gateway no localizado por WinIFDesigner        | En la opción de buscar dispositivos no aparece el gateway | ./imgs/ConfiguracionGateway206/DeviceDetection_NoEncontrado.png |
| Gateway localizado por WinIFDesigner | En la opción de buscar dispositivos no aparece el gateway |./imgs/ConfiguracionGateway206/DeviceDetection_Encontrado.png|
| Interfaces de red deshabilitadas | Se deshabilitaron todas las intefaces de red para evitar una conexión errónea |./imgs/ConfiguracionGateway206/InterfacesDeRedDeshabilitadas.png|
| Resultado de ARP -a | Se muestran todas las entradas ARP actuales, incluyendo direcciones IP y sus correspondientes direcciones MAC  |./imgs/ConfiguracionGateway206/AdaptadorUnicaInterfaz.png|

### Evidencias

* [Configuración de la red 4G ](./imgs/ConfiguracionGateway206/ConfiguracionRed4G.png)
* [Error al cargar configuraciones](./imgs/ConfiguracionGateway206/WinIFDesignerConnectionError.png)
* [Gateway no localizado por WinIFDesigner](./imgs/ConfiguracionGateway206/DeviceDetection_NoEncontrado.png)
* [Gateway localizado por WinIFDesigner](./imgs/ConfiguracionGateway206/DeviceDetection_Encontrado.png)
* [Interfaces de red deshabilitadas](./imgs/ConfiguracionGateway206/InterfacesDeRedDeshabilitadas.png)
* [Resultado de ARP -a](./imgs/ConfiguracionGateway206/AdaptadorUnicaInterfaz.png)


---

## 10. Próximos pasos

* Dar seguimiento a la comunicación con el fabricante y aplicar las recomendaciones que indiquen.
* Una vez resuelto el problema de reconocimiento del gateway, continuar con la carga de la configuración de red de la tarjeta SIM y del broker MQTT.
* Retomar la replicación del flujo logrado con el gateway WHG-151 (captura de señales del Arduino Mega 2560, transmisión MQTT, almacenamiento en registro histórico y visualización en el sistema de monitoreo).

---

## 11. Observaciones

El problema de reconocimiento del gateway por parte de WinIFDesigner impidió avanzar con la configuración de red de la tarjeta SIM y del broker MQTT, a pesar de que la conectividad de red básica (ping) con el equipo es correcta. Esto sugiere que el inconveniente está relacionado con el software de configuración o con algún parámetro específico del gateway, más que con la conexión física o de red. Se mantiene la comunicación con el fabricante para obtener soporte adicional.

---

## 12. Estado de la actividad

**Estado:** Bloqueada

**Fecha de cierre:** 04/09/2026

**Pendientes:**
Cargar la configuración al gateway NE-206. El caso fue escalado al fabricante y se encuentra pendiente de respuesta.