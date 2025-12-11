@echo off
REM 启动 Intel Ollama 服务器
echo ========================================
echo 启动 Intel Ollama 服务器
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 正在启动 Ollama 服务...
echo 服务将在新窗口中运行
echo 请保持该窗口打开
echo.

start "Intel Ollama Server" cmd /k "start-ollama.bat"

echo.
echo ✓ Ollama 服务已启动！
echo.
echo 下一步:
echo 1. 保持服务窗口打开
echo 2. 运行 2_pull_qwen_model.bat 下载模型
echo 3. 或运行 3_run_qwen_model.bat 运行模型
echo.
pause
