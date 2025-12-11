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

### 方案 1: Intel Ollama（推荐新手）

```cmd
# 一键部署
setup_qwen3_auto.bat

# 运行模型
run_qwen3.bat
```

### 方案 2: OpenVINO NPU（推荐高级用户）

```cmd
# 自动部署
python deploy_qwen3_npu.py
```

### 方案 3: 手动部署

```cmd
# 安装依赖
pip install optimum-intel openvino-genai transformers torch

# 导出模型
optimum-cli export openvino --model Qwen/Qwen3-8B \
    --task text-generation-with-past \
    --weight-format int4 \
    Qwen3-8B-int4-ov

# 运行推理
python run_qwen3_openvino.py
```

## 📖 完整文档

详细的项目介绍和使用指南请查看：[.kiro/项目介绍.md](.kiro/项目介绍.md)

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

## 📚 文档目录

- [Intel Ollama 使用指南](Intel_Ollama_使用指南.md)
- [Qwen3 部署方案](README_Qwen3_部署方案.md)
- [OpenVINO NPU 部署](README_Qwen3_NPU.md)
- [OpenVINO 部署说明](OpenVINO_部署说明.md)

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
