// ============================================================================
// Datos ficticios para pruebas - Plataforma de monitoreo de polipastos
// Ejecutar con:  mongosh "mongodb://localhost:27017" seed_mongo.js
// (o pegarlo completo en la consola MONGOSH de Compass)
//
// Inserta: empresas, dispositivos, polipastos y monitoreos.
// NO toca: usuarios, reglas_alarmas, alarmas_log.
//
// Todo lo de prueba se identifica por nombre ("... Demo S.A.") y por id de
// dispositivo (prefijo "DEMO-"), para poder borrarlo sin afectar datos reales.
// ============================================================================

(function () {
  const dbName = "contec_proyectoIoT_db";    // debe coincidir con schema_mongo_v2.js
  const LIMPIAR = false;             // true = borra los datos demo existentes y los vuelve a crear
  const MINUTOS_MONITOREO = 5;       // minutos de historial por dispositivo (10 lecturas/s)

  const conn = db.getSiblingDB(dbName);
  const ahora = new Date();
  const oid = () => new ObjectId();

  const NOMBRES_EMPRESAS = ["Industrias Demo S.A.", "Logística Demo S.A."];
  const IDS_DISPOSITIVOS = ["DEMO-DEV-001", "DEMO-DEV-002", "DEMO-DEV-003", "DEMO-DEV-004", "DEMO-DEV-005"];

  // --------------------------------------------------------------------------
  // Limpieza / verificación de datos demo previos
  // --------------------------------------------------------------------------
  const empresasPrevias = conn.empresas.find({ nombre: { $in: NOMBRES_EMPRESAS } }).toArray();

  if (empresasPrevias.length > 0) {
    if (!LIMPIAR) {
      print("Ya existen datos demo. Pon LIMPIAR = true para reemplazarlos. No se insertó nada.");
      return;
    }
    const idsEmpresas = empresasPrevias.map(e => e._id);
    print("Borrando datos demo anteriores...");
    conn.monitoreos.deleteMany({ "meta.dispositivo_id": { $in: IDS_DISPOSITIVOS } });
    conn.polipastos.deleteMany({ "ubicacion.empresa_id": { $in: idsEmpresas } });
    conn.dispositivos.deleteMany({ _id: { $in: IDS_DISPOSITIVOS } });
    conn.empresas.deleteMany({ _id: { $in: idsEmpresas } });
  }

  // --------------------------------------------------------------------------
  // 1. Empresas (con sucursales > áreas > naves embebidas)
  // --------------------------------------------------------------------------
  const emp1 = oid(), emp2 = oid();

  // Sucursales / áreas / naves de la empresa 1
  const s1_z12 = oid(), s1_esc = oid();
  const a1_central = oid(), a1_terminado = oid(), a1_esc_b1 = oid();
  const n1_A = oid(), n1_B = oid(), n1_1 = oid(), n1_esc_A = oid();

  // Sucursal / áreas / naves de la empresa 2
  const s2_mixco = oid();
  const a2_norte = oid();
  const n2_1 = oid(), n2_2 = oid();

  conn.empresas.insertMany([
    {
      _id: emp1,
      nombre: NOMBRES_EMPRESAS[0],
      activa: true,
      creado_en: ahora,
      sucursales: [
        {
          _id: s1_z12,
          nombre: "Planta Zona 12",
          ubicacion: {
            direccion: "Calzada Aguilar Batres 12-34, Zona 12",
            ciudad: "Guatemala",
            pais: "GT",
            coordenadas: { type: "Point", coordinates: [Double(-90.5328), Double(14.5896)] }
          },
          areas: [
            {
              _id: a1_central,
              nombre: "Bodega Central",
              naves: [
                { _id: n1_A, nombre: "Nave A", descripcion: "Recepción de materia prima" },
                { _id: n1_B, nombre: "Nave B", descripcion: "Almacenamiento" }
              ]
            },
            {
              _id: a1_terminado,
              nombre: "Bodega Producto Terminado",
              naves: [
                { _id: n1_1, nombre: "Nave 1", descripcion: "Despacho" }
              ]
            }
          ]
        },
        {
          _id: s1_esc,
          nombre: "Planta Escuintla",
          ubicacion: {
            direccion: "Km 62 Carretera al Pacífico",
            ciudad: "Escuintla",
            pais: "GT",
            coordenadas: { type: "Point", coordinates: [Double(-90.7861), Double(14.3050)] }
          },
          areas: [
            {
              _id: a1_esc_b1,
              nombre: "Bodega 1",
              naves: [
                { _id: n1_esc_A, nombre: "Nave A", descripcion: "Producción" }
              ]
            }
          ]
        }
      ]
    },
    {
      _id: emp2,
      nombre: NOMBRES_EMPRESAS[1],
      activa: true,
      creado_en: ahora,
      sucursales: [
        {
          _id: s2_mixco,
          nombre: "Centro de Distribución Mixco",
          ubicacion: {
            direccion: "Boulevard Landívar 8-20, Mixco",
            ciudad: "Mixco",
            pais: "GT",
            coordenadas: { type: "Point", coordinates: [Double(-90.6063), Double(14.6349)] }
          },
          areas: [
            {
              _id: a2_norte,
              nombre: "Bodega Norte",
              naves: [
                { _id: n2_1, nombre: "Nave 1", descripcion: "Carga y descarga" },
                { _id: n2_2, nombre: "Nave 2", descripcion: "Contenedores" }
              ]
            }
          ]
        }
      ]
    }
  ]);
  print("+ 2 empresas");

  // --------------------------------------------------------------------------
  // 2. Dispositivos (el _id es el identificador que envía el equipo)
  // --------------------------------------------------------------------------
  const canales = [
    { id: NumberInt(1), descripcion: "Carga del gancho",        entrada: "AI0", unidad: "kg" },
    { id: NumberInt(2), descripcion: "Corriente del motor",     entrada: "AI1", unidad: "A"  },
    { id: NumberInt(3), descripcion: "Temperatura del motor",   entrada: "AI2", unidad: "°C" },
    { id: NumberInt(4), descripcion: "Posición del gancho",     entrada: "AI3", unidad: "m"  }
  ];

  const minutosAtras = (m) => new Date(ahora.getTime() - m * 60000);

  conn.dispositivos.insertMany([
    { _id: IDS_DISPOSITIVOS[0], nombre: "Sensor Polipasto 1", estado: "online",
      ultima_conexion: ahora, firmware: "1.2.0", empresa_id: emp1, canales },
    { _id: IDS_DISPOSITIVOS[1], nombre: "Sensor Polipasto 2", estado: "online",
      ultima_conexion: ahora, firmware: "1.2.0", empresa_id: emp1, canales },
    { _id: IDS_DISPOSITIVOS[2], nombre: "Sensor Polipasto 3", estado: "offline",
      ultima_conexion: minutosAtras(180), firmware: "1.1.4", empresa_id: emp1, canales },
    { _id: IDS_DISPOSITIVOS[3], nombre: "Sensor Polipasto 4", estado: "online",
      ultima_conexion: ahora, firmware: "1.2.0", empresa_id: emp2, canales },
    // Dispositivo sin asignar a ningún polipasto (útil para probar ese caso)
    { _id: IDS_DISPOSITIVOS[4], nombre: "Sensor en bodega (sin asignar)", estado: "mantenimiento",
      ultima_conexion: minutosAtras(60 * 24 * 3), firmware: "1.1.4", empresa_id: emp2, canales }
  ]);
  print("+ 5 dispositivos");

  // --------------------------------------------------------------------------
  // 3. Polipastos
  // --------------------------------------------------------------------------
  const pol = [oid(), oid(), oid(), oid(), oid()];

  const polipastos = [
    { _id: pol[0], alias: "Polipasto Nave A - 1", marca: "Demag", no_serie: "DM-100234",
      no_fabrica: "F-2019-0457", factor_trabajo: 0.40, capacidad_nominal: 5000, capacidad_carga: 4500,
      ubicacion: { empresa_id: emp1, sucursal_id: s1_z12, area_id: a1_central, nave_id: n1_A },
      dispositivo_id: IDS_DISPOSITIVOS[0], activo: true },
    { _id: pol[1], alias: "Polipasto Nave B - 1", marca: "Konecranes", no_serie: "KC-558812",
      no_fabrica: "F-2020-1180", factor_trabajo: 0.25, capacidad_nominal: 3200, capacidad_carga: 3000,
      ubicacion: { empresa_id: emp1, sucursal_id: s1_z12, area_id: a1_central, nave_id: n1_B },
      dispositivo_id: IDS_DISPOSITIVOS[1], activo: true },
    { _id: pol[2], alias: "Polipasto Despacho", marca: "Yale", no_serie: "YL-77421",
      no_fabrica: "F-2018-0932", factor_trabajo: 0.60, capacidad_nominal: 2000, capacidad_carga: 1800,
      ubicacion: { empresa_id: emp1, sucursal_id: s1_z12, area_id: a1_terminado, nave_id: n1_1 },
      dispositivo_id: IDS_DISPOSITIVOS[2], activo: true },
    { _id: pol[3], alias: "Polipasto Bodega Norte - 1", marca: "Demag", no_serie: "DM-100871",
      no_fabrica: "F-2021-0214", factor_trabajo: 0.60, capacidad_nominal: 10000, capacidad_carga: 9500,
      ubicacion: { empresa_id: emp2, sucursal_id: s2_mixco, area_id: a2_norte, nave_id: n2_1 },
      dispositivo_id: IDS_DISPOSITIVOS[3], activo: true },
    // Polipasto sin dispositivo asignado
    { _id: pol[4], alias: "Polipasto Contenedores", marca: "Street Crane", no_serie: "SC-30915",
      no_fabrica: "F-2022-0678", factor_trabajo: 0.50, capacidad_nominal: 8000, capacidad_carga: 7500,
      ubicacion: { empresa_id: emp2, sucursal_id: s2_mixco, area_id: a2_norte, nave_id: n2_2 },
      dispositivo_id: null, activo: true }
  ];

  conn.polipastos.insertMany(polipastos);
  print("+ 5 polipastos");

  // --------------------------------------------------------------------------
  // 4. Monitoreos (serie de tiempo, una lectura cada 100 ms)
  //    Simula ciclos de 60 s: reposo, subida de carga, carga sostenida, bajada.
  // --------------------------------------------------------------------------
  const redondear = (x) => Math.round(x * 100) / 100;
  const ruido = (amp) => (Math.random() - 0.5) * 2 * amp;

  // Perfil 0..1 dentro de un ciclo de 60 s
  function perfilCiclo(segundos) {
    const c = segundos % 60;
    if (c < 10) return 0;                 // reposo
    if (c < 20) return (c - 10) / 10;     // subida
    if (c < 40) return 1;                 // carga sostenida
    if (c < 50) return 1 - (c - 40) / 10; // bajada
    return 0;                             // reposo
  }

  function insertarMonitoreos(dispositivoId, polipasto, minutosFin) {
    const intervaloMs = 100;
    const total = MINUTOS_MONITOREO * 60 * (1000 / intervaloMs);
    const fin = ahora.getTime() - minutosFin * 60000;
    const meta = { dispositivo_id: dispositivoId, polipasto_id: polipasto._id };
    const cargaMax = polipasto.capacidad_carga * 0.7;   // trabaja al 70 % de la carga

    let lote = [];
    let insertados = 0;

    for (let i = total - 1; i >= 0; i--) {          // del más antiguo al más reciente
      const t = fin - i * intervaloMs;
      const segundos = (total - 1 - i) * intervaloMs / 1000;
      const p = perfilCiclo(segundos);
      const progreso = (total - 1 - i) / total;

      const carga = p * cargaMax + (p > 0 ? ruido(cargaMax * 0.01) : ruido(2));
      const corriente = 3 + p * 15 + ruido(0.3);
      const temperatura = 38 + progreso * 12 + p * 8 + ruido(0.2);
      const posicion = p * 6 + ruido(0.02);

      const fecha = new Date(t);
      lote.push({
        fecha_monitoreo: fecha,
        fecha_carga: new Date(t + 50),
        meta: meta,
        mediciones: [
          { canal: NumberInt(1), valor: redondear(Math.max(carga, 0)) },
          { canal: NumberInt(2), valor: redondear(Math.max(corriente, 0)) },
          { canal: NumberInt(3), valor: redondear(temperatura) },
          { canal: NumberInt(4), valor: redondear(Math.max(posicion, 0)) }
        ]
      });

      if (lote.length === 1000) {
        conn.monitoreos.insertMany(lote, { ordered: false });
        insertados += lote.length;
        lote = [];
      }
    }
    if (lote.length > 0) {
      conn.monitoreos.insertMany(lote, { ordered: false });
      insertados += lote.length;
    }
    print(`+ ${insertados} monitoreos para ${dispositivoId} (${polipasto.alias})`);
  }

  // Solo los polipastos con dispositivo asignado generan lecturas.
  // El dispositivo "offline" termina de reportar hace 3 horas.
  insertarMonitoreos(IDS_DISPOSITIVOS[0], polipastos[0], 0);
  insertarMonitoreos(IDS_DISPOSITIVOS[1], polipastos[1], 0);
  insertarMonitoreos(IDS_DISPOSITIVOS[2], polipastos[2], 180);
  insertarMonitoreos(IDS_DISPOSITIVOS[3], polipastos[3], 0);

  print("\nListo. Conteos en " + dbName + ":");
  printjson({
    empresas: conn.empresas.countDocuments({}),
    dispositivos: conn.dispositivos.countDocuments({}),
    polipastos: conn.polipastos.countDocuments({}),
    monitoreos: conn.monitoreos.countDocuments({})
  });
})();
