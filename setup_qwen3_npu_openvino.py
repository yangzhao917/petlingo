#!/usr/bin/env python3
"""
使用 OpenVINO 在 NPU 上运行 Qwen3 模型
参考: https://docs.openvino.ai/2025/openvino-workflow-generative/inference-with-genai/inference-with-genai-on-npu.html
"""

import os
import subprocess
import sys

def check_install_packages():
    """检查并安装必要的包"""
    print("=" * 60)
    print("检查依赖包")
    print("=" * 60)
    
    packages = [
        "optimum-intel[npu]",
        "openvino-genai",
        "transformers",
        "torch"
    ]
    
    for package in packages:
        try:
            if package == "optimum-intel[npu]":
                import optimum.intel
                print(f"✓ {package} 已安装")
            elif package == "openvino-genai":
                import openvino_genai
                print(f"✓ {package} 已安装")
            elif package == "transformers":
                import transformers
                print(f"✓ {package} 已安装")
            elif package == "torch":
                import torch
                print(f"✓ {package} 已安装")
        except ImportError:
            print(f"正在安装 {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package, "-q"], check=True)
            print(f"✓ {package} 安装完成")
    
    print()

def export_model_to_openvino():
    """使用 Optimum Intel 导出模型到 OpenVINO 格式"""
    print("=" * 60)
    print("导出 Qwen3 模型到 OpenVINO 格式")
    print("=" * 60)
    print()
    
    model_id = "Qwen/Qwen2.5-7B-Instruct"  # 先用 7B 测试，30B 太大
    output_dir = "qwen3-7b-openvino-npu"
    
    print(f"模型: {model_id}")
    print(f"输出目录: {output_dir}")
    print()
    
    if os.path.exists(output_dir):
        print(f"✓ 模型已存在: {output_dir}")
        user_input = input("是否重新导出? (y/N): ").strip().lower()
        if user_input != 'y':
            return output_dir
    
    print("正在导出模型...")
    print("这可能需要几分钟时间...")
    print()
    
    # 使用 optimum-cli 导出
    cmd = [
        "optimum-cli",
        "export",
        "openvino",
        "--model", model_id,
        "--task", "text-generation-with-past",
        "--weight-format", "int4",
        "--ratio", "1.0",
        "--group-size", "128",
        "--sym",
        output_dir
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print()
        print(f"✓ 模型导出完成: {output_dir}")
        return output_dir
    except subprocess.CalledProcessError as e:
        print(f"✗ 导出失败: {e}")
        return None

def run_model_on_npu(model_path):
    """在 NPU 上运行模型"""
    print()
    print("=" * 60)
    print("在 Intel NPU 上运行模型")
    print("=" * 60)
    print()
    
    try:
        import openvino_genai as ov_genai
        
        # 尝试 NPU
        device = "NPU"
        print(f"设备: {device}")
        print(f"模型: {model_path}")
        print()
        
        try:
            print("正在加载模型到 NPU...")
            pipe = ov_genai.LLMPipeline(model_path, device)
            print("✓ 模型加载成功！")
        except Exception as e:
            print(f"NPU 加载失败: {e}")
            print()
            print("尝试使用 GPU...")
            device = "GPU"
            pipe = ov_genai.LLMPipeline(model_path, device)
            print("✓ 模型加载到 GPU 成功！")
        
        print()
        print("=" * 60)
        print("测试推理")
        print("=" * 60)
        print()
        
        test_prompts = [
            "What is artificial intelligence?",
            "介绍一下量子计算",
        ]
        
        for i, prompt in enumerate(test_prompts, 1):
            print(f"[测试 {i}] 问题: {prompt}")
            print("-" * 60)
            
            try:
                response = pipe.generate(prompt, max_length=200)
                print(f"回答: {response}")
            except Exception as e:
                print(f"生成失败: {e}")
            
            print("-" * 60)
            print()
        
        print("=" * 60)
        print("进入交互模式")
        print("=" * 60)
        print("输入 'quit' 或 'exit' 退出")
        print()
        
        while True:
            try:
                user_input = input("你的问题: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("退出程序")
                    break
                
                if not user_input:
                    continue
                
                print("生成中...")
                response = pipe.generate(user_input, max_length=200)
                print(f"\n回答: {response}\n")
                
            except KeyboardInterrupt:
                print("\n\n程序被中断")
                break
            except Exception as e:
                print(f"错误: {e}")
                continue
        
    except Exception as e:
        print(f"运行失败: {e}")
        print()
        print("可能的原因:")
        print("1. NPU 驱动未正确安装")
        print("2. OpenVINO 版本不兼容")
        print("3. 模型文件损坏")
        return 1
    
    return 0

def main():
    print()
    print("=" * 60)
    print("Qwen3 OpenVINO NPU 部署工具")
    print("=" * 60)
    print()
    
    # 1. 检查依赖
    check_install_packages()
    
    # 2. 导出模型
    model_path = export_model_to_openvino()
    
    if not model_path:
        print("模型导出失败，退出")
        return 1
    
    # 3. 运行模型
    return run_model_on_npu(model_path)

if __name__ == "__main__":
    exit(main())
