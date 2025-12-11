@echo off
REM 运行 Qwen3:30b 模型 - 优化配置

echo ========================================
echo 运行 Qwen3:30b MoE 模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo [配置] 显存优化模式
set OLLAMA_NUM_CTX=8192
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_SET_OT=exps=CPU

echo   - 上下文: 8192 tokens
echo   - MoE Experts: CPU
echo   - 主模型: GPU/NPU
echo.

echo 正在启动 Qwen3:30b...
echo.
echo 提示: 输入 /bye 退出对话
echo ========================================
echo.

ollama.exe run qwen3:30b

pause
