@echo off
REM 自动设置 Qwen3:30b MoE 模型 - 优化配置
REM 默认: 显存优化 + NPU/GPU/CPU 混合推理

echo ========================================
echo Qwen3:30b MoE 自动部署
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo [配置] 启用显存优化...
set OLLAMA_NUM_CTX=8192
set OLLAMA_NUM_PARALLEL=1
echo   - 上下文长度: 8192
echo   - 并行请求: 1 (节省显存)

echo.
echo [配置] MoE 优化 - Experts 在 CPU...
set OLLAMA_SET_OT=exps=CPU
echo   - 所有 MoE experts 将在 CPU 运行
echo   - 主模型在 GPU/NPU 运行

echo.
echo [配置] 模型源: ModelScope (国内)
echo   - 默认从 ModelScope 下载

echo.
echo ========================================
echo 启动 Ollama 服务
echo ========================================
echo.

start "Intel Ollama Server" cmd /k "start-ollama.bat"

echo 等待服务启动...
timeout /t 5 /nobreak >nul

echo ✓ Ollama 服务已启动
echo.

echo ========================================
echo 下载 Qwen3:30b 模型
echo ========================================
echo.
echo 模型: qwen3:30b
echo 大小: 约 18GB
echo 架构: MoE (Mixture of Experts)
echo.
echo 正在下载，请耐心等待...
echo.

ollama.exe pull qwen3:30b

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ 部署完成！
    echo ========================================
    echo.
    echo 已安装的模型:
    ollama.exe list
    echo.
    echo 配置信息:
    echo   - 模型: qwen3:30b
    echo   - 上下文: 8192 tokens
    echo   - 显存优化: 已启用
    echo   - MoE Experts: CPU
    echo   - 主模型: GPU/NPU
    echo.
    echo 运行模型:
    echo   ollama.exe run qwen3:30b
    echo.
    echo 或双击: run_qwen3.bat
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ 下载失败
    echo ========================================
    echo.
    echo 请检查:
    echo 1. 网络连接
    echo 2. Ollama 服务是否正常运行
    echo 3. 磁盘空间是否足够 (需要约 18GB)
    echo.
)

pause
