import openvino_genai as ov_genai

print("加载模型到 NPU...")
pipe = ov_genai.LLMPipeline('qwen3-8b-int4-cw-ov', 'NPU')

print("模型加载成功！开始推理...")
response = pipe.generate('What is artificial intelligence?', max_new_tokens=100)

print(f"\n回答: {response}")
