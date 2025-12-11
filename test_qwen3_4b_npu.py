import openvino_genai as ov_genai
import time
import os

# 模型路径
model_path = "./qwen3_original/Qwen3-4B-int4-ov"

# 检查模型目录是否存在
if not os.path.exists(model_path):
    print(f"错误: 模型目录不存在: {model_path}")
    exit(1)

# 检查必需的模型文件
required_files = ["openvino_model.xml", "openvino_model.bin"]
for file in required_files:
    file_path = os.path.join(model_path, file)
    if not os.path.exists(file_path):
        print(f"错误: 缺少必需文件: {file_path}")
        exit(1)

print("=" * 60)
print("OpenVINO GenAI - Qwen3-4B NPU 推理测试")
print("=" * 60)

# 可选设备: "NPU", "CPU", "GPU", "AUTO"
device = "NPU"

print(f"\n[1/4] 模型路径: {model_path}")
print(f"[2/4] 目标设备: {device}")
print(f"[3/4] 正在加载模型...")

try:
    start_time = time.time()
    
    # 创建 LLM Pipeline，指定设备
    pipe = ov_genai.LLMPipeline(model_path, device)
    
    load_time = time.time() - start_time
    print(f"[4/4] 模型加载成功！耗时: {load_time:.2f} 秒\n")
    
    # 测试多个提示词
    test_prompts = [
        "你好，请介绍一下你自己。",
        "什么是人工智能？",
        "用Python写一个快速排序算法。"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print("=" * 60)
        print(f"测试 {i}/{len(test_prompts)}")
        print("=" * 60)
        print(f"用户: {prompt}")
        print("助手: ", end="", flush=True)
        
        # 生成回复
        gen_start = time.time()
        result = pipe.generate(prompt, max_new_tokens=200)
        gen_time = time.time() - gen_start
        
        print(result)
        print(f"\n生成耗时: {gen_time:.2f} 秒")
        print(f"生成速度: {200/gen_time:.2f} tokens/秒\n")
    
    print("=" * 60)
    print("所有测试完成！")
    print("=" * 60)
    
except Exception as e:
    print(f"\n错误: {e}")
    import traceback
    traceback.print_exc()
    
    # 如果 NPU 失败，建议尝试 CPU
    if device == "NPU":
        print("\n提示: 如果 NPU 不可用，可以尝试修改 device = 'CPU' 或 'AUTO'")
