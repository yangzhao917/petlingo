# Qwen3-8B OpenVINO NPU 部署步骤

## 📋 完整流程

### 步骤 1: 安装依赖

```cmd
pip install optimum-intel openvino-genai transformers torch
```

### 步骤 2: 导出并量化模型（INT4）

**这一步会自动下载 Qwen3-8B 模型并转换为 OpenVINO 格式**

```cmd
optimum-cli export openvino --model Qwen/Qwen3-8B --task text-generation-with-past --weight-format int4 --group-size 128 --ratio 0.8 Qwen3-8B-int4-ov
```

**参数说明**:
- `--model Qwen/Qwen3-8B`: 从 HuggingFace 下载 Qwen3-8B
- `--task text-generation-with-past`: 文本生成任务
- `--weight-format int4`: INT4 量化
- `--group-size 128`: 量化组大小
- `--ratio 0.8`: 80% 层使用 INT4，20% 使用 INT8
- `Qwen3-8B-int4-ov`: 输出目录

**预计时间**: 30-60 分钟（取决于网速和硬件）

### 步骤 3: 运行模型（NPU）

创建 `run_qwen3_npu.py`:

```python
import openvino_genai as ov_genai

# 使用 NPU
pipe = ov_genai.LLMPipeline("Qwen3-8B-int4-ov", "NPU")

# 测试
print(pipe.generate("What is artificial intelligence?", max_new_tokens=200))
```

运行:
```cmd
python run_qwen3_npu.py
```

---

## 🔧 其他量化选项

### INT8 量化（更高质量）

```cmd
optimum-cli export openvino --model Qwen/Qwen3-8B --task text-generation-with-past --weight-format int8 Qwen3-8B-int8-ov
```

### FP16（最高质量，最大）

```cmd
optimum-cli export openvino --model Qwen/Qwen3-8B --task text-generation-with-past --weight-format fp16 Qwen3-8B-fp16-ov
```

---

## 🎯 设备选项

```python
# NPU（推荐，Intel Arc NPU）
pipe = ov_genai.LLMPipeline("Qwen3-8B-int4-ov", "NPU")

# GPU（Intel Arc GPU）
pipe = ov_genai.LLMPipeline("Qwen3-8B-int4-ov", "GPU")

# CPU（备用）
pipe = ov_genai.LLMPipeline("Qwen3-8B-int4-ov", "CPU")

# 混合（NPU + GPU + CPU）
pipe = ov_genai.LLMPipeline("Qwen3-8B-int4-ov", "MULTI:NPU,GPU,CPU")
```

---

## 📊 预期结果

### 模型大小
- **INT4**: ~4-5 GB
- **INT8**: ~8-9 GB  
- **FP16**: ~16-17 GB

### 性能（Intel Arc 140V）
- **NPU**: 最快，最省电
- **GPU**: 快，显存占用高
- **CPU**: 较慢

---

## 🚀 一键运行脚本

创建 `deploy_qwen3_npu.bat`:

```bat
@echo off
echo 步骤 1: 安装依赖
pip install optimum-intel openvino-genai transformers torch

echo.
echo 步骤 2: 导出并量化模型（INT4）
echo 这将需要 30-60 分钟...
optimum-cli export openvino --model Qwen/Qwen3-8B --task text-generation-with-past --weight-format int4 --group-size 128 --ratio 0.8 Qwen3-8B-int4-ov

echo.
echo 步骤 3: 测试模型
python -c "import openvino_genai as ov_genai; pipe = ov_genai.LLMPipeline('Qwen3-8B-int4-ov', 'NPU'); print(pipe.generate('Hello!', max_new_tokens=50))"

pause
```

---

## 📝 注意事项

1. **首次运行需要下载模型**（约 16GB）
2. **量化过程需要时间**（30-60 分钟）
3. **确保有足够磁盘空间**（至少 30GB）
4. **NPU 需要最新驱动**

---

## 🔗 参考文档

- [Intel 官方文档](https://newsroom.intel.com/zh-cn/人工智能/英特尔第一时间深度优化qwen3大模型升级ai-pc能力赋能)
- [OpenVINO NPU 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai/inference-with-genai-on-npu.html)
