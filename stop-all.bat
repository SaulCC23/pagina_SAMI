@echo off
color 0C
echo ========================================
echo   DETENIENDO SISTEMA SAMI
echo ========================================
echo.

echo Cerrando todos los procesos de Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   SISTEMA DETENIDO
echo ========================================
echo.
pause