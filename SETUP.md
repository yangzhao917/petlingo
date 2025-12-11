# 完整安装配置指南

本文档提供详细的环境配置和故障排除指南，确保项目能够正常运行。

## 📋 系统要求

### 硬件要求
- **CPU**: Intel Core Ultra 处理器（推荐）或其他 x86-64 处理器
- **GPU**: Intel Arc 140V (16GB) 或其他 Intel Arc/Iris Xe GPU
- **NPU**: Intel AI Boost（可选，用于最高性能）
- **内存**: 16GB RAM（推荐 32GB）
- **存储**: 至少 50GB 可用空间（用于模型和缓存）

### 软件要求
- **操作系统**: Windows 10 (64-bit) 或 Windows 11
- **Python**: 3.8, 3.9, 3.10, 或 3.11（推荐 3.11）
- **Git**: 用于克隆项目
- **驱动**: Intel GPU/NPU 驱动（见下文）

---

## 🔧 环境配置

### 1. 安装 Python

如果还没有安装 Python：

1. 访问 [Python 官网](https://www.python.org/downloads/)
2. 下载 Python 3.11（推荐）
3. 安装时勾选 "Add Python to PATH"

验证安装：
```cmd
python --version
pip --version
```

### 2. 安装 Git

1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载并安装 Git for Windows

验证安装：
```cmd
git --version
```

### 3. 安装 Intel GPU/NPU 驱动

#### Intel Arc GPU 驱动

1. 访问 [Intel 驱动下载页面](https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html)
2. 下载最新版本驱动
3. 安装并重启电脑

#### Intel NPU 驱动

Intel NPU 驱动通常随系统驱动更新自动安装。检查方法：

1. 打开"设备管理器"
2. 查找"神经处理器"或"Neural Processor"
3. 如果没有，更新 Windows 和 Intel 驱动

---

## 📦 项目安装

### 步骤 1: 克隆项目

```cmd
# 克隆项目
git clone https://github.com/yangzhao917/petlingo.git

# 进入项目目录
cd petlingo
```

### 步骤 2: 创建虚拟环境（推荐）

```cmd
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
venv\Scripts\activate

# 你会看到命令提示符前面有 (venv)
```

### 步骤 3: 安装依赖

```cmd
# 升级 pip
python -m pip install --upgrade pip

# 安装项目依赖
pip install -r requirements.txt
```

**注意**: 首次安装可能需要 5-10 分钟，请耐心等待。

### 步骤 4: 验证安装

```cmd
# 检查 OpenVINO
python -c "import openvino; print(f'OpenVINO version: {openvino.__version__}')"

# 检查 OpenVINO GenAI
python -c "import openvino_genai; print('OpenVINO GenAI installed successfully')"

# 检查可用设备
python -c "from openvino.runtime import Core; core = Core(); print('Available devices:', core.available_devices)"
```

如果看到类似输出，说明安装成功：
```
OpenVINO version: 2025.3.0
OpenVINO GenAI installed successfully
Available devices: ['CPU', 'GPU', 'NPU']
```

---

## 🚀 运行项目

### 方案 1: Intel Ollama（最简单）

#### 1.1 首次部署

```cmd
# 运行一键部署脚本
setup_qwen3_auto.bat
```

脚本会自动：
- 配置环境变量
- 启动 Ollama 服务
- 下载 Qwen 模型（约 18GB，需要时间）
- 配置优化参数

#### 1.2 日常使用

```cmd
# 运行模型
run_qwen3.bat

# 或手动运行
cd ollama-intel-2.3.0b20250923-win
ollama.exe run qwen3:30b
```

### 方案 2: OpenVINO NPU（最高性能）

#### 2.1 自动部署

```cmd
# 运行部署脚本（会自动下载模型）
python deploy_qwen3_npu.py
```

脚本会自动：
- 检查依赖
- 从 HuggingFace 下载模型（约 4.7GB）
- 配置 NPU 推理
- 进入交互模式

#### 2.2 手动部署

如果自动部署失败，可以手动操作：

```cmd
# 1. 下载模型
python -c "from huggingface_hub import snapshot_download; snapshot_download('OpenVINO/qwen3-8b-int4-cw-ov', local_dir='qwen3-8b-int4-cw-ov')"

# 2. 测试模型
python quick_test_npu.py
```

### 方案 3: 从源码导出模型

如果想从原始模型导出：

```cmd
# 导出 Qwen3-8B 为 OpenVINO INT4 格式
optimum-cli export openvino ^
    --model Qwen/Qwen3-8B ^
    --task text-generation-with-past ^
    --weight-format int4 ^
    --group-size 128 ^
    --ratio 0.8 ^
    Qwen3-8B-int4-ov

# 运行导出的模型
python -c "import openvino_genai as ov_genai; pipe = ov_genai.LLMPipeline('Qwen3-8B-int4-ov', 'NPU'); print(pipe.generate('Hello', max_length=50))"
```

---

## 🧪 测试和验证

### 快速测试

```cmd
# 测试 NPU 推理
python quick_test_npu.py

# 测试 Qwen3-4B
python test_qwen3_4b_npu.py

# 测试 Qwen3-8B
python test_qwen3_npu.py
```

### 检查设备可用性

```cmd
# 检查 OpenVINO 设备
python test_npu.py
```

预期输出：
```
Available devices: ['CPU', 'GPU.0', 'NPU']
```

---

## 🐛 常见问题和解决方案

### 问题 1: 模块导入错误

**错误信息**:
```
ModuleNotFoundError: No module named 'openvino_genai'
```

**解决方案**:
```cmd
# 重新安装 openvino-genai
pip install --upgrade openvino-genai

# 或从源码安装
pip install git+https://github.com/openvinotoolkit/openvino.genai.git
```

### 问题 2: NPU 设备不可用

**错误信息**:
```
Device NPU not found
```

**解决方案**:
1. 检查设备管理器中是否有"神经处理器"
2. 更新 Intel NPU 驱动
3. 更新 Windows 到最新版本
4. 临时使用 GPU 或 CPU：
   ```python
   pipe = ov_genai.LLMPipeline(model_path, "GPU")  # 或 "CPU"
   ```

### 问题 3: 模型下载失败

**错误信息**:
```
Connection timeout / Download failed
```

**解决方案**:

**方法 A: 使用 ModelScope（国内推荐）**
```cmd
pip install modelscope
python -c "from modelscope import snapshot_download; snapshot_download('OpenVINO/Qwen3-8B-int4-cw-ov', local_dir='qwen3-8b-int4-cw-ov')"
```

**方法 B: 配置 HuggingFace 镜像**
```cmd
set HF_ENDPOINT=https://hf-mirror.com
python deploy_qwen3_npu.py
```

**方法 C: 手动下载**
1. 访问 https://www.modelscope.cn/models/OpenVINO/Qwen3-8B-int4-cw-ov
2. 点击"文件"标签
3. 下载所有文件到 `qwen3-8b-int4-cw-ov/` 目录

### 问题 4: 显存不足 (OOM)

**错误信息**:
```
Out of memory / Allocation failed
```

**解决方案**:

**对于 Intel Ollama**:
```cmd
# 编辑 setup_qwen3_auto.bat，添加：
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_NUM_CTX=4096
set OLLAMA_SET_OT=exps=CPU
```

**对于 OpenVINO**:
```python
# 使用更小的模型
python test_qwen3_4b_npu.py  # 4B 而非 8B

# 或减少生成长度
response = pipe.generate(prompt, max_length=100)  # 而非 200
```

### 问题 5: Intel Ollama 服务启动失败

**错误信息**:
```
Failed to start Ollama service
```

**解决方案**:
1. 检查端口 11434 是否被占用：
   ```cmd
   netstat -ano | findstr :11434
   ```
2. 如果被占用，结束占用进程或更改端口：
   ```cmd
   set OLLAMA_HOST=0.0.0.0:11435
   ```
3. 检查 Intel GPU 驱动是否正确安装

### 问题 6: Python 版本不兼容

**错误信息**:
```
Python version 3.7 is not supported
```

**解决方案**:
1. 安装 Python 3.8 或更高版本
2. 使用虚拟环境隔离不同 Python 版本

### 问题 7: 首次运行很慢

**现象**: 模型加载需要 2-5 分钟

**原因**: OpenVINO 首次运行需要编译模型以适配硬件

**解决方案**: 
- 这是正常现象，耐心等待
- 编译后会缓存，后续运行会快很多
- 缓存位置: `%LOCALAPPDATA%\openvino\cache`

---

## 📊 性能优化建议

### 1. 使用 INT4 量化模型

INT4 模型比 FP16 小 4 倍，速度快 2-3 倍：
```cmd
# 推荐使用 INT4
python deploy_qwen3_npu.py  # 默认使用 INT4

# 而非 FP16
# optimum-cli export openvino --weight-format fp16 ...
```

### 2. 选择合适的设备

```python
# 性能排序（从快到慢）
"NPU"           # 最快，最省电（推荐）
"GPU"           # 快，显存占用高
"CPU"           # 慢，兼容性最好
"AUTO"          # 自动选择
```

### 3. 调整生成参数

```python
# 平衡质量和速度
response = pipe.generate(
    prompt,
    max_length=200,        # 减少长度提升速度
    temperature=0.7,       # 降低随机性
    do_sample=False        # 禁用采样（贪婪解码）
)
```

### 4. 批量处理

```python
# 批量处理多个请求更高效
prompts = ["问题1", "问题2", "问题3"]
for prompt in prompts:
    response = pipe.generate(prompt)
```

---

## 📚 更多资源

### 官方文档
- [OpenVINO 文档](https://docs.openvino.ai/)
- [OpenVINO GenAI 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai.html)
- [Intel NPU 文档](https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai/inference-with-genai-on-npu.html)

### 模型资源
- [Qwen 官方仓库](https://github.com/QwenLM/Qwen)
- [ModelScope 模型库](https://www.modelscope.cn/)
- [HuggingFace 模型库](https://huggingface.co/)

### 驱动下载
- [Intel Arc 驱动](https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html)
- [Intel 驱动中心](https://www.intel.com/content/www/us/en/download-center/home.html)

---

## 💬 获取帮助

如果遇到问题：

1. **查看文档**: 先查看本文档和项目 README
2. **搜索 Issues**: 在 GitHub Issues 中搜索类似问题
3. **提交 Issue**: 如果问题未解决，提交新的 Issue，包含：
   - 错误信息（完整的错误堆栈）
   - 系统信息（Windows 版本、Python 版本、GPU 型号）
   - 复现步骤
4. **社区讨论**: 参与 GitHub Discussions

---

**祝你使用愉快！** 🚀
