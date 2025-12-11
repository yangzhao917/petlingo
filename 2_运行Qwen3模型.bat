@echo off
echo ========================================
echo 运行 Qwen3-8B (OpenVINO NPU)
echo ========================================
echo.

if not exist "Qwen3-8B-int4-ov" (
    echo ✗ 模型未找到！
    echo.
    echo 请先运行: 1_导出Qwen3模型.bat
    echo.
    pause
    exit /b 1
)

echo 模型: Qwen3-8B-int4-ov
echo 设备: NPU (Intel Arc NPU)
echo.
echo 正在启动...
echo.

python -c "import openvino_genai as ov_genai; pipe = ov_genai.LLMPipeline('Qwen3-8B-int4-ov', 'NPU'); print('✓ 模型加载成功！'); print('\n测试推理:'); print(pipe.generate('What is artificial intelligence?', max_new_tokens=200))"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo NPU 加载失败，尝试使用 GPU...
    python -c "import openvino_genai as ov_genai; pipe = ov_genai.LLMPipeline('Qwen3-8B-int4-ov', 'GPU'); print('✓ 模型加载到 GPU 成功！'); print('\n测试推理:'); print(pipe.generate('What is artificial intelligence?', max_new_tokens=200))"
)

echo.
pause
