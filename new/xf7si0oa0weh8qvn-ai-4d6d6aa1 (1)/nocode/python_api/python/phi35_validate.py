from PIL import Image
import requests
import sys
import os
from optimum.intel.openvino import OVModelForVisualCausalLM
from modelscope import AutoProcessor, TextStreamer
from openvino.runtime import Core

def main():
    model_id = "OpenVINO/Phi-3.5-vision-instruct-int4-ov"
    device = "GPU"
    image_path = None
    args = sys.argv[1:]
    if len(args) >= 1:
        first = args[0]
        if os.path.exists(first):
            image_path = first
        else:
            device = first.upper()
    if len(args) >= 2:
        device = args[1].upper()

    core = Core()
    available = core.available_devices
    if device not in available:
        print(f"Requested device {device} not available, available: {available}")
        sys.exit(1)

    processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)
    ov_model = OVModelForVisualCausalLM.from_pretrained(model_id, trust_remote_code=True, device=device)

    prompt = "<|image_1|>\nWhat is unusual on this picture?"
    if image_path and os.path.exists(image_path):
        image = Image.open(image_path).convert("RGB")
    else:
        url = "https://github.com/openvinotoolkit/openvino_notebooks/assets/29454499/d5fbbd1a-d484-415c-88cb-9986625b7b11"
        image = Image.open(requests.get(url, stream=True).raw).convert("RGB")

    inputs = ov_model.preprocess_inputs(text=prompt, image=image, processor=processor)
    generation_args = {
        "max_new_tokens": 50,
        "temperature": 0.0,
        "do_sample": False,
        "streamer": TextStreamer(processor.tokenizer, skip_prompt=True, skip_special_tokens=True),
    }
    generate_ids = ov_model.generate(
        **inputs,
        eos_token_id=processor.tokenizer.eos_token_id,
        **generation_args,
    )
    generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
    response = processor.batch_decode(
        generate_ids,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    )[0]
    print(response)

if __name__ == "__main__":
    main()
