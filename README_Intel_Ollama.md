# Intel Ollama + Qwen MoE 部署完成 ✅

## 📦 已完成的工作

✅ **Intel Ollama 已下载并解压**
- 位置: `ollama-intel-2.3.0b20250923-win/`
- 版本: 2.3.0b20250923
- 支持: Intel Arc GPU/NPU 加速

✅ **创建了便捷脚本**
- `setup_qwen_moe.bat` - 一键设置和下载 Qwen MoE 模型
- `run_qwen_moe.bat` - 运行模型
- `quantize_qwen_model.bat` - 模型量化工具

✅ **完整文档**
- `Intel_Ollama_使用指南.md` - 详细使用说明

## 🚀 立即开始

### 最简单的方式（推荐）

1. **双击运行**: `setup_qwen_moe.bat`
2. **按提示选择**:
   - 上下文长度（推荐 8192）
   - 是否启用显存优化
   - 选择 Qwen MoE 模型（推荐 qwen2.5-moe:7b）
   - MoE 优化选项
3. **等待下载完成**
4. **开始对话！**

### 手动方式

```cmd
# 1. 启动服务
cd ollama-intel-2.3.0b20250923-win
start-ollama.bat

# 2. 新开终端，下载模型
cd ollama-intel-2.3.0b20250923-win
ollama.exe pull qwen2.5-moe:7b

# 3. 运行模型
ollama.exe run qwen2.5-moe:7b
```

## 🎯 推荐配置

### 你的硬件: Intel Arc 140V (16GB)

**推荐模型**: qwen2.5-moe:7b 或 qwen3:30b

**推荐设置**:
```cmd
set OLLAMA_NUM_CTX=8192          # 8K 上下文
set OLLAMA_NUM_PARALLEL=2        # 2 个并行请求
```

**如果显存紧张**:
```cmd
set OLLAMA_NUM_CTX=4096          # 4K 上下文
set OLLAMA_NUM_PARALLEL=1        # 1 个并行请求
set OLLAMA_SET_OT=exps=CPU       # MoE experts 在 CPU
```

## 📊 可用的 Qwen MoE 模型

| 模型 | 大小 | 特点 |
|------|------|------|
| **qwen2.5-moe:7b** ⭐ | ~4.7GB | 推荐，平衡性能 |
| qwen2.5-moe:14b | ~9GB | 更强性能 |
| qwen2.5-moe:57b | ~35GB | 最强性能 |
| qwen3:30b | ~18GB | 最新版本 |

## 🔧 模型量化

下载原始模型后，可以进行量化以节省空间和显存：

```cmd
# 运行量化脚本
quantize_qwen_model.bat

# 或手动量化
ollama.exe create qwen2.5-moe:Q4_K_M -f Modelfile -q Q4_K_M
```

## 📝 重要说明

1. **模型源**: Intel Ollama 默认从 **ModelScope** 下载（国内快）
2. **模型 ID**: 会显示为 `modelscope.cn/...`，这是正常的
3. **删除模型**: 使用完整 ID，例如:
   ```cmd
   ollama.exe rm modelscope.cn/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF:Q4_K_M
   ```
4. **服务必须运行**: 使用模型前确保 Ollama 服务在运行

## 🐛 常见问题

### Q: 服务启动失败？
A: 检查 Intel GPU 驱动，更新到推荐版本

### Q: 显存不足？
A: 
- 使用更小的模型
- 启用显存优化
- 将 MoE experts 放到 CPU
- 使用量化模型

### Q: 下载速度慢？
A: Intel Ollama 默认使用 ModelScope（国内快）

### Q: 如何切换到 Ollama 官方库？
A: 
```cmd
set OLLAMA_MODEL_SOURCE=ollama
ollama.exe pull qwen2.5:7b
```

## 📚 文档

- **详细使用指南**: `Intel_Ollama_使用指南.md`
- **官方说明**: `ollama-intel-2.3.0b20250923-win/README.zh-CN.txt`

## 🎉 下一步

1. **运行 `setup_qwen_moe.bat`** 开始使用
2. **阅读 `Intel_Ollama_使用指南.md`** 了解更多功能
3. **尝试量化** 优化模型性能

---

**快速开始**: 双击 `setup_qwen_moe.bat` 🚀
