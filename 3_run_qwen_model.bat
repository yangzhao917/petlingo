@echo off
REM 运行 Qwen 模型（交互模式）
echo ========================================
echo 运行 Qwen 模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 设置模型源为 Ollama 官方库...
set OLLAMA_MODEL_SOURCE=ollama

echo.
echo 选择要运行的模型:
echo 1. qwen2.5:7b (推荐)
echo 2. qwen2.5:3b
echo 3. qwen2.5:14b
echo 4. qwen2.5:32b
echo.

set /p model_choice="请选择模型 (1-4，默认 1): "

if "%model_choice%"=="" set model_choice=1
if "%model_choice%"=="1" set model_name=qwen2.5:7b
if "%model_choice%"=="2" set model_name=qwen2.5:3b
if "%model_choice%"=="3" set model_name=qwen2.5:14b
if "%model_choice%"=="4" set model_name=qwen2.5:32b

echo.
echo 正在启动模型: %model_name%
echo 使用 Intel GPU/NPU 加速
echo.
echo 提示: 输入 /bye 退出对话
echo ========================================
echo.

ollama.exe run %model_name%

echo.
pause
