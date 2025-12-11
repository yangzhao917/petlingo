#!/usr/bin/env python3
"""快速测试 Qwen3-8B NPU 模型"""

import openvino_genai as ov_genai
import time

model_path = "qwen3-8b-int4-cw-ov"
device = "NPU"

print(f"加载模型到 {device}...")
start = time.time()

try:
    pipe = ov_genai.LLMPipeline(model_path, device)
    load_time = time.time() - start
    print(f"✓ 模型加载成功 ({load_time:.2f}秒)\n")
    
    # 简单测试
    prompt = "Hello, who are you?"
    print(f"问题: {prompt}")
    print("生成中...\n")
    
    start = time.time()
    response = pipe.generate(prompt, max_length=50)
    gen_time = time.time() - start
    
    print(f"回答: {response}")
    print(f"\n生成时间: {gen_time:.2f}秒")
    print("✓ NPU 推理成功！")
    
except Exception as e:
    print(f"✗ 错误: {e}")
    print("\n尝试使用 CPU...")
    
    try:
        pipe = ov_genai.LLMPipeline(model_path, "CPU")
        print("✓ CPU 加载成功")
        response = pipe.generate("Hello!", max_length=30)
        print(f"回答: {response}")
    except Exception as e2:
        print(f"CPU 也失败: {e2}")
