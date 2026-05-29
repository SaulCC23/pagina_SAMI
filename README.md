<div align="center">
  <img width="140" height="215" alt="merida" src="https://github.com/user-attachments/assets/f9ba7133-9e3f-4a42-a2fc-c57ea11a581d" />
</div>

<h1 align="center"> SAMI – Sistema Autonomo de Monitoreo Inteligente</h1>

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

##  Descripción general

**SAMI (Sistema Autonomo de Monitoreo Inteligente)** es una plataforma web que recopila datos de participación estudiantil en ferias educativas.  
Conecta con un **Raspberry Pi** equipado con cámara e IA básica para clasificar asistentes (masculino/femenino) y descartar mayores de edad.

Los datos son enviados automáticamente al sistema web, almacenados en **MySQL** y visualizados mediante un **Dashboard profesional** con tablas y gráficas dinámicas.

>  _Su propósito es apoyar la evaluación del impacto de eventos educativos a nivel medio superior._

---

##  Funcionalidades principales

-  **Panel de control dinámico** con gráficas y estadísticas de participación.
-  **Gestión de eventos:** nombre, fecha, ubicación y descripción.
-  **Conteo automático** de participantes (total, hombres, mujeres).
-  **Conexión directa a MySQL** mediante API REST.
-  **Diseño profesional y responsivo**.

---

##  Estructura del proyecto

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
```

##  Instalación y ejecución

### 1. Clona el proyecto

```bash
git clone https://github.com/SaulCC23/pagina_SAMI.git
cd pagina_SAMI
```

### 2. Configura el backend

```bash
cd backend
npm install
node server.js
```

> **Nota:** El servidor correrá en el puerto 5001.

### 3. Configura la Base de Datos

Asegúrate de tener XAMPP corriendo con MySQL.

Ejecuta el siguiente script SQL para crear la base de datos `sami`:

```sql
CREATE DATABASE sami;
USE sami;

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME,
  ubicacion VARCHAR(100),
  descripcion TEXT,
  estado ENUM('activo', 'cancelado') DEFAULT 'activo'
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

### 4. Inicia el frontend

Abre una **nueva terminal** (manteniendo el backend corriendo) y ejecuta:

```bash
cd frontend
npm install
npm start
```

##  Tecnologías clave

| Tipo                 | Tecnología        | Uso principal                            |
| -------------------- | ----------------- | ---------------------------------------- |
|  **Frontend**      | React + CSS       | Interfaz visual y componentes            |
|  **Backend**       | Node.js + Express | API REST y conexión a MySQL              |
|  **Base de datos** | MySQL             | Almacenamiento de eventos y estadísticas |
|  **Visualización** | Recharts          | Gráficas dinámicas y reportes            |
|  **Comunicación**  | Axios             | Peticiones HTTP entre cliente y servidor |

---

##  Contribución

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit
4. Envía un Pull Request

---

##  Licencia y créditos

Proyecto académico desarrollado para el **Instituto Tecnológico de Mérida (ITM)**   
Todos los derechos reservados © 2025.

<div align="center">
  <br>
   Desarrollado por estudiantes del ITM <br>
   Hecho con React, Node.js y MySQL <br>
</div>
