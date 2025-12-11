@echo off
REM Qwen3 OpenVINO 一键部署
REM 自动下载、转换、运行，无需任何选择

title Qwen3 OpenVINO 自动部署

echo ========================================
echo   Qwen3 OpenVINO 一键部署
echo ========================================
echo.
echo 配置:
echo   - 模型: Qwen2.5-7B-Instruct
echo   - 量化: INT4 (Group Size: 128, Ratio: 0.8)
echo   - 设备: GPU (自动回退到 NPU/CPU)
echo   - 完全自动化，无需手动选择
echo.
echo ========================================
echo.

echo 开始部署...
echo.

python deploy_qwen3_openvino_auto.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   部署成功！
    echo ========================================
    echo.
) else (
    echo.
    echo ========================================
    echo   部署失败
    echo ========================================
    echo.
    echo 请检查:
    echo 1. Python 是否已安装
    echo 2. 网络连接是否正常
    echo 3. 磁盘空间是否足够
    echo.
)

pause
