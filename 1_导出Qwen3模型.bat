@echo off
echo ========================================
echo Qwen3-8B OpenVINO NF4 导出（NPU 优化）
echo ========================================
echo.
echo 此过程将:
echo 1. 自动从 HuggingFace 下载 Qwen3-8B 模型
echo 2. 转换为 OpenVINO 格式
echo 3. 进行 NF4 量化（针对 NPU 优化）
echo.
echo 预计时间: 30-60 分钟
echo 需要磁盘空间: 约 30GB
echo.
echo 按任意键开始...
pause >nul

echo.
echo 开始导出模型（NF4 量化，NPU 优化）...
echo.

optimum-cli export openvino --model Qwen/Qwen3-8B --task text-generation-with-past --weight-format nf4 --sym --group-size -1 Qwen3-8B-nf4-ov --backup-precision int8_sym

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ 导出完成！
    echo ========================================
    echo.
    echo 模型位置: Qwen3-8B-int4-ov
    echo.
    echo 下一步: 运行 2_运行Qwen3模型.bat
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ 导出失败
    echo ========================================
    echo.
    echo 请检查:
    echo 1. 网络连接
    echo 2. 磁盘空间
    echo 3. 依赖是否安装: pip install optimum-intel openvino-genai
    echo.
)

pause
