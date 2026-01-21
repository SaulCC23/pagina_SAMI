const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sami",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting:", err);
    process.exit(1);
  }
  
  // Check active events and their times
  db.query("SELECT id, nombre, fecha, hora, estado FROM eventos ORDER BY fecha DESC, hora ASC", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Existing Events:");
      console.table(results);
    }
    db.end();
  });
});
