import express from "express";
import cors from "cors";
import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 🧠 Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sami",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL (Base de datos: sami)");
  
  // 🔄 AGREGAR CAMPO 'estado' SI NO EXISTE
  const alterTableEstado = `
    ALTER TABLE eventos 
    ADD COLUMN estado ENUM('activo', 'cancelado') DEFAULT 'activo'
  `;
  
  db.query(alterTableEstado, (alterErr) => {
    if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME') {
      console.log("ℹ️ Campo 'estado' ya existe o no se pudo agregar");
    } else {
      console.log("✅ Campo 'estado' verificado/agregado");
    }
  });

  // 🕐 AGREGAR CAMPO 'hora' SI NO EXISTE
  const alterTableHora = `
    ALTER TABLE eventos 
    ADD COLUMN hora TIME AFTER fecha
  `;
  
  db.query(alterTableHora, (alterErr) => {
    if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME') {
      console.log("ℹ️ Campo 'hora' ya existe o no se pudo agregar");
    } else {
      console.log("✅ Campo 'hora' verificado/agregado");
    }
  });
});

/* =========================================================
   📊 ENDPOINTS PRINCIPALES
   ========================================================= */

// 1️⃣ RESUMEN DEL DASHBOARD (EXCLUYE CANCELADOS)
app.get("/api/dashboard/summary", (req, res) => {
  const queryEventos = `
    SELECT 
      COUNT(*) AS totalEventos,
      SUM(CASE WHEN fecha < CURDATE() AND (estado = 'activo' OR estado IS NULL) THEN 1 ELSE 0 END) AS eventosPasados,
      SUM(CASE WHEN fecha >= CURDATE() AND (estado = 'activo' OR estado IS NULL) THEN 1 ELSE 0 END) AS eventosFuturos
    FROM eventos
    WHERE estado != 'cancelado' OR estado IS NULL
  `;

  const queryParticipantes = `
    SELECT 
      SUM(total_participantes) AS total_participantes, 
      SUM(hombres) AS total_hombres, 
      SUM(mujeres) AS total_mujeres 
    FROM estadisticas s
    JOIN eventos e ON e.id = s.evento_id
    WHERE e.estado != 'cancelado' OR e.estado IS NULL
  `;

  db.query(queryEventos, (err1, eventosResult) => {
    if (err1) return res.status(500).json({ error: err1 });

    db.query(queryParticipantes, (err2, participantesResult) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({
        totalEventos: eventosResult[0].totalEventos || 0,
        eventosPasados: eventosResult[0].eventosPasados || 0,
        eventosFuturos: eventosResult[0].eventosFuturos || 0,
        eventos: eventosResult[0].totalEventos || 0,
        participantes: participantesResult[0].total_participantes || 0,
        hombres: participantesResult[0].total_hombres || 0,
        mujeres: participantesResult[0].total_mujeres || 0
      });
    });
  });
});

// 2️⃣ LISTA DE EVENTOS (INCLUYE HORA)
app.get("/api/eventos", (req, res) => {
  const { incluir_cancelados = 'false' } = req.query;
  
  let query = `
    SELECT e.id, e.nombre, e.fecha, e.hora, e.ubicacion, e.descripcion, e.estado,
           s.total_participantes, s.hombres, s.mujeres
    FROM eventos e
    LEFT JOIN estadisticas s ON e.id = s.evento_id
  `;
  
  if (incluir_cancelados === 'false') {
    query += ` WHERE e.estado != 'cancelado' OR e.estado IS NULL`;
  }
  
  query += ` ORDER BY e.fecha DESC, e.hora DESC, e.estado ASC`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 3️⃣ CREAR EVENTO (CON HORA)
app.post("/api/eventos", (req, res) => {
  const { nombre, fecha, hora, ubicacion, descripcion } = req.body;
  
  // Validar que hora esté presente
  if (!hora) {
    return res.status(400).json({ 
      error: "La hora del evento es obligatoria" 
    });
  }
  
  const query = `
    INSERT INTO eventos (nombre, fecha, hora, ubicacion, descripcion, estado) 
    VALUES (?, ?, ?, ?, ?, 'activo')
  `;
  
  db.query(query, [nombre, fecha, hora, ubicacion, descripcion], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ 
      message: "Evento registrado con éxito", 
      id: result.insertId,
      estado: 'activo',
      fecha: fecha,
      hora: hora
    });
  });
});

// 4️⃣ BUSCAR EVENTO POR FECHA Y HORA (PARA DISPOSITIVOS EXTERNOS)
app.get("/api/eventos/buscar", (req, res) => {
  const { fecha, hora } = req.query;
  
  if (!fecha || !hora) {
    return res.status(400).json({ 
      error: "Se requieren los parámetros 'fecha' y 'hora'" 
    });
  }
  
  const query = `
    SELECT id, nombre, fecha, hora, ubicacion, descripcion, estado
    FROM eventos 
    WHERE fecha = ? 
    AND hora = ?
    AND estado = 'activo'
    LIMIT 1
  `;
  
  db.query(query, [fecha, hora], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    
    if (results.length === 0) {
      return res.status(404).json({ 
        error: "No se encontró un evento activo para esa fecha y hora" 
      });
    }
    
    res.json(results[0]);
  });
});

// 5️⃣ OBTENER EVENTOS ACTIVOS DE UNA FECHA ESPECÍFICA
app.get("/api/eventos/fecha/:fecha", (req, res) => {
  const { fecha } = req.params;
  
  const query = `
    SELECT id, nombre, fecha, hora, ubicacion, descripcion, estado
    FROM eventos 
    WHERE fecha = ? 
    AND estado = 'activo'
    ORDER BY hora ASC
  `;
  
  db.query(query, [fecha], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 6️⃣ CANCELAR EVENTO
app.put("/api/eventos/:id/cancelar", (req, res) => {
  const eventId = req.params.id;
  const query = "UPDATE eventos SET estado = 'cancelado' WHERE id = ?";
  
  db.query(query, [eventId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    
    res.json({ 
      message: "Evento cancelado exitosamente",
      evento_id: eventId
    });
  });
});

// 7️⃣ REACTIVAR EVENTO
app.put("/api/eventos/:id/reactivar", (req, res) => {
  const eventId = req.params.id;
  const query = "UPDATE eventos SET estado = 'activo' WHERE id = ?";
  
  db.query(query, [eventId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    
    res.json({ 
      message: "Evento reactivado exitosamente",
      evento_id: eventId
    });
  });
});

// 8️⃣ REGISTRAR/ACTUALIZAR ESTADÍSTICAS
app.post("/api/estadisticas", (req, res) => {
  const { evento_id, total_participantes, hombres, mujeres } = req.body;
  
  // Validar que el evento existe y está activo
  const checkQuery = "SELECT estado FROM eventos WHERE id = ?";
  
  db.query(checkQuery, [evento_id], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).json({ error: checkErr });
    
    if (checkResults.length === 0) {
      return res.status(404).json({ 
        error: "El evento no existe" 
      });
    }
    
    if (checkResults[0].estado === 'cancelado') {
      return res.status(400).json({ 
        error: "No se pueden agregar estadísticas a un evento cancelado" 
      });
    }
    
    // Insertar o actualizar estadísticas
    const query = `
      INSERT INTO estadisticas (evento_id, total_participantes, hombres, mujeres)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        total_participantes=?, 
        hombres=?, 
        mujeres=?
    `;
    
    db.query(
      query,
      [evento_id, total_participantes, hombres, mujeres, total_participantes, hombres, mujeres],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ 
          message: "Estadísticas registradas o actualizadas correctamente",
          evento_id: evento_id
        });
      }
    );
  });
});

// 9️⃣ HISTORIAL DE PARTICIPACIÓN (PARA GRÁFICA)
app.get("/api/dashboard/participation", (req, res) => {
  const query = `
    SELECT e.nombre AS evento, s.total_participantes AS participacion,
           e.fecha, e.hora
    FROM estadisticas s
    JOIN eventos e ON e.id = s.evento_id
    WHERE e.estado != 'cancelado' OR e.estado IS NULL
    ORDER BY e.fecha ASC, e.hora ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔟 ENDPOINTS DE VERIFICACIÓN
app.get("/", (req, res) => {
  res.send("✅ Backend de SAMI conectado correctamente con gestión de eventos por fecha y hora.");
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Servidor SAMI funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// 🔄 FUNCIÓN PARA SINCRONIZAR DATOS DE CÁMARA (JSON)
// 🔄 FUNCIÓN PARA SINCRONIZAR DATOS (POR TIEMPO)
// 🔄 FUNCIÓN PARA SINCRONIZAR DATOS (MULTI-ARCHIVO POR TIEMPO - SECUENCIAL)
const syncCameraData = async () => {
  const dataDir = path.join(__dirname, 'data');
  const logFile = path.join(__dirname, 'debug.txt');
  
  const log = (msg) => {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    try {
      fs.appendFileSync(logFile, line);
    } catch (e) {
      console.error("Error escribiendo log:", e);
    }
  };

  // Helper para convertir db.query a Promesa
  const dbQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };

  if (!fs.existsSync(dataDir)) {
    console.log("⚠️ No se encontró la carpeta data/");
    return;
  }

  // Leer directorio
  let files;
  try {
     files = fs.readdirSync(dataDir);
  } catch (err) {
      log(`❌ Error leyendo directorio data: ${err}`);
      return;
  }

  // Filtrar solo archivos JSON
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
      // No hay archivos, solo retornamos silenciosamente para no llenar el log
      return;
  }

  log(`📂 Procesando ${jsonFiles.length} archivos de cámara...`);

  // PROCESAMIENTO SECUENCIAL (Importante para evitar condiciones de carrera en BD)
  for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      
      try {
        const stats = fs.statSync(filePath);
        const fileTime = stats.mtime; 
        const rawData = fs.readFileSync(filePath, 'utf8');
        
        let cameraData;
        try {
          const parsed = JSON.parse(rawData);
          if (Array.isArray(parsed)) {
             cameraData = parsed.find(item => item && Object.keys(item).length > 0) || {};
          } else {
             cameraData = parsed;
          }
        } catch (parseErr) {
          log(`⚠️ Error parseando JSON en ${file}: ${parseErr.message}`);
          continue;
        }

        if (!cameraData || Object.keys(cameraData).length === 0) {
          log(`⚠️ Archivo ${file} vacío o sin datos válidos.`);
          continue; 
        }

        // Ajustar a zona horaria local
        const offset = fileTime.getTimezoneOffset() * 60000;
        const localDate = new Date(fileTime.getTime() - offset);
        const dateString = localDate.toISOString().split('T')[0];

        // 1. Buscar TODOS los eventos (activos y cancelados)
        const queryEvents = `
          SELECT id, nombre, fecha, hora, estado 
          FROM eventos 
          WHERE fecha = ?
        `;
        
        let eventos;
        try {
            eventos = await dbQuery(queryEvents, [dateString]);
        } catch (err) {
            log(`❌ Error buscando eventos para ${file}: ${err}`);
            continue;
        }

        if (eventos.length === 0) {
          log(`ℹ️ Archivo ${file}: No hay eventos programados el ${dateString} (Local).`);
          continue;
        }

        // 2. Encontrar evento más cercano
        let closestEvent = null;
        let minDiff = Infinity;

        eventos.forEach(evento => {
            const [hours, minutes] = evento.hora.split(':');
            const eventTime = new Date(fileTime);
            eventTime.setHours(parseInt(hours), parseInt(minutes), 0);
            const diff = Math.abs(fileTime - eventTime);
            if (diff < minDiff) {
              minDiff = diff;
              closestEvent = evento;
            }
        });

        if (!closestEvent) {
             log(`❌ Archivo ${file}: No se pudo emparejar con ningún evento.`);
             continue;
        }

        // 3. VERIFICAR SI EL EVENTO GANADOR ESTÁ CANCELADO
        if (closestEvent.estado === 'cancelado') {
           log(`⚠️ Archivo ${file} pertenece al evento CANCELADO "${closestEvent.nombre}" (Hora: ${closestEvent.hora}). Se omitirá.`);
           continue; 
        }

        // 4. VERIFICAR DUPLICADOS (PROTECCION DE SOBRESCRITURA)
        const checkQuery = "SELECT id FROM estadisticas WHERE evento_id = ?";
        let checkRes;
        try {
             checkRes = await dbQuery(checkQuery, [closestEvent.id]);
        } catch (err) {
             log(`❌ Error check duplicados: ${err}`);
             continue;
        }

        if (checkRes.length > 0) {
           log(`🔒 El evento "${closestEvent.nombre}" YA tiene estadísticas. Omitiendo archivo ${file}.`);
           continue;
        }

        // 5. INSERTAR DATOS
        const { total_participantes = 0, hombres = 0, mujeres = 0 } = cameraData;
        const insertQuery = `
            INSERT INTO estadisticas (evento_id, total_participantes, hombres, mujeres)
            VALUES (?, ?, ?, ?)
        `;

        try {
            await dbQuery(insertQuery, [closestEvent.id, total_participantes, hombres, mujeres]);
             log(`✅ Archivo ${file} guardado en BD para "${closestEvent.nombre}": Total=${total_participantes}`);
        } catch (err) {
             log(`❌ Error insertando datos: ${err}`);
        }

      } catch (fileErr) {
        log(`❌ Error procesando archivo ${file}: ${fileErr}`);
      }
  }
};

app.get("/api/camera/sync", (req, res) => {
    syncCameraData();
    res.json({ message: "Sincronización iniciada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST http://localhost:${PORT}/api/eventos (requiere fecha y hora)`);
  console.log(`   GET  http://localhost:${PORT}/api/eventos/buscar?fecha=YYYY-MM-DD&hora=HH:MM:SS`);
  console.log(`   GET  http://localhost:${PORT}/api/eventos/fecha/:fecha`);
  console.log(`   PUT  http://localhost:${PORT}/api/eventos/:id/cancelar`);
  console.log(`   PUT  http://localhost:${PORT}/api/eventos/:id/reactivar`);
  console.log(`   POST http://localhost:${PORT}/api/estadisticas`);
  console.log(`   GET  http://localhost:${PORT}/api/camera/sync (Sincronizar datos JSON)`);
});

// Sincronizar al iniciar el servidor
setTimeout(syncCameraData, 5000);



