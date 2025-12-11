import openvino_genai as ov_genai
import time
import os

# 模型路径 - NF4 量化版本
model_path = "./qwen3_original/Qwen3-4B-nf4-ov"

# 检查模型目录是否存在
if not os.path.exists(model_path):
    print(f"错误: 模型目录不存在: {model_path}")
    print("请先运行 NF4 量化转换命令")
    exit(1)

# 检查必需的模型文件
required_files = ["openvino_model.xml", "openvino_model.bin"]
for file in required_files:
    file_path = os.path.join(model_path, file)
    if not os.path.exists(file_path):
        print(f"错误: 缺少必需文件: {file_path}")
        exit(1)

print("=" * 70)
print("OpenVINO GenAI - Qwen3-4B NF4 量化 NPU 推理测试")
print("=" * 70)

# 使用 NPU 设备
device = "NPU"

print(f"\n[信息] 模型路径: {model_path}")
print(f"[信息] 量化方式: NF4 (NormalFloat4) + 对称量化")
print(f"[信息] 目标设备: {device}")
print(f"[信息] 正在加载模型...\n")

try:
    start_time = time.time()
    
    # 创建 LLM Pipeline，指定 NPU 设备
    pipe = ov_genai.LLMPipeline(model_path, device)
    
    load_time = time.time() - start_time
    print(f"✓ 模型加载成功！耗时: {load_time:.2f} 秒\n")
    
    # 测试提示词
    test_prompts = [
        "你好，请用一句话介绍你自己。",
        "解释一下什么是神经网络。",
        "写一个Python函数计算斐波那契数列。",
        "北京的天气怎么样？"
    ]
    
    total_tokens = 0
    total_time = 0
    
    for i, prompt in enumerate(test_prompts, 1):
        print("=" * 70)
        print(f"测试 {i}/{len(test_prompts)}")
        print("=" * 70)
        print(f"用户: {prompt}")
        print("-" * 70)
        print("助手: ", end="", flush=True)
        
        # 生成回复
        gen_start = time.time()
        result = pipe.generate(prompt, max_new_tokens=150)
        gen_time = time.time() - gen_start
        
        print(result)
        print("-" * 70)
        
        # 估算生成的 token 数量
        tokens_generated = len(result.split())
        total_tokens += tokens_generated
        total_time += gen_time
        
        print(f"生成耗时: {gen_time:.2f} 秒")
        print(f"生成速度: {tokens_generated/gen_time:.2f} tokens/秒")
        print(f"生成词数: {tokens_generated} 词\n")
    
    # 总结
    print("=" * 70)
    print("测试总结")
    print("=" * 70)
    print(f"总测试数: {len(test_prompts)}")
    print(f"总耗时: {total_time:.2f} 秒")
    print(f"平均速度: {total_tokens/total_time:.2f} tokens/秒")
    print(f"模型加载时间: {load_time:.2f} 秒")
    print("=" * 70)
    print("✓ 所有测试完成！NF4 量化模型在 NPU 上运行正常。")
    print("=" * 70)
    
except Exception as e:
    print(f"\n✗ 错误: {e}")
    import traceback
    traceback.print_exc()
    
    # 错误提示
    if device == "NPU":
        print("\n[提示]")
        print("1. 确保 Intel NPU 驱动已正确安装")
        print("2. 如果 NPU 不可用，可以修改 device = 'CPU' 测试")
        print("3. 检查模型文件是否完整")
