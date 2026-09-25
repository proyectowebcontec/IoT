# Introducción

La industria atraviesa una transformación impulsada por la digitalización de sus procesos, conocida como Industria 4.0. Uno de sus pilares es el Internet de las Cosas (IoT), que conecta equipos, sensores y controladores del entorno productivo con plataformas de cómputo capaces de almacenar, procesar y analizar grandes volúmenes de información. Gracias a esta integración, las empresas pueden dejar atrás una gestión basada en la observación directa y la reacción ante fallas, y adoptar una gestión apoyada en datos que permite anticipar problemas, optimizar recursos y aumentar la disponibilidad de sus activos.

Los equipos de elevación, como las grúas ABUS, son activos críticos en plantas de manufactura, bodegas y talleres, porque de ellos depende el movimiento seguro de cargas y la continuidad de la operación. A pesar de su importancia, el seguimiento de su estado suele depender todavía de inspecciones periódicas y del reporte de los operadores. Por ello, condiciones anormales como sobrecorrientes, variaciones de voltaje o uso intensivo pueden pasar inadvertidas hasta provocar daños graves, en particular en los motores. Además, cuando ocurre una falla, la falta de información precisa sobre su causa dificulta el diagnóstico. En consecuencia, el personal técnico acude en ocasiones al sitio sin el material adecuado, lo que prolonga el tiempo de paro y genera pérdidas económicas para los clientes.

Ante esta situación, el presente proyecto propone el desarrollo de un sistema de monitoreo inteligente para grúas ABUS y equipo industrial. El sistema se basa en la integración del entorno operativo con los servicios en la nube de Amazon Web Services (AWS). Para ello se plantea una arquitectura en la que un Gateway industrial adquiere información del equipo mediante protocolos de campo como Modbus y la transmite de forma segura a través de Internet mediante protocolos orientados a IoT como MQTT. Los datos llegan así a AWS, donde pueden almacenarse, visualizarse y quedar disponibles para análisis posteriores. De esta manera, el personal técnico podrá conocer de forma remota las condiciones del equipo, detectar comportamientos anómalos antes de que se conviertan en fallas y llegar al sitio con un diagnóstico más certero.

El objetivo general del proyecto es diseñar, desarrollar y validar un prototipo de integración entre equipos industriales y AWS que utilice un Gateway industrial para la adquisición y transmisión segura de información desde el entorno operativo hacia la nube. El trabajo comprende las siguientes etapas:

- Investigar las tecnologías y arquitecturas disponibles
- Analizar el equipo industrial, el PLC, el Gateway y los servicios de AWS
- Identificar las variables relevantes,
- Diseñar la arquitectura de comunicación,
- Configurar los componentes de software,
- Implementar el prototipo,
- Evaluarlo mediante pruebas de comunicación, estabilidad, seguridad y pérdida de información.

La confiabilidad y la seguridad son ejes transversales del proyecto. Una solución de monitoreo industrial solo aporta valor si los datos llegan completos y a tiempo. Además, la conexión del entorno operativo a Internet no debe exponer al equipo ni a la información a riesgos. Por ello se da especial atención a los mecanismos de autenticación, cifrado y manejo de interrupciones en la conectividad.

Este documento presenta primero el planteamiento del problema y los objetivos del proyecto. Después expone el análisis de los equipos y las variables disponibles, y el diseño de la arquitectura propuesta. Por último, describe la implementación del prototipo, los resultados de las pruebas realizadas, los problemas encontrados con sus soluciones, y las conclusiones y recomendaciones para trabajos futuros.

