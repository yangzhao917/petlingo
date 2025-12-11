@echo off
REM Ollama 模型量化工具
echo ========================================
echo Ollama 模型量化工具
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

echo 此脚本用于创建自定义量化的 Qwen 模型
echo.
echo 量化选项:
echo - Q4_0: 4-bit 量化 (最小，速度快)
echo - Q4_K_M: 4-bit 量化 (推荐，平衡)
echo - Q5_K_M: 5-bit 量化 (较好质量)
echo - Q8_0: 8-bit 量化 (高质量)
echo.

echo ========================================
echo 方法 1: 从已下载的模型创建量化版本
echo ========================================
echo.

echo 查看已安装的模型:
ollama.exe list
echo.

set /p base_model="输入基础模型名称 (例如 qwen2.5-moe:7b): "

if "%base_model%"=="" (
    echo 错误: 未输入模型名称
    pause
    exit /b 1
)

echo.
echo 选择量化级别:
echo 1. Q4_0 (最小)
echo 2. Q4_K_M (推荐)
echo 3. Q5_K_M (较好)
echo 4. Q8_0 (高质量)
echo.

set /p quant_choice="请选择 (1-4，默认 2): "

if "%quant_choice%"=="" set quant_choice=2
if "%quant_choice%"=="1" set quant_type=Q4_0
if "%quant_choice%"=="2" set quant_type=Q4_K_M
if "%quant_choice%"=="3" set quant_type=Q5_K_M
if "%quant_choice%"=="4" set quant_type=Q8_0

set /p new_model_name="输入新模型名称 (例如 qwen2.5-moe:%quant_type%): "

if "%new_model_name%"=="" (
    echo 错误: 未输入新模型名称
    pause
    exit /b 1
)

echo.
echo ========================================
echo 创建 Modelfile
echo ========================================
echo.

REM 创建 Modelfile
echo FROM %base_model% > Modelfile.tmp
echo.
echo ✓ Modelfile 已创建

echo.
echo ========================================
echo 创建量化模型
echo ========================================
echo.

echo 正在创建模型: %new_model_name%
echo 基于: %base_model%
echo 量化: %quant_type%
echo.

ollama.exe create %new_model_name% -f Modelfile.tmp -q %quant_type%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ 量化模型创建成功！
    echo.
    echo 新模型: %new_model_name%
    echo.
    echo 查看所有模型:
    ollama.exe list
    echo.
    echo 运行新模型:
    echo   ollama.exe run %new_model_name%
    echo.
) else (
    echo.
    echo ✗ 创建失败
    echo.
)

del Modelfile.tmp 2>nul

echo.
echo ========================================
echo 方法 2: 从 HuggingFace 导入并量化
echo ========================================
echo.
echo 如果要从 HuggingFace 导入原始模型并量化:
echo.
echo 1. 创建 Modelfile，内容如下:
echo    FROM hf.co/Qwen/Qwen2.5-7B-Instruct-GGUF:Q4_K_M
echo.
echo 2. 运行: ollama.exe create my-qwen -f Modelfile
echo.
echo 3. 运行模型: ollama.exe run my-qwen
echo.

pause
