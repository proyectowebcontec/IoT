# Comparativa de Robustez y Resistencia a Altas Temperaturas: GAOTek-WHG-151 vs. GAOTek-NE-206

Con base en la documentación disponible se ha realizado una evaluación de robustez y resiliencia a altas temperaturas sobre los gateway GAOTek disponibles para el proyecto. Esto con la finalidad de determinar sus oportunidades y, especialmente, sus limitaciones. 

## Comparación Técnica

| Categoría | Gaotek-WHG-151 | Gaotek-NE-206 |
| --------  | -------------- | ------------- |
| Rol | RTU multifuncional con amplia capacidad de E/S | Puerta de enlace para Edge-computing | 
| Procesador | No especificado | quad-core, 1.6 GHz |
| RAM | No especificado | 1 GB |
| Almacenamiento | No especificado | 8 GB eMMC |
| Ethernet | 1 x 100 Mbps RJ45 | Conflicto en la documentación: el manual indica inicialmente 1 WAN gigabit más 4 LAN de 100 Mbps, pero posteriormente describe solo las interfaces WAN y LAN. |
| Celular | 2G o 4G | LTE Cat 1 |
| Wi-fi | Diversas versiones, opción de conexión inalámbrica | IEEE 802.11 b/g/n/ |
| Serial | 2 x RS485 | 3 x RS485 Y 1 X RS232 |
| Otras interfaces | USB tipo C para configuración y debugging; OLED 1.3 pulgadas |
| Entradas | 8 × 0–20 mA; 8 × 0–5 V; 8 entradas digitales. DI0 y DI1 admiten conteo. | No se enumeran entradas analógicas |
| Salidas | 2 salidas analógicas configurables, cada una funcionando como 0–20 mA o 0–10 V; 4 salidas de relé con capacidad nominal de hasta 220 VCA/5 A o 30 VCC/5 A | No se especifican de forma explícia en la documentación |
| Exactitud | entrada: 0.2%; salida: 0.3% | No se especifica un proceso externo de E/S |
| Alimentación | 12 - 24 VDC | 10.5 - 28 VDC; debajo de 5 W y Protección contra polaridad inversa y cableado incorrecto | 
| Ventaja principal | Adquisición y control directo de numerosas señales de campo | Conversión de protocolo, enrutamiento, computación en el borde, almacenamiento y conectividad de múltiples redes |

## Protocolos admitidos
| Capa | GAOTek-WHG-151 | GAOTek-NE-206 |
|---|---|---|
| Protocolos industriales/de dispositivos | Interfaz de registro Modbus; software de configuración identifica Modbus RTU | Modbus RTU/TCP, bus CAN, drivers Siemens, Mitsubishi, Omron, Schneider y Delta |
| Protocolos de nube/aplicación | MQTT y TCP | MQTT, TCP, UDP, HTTP/HTTPS, WebSocket, SNMP y SOAP |
| Comportamiento en red | Transmisión de datos RTU a través de Ethernet o interfaz inalámbrica seleccionada | Operación de cliente/servidor TCP, acceso WAN/LAN enrutado, mapeo de puertos y conectividad en la nube |
| Limitación verificada | El manual no distingue claramente todos los modos de transporte Modbus admitidos | La disponibilidad exacta del protocolo puede depender de la biblioteca y el firmware del controlador WinIF instalado |

## Consideraciones ambientales

| Factor | GAOTek-WHG-151 | GAOTek-NE-206 | Hallazgo comparativo |
|---|---|---|---|
| Temperatura de funcionamiento | −20 a 60 °C, 0–95 % HR — Manual WHG, pág. 4 | −20 a 60 °C, 10–90 % HR, sin condensación | El rango térmico está vinculado |
| Temperatura de almacenamiento | −30 a 65 °C, 30–80 % HR | −30 a 70 °C | El NE-206 tiene un límite de almacenamiento 5 °C superior |
| Clasificación IP | No especificada | IP20 | NE-206 está mejor documentado, pero IP20 no es hermético al polvo ni resistente al agua |
| Carcasa | Plástico ABS de ingeniería ignífugo; resistencia declarada a la corrosión por ácidos/álcalis | ABS ignífugo | Ninguno de los dos ofrece las ventajas de impacto y disipación de calor normalmente asociadas a una carcasa industrial metálica sellada |
| Vibración | Sin clasificación | 10–25 Hz, ejes X/Y/Z, 2 G durante 30 minutos | Clara ventaja para NE-206 |
| Choque/caída | No especificado | No especificado | Ninguno de los dos tiene una clasificación de choque documentada |
| Resistencia eléctrica | Sin especificación de aislamiento ni protección contra polaridad inversa | 500 VCA durante un minuto; resistencia de aislamiento superior a 50 MΩ a 500 VCC; protección contra polaridad inversa/cableado incorrecto | Ventaja para NE-206 |
| Refrigeración | No especificado | Convección natural | Requiere flujo de aire y espacio térmico en el gabinete |
| Advertencias ambientales | No exponer al sol ni a fuentes de calor; no almacenar al aire libre; no utilizar en ambientes húmedos | Requisito de humedad sin condensación | WHG-151 incluye advertencias de instalación más restrictivas |

## Conclusiones
El GAOTek-NE-206 ofrece un perfil más sólido de robustez al ofrecer IP20, prueba antivibración, límites de humedad sin condensación, datos de aislamiento eléctrico, protección para el cableado de alimentación un rango de temperatura de almacenamiento más amplio, menor consumo de energía especificado y mayor redundancia de comunicaciones. Por su parte el WHG-151 aunque no tiene una clasificación IP declarada y su manual advierte explícitamente sobre su uso en ambientes húmedos y al aire libre. 

Para un armario industrial cerrado y seco que opere entre -20 y 60 °C, el GAOTek-NE-206 es la mejor opción en cuanto a robustez. Para aplicaciones que requieren numerosas señales de campo analógicas y digitales directas, el WHG-151 es funcionalmente superior como RTU, pero su rendimiento ambiental es inferior debido a la ausencia de clasificaciones IP, de vibración, de impacto y de resistencia eléctrica.

Debe tenerse en consideración que ninguno de los dos gateways es adecuado para la exposición directa a entornos realmente adversos con agua, polvo denso, condensación, condiciones climáticas exteriores o temperaturas superiores a 60 °C. Para implementaciones expuestas o en entornos de alta temperatura extrema, la conclusión correcta es que ninguno de los modelos es adecuado sin protección adicional. Se recomienda utilizar, como mínimo, una carcasa industrial con clasificación IP54/IP65 apropiada, control de condensación, protección contra sobretensiones y cálculos térmicos del gabinete. Si la temperatura interna sostenida del gabinete puede alcanzar los 60 °C, seleccione una puerta de enlace con una clasificación de al menos 70–85 °C para mantener el margen operativo.