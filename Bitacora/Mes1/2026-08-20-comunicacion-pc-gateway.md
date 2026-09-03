# Bitácora — 20-08-2026

**Fecha:** 20/08/2026
**Responsable:** Katherinne Gómez
**Etapa del proyecto:** Etapa 1
**Actividad:** Establecer comunicación con el gateway

---

## 1. Objetivo

Establecer y validar la comunicación de red entre el Automation Industrial 4.0 DTU Multifunction IoT Gateway (WHG-151) y una computadora mediante una conexión Ethernet directa, configurando previamente una dirección IP estática en el mismo segmento de red. Asímismo, investigar y probar enviar datos hacia el Gateway.

**Objetivo:**
* Verificar la alimentación eléctrica del gateway.
* Establecer comunicación temporal mediante USB para acceder a su configuración.
* Identificar y configurar los parámetros de red del gateway.
* Asignar direcciones IP compatibles al gateway y a la computadora.
* Conectar físicamente ambos dispositivos mediante Ethernet.
* Preparar la infraestructura necesaria para realizar una prueba de conectividad mediante ping.
* Investigar protocolo de comunicación Modbus TCP o RTU.
* Realizar el envío de una variable hacia el gateway.

---

## 2. Actividad realizada

1. Se preparó la alimentación eléctrica del Gateway utilizando una fuente regulada de 12–24 VDC, verificando previamente la polaridad de conexión.
2. Se conectó la antena del dispositivo antes de su encendido.
3. Se encendió el Gateway y se verificó el funcionamiento del indicador de alimentación y de la pantalla OLED.
4. Se estableció una conexión temporal mediante USB-C entre el Gateway y la computadora para realizar su configuración.
5. Se instaló el controlador CH340, ubicado en: ManualesDeLosComponentes\GAOTek-WHG-151\USB tool\CH341SER
6. Se identificó el puerto de comunicación asignado por Windows, correspondiente a COM8.
7. Se utilizó TP Assistant para acceder a la configuración del Gateway.
8. Se configuró la comunicación USB a 115200 baudios.
9. Se realizó una lectura de la configuración actual mediante la opción Refresh.
10. Se revisaron los parámetros correspondientes a Network port parameters.
11. Se estableció una configuración de red para realizar pruebas de comunicación Ethernet:
    * Gateway: 192.168.137.2
    * Máscara: 255.255.255.0
    * Computadora: 192.168.137.1
12. Se guardó la configuración mediante Save Configuration y se reinició el Gateway.
13. Se conectó un cable Ethernet directamente entre el Gateway y la computadora.
14. Se procedió a realizar pruebas de conectividad mediante ping hacia la dirección IP física configurada en el Gateway: 192.168.137.2.

---

## 3. Equipo utilizado

| Equipo / Recurso | Marca / Modelo | Identificación | Función   |
| ---------------- | -------------- | -------------- | --------- |
| Automation Industrial 4.0 DTU Multifunction IOT Gateway         | --       | 7IOT161-00020           | Puerta de enlace entre redes |
| Cable ethernet directo         | --       | --  | Establecer una conexión física directa entre dispositivos de red |
| Multimetro         | Fluke 376 FC       | --  | Medir magnitudes eléctricas |
| TP assistant       | 6.2      | —              | Configuración del gateway |

---

## 4. Configuración

### Alimentación eléctrica
|Parámetro|	Configuración|
|---------|--------------|
|Alimentación|	12–24 VDC|
|Corriente máxima considerada|	< 1 A|
|Polaridad	|Positivo (+) / Negativo (–)|

### Comunicación USB
|Parámetro	|Configuración|
|-----------|-------------|
|Interfaz|	USB-C|
|Controlador|	CH340|
|Puerto COM|	COM8|
|Velocidad|	115200 baudios|
|Software|	TP Assistant 6.2|

### Configuración de red
|Dispositivo|	Dirección IP|	Máscara de subred|
|-----------|---------------|--------------------|
|Gateway|	192.168.137.1|	255.255.255.0|
|Computadora|	192.168.137.1|	255.255.255.0|

La configuración coloca ambos dispositivos dentro de la misma red 192.168.137.0/24, permitiendo establecer comunicación directa mediante Ethernet.
```
Conexión física
Computadora
192.168.137.1
      │
      │ Ethernet
      │
      ▼
WAN RJ45
Gateway WHG-151
192.168.137.2
```
---

## 5. Cambios realizados

Registrar cualquier modificación realizada respecto a la configuración inicial.

| Elemento   | Configuración anterior | Configuración nueva | Motivo   |
| ---------- | ---------------------- | ------------------- | -------- |
| Gateway | DHCP: ON IP:-- Mask:-- Gateway:--            | DHCP: OFF IP:192.168.137.2 Mask:255.255.255.0 Gateway:192.168.137.1             | Habilitar la comunicación entre la computadora y el gateway |


---

## 6. Resultados obtenidos

**Resultado general:**
Exitoso

### Resultados específicos

* Ping correcto hacia la IP 192.168.137.1 
* Ping correcto hacia la IP 192.168.137.2

### Datos relevantes

Resultados del ping de verificación a la red ethernet

```text
Estadísticas de ping para 192.168.137.1:
Paquetes: enviados = 4, recibidos = 4, perdidos = 0
(0% perdidos),
Tiempos aproximados de ida y vuelta en milisegundos:
Mínimo = Oms, Maximo = Oms, Media = Oms
```

Resultados del ping de verificación hacia el gateway
```

```
Estadísticas de ping para 192.168.137.2:
Paquetes: enviados = 4, recibidos = 4, perdidos = 0
(0% perdidos),
Tiempos aproximados de ida y vuelta en milisegundos:
Mínimo = Om
= Oms, Maximo = 1ms, Media = Oms
---

## 7. Errores encontrados / Obstáculos

> No se presentaron errores u obstáculos relevantes durante la actividad.

---

## 8. Solución aplicada

> No se presentaron errores u obstáculos relevantes durante la actividad.

## 9. Evidencias

| Evidencia     | Descripción   | Ubicación          |
| ------------- | ------------- | ------------------ |
| Identificación del puerto COM    | En la imagen se puede observar el administrador de dispositivos de la computadora. Dentro del recuadro rojo y señalado por una flecha se puede encontrar el puerto COM que corresponde al Gateway. | Bitacora\Mes1\imgs\IdentificarCOM.png |
| Ping al gateway    | En la imágen se puede observar del lado izquiero la consola CMD con los resultados exitosos del ping hacia las direcciones IP y del lado derecho, el software de configuración del gateway y su dirección IP correspondiente. | Bitacora\Mes1\imgs\PingExitosoGateway.png |

### Evidencias

* [Identificación del puerto COM](./imgs/IdentificarCOM.png)
* [Ping al gateway](./imgs/PingExitosoGateway.png)

---

## 10. Próximos pasos

* Determinar el mecanismo adecuado para enviar datos al Gateway físico.
* Realizar una primera prueba de envío de datos hacia el Gateway.
* Analizar la respuesta del Gateway ante los datos enviados.
* Documentar el protocolo y parámetros necesarios para la comunicación.
* Identificar posteriormente cómo integrar esta comunicación con la arquitectura PLC → Gateway → AWS.
---

## 11. Observaciones

La configuración inicial del Gateway y el establecimiento de los parámetros de red para la prueba Ethernet fueron realizados.

La actividad de comunicación no se considera finalizada, debido a que aún se encuentra pendiente investigar y validar el mecanismo mediante el cual será posible enviar datos al Gateway físico, así como determinar el protocolo, puerto y configuración requeridos para dicha comunicación.

---

## 12. Estado de la actividad

**Estado:** Parcial

**Fecha de cierre:** [DD/MM/AAAA]

**Pendientes:**
[Descripción de pendientes, si existen.]
