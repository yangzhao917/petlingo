#!/usr/bin/env python3
"""
Qwen3 OpenVINO 自动部署脚本
- 自动下载模型
- 自动转换为 OpenVINO INT4 格式
- 自动在 NPU/GPU/CPU 上运行
- 无需任何手动选择
"""

import os
import sys
import subprocess
import shutil

# ==================== 配置 ====================
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"  # 使用 7B 模型（30B 太大）
OUTPUT_DIR = "qwen3-7b-openvino-int4"
DEVICE = "GPU"  # 优先 GPU，如果失败会自动尝试 NPU 和 CPU

# INT4 量化参数
WEIGHT_FORMAT = "int4"
GROUP_SIZE = 128
RATIO = 0.8  # 80% INT4, 20% INT8
SYMMETRIC = True  # 对称量化

# ==================== 函数 ====================

def print_section(title):
    """打印分节标题"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60 + "\n")

def check_and_install_packages():
    """检查并安装必要的包"""
    print_section("检查依赖包")
    
    packages = {
        "optimum-intel": "optimum.intel",
        "openvino-genai": "openvino_genai",
        "transformers": "transformers",
        "torch": "torch",
        "accelerate": "accelerate"
    }
    
    for package_name, import_name in packages.items():
        try:
            __import__(import_name.split('.')[0])
            print(f"✓ {package_name} 已安装")
        except ImportError:
            print(f"正在安装 {package_name}...")
            subprocess.run(
                [sys.executable, "-m", "pip", "install", package_name, "-q"],
                check=True
            )
            print(f"✓ {package_name} 安装完成")

def download_model():
    """从 HuggingFace 下载模型"""
    print_section("下载模型")
    
    print(f"模型: {MODEL_ID}")
    print(f"来源: HuggingFace Hub")
    print()
    
    # 检查是否已下载
    from transformers import AutoTokenizer
    
    try:
        print("检查模型缓存...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        print("✓ 模型已在缓存中")
        return True
    except Exception as e:
        print(f"正在下载模型...")
        print("这可能需要几分钟时间...")
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
            print("✓ 模型下载完成")
            return True
        except Exception as e:
            print(f"✗ 下载失败: {e}")
            return False

def convert_model():
    """使用 Optimum-CLI 转换模型"""
    print_section("转换模型到 OpenVINO INT4 格式")
    
    if os.path.exists(OUTPUT_DIR):
        print(f"✓ 模型已存在: {OUTPUT_DIR}")
        user_input = input("是否重新转换? (y/N): ").strip().lower()
        if user_input != 'y':
            return True
        print("删除旧模型...")
        shutil.rmtree(OUTPUT_DIR)
    
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"量化格式: {WEIGHT_FORMAT}")
    print(f"Group Size: {GROUP_SIZE}")
    print(f"Ratio: {RATIO} (80% INT4, 20% INT8)")
    print(f"对称量化: {SYMMETRIC}")
    print()
    
    # 构建命令
    cmd = [
        "optimum-cli",
        "export",
        "openvino",
        "--model", MODEL_ID,
        "--task", "text-generation-with-past",
        "--weight-format", WEIGHT_FORMAT,
        "--group-size", str(GROUP_SIZE),
        "--ratio", str(RATIO),
    ]
    
    if SYMMETRIC:
        cmd.append("--sym")
    
    cmd.append(OUTPUT_DIR)
    
    print("执行命令:")
    print(" ".join(cmd))
    print()
    print("正在转换模型...")
    print("这可能需要 5-10 分钟，请耐心等待...")
    print()
    
    try:
        subprocess.run(cmd, check=True)
        print()
        print("✓ 模型转换完成！")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ 转换失败: {e}")
        return False

def run_model():
    """运行模型推理"""
    print_section("运行模型推理")
    
    try:
        import openvino_genai as ov_genai
        
        print(f"模型路径: {OUTPUT_DIR}")
        print(f"目标设备: {DEVICE}")
        print()
        
        # 尝试加载模型
        devices_to_try = [DEVICE, "NPU", "GPU", "CPU"]
        pipe = None
        used_device = None
        
        for device in devices_to_try:
            try:
                print(f"尝试加载到 {device}...")
                pipe = ov_genai.LLMPipeline(OUTPUT_DIR, device)
                used_device = device
                print(f"✓ 模型成功加载到 {device}")
                break
            except Exception as e:
                print(f"✗ {device} 加载失败: {e}")
                continue
        
        if pipe is None:
            print("✗ 所有设备都加载失败")
            return False
        
        print()
        print_section("测试推理")
        
        test_prompts = [
            "What is artificial intelligence?",
            "介绍一下量子计算的基本原理",
            "Write a Python function to calculate fibonacci numbers"
        ]
        
        for i, prompt in enumerate(test_prompts, 1):
            print(f"\n[测试 {i}/{len(test_prompts)}]")
            print(f"问题: {prompt}")
            print("-" * 60)
            
            try:
                response = pipe.generate(prompt, max_new_tokens=200)
                print(f"回答: {response}")
            except Exception as e:
                print(f"生成失败: {e}")
            
            print("-" * 60)
        
        print()
        print_section("交互模式")
        print(f"设备: {used_device}")
        print("输入 'quit' 或 'exit' 退出")
        print()
        
        while True:
            try:
                user_input = input("\n你的问题: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q', 'bye']:
                    print("退出程序")
                    break
                
                if not user_input:
                    continue
                
                print("生成中...")
                response = pipe.generate(user_input, max_new_tokens=500)
                print(f"\n回答: {response}")
                
            except KeyboardInterrupt:
                print("\n\n程序被中断")
                break
            except Exception as e:
                print(f"错误: {e}")
                continue
        
        return True
        
    except Exception as e:
        print(f"运行失败: {e}")
        return False

def main():
    """主函数"""
    print()
    print("=" * 60)
    print("  Qwen3 OpenVINO 自动部署工具")
    print("=" * 60)
    print()
    print("配置:")
    print(f"  - 模型: {MODEL_ID}")
    print(f"  - 量化: INT4 (Group Size: {GROUP_SIZE}, Ratio: {RATIO})")
    print(f"  - 设备: {DEVICE} (自动回退到 NPU/CPU)")
    print(f"  - 输出: {OUTPUT_DIR}")
    print()
    
    # 步骤 1: 检查依赖
    try:
        check_and_install_packages()
    except Exception as e:
        print(f"✗ 依赖安装失败: {e}")
        return 1
    
    # 步骤 2: 下载模型
    if not download_model():
        print("✗ 模型下载失败")
        return 1
    
    # 步骤 3: 转换模型
    if not convert_model():
        print("✗ 模型转换失败")
        return 1
    
    # 步骤 4: 运行模型
    if not run_model():
        print("✗ 模型运行失败")
        return 1
    
    print()
    print_section("部署完成")
    print(f"模型已保存到: {os.path.abspath(OUTPUT_DIR)}")
    print()
    print("下次运行可以直接使用:")
    print(f"  python -c \"import openvino_genai; pipe = openvino_genai.LLMPipeline('{OUTPUT_DIR}', 'GPU'); print(pipe.generate('Hello!'))\"")
    print()
    
    return 0

if __name__ == "__main__":
    try:
        exit(main())
    except KeyboardInterrupt:
        print("\n\n程序被用户中断")
        exit(1)
    except Exception as e:
        print(f"\n✗ 发生错误: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
