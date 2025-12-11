# 模型文件下载指南

由于模型文件体积较大（几GB到几十GB），无法直接上传到 GitHub。请按照以下方式获取模型：

## 🤖 自动下载（推荐）

项目中的脚本会自动下载所需模型：

```cmd
# Intel Ollama 方式（自动下载）
setup_qwen3_auto.bat

# OpenVINO 方式（自动下载）
python deploy_qwen3_npu.py
```

## 📥 手动下载

如果自动下载失败，可以手动下载模型：

### 1. Qwen3-8B INT4 OpenVINO 模型

**ModelScope（国内推荐）**:
```bash
# 使用 modelscope 命令行工具
pip install modelscope
modelscope download --model OpenVINO/Qwen3-8B-int4-cw-ov --local_dir ./qwen3-8b-int4-cw-ov
```

**HuggingFace**:
```bash
# 使用 huggingface-cli
pip install huggingface_hub
huggingface-cli download OpenVINO/qwen3-8b-int4-cw-ov --local-dir ./qwen3-8b-int4-cw-ov
```

**手动下载链接**:
- ModelScope: https://www.modelscope.cn/models/OpenVINO/Qwen3-8B-int4-cw-ov
- HuggingFace: https://huggingface.co/OpenVINO/qwen3-8b-int4-cw-ov

**模型大小**: ~4.7 GB

---

### 2. Qwen3-4B INT4 OpenVINO 模型

**下载位置**: 
- 放在 `qwen3_original/Qwen3-4B-int4-ov/` 目录

**下载命令**:
```bash
# ModelScope
modelscope download --model OpenVINO/Qwen3-4B-int4-ov --local_dir ./qwen3_original/Qwen3-4B-int4-ov

# HuggingFace
huggingface-cli download OpenVINO/Qwen3-4B-int4-ov --local-dir ./qwen3_original/Qwen3-4B-int4-ov
```

**模型大小**: ~2.5 GB

---

### 3. Intel Ollama 模型

Intel Ollama 会自动从 ModelScope 下载模型，无需手动下载。

**支持的模型**:
- `qwen3:30b` - Qwen3 30B 模型
- `qwen2.5-moe:7b` - Qwen2.5 MoE 7B
- `qwen2.5-moe:14b` - Qwen2.5 MoE 14B

**下载方式**:
```cmd
cd ollama-intel-2.3.0b20250923-win
ollama.exe pull qwen3:30b
```

---

### 4. Qwen3-VL 视觉模型（可选）

**下载位置**: `ov_qwen3vl8b/`

**下载命令**:
```bash
# ModelScope
modelscope download --model OpenVINO/Qwen3-VL-8B-int4-ov --local_dir ./ov_qwen3vl8b

# HuggingFace
huggingface-cli download OpenVINO/Qwen3-VL-8B-int4-ov --local_dir ./ov_qwen3vl8b
```

**模型大小**: ~5 GB

---

### 5. Phi-3.5 模型（可选）

**下载位置**: `ov_phi35/`

**下载命令**:
```bash
# ModelScope
modelscope download --model OpenVINO/Phi-3.5-mini-instruct-int4-ov --local_dir ./ov_phi35

# HuggingFace
huggingface-cli download OpenVINO/Phi-3.5-mini-instruct-int4-ov --local_dir ./ov_phi35
```

**模型大小**: ~2 GB

---

### 6. Paraformer 语音识别模型（可选）

**下载位置**: `ov_paraformer/`

**下载命令**:
```bash
# ModelScope
modelscope download --model OpenVINO/paraformer-zh-int8-ov --local_dir ./ov_paraformer
```

**模型大小**: ~200 MB

---

## 📂 目录结构

下载完成后，你的目录结构应该是这样的：

```
项目根目录/
├── qwen3-8b-int4-cw-ov/          # Qwen3-8B INT4 模型
│   ├── openvino_model.xml
│   ├── openvino_model.bin
│   └── ...
├── qwen3_original/
│   └── Qwen3-4B-int4-ov/         # Qwen3-4B INT4 模型
│       ├── openvino_model.xml
│       ├── openvino_model.bin
│       └── ...
├── ov_qwen3vl8b/                 # Qwen3-VL 视觉模型（可选）
├── ov_phi35/                     # Phi-3.5 模型（可选）
├── ov_paraformer/                # Paraformer 语音模型（可选）
└── ollama-intel-2.3.0b20250923-win/
    └── （Ollama 自动管理模型）
```

---

## ⚠️ 注意事项

1. **磁盘空间**: 确保有足够的磁盘空间（建议至少 50GB）
2. **网络**: 模型文件较大，建议使用稳定的网络连接
3. **国内用户**: 推荐使用 ModelScope，下载速度更快
4. **代理**: 如果访问 HuggingFace 较慢，可以配置代理或使用镜像站

---

## 🔧 验证模型

下载完成后，可以运行测试脚本验证模型：

```cmd
# 测试 Qwen3-8B NPU
python quick_test_npu.py

# 测试 Qwen3-4B NPU
python test_qwen3_4b_npu.py

# 测试 Intel Ollama
cd ollama-intel-2.3.0b20250923-win
ollama.exe run qwen3:30b
```

---

## 📞 遇到问题？

如果下载遇到问题，请查看：
- [ModelScope 文档](https://www.modelscope.cn/docs)
- [HuggingFace 文档](https://huggingface.co/docs)
- 或在项目 Issues 中提问

---

**提示**: 首次运行时，脚本会自动检查模型是否存在，如果不存在会提示下载。
