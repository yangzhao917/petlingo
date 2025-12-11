# Intel Ollama 使用指南

## 📁 文件结构

```
ollama-intel-2.3.0b20250923-win/  # Intel Ollama 主目录
├── ollama.exe                     # Ollama 可执行文件
├── start-ollama.bat               # 启动服务脚本
└── README.zh-CN.txt               # 官方中文说明

setup_qwen_moe.bat                 # 一键设置 Qwen MoE 模型
run_qwen_moe.bat                   # 运行 Qwen MoE 模型
quantize_qwen_model.bat            # 模型量化工具
```

## 🚀 快速开始

### 方法 1: 使用一键脚本（推荐）

1. **双击运行 `setup_qwen_moe.bat`**
   - 自动配置环境变量
   - 启动 Ollama 服务
   - 下载 Qwen MoE 模型
   - 支持显存优化选项

2. **运行模型**
   - 双击 `run_qwen_moe.bat`
   - 或在命令行: `ollama.exe run qwen2.5-moe:7b`

### 方法 2: 手动步骤

#### 步骤 1: 启动 Ollama 服务

```cmd
cd /d C:\Users\devcloud\Desktop\new\ollama-intel-2.3.0b20250923-win
start-ollama.bat
```

保持服务窗口打开！

#### 步骤 2: 下载模型（新终端）

```cmd
cd /d C:\Users\devcloud\Desktop\new\ollama-intel-2.3.0b20250923-win

REM 下载 Qwen MoE 模型（从 ModelScope，默认）
ollama.exe pull qwen2.5-moe:7b
```

#### 步骤 3: 运行模型

```cmd
ollama.exe run qwen2.5-moe:7b
```

## 🎯 推荐的 Qwen MoE 模型

| 模型 | 大小 | 特点 | 推荐场景 |
|------|------|------|----------|
| **qwen2.5-moe:7b** | ~4.7GB | MoE 架构，平衡性能 | 日常使用（推荐） |
| qwen2.5-moe:14b | ~9GB | 更强性能 | 复杂任务 |
| qwen2.5-moe:57b | ~35GB | 最强性能 | 专业应用 |
| qwen3:30b | ~18GB | 新版本 MoE | 最新特性 |

## ⚙️ 高级配置

### 1. 增加上下文长度

```cmd
REM 设置为 16K 上下文
set OLLAMA_NUM_CTX=16384

REM 启动服务
start-ollama.bat
```

### 2. 节省显存

```cmd
REM 减少并行请求
set OLLAMA_NUM_PARALLEL=1

REM 启动服务
start-ollama.bat
```

### 3. MoE 模型优化（将 experts 放到 CPU）

```cmd
REM 所有 experts 在 CPU
set OLLAMA_SET_OT=exps=CPU

REM 或者只将 24-99 层放到 CPU
set OLLAMA_SET_OT=(2[4-9]|[3-9][0-9])\.ffn_.*_exps\.=CPU

REM 启动服务
start-ollama.bat
```

### 4. 切换模型源

```cmd
REM 使用 Ollama 官方库（而非 ModelScope）
set OLLAMA_MODEL_SOURCE=ollama

REM 下载模型
ollama.exe pull qwen2.5:7b
```

## 🔧 模型量化

### 使用量化脚本

双击运行 `quantize_qwen_model.bat`，按提示操作。

### 手动量化

1. **创建 Modelfile**

```
FROM qwen2.5-moe:7b
```

2. **创建量化模型**

```cmd
ollama.exe create qwen2.5-moe:Q4_K_M -f Modelfile -q Q4_K_M
```

3. **运行量化模型**

```cmd
ollama.exe run qwen2.5-moe:Q4_K_M
```

### 量化级别说明

| 量化类型 | 大小 | 质量 | 速度 |
|---------|------|------|------|
| Q4_0 | 最小 | 较低 | 最快 |
| **Q4_K_M** | 小 | 良好 | 快（推荐） |
| Q5_K_M | 中 | 较好 | 中等 |
| Q8_0 | 大 | 高 | 较慢 |

## 📋 常用命令

```cmd
REM 查看已安装的模型
ollama.exe list

REM 删除模型（使用完整 ID）
ollama.exe rm modelscope.cn/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF:Q4_K_M

REM 查看模型信息
ollama.exe show qwen2.5-moe:7b

REM 复制模型
ollama.exe cp qwen2.5-moe:7b my-qwen

REM API 调用
curl http://localhost:11434/api/generate -d "{\"model\":\"qwen2.5-moe:7b\",\"prompt\":\"你好\"}"
```

## 🐛 故障排除

### 问题 1: 服务启动失败

**解决方案:**
1. 检查 Intel GPU 驱动是否安装
2. 更新驱动到推荐版本:
   - Intel Arc 140V: 最新版本
   - 其他 Intel GPU: 32.0.101.6078

### 问题 2: 显存不足

**解决方案:**
1. 使用更小的模型（如 qwen2.5-moe:7b 而非 57b）
2. 启用显存优化: `set OLLAMA_NUM_PARALLEL=1`
3. 将 MoE experts 放到 CPU: `set OLLAMA_SET_OT=exps=CPU`
4. 使用量化模型（Q4_K_M）

### 问题 3: 下载速度慢

**解决方案:**
1. 默认使用 ModelScope（国内快）
2. 如需使用 Ollama 官方库: `set OLLAMA_MODEL_SOURCE=ollama`

### 问题 4: 模型 ID 显示为 modelscope.cn/...

**这是正常的！** Intel Ollama 默认从 ModelScope 下载，模型 ID 会显示完整路径。

删除时使用完整 ID:
```cmd
ollama.exe rm modelscope.cn/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF:Q4_K_M
```

## 📊 性能优化建议

### Intel Arc 140V (16GB) 推荐配置

```cmd
REM 平衡配置
set OLLAMA_NUM_CTX=8192
set OLLAMA_NUM_PARALLEL=2

REM 启动服务
start-ollama.bat

REM 使用 qwen2.5-moe:7b 或 qwen3:30b
ollama.exe run qwen2.5-moe:7b
```

### 显存紧张时

```cmd
REM 节省显存配置
set OLLAMA_NUM_CTX=4096
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_SET_OT=exps=CPU

REM 启动服务
start-ollama.bat

REM 使用量化模型
ollama.exe run qwen2.5-moe:Q4_K_M
```

## 🔗 相关链接

- [Intel Ollama ModelScope](https://www.modelscope.cn/models/Intel/ollama)
- [Ollama 官方文档](https://github.com/ollama/ollama)
- [Qwen 模型](https://github.com/QwenLM/Qwen)
- [Intel Arc 驱动下载](https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html)

## 💡 使用技巧

1. **首次运行较慢**: 模型加载需要时间，后续会更快
2. **保持服务运行**: Ollama 服务需要一直运行
3. **使用 API**: 可以通过 HTTP API 集成到应用中
4. **模型管理**: 定期清理不用的模型节省空间

---

**快速开始**: 双击 `setup_qwen_moe.bat` 即可开始使用！
