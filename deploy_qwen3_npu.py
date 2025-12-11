#!/usr/bin/env python3
"""
Qwen3-8B INT4 OpenVINO NPU 部署脚本
针对 Intel Arc NPU 优化的模型推理
"""

import os
import sys

def download_model():
    """从 HuggingFace 下载模型"""
    print("=" * 60)
    print("步骤 1: 下载 Qwen3-8B INT4 OpenVINO 模型")
    print("=" * 60)
    
    try:
        import huggingface_hub as hf_hub
        
        model_id = "OpenVINO/qwen3-8b-int4-cw-ov"
        model_path = "qwen3-8b-int4-cw-ov"
        
        print(f"正在从 HuggingFace 下载模型: {model_id}")
        print(f"保存路径: {model_path}")
        print("这可能需要几分钟时间，请耐心等待...")
        print("模型大小约 4.7GB")
        
        hf_hub.snapshot_download(model_id, local_dir=model_path)
        
        print(f"✓ 模型下载完成！保存在: {model_path}")
        return model_path
        
    except Exception as e:
        print(f"下载失败: {e}")
        print("\n如果下载失败，你可以手动下载:")
        print(f"访问: https://huggingface.co/{model_id}")
        sys.exit(1)

def run_inference(model_path):
    """在 NPU 上运行模型推理"""
    print("\n" + "=" * 60)
    print("步骤 2: 在 Intel NPU 上运行推理")
    print("=" * 60)
    
    try:
        import openvino_genai as ov_genai
        
        device = "NPU"
        print(f"使用设备: {device} (Intel Arc NPU)")
        print(f"加载模型: {model_path}")
        
        # 创建 LLM Pipeline
        pipe = ov_genai.LLMPipeline(model_path, device)
        
        print("\n✓ 模型加载成功！")
        print("\n" + "=" * 60)
        print("开始测试推理")
        print("=" * 60)
        
        # 测试问题
        prompts = [
            "What is OpenVINO?",
            "介绍一下人工智能",
            "Write a Python function to calculate fibonacci numbers"
        ]
        
        for i, prompt in enumerate(prompts, 1):
            print(f"\n[测试 {i}] 问题: {prompt}")
            print("-" * 60)
            
            response = pipe.generate(prompt, max_length=200)
            print(f"回答: {response}")
            print("-" * 60)
        
        print("\n✓ 推理测试完成！")
        
        # 交互模式
        print("\n" + "=" * 60)
        print("进入交互模式 (输入 'quit' 或 'exit' 退出)")
        print("=" * 60)
        
        while True:
            try:
                user_input = input("\n你的问题: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("退出程序")
                    break
                
                if not user_input:
                    continue
                
                print("生成中...")
                response = pipe.generate(user_input, max_length=200)
                print(f"\n回答: {response}")
                
            except KeyboardInterrupt:
                print("\n\n程序被中断")
                break
            except Exception as e:
                print(f"错误: {e}")
                continue
        
    except Exception as e:
        print(f"推理失败: {e}")
        print("\n可能的原因:")
        print("1. NPU 驱动未正确安装")
        print("2. 模型文件损坏")
        print("3. OpenVINO 版本不兼容")
        sys.exit(1)

def main():
    print("\n" + "=" * 60)
    print("Qwen3-8B INT4 OpenVINO NPU 部署工具")
    print("=" * 60)
    
    # 检查模型是否已存在
    model_path = "qwen3-8b-int4-cw-ov"
    
    if os.path.exists(model_path):
        print(f"✓ 发现已下载的模型: {model_path}")
        user_choice = input("是否重新下载? (y/N): ").strip().lower()
        if user_choice == 'y':
            model_path = download_model()
    else:
        model_path = download_model()
    
    # 运行推理
    run_inference(model_path)

if __name__ == "__main__":
    main()
