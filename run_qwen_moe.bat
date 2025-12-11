@echo off
REM 运行 Qwen MoE 模型
echo ========================================
echo 运行 Qwen MoE 模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 查看已安装的模型:
echo.
ollama.exe list
echo.

set /p model_name="请输入要运行的模型名称 (例如 qwen2.5-moe:7b): "

if "%model_name%"=="" (
    echo 错误: 未输入模型名称
    pause
    exit /b 1
)

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
