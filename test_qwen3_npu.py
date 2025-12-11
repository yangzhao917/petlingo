#!/usr/bin/env python3
"""
Qwen3-8B INT4 OpenVINO NPU 测试脚本
"""

import openvino_genai as ov_genai

def main():
    print("=" * 60)
    print("Qwen3-8B INT4 OpenVINO NPU 推理测试")
    print("=" * 60)
    
    model_path = "qwen3-8b-int4-cw-ov"
    device = "NPU"
    
    print(f"\n加载模型: {model_path}")
    print(f"目标设备: {device} (Intel Arc NPU)")
    print("正在初始化...")
    
    try:
        # 创建 LLM Pipeline
        pipe = ov_genai.LLMPipeline(model_path, device)
        print("✓ 模型加载成功！\n")
        
        # 测试问题
        test_prompts = [
            "What is OpenVINO?",
            "介绍一下人工智能的发展历史",
            "Write a Python function to calculate fibonacci numbers"
        ]
        
        print("=" * 60)
        print("开始推理测试")
        print("=" * 60)
        
        for i, prompt in enumerate(test_prompts, 1):
            print(f"\n[测试 {i}/{len(test_prompts)}]")
            print(f"问题: {prompt}")
            print("-" * 60)
            
            try:
                response = pipe.generate(prompt, max_length=200)
                print(f"回答: {response}")
            except Exception as e:
                print(f"生成失败: {e}")
            
            print("-" * 60)
        
        print("\n" + "=" * 60)
        print("✓ 测试完成！")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ 错误: {e}")
        print("\n可能的原因:")
        print("1. NPU 驱动未正确安装或不支持")
        print("2. 模型文件损坏")
        print("3. OpenVINO 版本不兼容")
        print("\n尝试使用 CPU 设备:")
        print("  修改 device = 'CPU' 然后重新运行")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
