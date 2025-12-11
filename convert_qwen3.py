from optimum.intel.openvino import OVModelForCausalLM
from transformers import AutoTokenizer

print("开始转换模型...")
print("正在加载模型，这可能需要几分钟...")

try:
    # 导出模型到 OpenVINO 格式
    model = OVModelForCausalLM.from_pretrained(
        "./model_dir/Qwen3-8B",
        export=True,
        trust_remote_code=True,
        compile=False
    )
    
    print("模型加载成功，正在保存...")
    
    # 保存转换后的模型
    model.save_pretrained("Qwen3-8B-ov")
    
    # 同时保存 tokenizer
    tokenizer = AutoTokenizer.from_pretrained("./model_dir/Qwen3-8B", trust_remote_code=True)
    tokenizer.save_pretrained("Qwen3-8B-ov")
    
    print("转换完成！模型已保存到 Qwen3-8B-ov 目录")
    
except Exception as e:
    print(f"转换失败，错误信息：{e}")
    import traceback
    traceback.print_exc()
