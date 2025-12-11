# ✅ Qwen3 MoE 部署方案已就绪

## 🎉 恭喜！所有准备工作已完成

你现在可以开始使用 Qwen3:30b MoE 模型了！

---

## 🚀 最简单的开始方式

### 双击运行: `START_HERE.bat`

这是一个交互式菜单，提供以下功能：
1. 一键部署 Qwen3:30b
2. 运行模型
3. 查看已安装的模型
4. 查看文档

---

## 📦 已创建的文件

### 🔧 核心脚本

| 文件 | 说明 |
|------|------|
| **START_HERE.bat** ⭐ | 主菜单，推荐使用 |
| setup_qwen3_auto.bat | 自动部署 Qwen3:30b |
| run_qwen3.bat | 运行 Qwen3:30b |
| setup_qwen3_npu_openvino.py | OpenVINO NPU 方案 |

### 📚 文档

| 文件 | 说明 |
|------|------|
| **README_Qwen3_部署方案.md** ⭐ | 完整部署指南 |
| Intel_Ollama_使用指南.md | Ollama 详细说明 |
| README_Intel_Ollama.md | 快速开始 |

### 📁 模型目录

| 目录 | 说明 |
|------|------|
| ollama-intel-2.3.0b20250923-win/ | Intel Ollama 主程序 |
| qwen3-8b-int4-cw-ov/ | OpenVINO 预量化模型 |

---

## ⚙️ 默认配置

### 硬件
- **GPU**: Intel Arc 140V (16GB)
- **加速**: GPU + CPU 混合推理

### 模型
- **名称**: Qwen3:30b
- **架构**: MoE (Mixture of Experts)
- **大小**: 约 18GB

### 优化设置
- **上下文长度**: 8192 tokens
- **并行请求**: 1 (节省显存)
- **MoE Experts**: 在 CPU 运行
- **主模型**: 在 GPU 运行

---

## 📋 使用流程

### 首次使用

1. **双击**: `START_HERE.bat`
2. **选择**: [1] 一键部署
3. **等待**: 下载完成（约 18GB，需要时间）
4. **完成**: 自动配置并启动

### 日常使用

1. **双击**: `START_HERE.bat`
2. **选择**: [2] 运行模型
3. **开始对话**: 输入问题，按回车
4. **退出**: 输入 `/bye`

---

## 🎯 两种部署方案对比

### 方案 1: Intel Ollama (已配置) ⭐

**优点**:
- ✅ 简单快速，一键部署
- ✅ 自动优化 MoE 模型
- ✅ GPU + CPU 混合推理
- ✅ 从 ModelScope 快速下载

**使用**:
```cmd
START_HERE.bat
```

### 方案 2: OpenVINO NPU (可选)

**优点**:
- ✅ 支持 Intel NPU
- ✅ NPU + GPU + CPU 混合推理
- ✅ INT4 量化，更快

**使用**:
```cmd
python setup_qwen3_npu_openvino.py
```

**注意**: 更复杂，建议先用方案 1

---

## 💡 常见问题

### Q: 显存不足怎么办？

A: 已经启用了最优配置：
- OLLAMA_NUM_PARALLEL=1
- OLLAMA_SET_OT=exps=CPU

如果仍不足，可以：
- 减少上下文: `set OLLAMA_NUM_CTX=4096`
- 使用更小模型: `qwen2.5-moe:7b`

### Q: 下载速度慢？

A: Intel Ollama 默认使用 ModelScope（国内快）

### Q: 如何使用 NPU？

A: 运行 `python setup_qwen3_npu_openvino.py`

### Q: 模型在哪里？

A: 
- Ollama 模型: `~/.ollama/models/`
- OpenVINO 模型: `qwen3-8b-int4-cw-ov/`

---

## 🔧 手动命令（高级用户）

```cmd
# 进入 Ollama 目录
cd ollama-intel-2.3.0b20250923-win

# 配置环境变量
set OLLAMA_NUM_CTX=8192
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_SET_OT=exps=CPU

# 启动服务
start-ollama.bat

# 下载模型
ollama.exe pull qwen3:30b

# 运行模型
ollama.exe run qwen3:30b

# 查看模型
ollama.exe list

# API 调用
curl http://localhost:11434/api/generate -d "{\"model\":\"qwen3:30b\",\"prompt\":\"你好\"}"
```

---

## 📊 性能预期

### Intel Arc 140V (16GB)

- **加载时间**: 首次 1-2 分钟（编译），后续 10-30 秒
- **推理速度**: 约 10-20 tokens/秒
- **显存使用**: 约 12-14GB（优化后）
- **上下文**: 8192 tokens

---

## 🔗 相关资源

- [Intel Ollama](https://www.modelscope.cn/models/Intel/ollama)
- [Qwen 模型](https://github.com/QwenLM/Qwen)
- [OpenVINO 文档](https://docs.openvino.ai/)

---

## 🎊 下一步

### 立即开始

**双击运行**: `START_HERE.bat`

选择 [1] 开始部署！

---

## 📞 需要帮助？

查看文档：
- `README_Qwen3_部署方案.md` - 完整指南
- `Intel_Ollama_使用指南.md` - 详细说明

---

**祝使用愉快！** 🚀
