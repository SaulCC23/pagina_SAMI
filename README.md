<div align="center">
  <img src="../frontend/assets/ITM.png" alt="Logo ITM" width="140"/>
</div>

<h1 align="center">🌌 SAMI – Sistema de Análisis y Monitoreo de Impacto</h1>

<p align="center">
  <em>Plataforma web para recopilar, analizar y visualizar la participación estudiantil en ferias educativas</em>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node Badge"/>
  <img src="https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge"/>
  <img src="https://img.shields.io/badge/Database-MySQL-00618A?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Badge"/>
  <img src="https://img.shields.io/badge/Charts-Recharts-7C3AED?style=for-the-badge&logo=recharts&logoColor=white" alt="Recharts Badge"/>
</p>

---

## 🚀 Descripción general

**SAMI (Sistema de Análisis y Monitoreo de Impacto)** es una plataforma web que recopila datos de participación estudiantil en ferias educativas.  
Conecta con un **Raspberry Pi** equipado con cámara e IA básica para clasificar asistentes (masculino/femenino) y descartar mayores de edad.  

Los datos son enviados automáticamente al sistema web, almacenados en **MySQL** y visualizados mediante un **Dashboard profesional** con tablas y gráficas dinámicas.

> 💡 *Su propósito es apoyar la evaluación del impacto de eventos educativos a nivel medio superior.*

---

## 🧠 Funcionalidades principales

- 📊 **Panel de control dinámico** con gráficas y estadísticas de participación.  
- 🧾 **Gestión de eventos:** nombre, fecha, ubicación y descripción.  
- 👥 **Conteo automático** de participantes (total, hombres, mujeres).  
- 💾 **Conexión directa a MySQL** mediante API REST.  
- 🖥️ **Diseño profesional y responsivo** (sin Tailwind, con CSS puro).  

---

## 🧩 Estructura del proyecto

```
pagina_SAMI/
├── backend/
│   └── server.js              # API REST con Node.js + Express + MySQL
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Componentes visuales del dashboard
│   │   ├── services/          # Conexión Axios al backend
│   │   ├── styles/            # Estilos CSS personalizados
│   │   └── index.jsx          # Página principal
│   └── assets/
│       └── ITM.png            # Logotipo del ITM
│
└── README.md
⚙️ Instalación y ejecución
🧩 Clona el proyecto
bash
Copiar código
git clone https://github.com/SaulCC23/pagina_SAMI.git
cd pagina_SAMI
⚙️ Configura el backend
bash
Copiar código
cd backend
npm install
node server.js
🗄️ Asegúrate de tener XAMPP corriendo con MySQL y la base de datos sami creada.

💻 Inicia el frontend
bash
Copiar código
cd ../frontend
npm install
npm start
Accede en: 👉 http://localhost:3000

🗃️ Estructura de la base de datos (MySQL)
sql
Copiar código
CREATE DATABASE sami;

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  ubicacion VARCHAR(100),
  descripcion TEXT
);

CREATE TABLE estadisticas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  total_participantes INT DEFAULT 0,
  hombres INT DEFAULT 0,
  mujeres INT DEFAULT 0,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);


```

🧩 Tecnologías clave
Tipo	Tecnología	Uso principal
🖥️ Frontend	React + CSS	Interfaz visual y componentes
⚙️ Backend	Node.js + Express	API REST y conexión a MySQL
🗄️ Base de datos	MySQL	Almacenamiento de eventos y estadísticas
📈 Visualización	Recharts	Gráficas dinámicas y reportes
🔌 Comunicación	Axios	Peticiones HTTP entre cliente y servidor

🤝 Contribución
Haz un fork del repositorio

Crea una rama:

bash
Copiar código
git checkout -b feature/nueva-funcionalidad
Realiza tus cambios y haz commit

Envía un Pull Request

🧾 Licencia y créditos
Proyecto académico desarrollado para el
Instituto Tecnológico de Morelia (ITM) 🏫
Todos los derechos reservados © 2025.

<div align="center">
💡 Desarrollado por estudiantes del ITM
💻 Hecho con React, Node.js y MySQL
🌑 Versión Dark UI — Proyecto SAMI 2025

</div> ```
