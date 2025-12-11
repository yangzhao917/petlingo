@echo off
REM 从 Ollama 官方库下载 Qwen 模型
echo ========================================
echo 下载 Qwen 模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 设置模型源为 Ollama 官方库...
set OLLAMA_MODEL_SOURCE=ollama

echo.
echo 可选的 Qwen 模型:
echo 1. qwen2.5:7b (推荐，约 4.7GB)
echo 2. qwen2.5:3b (较小，约 2GB)
echo 3. qwen2.5:14b (较大，约 9GB)
echo 4. qwen2.5:32b (最大，约 20GB)
echo.

set /p model_choice="请选择模型 (1-4，默认 1): "

if "%model_choice%"=="" set model_choice=1
if "%model_choice%"=="1" set model_name=qwen2.5:7b
if "%model_choice%"=="2" set model_name=qwen2.5:3b
if "%model_choice%"=="3" set model_name=qwen2.5:14b
if "%model_choice%"=="4" set model_name=qwen2.5:32b

echo.
echo 正在下载模型: %model_name%
echo 这可能需要几分钟时间...
echo.

ollama.exe pull %model_name%

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo ✓ 模型下载完成！
    echo.
    echo 下一步: 运行 3_run_qwen_model.bat 来使用模型
) else (
    echo ✗ 下载失败
    echo 请确保 Ollama 服务正在运行
    echo 运行 1_start_intel_ollama_server.bat 启动服务
)
echo ========================================
echo.
pause
