# Qwen3-8B INT4 OpenVINO NPU 部署指南

## 部署状态

✅ **模型已成功下载！**

- 模型路径: `qwen3-8b-int4-cw-ov/`
- 模型大小: 4.72 GB
- 优化目标: Intel NPU (Intel Arc 140V GPU)

## 系统信息

- **GPU**: Intel Arc 140V (16GB)
- **OpenVINO GenAI**: 2025.3.0.0
- **Python**: 3.11

## 已创建的脚本

### 1. `quick_test_npu.py` - 快速测试脚本
最简单的测试脚本，用于验证模型是否能在 NPU 上运行。

```bash
python quick_test_npu.py
```

### 2. `test_qwen3_npu.py` - 完整测试脚本
包含多个测试用例的完整测试脚本。

```bash
python test_qwen3_npu.py
```

### 3. `deploy_qwen3_npu.py` - 交互式部署脚本
包含下载和交互式对话功能的完整部署脚本。

```bash
python deploy_qwen3_npu.py
```

## 使用方法

### 基本使用

```python
import openvino_genai as ov_genai

# 加载模型
model_path = "qwen3-8b-int4-cw-ov"
device = "NPU"  # 使用 Intel NPU
pipe = ov_genai.LLMPipeline(model_path, device)

# 生成文本
prompt = "What is artificial intelligence?"
response = pipe.generate(prompt, max_length=200)
print(response)
```

### 设备选项

- `"NPU"` - Intel Arc NPU (推荐，针对 Intel Arc 优化)
- `"GPU"` - Intel Arc GPU
- `"CPU"` - CPU (备用选项)

### 生成参数

```python
response = pipe.generate(
    prompt="Your question here",
    max_length=200,        # 最大生成长度
    temperature=0.7,       # 温度参数 (可选)
    top_p=0.9,            # Top-p 采样 (可选)
    top_k=50              # Top-k 采样 (可选)
)
```

## 性能优化建议

1. **首次运行**: 首次加载模型时会进行编译，可能需要较长时间
2. **批处理**: 如果需要处理多个请求，考虑批处理以提高效率
3. **缓存**: 模型编译后会缓存，后续运行会更快

## 故障排除

### 如果 NPU 不工作

1. 检查 Intel NPU 驱动是否安装:
   ```bash
   # 在设备管理器中查看 "神经处理器" 或 "Neural Processor"
   ```

2. 尝试使用 GPU 或 CPU:
   ```python
   device = "GPU"  # 或 "CPU"
   ```

3. 更新 OpenVINO:
   ```bash
   pip install --upgrade openvino-genai
   ```

### 常见错误

- **内存不足**: 减少 `max_length` 参数
- **驱动问题**: 更新 Intel Arc 驱动程序
- **版本不兼容**: 确保 OpenVINO >= 2025.2.0

## 模型信息

- **原始模型**: Qwen/Qwen3-8B
- **量化方式**: INT4 对称量化
- **优化工具**: NNCF (Neural Network Compression Framework)
- **许可证**: Apache 2.0

## 参考链接

- [ModelScope 模型页面](https://www.modelscope.cn/models/OpenVINO/Qwen3-8B-int4-cw-ov)
- [HuggingFace 模型页面](https://huggingface.co/OpenVINO/qwen3-8b-int4-cw-ov)
- [OpenVINO GenAI 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai.html)
- [Intel Arc NPU 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai/inference-with-genai-on-npu.html)

## 下一步

模型已准备就绪！你可以:

1. 运行 `python quick_test_npu.py` 进行快速测试
2. 运行 `python test_qwen3_npu.py` 进行完整测试
3. 运行 `python deploy_qwen3_npu.py` 进入交互模式
4. 将模型集成到你自己的应用中

---

**注意**: 首次运行时，OpenVINO 会编译模型以适配你的硬件，这可能需要几分钟时间。编译完成后，后续运行会快得多。
