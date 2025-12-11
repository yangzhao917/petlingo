@echo off
REM Intel Ollama - Qwen MoE 模型设置和量化
echo ========================================
echo Intel Ollama - Qwen MoE 模型设置
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 当前目录: %CD%
echo.

echo ========================================
echo 步骤 1: 配置环境变量
echo ========================================
echo.

REM 默认从 ModelScope 下载（Intel Ollama 默认行为）
echo ✓ 使用 ModelScope 作为模型源（默认）

REM 设置上下文长度
echo.
set /p ctx_length="设置上下文长度 (默认 8192，按回车使用默认): "
if "%ctx_length%"=="" set ctx_length=8192
set OLLAMA_NUM_CTX=%ctx_length%
echo ✓ 上下文长度设置为: %ctx_length%

REM 节省显存设置
echo.
echo 是否启用显存优化？
echo 1. 是 (OLLAMA_NUM_PARALLEL=1)
echo 2. 否 (默认)
set /p save_vram="请选择 (1/2，默认 2): "
if "%save_vram%"=="1" (
    set OLLAMA_NUM_PARALLEL=1
    echo ✓ 已启用显存优化
) else (
    echo ✓ 使用默认并行设置
)

echo.
echo ========================================
echo 步骤 2: 选择 Qwen MoE 模型
echo ========================================
echo.
echo 可用的 Qwen MoE 模型:
echo.
echo 1. qwen2.5-moe:7b (推荐，MoE 架构，约 4.7GB)
echo 2. qwen2.5-moe:14b (较大，MoE 架构，约 9GB)
echo 3. qwen2.5-moe:57b (最大，MoE 架构，约 35GB)
echo 4. qwen3:30b (新版本，MoE 架构，约 18GB)
echo 5. qwen2.5:7b (标准版本，非 MoE，约 4.7GB)
echo.

set /p model_choice="请选择模型 (1-5，默认 1): "

if "%model_choice%"=="" set model_choice=1
if "%model_choice%"=="1" (
    set model_name=qwen2.5-moe:7b
    set is_moe=1
)
if "%model_choice%"=="2" (
    set model_name=qwen2.5-moe:14b
    set is_moe=1
)
if "%model_choice%"=="3" (
    set model_name=qwen2.5-moe:57b
    set is_moe=1
)
if "%model_choice%"=="4" (
    set model_name=qwen3:30b
    set is_moe=1
)
if "%model_choice%"=="5" (
    set model_name=qwen2.5:7b
    set is_moe=0
)

echo.
echo 选择的模型: %model_name%

REM MoE 模型的额外优化
if "%is_moe%"=="1" (
    echo.
    echo 检测到 MoE 模型，是否将 experts 放到 CPU 以节省显存？
    echo 1. 是 - 所有 experts 在 CPU
    echo 2. 是 - 部分 experts 在 CPU (24-99层)
    echo 3. 否 - 全部在 GPU
    set /p moe_opt="请选择 (1-3，默认 3): "
    
    if "!moe_opt!"=="1" (
        set OLLAMA_SET_OT=exps=CPU
        echo ✓ 所有 experts 将在 CPU 运行
    )
    if "!moe_opt!"=="2" (
        set OLLAMA_SET_OT=(2[4-9]^|[3-9][0-9])\.ffn_.*_exps\.=CPU
        echo ✓ 24-99 层 experts 将在 CPU 运行
    )
    if "!moe_opt!"=="3" (
        echo ✓ 所有层将在 GPU 运行
    )
)

echo.
echo ========================================
echo 步骤 3: 启动 Ollama 服务
echo ========================================
echo.

echo 正在启动 Ollama 服务...
start "Intel Ollama Server" cmd /k "start-ollama.bat"

timeout /t 5 /nobreak >nul

echo ✓ Ollama 服务已启动
echo.

echo ========================================
echo 步骤 4: 下载模型
echo ========================================
echo.

echo 正在从 ModelScope 下载模型: %model_name%
echo 这可能需要几分钟到几十分钟...
echo.

ollama.exe pull %model_name%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ 模型下载完成！
    echo.
    
    echo ========================================
    echo 步骤 5: 查看已安装的模型
    echo ========================================
    echo.
    
    ollama.exe list
    
    echo.
    echo ========================================
    echo 完成！
    echo ========================================
    echo.
    echo 模型已准备就绪，你可以:
    echo 1. 运行 run_qwen_moe.bat 开始对话
    echo 2. 或直接运行: ollama.exe run %model_name%
    echo.
    echo 注意: 删除模型时使用完整 ID，例如:
    echo   ollama.exe rm modelscope.cn/...
    echo.
) else (
    echo.
    echo ✗ 模型下载失败
    echo 请检查网络连接和 Ollama 服务状态
    echo.
)

pause
