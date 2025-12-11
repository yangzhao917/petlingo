# Qwen3 Intel AI PC 部署项目

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![OpenVINO](https://img.shields.io/badge/OpenVINO-2025.3-green.svg)](https://docs.openvino.ai/)

在 Intel AI PC（Intel Arc 140V GPU/NPU）上部署和运行 Qwen3 大语言模型的完整解决方案。

## 🎯 核心特性

- ✅ **多种部署方案**: Intel Ollama、OpenVINO NPU、OpenVINO GPU/CPU
- ✅ **硬件加速优化**: 充分利用 Intel Arc GPU 和 NPU 的 AI 加速能力
- ✅ **模型量化支持**: INT4/INT8 量化，大幅降低显存占用
- ✅ **MoE 架构优化**: 针对 Mixture of Experts 模型的显存优化
- ✅ **一键部署脚本**: 自动化安装、配置和运行流程
- ✅ **多模态支持**: 文本生成、视觉理解、语音识别

## 🚀 快速开始

### 前置要求

- **操作系统**: Windows 10/11
- **Python**: 3.8 或更高版本
- **硬件**: Intel Arc GPU 或 Intel Core Ultra 处理器（带 NPU）
- **磁盘空间**: 至少 20GB 可用空间
- **驱动**: 最新的 Intel GPU/NPU 驱动

### 步骤 1: 克隆项目

```cmd
git clone https://github.com/yangzhao917/petlingo.git
cd petlingo
```

### 步骤 2: 安装依赖

```cmd
# 安装 Python 依赖
pip install -r requirements.txt
```

### 步骤 3: 选择部署方案

#### 方案 A: Intel Ollama（推荐新手，最简单）

```cmd
# 一键部署（会自动下载模型）
setup_qwen3_auto.bat

# 运行模型
run_qwen3.bat
```

**特点**: 
- ✅ 无需手动下载模型
- ✅ 自动配置优化参数
- ✅ 5分钟内完成部署

#### 方案 B: OpenVINO NPU（推荐高级用户，最高性能）

```cmd
# 自动部署（会自动下载模型）
python deploy_qwen3_npu.py
```

**特点**:
- ✅ 自动下载和配置模型
- ✅ 充分利用 Intel NPU
- ✅ 最快的推理速度

#### 方案 C: 手动部署（完全控制）

```cmd
# 1. 安装依赖
pip install optimum-intel openvino-genai transformers torch

# 2. 导出模型（会自动从 HuggingFace 下载）
optimum-cli export openvino --model Qwen/Qwen3-8B \
    --task text-generation-with-past \
    --weight-format int4 \
    --group-size 128 \
    Qwen3-8B-int4-ov

# 3. 运行推理
python run_qwen3_openvino.py
```

### 步骤 4: 验证安装

```cmd
# 快速测试
python quick_test_npu.py
```

如果看到模型成功生成文本，说明部署成功！

## 📖 完整文档

- **[完整安装配置指南](SETUP.md)** - 详细的环境配置和故障排除
- **[模型下载指南](MODELS.md)** - 如何获取和管理模型文件
- **[项目详细介绍](.kiro/项目介绍.md)** - 完整的功能说明和使用示例
- **[Intel Ollama 使用指南](Intel_Ollama_使用指南.md)** - Ollama 详细配置
- **[Qwen3 部署方案](README_Qwen3_部署方案.md)** - 多种部署方案对比
- **[OpenVINO NPU 部署](README_Qwen3_NPU.md)** - NPU 专用部署指南

## 🖥️ 硬件要求

- **GPU**: Intel Arc 140V (16GB VRAM)
- **NPU**: Intel AI Boost
- **CPU**: Intel Core Ultra 处理器
- **内存**: 建议 16GB 以上

## 📦 支持的模型

- Qwen3-8B / Qwen3-4B
- Qwen2.5-MoE-7B / 14B / 30B
- Qwen3-VL（视觉语言模型）
- Phi-3.5
- Paraformer（语音识别）

## 📊 性能基准

| 模型 | 量化 | 设备 | 推理速度 | 显存占用 |
|------|------|------|----------|----------|
| Qwen3-8B | INT4 | NPU | ~40 tokens/s | ~4GB |
| Qwen3-8B | INT4 | GPU | ~35 tokens/s | ~5GB |
| Qwen3-4B | INT4 | NPU | ~60 tokens/s | ~3GB |

## ❓ 常见问题

### 模型文件在哪里？

模型文件因为太大（几GB到几十GB）没有包含在仓库中。运行部署脚本时会自动下载。详见 [MODELS.md](MODELS.md)。

### 如何选择部署方案？

- **新手/快速体验**: 使用 Intel Ollama（方案 A）
- **追求性能**: 使用 OpenVINO NPU（方案 B）
- **完全控制**: 手动部署（方案 C）

### NPU 不工作怎么办？

1. 检查设备管理器中是否有"神经处理器"
2. 更新 Intel NPU 驱动
3. 临时使用 GPU 或 CPU 设备

详细故障排除请查看 [SETUP.md](SETUP.md)。

### 显存不足怎么办？

```cmd
# 对于 Ollama
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_NUM_CTX=4096

# 对于 OpenVINO，使用更小的模型
python test_qwen3_4b_npu.py
```

## 🔧 常见问题

### 显存不足？

```cmd
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_NUM_CTX=4096
set OLLAMA_SET_OT=exps=CPU
```

### NPU 不工作？

1. 检查 Intel NPU 驱动
2. 更新到最新驱动版本
3. 尝试使用 GPU 或 AUTO 设备

## 🤝 贡献

欢迎贡献代码、文档或反馈问题！

## 📄 许可证

Apache 2.0 License

## 🔗 相关资源

- [OpenVINO 文档](https://docs.openvino.ai/)
- [Qwen 官方仓库](https://github.com/QwenLM/Qwen)
- [Intel Ollama](https://www.modelscope.cn/models/Intel/ollama)

---

**快速开始**: 运行 `setup_qwen3_auto.bat` 🚀
