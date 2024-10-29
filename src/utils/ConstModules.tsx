

export const bpmModules = ['infraestructura', 'legales'];

export const aguaModules = ['agua'];

export const poesModules = [
    'poes-control-productos', 'poes-control-agua', 'poes-superficies', 'poes-contaminacion-cruzada',
    'poes-sustancias-adulterantes', 'poes-higiene-empleados', 'poes-control-plagas', 'poes-instalaciones'
];

export const contaminacionMoudles = ['contaminacion-cruzada'];

export const poeModules = [
    'poe-recepcion', 'poe-almacenamiento', 'poe-preelaboraciones', 'poe-elaboracion', 'poe-mantencion',
    'poe-transporte', 'poe-servicio', 'poe-lavado-ollas-vajilla', 'poe-control-calidad', 'poe-ppt'
];

export const maModules = ['ma'];

export const docModules = ['doc'];

export const lumModules = ['LUM 21. Toma de muestra y uso de luminómetro:'];

export const traModules = ['tra'];

export const capModules = ['cap']

//questions

export const questionsBPM = [
    "INF 1. Separaciones de áreas mínimas y condiciones de mantención de esta:",
    "INF 2. Equipos mínimos de cocción y frío (quemadores, refrigeradores, mantenedores, otros):",
    "INF 3. Cuenta con servicios básicos (agua potable, desagües, ventilación, luminarias, vestuarios, otros):",
    "RL 4. Es factible realizar trazabilidad de producto:",
    "RL 5. Mantención de registros de control de proceso, 90 días:",
    "RL 6. Cuenta con registros de mantención correctiva de equipos:",
    "RL 7. Inducción y entrenamiento al personal, en calidad y medio ambiente (registros e interrogar al personal):"
]

export const questionsPOES = [
    "CQA 8. Almacenamiento de productos químicos según PH, con hojas de seguridad y EPP disponibles:",
    "CQA 9. Rotulación correcta, indicando nombre producto y área de uso:",
    "CQA 10. Productos químicos y utensilios de aseo en cantidad y limpieza adecuada:",
    "CA 11. Agua potable suministrada por empresa sanitaria u otra fuente autorizada, con registro sanitario (evidencia):",
    "CS 12. Aplicación de procedimiento de higiene de tablas, cuchillos y mesones:",
    "CS 13. Limpieza y desinfección de equipos de proceso (máquina universal, juguera, amasadora, otros):",
    "CS 14. Limpieza y desengrasado de equipos (cocina, horno, freidora, marmita, campana y otros):",
    "CS 15. Limpieza y desincrustación de máquinas de jugo, baño maría, vitrinas y hervidores (sin sarro):",
    "CS 16. Higiene de mesas y sillas de comedor:",
    "TRA CS 17. Aplicacion y eficiencia del programa de higiene, publicado e implementado por áreas (Art. 41, 43, 44, 64, 69):",
    "CS 18. Aplicación de alarma sanitaria (equipo), durante la auditoría, con frecuencia y responsable definido (si aplica):",
    "CS 19. Los registros generados son coherentes con lo especificado en el programa (Art. 69):",
    "CS 20. Se adoptan las medidas necesarias para evitar la contaminación de los equipos después de limpiarse y desinfectarse (Art. 42):",
    "LUM 21. Toma de muestra y uso de luminómetro:",
    "CC 22. Separación de utensilios por área, y separación alimentos (cocido - crudo - sucio, otros):",
    "CC 23. Ubicación de equipos y mobiliarios se mantienen correctamente (basureros, mesones, lavadero sanitizado):",
    "CSA 24. Pulverizadores de productos químicos separados de las materias primas-preparaciones en producción (Art. 50, 51):",
    "CSA 25. Protección de materias primas, producto terminado y utensilios:",
    "CSA 26. Consultar al personal por metodo de proteccion, previa a la aplicacion del control de plagas",
    "CSH 27. Uniforme completo de todos, limpio y en buen estado - Sin accesorios adicionales (reloj, joyas, celular, otros) (Art.56):",
    "CSH 28. Cubre-pelo (gorro o cofia), mascarilla y guantes usados correctamente (Art.56):",
    "TRA CSH 29. Lavado y sanitizado correcto de manos y uñas:",
    "CSH 30. Manos sin heridas desprotegidas, uñas cortas y sin esmalte:",
    "TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):",
    "CSH 32. Existe un programa de higiene del personal y sus registros correspondientes. (Art. 55, 56, 60, 69)",
    "CP 33. Barreras físicas para ingreso de vectores y/o plagas (puertas, ventanas, grietas, desagües, otros):",
    "CP 34. Revisar programa y evaluar eficacia y eficiencia (certificados 3 meses atrás e inspección visual) (Art. 47, 69):",
    "CP 35. La empresa a cargo del programa de aplicación de agentes químicos o biológicos para el control de plagas cuenta con Autorización sanitaria. (Art. 48):",
    "CP 36. Los desechos se disponen de forma de impedir el acceso y proliferación de plagas. (Art. 40):",
    "CIS 37. Lavamanos suficientes en áreas de manipulación, limpios, dispensador de papel y señalética publicada:",
    "CIS 38. Servicios higiénicos y sala vestuario, en buenas condiciones, limpios, con agua caliente, jabón y papel:",



]

export const questionsPOE = [
    "REC 39. Verificar registro recepción materias primas, inventario, ordenes de compra y guías de despacho (Art. 61, 69) :",
    "REC 40. Balanza en buen estado, limpia y utilizada frecuentemente:",
    "REC 41. Verificar tiempo de exposición de materias primas a Tª adecuada:",
    "REC 42. Las materias primas utilizadas provienen de establecimientos autorizados y debidamente rotuladas y/o identificadas. (Art. 61, 96)",
    "REC 43. Se cuenta con las especificaciones escritas para cada materia prima (condiciones de almacenamiento, duración, uso, etc.)",
    "ALM 44. Verificar prácticas higiénicas en el trasvasije de envases - Evitar contacto directo entre diferentes tipos de carne (Art.62):",
    "ALM 45. Identificación de áreas y estantes, por familias de productos:",
    "ALM 46. Receptáculos (bandejas) suficientes, limpios y ordenados:",
    "ALM 47. Cumplimiento del sistema FIFO o FEFO, según corresponda:",
    "ALM 48. Productos No Conforme, manejo correcto (art. 105 DS977):",
    "ALM 49. Mantención de productos sobre nivel de piso:",
    "ALM 50. Separación materias primas, desechables, productos químicos:",
    "ALM 51. Verificar entrega correcta a la producción (verificación de cantidad, calidad y disponibilidad):",
    "TRA PRE 52. Verificar descongelación en equipos de refrigeración, en agua corriendo sólo en caso de emergencias:",
    "PRE 53. Pre-elaborados en refrigeración, en envases originales sellados y apilados correctamente:",
    "PRE 54. Materias primas ya procesadas en recipientes o envases lavables y tapadas:",
    "PRE 55. Se separan productos por tipo y/o riesgo de contaminación:",
    "PRE 56. Sanitizado con concentración y tiempo correctos. Verificar registro si aplica:",
    "ELB 57. Recepción y mantención de materias primas en envases limpios y protegidos:",
    "ELB 58. Orden, limpieza y T° correcta en todos los equipos de frío. Termómetro interno:",
    "ELB 59. Productos en tránsito y/o producto terminado, correctamente rotulado según tiempos definidos:",
    "TRA ELB 60. Respetan las T° y los tiempos correctos de cocción y enfriamiento (fríos y calientes):",
    "ELB 61. Uso correcto de equipos de frío, elaboración y mantención:",
    "ELB 62. Sistema de extracción e inyección de aire, en correcto funcionamiento, limpio y con registro de limpieza de ducto:",
    "ELB 63. Estantes sin óxido, sin sobrecarga y ordenados (materias primas y especies - desechables - utensilios):",
    "ELB 64. Especieros limpios, rotulados, tapados y ordenados. Envases de material lavable:",
    "ELB 65. Montajes rápidos, por lote de producto y mice and place completa (mantención cadena frío):",
    "TRA ELB 66. Tiempo entre elaboración y consumo:",
    "TRA MA 67. Control de tiempo y Tº del equipo, al inicio y término de la mantención en frío o caliente:",
    "TRA TPO 68. Traslado de alimentos cumpliendo; protección, rotulación, estiba y registros al inicio y término:",
    "TPO 69. Vehículo cerrado, limpio y en correctas condiciones. Con autorización sanitaria:",
    "SER 70. Verificar mantención en baño maría caliente o mantenedor eléctrico:",
    "SER 71. Variedad de alternativas instaladas en línea autoservicio, según menú (fondos, ensaladas y postres, otros):",
    "TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:",
    "SER 73. Reposición continua de las preparaciones frías y calientes:",
    "SER 74. Vajilla, bandejas y cubiertos en cantidad correcta, limpios y secos:",
    "LVA 75. Desconche de ollas y vajilla limpio, ordenado, separado lo limpio de lo sucio. No hay contaminación cruzada:",
    "LVA 76. Procedimiento de higiene de vajilla y utensilios, en tres etapas (lavado, enjuague, sanitizado) - Disposición de agua caliente:",
    "LVA 77. Orden general del área:",
    "QQ 78. Termómetros y balanzas suficientes, en correcto estado y limpios:",
    "QQ 79. Verificar monitoreo de controles de proceso y verificación por la supervisión (en degustación debe revisar planillas):",
    "QQ 80. Verificar aplicación y verificación (firmas) de acciones correctivas en registros de días anteriores:",
    "QQ 81. Verificar registro y toma de contramuestras, considerar menú y gramaje (100 a 200 gramos):",
    "PPT 82. El flujo del personal, vehículos y de materias primas en las distintas etapas del proceso, es ordenado y conocido por todos los que participan en la elaboración, para evitar contaminación cruzada. (Art. 63)",
    "PPT 83. Se cuenta con procedimientos escritos de los procesos (Formulación del producto, flujos de operación, procesos productivos). (Art. 3, 11, 63, 66, 69, 132)",
    "PPT 84. Los productos se almacenan en condiciones que eviten su deterioro y contaminación (envases, temperatura, humedad, etc.). (Art.11, 67)",
    "PPT 85. La distribución de los productos terminados se realiza en vehículos autorizados, limpios y en buen estado. (Art. 11, 68)",
    "PPT 86. Para envasar los productos se utilizan materiales adecuados, los cuales son mantenidos en condiciones que eviten su contaminación. (Art. 11, 123)",
    "PPT 87. Los productos se etiquetan de acuerdo a las exigencias reglamentarias. (Art. 107 al 121)",

]

export const questionsMA = [
    "MA 88. Dosificación correcta de detergentes y sanitizantes:",
    "MA 89. Productos químicos autorizados por la empresa, verificar cumplimiento del 100% del listado y programa:",
    "MA 90. Basureros limpios y sanitizados, con pedal, tapa y bolsa:",
    "MA 91. Frecuencia de retiro de basura de las áreas (75% de la capacidad del contenedor):",
    "MA 92. Limpieza y sanitización de la sala o área destinada a la basura(sala,caseta):",
    "MA 93. Aceites usados, son correctamente envasados, rotulados. Ausencia de grasa en los desagües:",
    "MA 94. Separación de residuos sólidos y grasa durante desconche de vajilla y ollas:"
]

export const questionsDOC = [
    "DOC 95. Autorizaciones Sanitarias (casino y verduras crudas):",
    "DOC 96. Libro de inspección SEREMI Salud o Archivador con actas dejadas por la autoridad:",
    "DOC 97. Informes de muestreo microbiológico/luminometría. Planes de acción, charlas al personal si corresponde:",
    "TRA DOC 98. Informes de auditoría sanitaria, plan de acción, verificación de cumplimiento, por Administrador:",
    "TRA DOC 99. Registros del cumplimiento al 100% del programa de charlas en Calidad y Medio Ambiente:",
    "DOC 100. Reporte de proveedor productos químicos:"
]

export const questionsTra = [
    "TRA CS 17. Aplicacion y eficiencia del programa de higiene, publicado e implementado por áreas (Art. 41, 43, 44, 64, 69):",
    "TRA CSH 29. Lavado y sanitizado correcto de manos y uñas:",
    "TRA CSH 31. Exámenes de todos los manipuladores, ecónomos y administradores. Ausencia de malestares o infecciones (Art. 52, 53):",
    "TRA PRE 52. Verificar descongelación en equipos de refrigeración, en agua corriendo sólo en caso de emergencias:",
    "TRA ELB 60. Respetan las T° y los tiempos correctos de cocción y enfriamiento (fríos y calientes):",
    "TRA ELB 66. Tiempo entre elaboración y consumo:",
    "TRA MA 67. Control de tiempo y Tº del equipo, al inicio y término de la mantención en frío o caliente:",
    "TRA TPO 68. Traslado de alimentos cumpliendo; protección, rotulación, estiba y registros al inicio y término:",
    "TRA SER 72. Equipos suficientes para la correcta mantención de productos calientes y fríos:",
    "TRA DOC 98. Informes de auditoría sanitaria, plan de acción, verificación de cumplimiento, por Administrador:",
    "TRA DOC 99. Registros del cumplimiento al 100% del programa de charlas en Calidad y Medio Ambiente:",
];

export const questionLum = ['LUM 21. Toma de muestra y uso de luminómetro:']



