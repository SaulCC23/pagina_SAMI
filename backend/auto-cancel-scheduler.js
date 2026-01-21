import mysql from "mysql2";
import cron from "node-cron";

// 🔗 Conexión a MySQL (usa los mismos datos que en server.js)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sami",
});

// 🔌 Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    process.exit(1); // Detener el proceso si no puede conectar
  }
  console.log("✅ Scheduler conectado a la base de datos MySQL (sami)");
});

// 🎯 Función principal que auto-cancela eventos
function autoCancelarEventos() {
  const query = `
    UPDATE eventos e
    LEFT JOIN estadisticas s ON e.id = s.evento_id
    SET e.estado = 'cancelado'
    WHERE e.estado = 'activo'
    AND CONCAT(e.fecha, ' ', e.hora) < NOW()
    AND s.id IS NULL
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Error al ejecutar auto-cancelación:", err);
      return;
    }
    
    const timestamp = new Date().toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    if (result.affectedRows > 0) {
      console.log(`🔄 [${timestamp}] ✅ ${result.affectedRows} evento(s) cancelado(s) automáticamente`);
      
      // Opcional: Consultar qué eventos fueron cancelados
      const logQuery = `
        SELECT id, nombre, fecha, hora 
        FROM eventos 
        WHERE estado = 'cancelado' 
        ORDER BY fecha DESC, hora DESC 
        LIMIT ${result.affectedRows}
      `;
      
      db.query(logQuery, (logErr, eventos) => {
        if (!logErr && eventos.length > 0) {
          console.log('   📋 Eventos cancelados:');
          eventos.forEach(e => {
            console.log(`      - ID ${e.id}: "${e.nombre}" (${e.fecha} ${e.hora})`);
          });
        }
      });
    } else {
      console.log(`✅ [${timestamp}] No hay eventos para cancelar`);
    }
  });
}

// ⏰ Programar la tarea para que se ejecute cada minuto

cron.schedule('* * * * *', () => {
  console.log('🔍 Verificando eventos sin estadísticas...');
  autoCancelarEventos();
});

// 🚀 Mensaje de inicio
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║    SAMI - Sistema de Auto-Cancelación Iniciado     ║');
console.log('╚════════════════════════════════════════════════════════╝');
console.log('⏰ Frecuencia: Cada 1 minuto');
console.log('📌 Acción: Cancelar eventos pasados sin estadísticas');
console.log('🔄 Presiona Ctrl+C para detener el proceso\n');

// 🛑 Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n🛑 Deteniendo scheduler...');
  db.end(() => {
    console.log('✅ Conexión a MySQL cerrada');
    console.log('👋 Scheduler detenido correctamente');
    process.exit(0);
  });
});

// 🎯 Ejecutar una vez al inicio (opcional)
console.log('🚀 Ejecutando verificación inicial...\n');
autoCancelarEventos();