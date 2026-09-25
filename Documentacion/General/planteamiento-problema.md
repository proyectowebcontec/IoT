# Planteamiento del problema
## Contexto

Las grúas ABUS y los equipos industriales de elevación son parte crítica de las operaciones de manufactura, logística y mantenimiento de las empresas que los utilizan. Cuando uno de estos equipos se detiene, se interrumpe el movimiento de carga y, con él, la continuidad de procesos completos. Por eso su disponibilidad depende directamente de la capacidad de detectar a tiempo las condiciones que anteceden a una falla y de responder a ella de forma rápida y certera.

Hoy el seguimiento del estado de estos equipos depende casi por completo de la observación del operador, de inspecciones periódicas y del reporte verbal o escrito de las fallas. No existe un mecanismo que permita conocer, de manera continua y remota, las condiciones eléctricas y operativas de los motores y demás componentes. La información que genera el equipo durante su funcionamiento, como corrientes, voltajes, tiempos de operación, arranques o alarmas del PLC, no se registra ni se aprovecha fuera del entorno de la planta.

## Descripción del problema

El problema principal es el daño recurrente de los motores de las grúas, que se queman por la combinación de falta de mantenimiento oportuno, fallas eléctricas no detectadas, intervenciones tardías y deficiencias en la comunicación entre el cliente y el equipo técnico. Estas causas tienen un origen común: la falta de visibilidad sobre lo que ocurre en el equipo. Condiciones como sobrecorrientes, desbalances o caídas de tensión, sobrecalentamiento o uso intensivo más allá de lo previsto pueden desarrollarse durante días o semanas sin que nadie las advierta, hasta que terminan en una falla mayor.

A esto se suma un problema en la atención de las fallas. Cuando un cliente reporta que la grúa no funciona, la descripción que llega al área técnica suele ser incompleta o imprecisa, porque quien reporta observa el síntoma y no la causa. El equipo técnico prepara materiales y herramientas según ese reporte, se traslada al sitio y, al diagnosticar, descubre en ocasiones que la falla real es distinta. Entonces debe regresar a buscar el material y el equipo correctos, lo que duplica traslados, alarga el tiempo de respuesta y consume recursos del personal técnico.

Las consecuencias recaen sobre todo en el cliente. Cada hora que una grúa permanece fuera de servicio significa horas de trabajo perdidas, retrasos en la producción o en la entrega, personal inactivo y pérdidas económicas. Para la empresa que da el servicio, el mismo escenario implica costos operativos más altos, repuestos más caros por fallas que pudieron evitarse (como el reemplazo o rebobinado de motores) y un deterioro de la confianza y la satisfacción del cliente.

## Causa de fondo y oportunidad

El problema no se debe a la ausencia de datos, porque el equipo industrial y su PLC ya manejan información valiosa sobre su estado. Se debe a que esa información no se adquiere, no se transmite y no se analiza. No hay un canal confiable y seguro que lleve los datos desde el entorno operativo hasta un lugar donde el personal técnico pueda consultarlos en tiempo real, conservar su historial y usarlos para diagnosticar antes de salir hacia el sitio.

Las tecnologías de Internet Industrial de las Cosas (IIoT) ofrecen una alternativa para cerrar esta brecha. Un Gateway industrial puede leer datos del PLC y de los instrumentos de medición mediante protocolos de campo como Modbus RTU/TCP. Luego puede enviarlos por Internet mediante protocolos como MQTT hacia servicios en la nube como Amazon Web Services, donde se pueden almacenar, visualizar y analizar. Sin embargo, integrar el entorno industrial con la nube presenta retos técnicos que deben resolverse antes de confiar en esta solución para operar:

* la compatibilidad entre protocolos y equipos de distintos fabricantes,
* la selección adecuada de las variables relevantes,
* la estabilidad de la conexión,
* la protección de la información y del acceso al equipo mediante autenticación y cifrado,
* la prevención de la pérdida de datos cuando la conectividad falla.

## Formulación del problema

Por lo anterior, este proyecto plantea la siguiente pregunta central:

¿Cómo implementar una arquitectura confiable y segura que permita adquirir información de un equipo industrial, procesarla mediante un Gateway y transmitirla hacia servicios de AWS para su almacenamiento, visualización y posterior análisis?

Responder esta pregunta mediante un prototipo validado permitirá sentar la base técnica para el monitoreo remoto de las grúas ABUS. Con ese monitoreo, las fallas podrían detectarse antes de que dañen los motores, el diagnóstico podría hacerse a distancia antes de enviar al personal técnico, y el mantenimiento podría planificarse con base en el uso y la condición real del equipo, en lugar de reaccionar cuando ya se ha detenido.