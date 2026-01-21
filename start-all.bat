@echo off
color 0A
title Inicializador SAMI

echo.
echo  ███████╗ █████╗ ███╗   ███╗██╗
echo  ██╔════╝██╔══██╗████╗ ████║██║
echo  ███████╗███████║██╔████╔██║██║
echo  ╚════██║██╔══██║██║╚██╔╝██║██║
echo  ███████║██║  ██║██║ ╚═╝ ██║██║
echo  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
echo.
echo  Sistema Autonomo de Monitoreo Inteligente
echo  ==========================================
echo.

REM Guardar la ruta del script
set ROOT_DIR=%~dp0

REM Verificar si el puerto 5000 (Backend) está en uso
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ADVERTENCIA] El puerto 5000 ya esta en uso
    echo El backend podria estar corriendo
    choice /C SN /M "Deseas detener procesos existentes"
    if errorlevel 2 goto skip_backend
    if errorlevel 1 (
        echo Deteniendo procesos de Node.js...
        taskkill /F /IM node.exe >nul 2>&1
        timeout /t 2 /nobreak >nul
    )
)

:skip_backend
echo [1/3] Iniciando Backend (Puerto 5000)...
cd /d "%ROOT_DIR%backend"
start "SAMI - Backend" cmd /k "color 0B && echo ================================ && echo    BACKEND - Puerto 5000 && echo ================================ && echo. && node server.js"

echo.
echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Scheduler (Auto-cancelacion cada hora)...
cd /d "%ROOT_DIR%backend"
start "SAMI - Scheduler" cmd /k "color 0E && echo ================================ && echo    SCHEDULER - Auto-cancelacion && echo ================================ && echo. && node auto-cancel-scheduler.js"

echo.
echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

REM Verificar si el puerto 5173 (Frontend) está en uso
netstat -ano | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ADVERTENCIA] El puerto 5173 ya esta en uso
    echo El frontend ya esta corriendo. Omitiendo inicio...
    goto abrir_navegador
)

echo [3/3] Iniciando Frontend (React)...
cd /d "%ROOT_DIR%frontend"
start "SAMI - Frontend" cmd /k "color 0A && echo ================================ && echo    FRONTEND - React App && echo ================================ && echo. && npm start"

echo.
echo Esperando 5 segundos a que cargue el frontend...
timeout /t 5 /nobreak >nul

:abrir_navegador
echo.
echo ========================================
echo   SISTEMA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo  [BACKEND]    http://localhost:5000
echo  [FRONTEND]   http://localhost:3000
echo  [SCHEDULER]  Verificando cada hora
echo.

start http://localhost:3000

echo.
echo [OK] Sistema completamente iniciado
timeout /t 2 /nobreak >nul
exit