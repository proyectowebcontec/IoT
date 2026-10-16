// ============================================================================
// Esquema MongoDB v2 - Plataforma de monitoreo
// Ejecutar con:  mongosh "mongodb://localhost:27017" schema_mongo_v2.js
// Requiere MongoDB 5.0+ (series de tiempo). Recomendado 6.3+.
//
// Convenciones:
//  - Todos los campos en snake_case.
//  - dispositivos._id ES el identificador del equipo (string, el mismo que
//    envía el hardware, antes "IDDispositivo"). Así no hay que traducir ids
//    al insertar monitoreos a 10 por segundo.
//  - El resto de _id son ObjectId.
// ============================================================================

const dbName = "contec_proyectoIoT_db";     // <-- nombre de la BD
const RECREAR = false;              // true = BORRA toda la BD y la crea de nuevo
const RETENCION_DIAS = null;        // ej. 365 para borrar monitoreos > 1 año; null = nunca

const conn = db.getSiblingDB(dbName);

if (RECREAR) {
  print(`! Borrando base de datos ${dbName}`);
  conn.dropDatabase();
}

const existentes = conn.getCollectionNames();

function crearColeccion(nombre, opciones) {
  if (existentes.includes(nombre)) {
    print(`= ${nombre} ya existe, se omite`);
    return;
  }
  conn.createCollection(nombre, opciones);
  print(`+ ${nombre} creada`);
}

const numero = ["double", "int", "long", "decimal"];

// ----------------------------------------------------------------------------
// 1. empresas  (sucursales > áreas > naves EMBEBIDAS)
// ----------------------------------------------------------------------------
crearColeccion("empresas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "activa", "sucursales", "creado_en"],
      properties: {
        nombre: { bsonType: "string", minLength: 1 },
        activa: { bsonType: "bool" },
        creado_en: { bsonType: "date" },
        sucursales: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id", "nombre", "areas"],
            properties: {
              _id: { bsonType: "objectId" },
              nombre: { bsonType: "string" },
              ubicacion: {
                bsonType: "object",
                properties: {
                  direccion: { bsonType: "string" },
                  ciudad: { bsonType: "string" },
                  pais: { bsonType: "string" },
                  coordenadas: {
                    bsonType: "object",
                    required: ["type", "coordinates"],
                    properties: {
                      type: { enum: ["Point"] },
                      coordinates: {            // [longitud, latitud]
                        bsonType: "array", minItems: 2, maxItems: 2,
                        items: { bsonType: "double" }
                      }
                    }
                  }
                }
              },
              areas: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["_id", "nombre", "naves"],
                  properties: {
                    _id: { bsonType: "objectId" },
                    nombre: { bsonType: "string" },
                    naves: {
                      bsonType: "array",
                      items: {
                        bsonType: "object",
                        required: ["_id", "nombre"],
                        properties: {
                          _id: { bsonType: "objectId" },
                          nombre: { bsonType: "string" },
                          descripcion: { bsonType: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

conn.empresas.createIndex({ nombre: 1 }, { unique: true });
conn.empresas.createIndex({ "sucursales._id": 1 });
conn.empresas.createIndex({ "sucursales.ubicacion.coordenadas": "2dsphere" });

// ----------------------------------------------------------------------------
// 2. dispositivos
//    _id = identificador del equipo (string).
//    canales = catálogo de lo que mide el equipo (antes se repetía en CADA
//    medición: IdMedicion, descripcion, entrada). Ahora se define una vez aquí
//    y los monitoreos solo guardan { canal, valor }.
// ----------------------------------------------------------------------------
crearColeccion("dispositivos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "estado", "empresa_id", "canales"],
      properties: {
        _id: { bsonType: "string", minLength: 1 },
        nombre: { bsonType: "string" },
        estado: { enum: ["online", "offline", "mantenimiento"] },
        ultima_conexion: { bsonType: ["date", "null"] },
        firmware: { bsonType: ["string", "null"] },
        empresa_id: { bsonType: "objectId" },
        canales: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["id", "descripcion", "entrada"],
            properties: {
              id: { bsonType: ["int", "long"] },        // = IdMedicion
              descripcion: { bsonType: "string" },
              entrada: { bsonType: "string" },
              unidad: { bsonType: ["string", "null"] }
            }
          }
        }
      }
    }
  }
});

conn.dispositivos.createIndex({ empresa_id: 1, estado: 1 });
conn.dispositivos.createIndex({ ultima_conexion: 1 });

// ----------------------------------------------------------------------------
// 3. polipastos  (la asignación dispositivo <-> polipasto vive aquí)
// ----------------------------------------------------------------------------
crearColeccion("polipastos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "alias", "marca", "no_serie", "no_fabrica", "factor_trabajo",
        "capacidad_nominal", "capacidad_carga", "ubicacion", "activo"
      ],
      properties: {
        alias: { bsonType: "string", minLength: 1 },
        marca: { bsonType: "string" },
        no_serie: { bsonType: "string" },
        no_fabrica: { bsonType: "string" },
        factor_trabajo: { bsonType: numero, minimum: 0 },                    // ej. 20%
        capacidad_nominal: { bsonType: numero, minimum: 0 },       // kg
        capacidad_carga: { bsonType: numero, minimum: 0 },         // kg
        ubicacion: {
          bsonType: "object",
          required: ["empresa_id", "sucursal_id", "area_id", "nave_id"],
          properties: {
            empresa_id: { bsonType: "objectId" },
            sucursal_id: { bsonType: "objectId" },
            area_id: { bsonType: "objectId" },
            nave_id: { bsonType: "objectId" }
          }
        },
        dispositivo_id: { bsonType: ["string", "null"] },          // = dispositivos._id
        activo: { bsonType: "bool" }
      }
    }
  }
});

conn.polipastos.createIndex({ "ubicacion.empresa_id": 1, "ubicacion.nave_id": 1 });
conn.polipastos.createIndex({ "ubicacion.empresa_id": 1, alias: 1 });
// Un dispositivo no puede estar en dos polipastos (ignora null/ausente)
conn.polipastos.createIndex(
  { dispositivo_id: 1 },
  { unique: true, partialFilterExpression: { dispositivo_id: { $type: "string" } } }
);
conn.polipastos.createIndex({ marca: 1, no_serie: 1 }, { unique: true });

// ----------------------------------------------------------------------------
// 4. usuarios
// ----------------------------------------------------------------------------
crearColeccion("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "email", "password_hash", "rol", "empresa_id", "activo"],
      properties: {
        nombre: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        password_hash: { bsonType: "string" },
        rol: { enum: ["admin", "operador", "visor"] },
        empresa_id: { bsonType: "objectId" },
        sucursales_permitidas: { bsonType: "array", items: { bsonType: "objectId" } },
        activo: { bsonType: "bool" },
        ultimo_login: { bsonType: ["date", "null"] }
      }
    }
  }
});

conn.usuarios.createIndex({ email: 1 }, { unique: true });
conn.usuarios.createIndex({ empresa_id: 1, rol: 1 });

// ----------------------------------------------------------------------------
// 5. monitoreos  (serie de tiempo, una lectura cada 100 ms por dispositivo)
//
//    {
//      fecha_monitoreo: Date,                 // timeField (cuándo midió el equipo)
//      fecha_carga: Date,                     // cuándo llegó a la BD
//      meta: { dispositivo_id: "ESP32-X",     // metaField (agrupa los buckets)
//              polipasto_id: ObjectId },      //   polipasto asignado EN ESE MOMENTO
//      mediciones: [ { canal: 1, valor: 12.5 }, { canal: 2, valor: 0 } ]
//    }
//
//    - "canal" referencia dispositivos.canales[].id (descripción y entrada
//      ya no se repiten en cada lectura).
//    - polipasto_id viaja en meta para consultar el historial de un polipasto
//      aunque el dispositivo se mueva después a otro.
//    - Carga estimada: 10 docs/s = 864,000 docs/día por dispositivo. Mongo
//      agrupa hasta 1000 lecturas por bucket (~100 s a este ritmo), por lo que
//      conviene insertar con insertMany en lotes (ej. cada 1-5 s).
//    - Las series de tiempo no admiten índices únicos ni $jsonSchema: valida
//      en la capa Pydantic. El _id lo genera Mongo (reemplaza a IDMonitoreo).
// ----------------------------------------------------------------------------
const opcionesMonitoreos = {
  timeseries: {
    timeField: "fecha_monitoreo",
    metaField: "meta",
    granularity: "seconds"
  }
};
if (RETENCION_DIAS) {
  opcionesMonitoreos.expireAfterSeconds = RETENCION_DIAS * 24 * 60 * 60;
}
crearColeccion("monitoreos", opcionesMonitoreos);

conn.monitoreos.createIndex({ "meta.dispositivo_id": 1, fecha_monitoreo: -1 });
conn.monitoreos.createIndex({ "meta.polipasto_id": 1, fecha_monitoreo: -1 });

// ----------------------------------------------------------------------------
// 6. reglas_alarmas  (estructura mínima; el detalle se definirá después)
// ----------------------------------------------------------------------------
crearColeccion("reglas_alarmas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "empresa_id", "activa"],
      properties: {
        nombre: { bsonType: "string" },
        empresa_id: { bsonType: "objectId" },
        polipasto_ids: { bsonType: "array", items: { bsonType: "objectId" } }, // vacío = toda la empresa
        activa: { bsonType: "bool" }
      }
    }
  },
  validationLevel: "moderate"
});

conn.reglas_alarmas.createIndex({ empresa_id: 1, activa: 1 });
conn.reglas_alarmas.createIndex({ polipasto_ids: 1 });

// ----------------------------------------------------------------------------
// 7. alarmas_log  (histórico con snapshots a propósito)
// ----------------------------------------------------------------------------
crearColeccion("alarmas_log", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fecha", "empresa_id", "polipasto_id", "regla_id", "atendida"],
      properties: {
        fecha: { bsonType: "date" },
        empresa_id: { bsonType: "objectId" },
        polipasto_id: { bsonType: "objectId" },
        dispositivo_id: { bsonType: ["string", "null"] },
        regla_id: { bsonType: "objectId" },
        fecha_monitoreo: { bsonType: ["date", "null"] },   // lectura que la disparó
        // snapshot al momento del disparo
        polipasto_alias: { bsonType: "string" },
        regla_nombre: { bsonType: "string" },
        valor_medido: {},
        atendida: { bsonType: "bool" },
        atendida_por: { bsonType: ["objectId", "null"] },
        atendida_en: { bsonType: ["date", "null"] }
      }
    }
  },
  validationLevel: "moderate"
});

conn.alarmas_log.createIndex({ empresa_id: 1, fecha: -1 });
conn.alarmas_log.createIndex({ polipasto_id: 1, fecha: -1 });
conn.alarmas_log.createIndex({ regla_id: 1, fecha: -1 });
conn.alarmas_log.createIndex({ empresa_id: 1, atendida: 1, fecha: -1 });

print("\nListo. Colecciones en " + dbName + ":");
printjson(conn.getCollectionNames());
