#!/usr/bin/env python3
"""
运行已转换的 Qwen3 OpenVINO 模型
仅需三行代码！
"""

import openvino_genai
import os
import sys

# 配置
MODEL_PATH = "qwen3-7b-openvino-int4"
DEVICE = "GPU"  # 可选: NPU, GPU, CPU

def main():
    print("=" * 60)
    print("  Qwen3 OpenVINO 推理")
    print("=" * 60)
    print()
    
    if not os.path.exists(MODEL_PATH):
        print(f"✗ 模型不存在: {MODEL_PATH}")
        print()
        print("请先运行: python deploy_qwen3_openvino_auto.py")
        return 1
    
    print(f"模型: {MODEL_PATH}")
    print(f"设备: {DEVICE}")
    print()
    
    # 尝试加载模型到不同设备
    devices = [DEVICE, "NPU", "GPU", "CPU"]
    pipe = None
    used_device = None
    
    for device in devices:
        try:
            print(f"尝试加载到 {device}...")
            pipe = openvino_genai.LLMPipeline(MODEL_PATH, device)
            used_device = device
            print(f"✓ 成功加载到 {device}")
            break
        except Exception as e:
            print(f"✗ {device} 失败: {e}")
            continue
    
    if pipe is None:
        print("✗ 所有设备都加载失败")
        return 1
    
    print()
    print("=" * 60)
    print(f"  交互模式 (设备: {used_device})")
    print("=" * 60)
    print()
    print("输入问题，按回车生成回答")
    print("输入 'quit' 或 'exit' 退出")
    print()
    
    while True:
        try:
            prompt = input("你的问题: ").strip()
            
            if prompt.lower() in ['quit', 'exit', 'q', 'bye']:
                print("退出")
                break
            
            if not prompt:
                continue
            
            print("\n生成中...\n")
            response = pipe.generate(prompt, max_new_tokens=500)
            print(f"回答: {response}\n")
            print("-" * 60 + "\n")
            
        except KeyboardInterrupt:
            print("\n\n退出")
            break
        except Exception as e:
            print(f"错误: {e}\n")
            continue
    
    return 0

if __name__ == "__main__":
    exit(main())
