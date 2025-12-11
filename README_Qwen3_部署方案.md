# Qwen3 MoE 模型部署方案

## 🎯 目标配置

- **模型**: Qwen3:30b (MoE 架构)
- **硬件**: Intel Arc 140V (16GB)
- **优化**: 显存优化 + NPU/GPU/CPU 混合推理

## 📋 两种部署方案

### 方案 1: Intel Ollama (推荐，简单快速) ⭐

**优点**:
- 安装简单，一键部署
- 自动优化 MoE 模型
- 支持 GPU + CPU 混合推理
- 从 ModelScope 快速下载

**缺点**:
- 不直接支持 NPU（但支持 Intel GPU 加速）

**使用方法**:

```cmd
# 一键部署
setup_qwen3_auto.bat

# 运行模型
run_qwen3.bat
```

**配置说明**:
- 上下文长度: 8192 tokens
- 显存优化: 已启用 (OLLAMA_NUM_PARALLEL=1)
- MoE Experts: 在 CPU 运行
- 主模型: 在 GPU 运行
- 模型大小: 约 18GB

---

### 方案 2: OpenVINO + NPU (最优性能，复杂)

**优点**:
- 直接支持 Intel NPU
- 可以 NPU + GPU + CPU 混合推理
- INT4 量化，更小更快

**缺点**:
- 设置复杂
- 需要导出模型
- Qwen3:30b 可能太大，建议先用 7B 测试

**使用方法**:

```cmd
# Python 脚本部署
python setup_qwen3_npu_openvino.py
```

**流程**:
1. 安装 optimum-intel[npu]
2. 使用 optimum-cli 导出模型到 OpenVINO 格式
3. 使用 openvino-genai 在 NPU 上运行

---

## 🚀 快速开始（推荐方案 1）

### 步骤 1: 部署模型

双击运行 `setup_qwen3_auto.bat`

脚本会自动：
- 配置显存优化
- 启动 Ollama 服务
- 下载 Qwen3:30b 模型（约 18GB）
- 配置 MoE 优化

### 步骤 2: 运行模型

双击运行 `run_qwen3.bat`

或在命令行：
```cmd
cd ollama-intel-2.3.0b20250923-win
ollama.exe run qwen3:30b
```

---

## ⚙️ 配置详解

### Ollama 环境变量

```cmd
# 上下文长度
set OLLAMA_NUM_CTX=8192

# 并行请求数（节省显存）
set OLLAMA_NUM_PARALLEL=1

# MoE 优化：Experts 在 CPU
set OLLAMA_SET_OT=exps=CPU
```

### 为什么这样配置？

1. **OLLAMA_NUM_CTX=8192**
   - 8K 上下文足够大多数任务
   - 平衡性能和显存使用

2. **OLLAMA_NUM_PARALLEL=1**
   - 减少并行请求
   - 节省显存，避免 OOM

3. **OLLAMA_SET_OT=exps=CPU**
   - MoE 模型的 experts 在 CPU 运行
   - 主模型在 GPU 运行
   - 大幅节省显存

---

## 🔧 高级配置

### 如果显存仍然不足

```cmd
# 减少上下文
set OLLAMA_NUM_CTX=4096

# 或使用更小的模型
ollama.exe pull qwen2.5-moe:7b
```

### 如果想要更大上下文

```cmd
# 增加到 16K（需要更多显存）
set OLLAMA_NUM_CTX=16384
```

### 切换到 Ollama 官方库

```cmd
# 使用 Ollama 官方库而非 ModelScope
set OLLAMA_MODEL_SOURCE=ollama
ollama.exe pull qwen3:30b
```

---

## 📊 性能对比

| 方案 | 设备 | 速度 | 显存 | 复杂度 |
|------|------|------|------|--------|
| Ollama | GPU + CPU | 快 | 中 | 低 ⭐ |
| OpenVINO | NPU + GPU + CPU | 最快 | 低 | 高 |

---

## 🐛 故障排除

### 问题 1: 显存不足 (OOM)

**解决方案**:
1. 确认已启用 `OLLAMA_NUM_PARALLEL=1`
2. 确认已启用 `OLLAMA_SET_OT=exps=CPU`
3. 减少上下文: `set OLLAMA_NUM_CTX=4096`
4. 使用更小的模型: `qwen2.5-moe:7b`

### 问题 2: 下载速度慢

**解决方案**:
- Intel Ollama 默认使用 ModelScope（国内快）
- 如果仍然慢，考虑使用代理

### 问题 3: NPU 不工作

**解决方案**:
1. 检查 Intel NPU 驱动
2. 更新到最新驱动
3. 使用 OpenVINO 方案而非 Ollama

### 问题 4: 模型加载慢

**正常现象**:
- 首次加载需要编译，约 1-2 分钟
- 后续加载会快很多

---

## 📝 常用命令

```cmd
# 查看已安装的模型
ollama.exe list

# 删除模型（使用完整 ID）
ollama.exe rm modelscope.cn/...

# 查看模型信息
ollama.exe show qwen3:30b

# API 调用
curl http://localhost:11434/api/generate -d "{\"model\":\"qwen3:30b\",\"prompt\":\"你好\"}"
```

---

## 🔗 相关文档

- [Intel Ollama](https://www.modelscope.cn/models/Intel/ollama)
- [OpenVINO NPU 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai/inference-with-genai-on-npu.html)
- [Qwen 模型](https://github.com/QwenLM/Qwen)

---

## 💡 推荐使用流程

1. **首次使用**: 运行 `setup_qwen3_auto.bat`
2. **日常使用**: 运行 `run_qwen3.bat`
3. **如果需要更高性能**: 尝试 OpenVINO NPU 方案

---

**快速开始**: 双击 `setup_qwen3_auto.bat` 🚀
