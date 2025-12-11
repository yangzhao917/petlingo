@echo off
REM Qwen3 MoE 一键启动脚本
title Qwen3 MoE 部署工具

:menu
cls
echo ========================================
echo    Qwen3 MoE 模型部署工具
echo ========================================
echo.
echo 硬件: Intel Arc 140V (16GB)
echo 模型: Qwen3:30b (MoE 架构)
echo 优化: 显存优化 + GPU/CPU 混合推理
echo.
echo ========================================
echo 请选择操作:
echo ========================================
echo.
echo === Ollama 方案 (简单) ===
echo [1] 一键部署 Qwen3:30b Ollama
echo [2] 运行 Qwen3:30b Ollama
echo [3] 查看已安装的模型
echo.
echo === OpenVINO 方案 (高性能) ===
echo [4] 一键部署 Qwen3 OpenVINO (NPU/GPU)
echo [5] 运行 Qwen3 OpenVINO
echo.
echo === 其他 ===
echo [6] 查看部署文档
echo [7] 退出
echo.
echo ========================================

set /p choice="请输入选项 (1-7): "

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto run
if "%choice%"=="3" goto list
if "%choice%"=="4" goto deploy_openvino
if "%choice%"=="5" goto run_openvino
if "%choice%"=="6" goto docs
if "%choice%"=="7" goto end

echo 无效选项，请重新选择
timeout /t 2 >nul
goto menu

:deploy
cls
echo ========================================
echo 开始部署 Qwen3:30b
echo ========================================
echo.
echo 配置:
echo   - 模型: Qwen3:30b (约 18GB)
echo   - 上下文: 8192 tokens
echo   - 显存优化: 已启用
echo   - MoE Experts: CPU
echo   - 主模型: GPU
echo.
echo 按任意键开始部署...
pause >nul

call setup_qwen3_auto.bat

echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:run
cls
echo ========================================
echo 运行 Qwen3:30b 模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"

REM 检查服务是否运行
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Ollama 服务未运行，正在启动...
    start "Intel Ollama Server" cmd /k "start-ollama.bat"
    timeout /t 5 /nobreak >nul
)

echo 配置显存优化...
set OLLAMA_NUM_CTX=8192
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_SET_OT=exps=CPU

echo.
echo 正在启动 Qwen3:30b...
echo 提示: 输入 /bye 退出对话
echo.

ollama.exe run qwen3:30b

echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:list
cls
echo ========================================
echo 已安装的模型
echo ========================================
echo.

cd /d "%~dp0ollama-intel-2.3.0b20250923-win"
ollama.exe list

echo.
echo ========================================
echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:deploy_openvino
cls
echo ========================================
echo 部署 Qwen3 OpenVINO
echo ========================================
echo.
echo 配置:
echo   - 模型: Qwen2.5-7B-Instruct
echo   - 量化: INT4
echo   - 设备: NPU/GPU/CPU (自动选择)
echo   - 完全自动化
echo.
echo 按任意键开始部署...
pause >nul

call 一键部署_Qwen3_OpenVINO.bat

echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:run_openvino
cls
echo ========================================
echo 运行 Qwen3 OpenVINO
echo ========================================
echo.

call 运行_Qwen3_OpenVINO.bat

echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:docs
cls
echo ========================================
echo 文档列表
echo ========================================
echo.
echo 1. 部署完成_README.md - 总览
echo 2. README_Qwen3_部署方案.md - 完整部署指南
echo 3. Intel_Ollama_使用指南.md - Ollama 使用说明
echo 4. README_Intel_Ollama.md - 快速开始
echo.
echo 请使用文本编辑器打开这些文件查看
echo.
echo 按任意键返回主菜单...
pause >nul
goto menu

:end
cls
echo.
echo 感谢使用！
echo.
timeout /t 2 >nul
exit
