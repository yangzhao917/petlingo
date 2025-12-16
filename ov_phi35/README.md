---
license: mit
license_link: https://huggingface.co/microsoft/Phi-3.5-vision-instruct/resolve/main/LICENSE
language:
- multilingual
pipeline_tag: image-text-to-text
tags:
- nlp
- code
- vision
base_model:
- microsoft/Phi-3.5-vision-instruct
base_model_relation: quantized
---

# Phi-3.5-vision-instruct-int4-ov

 * Model creator: [Microsoft](https://huggingface.co/microsoft)
 * Original model: [Phi-3.5-vision-instruct](https://huggingface.co/microsoft/Phi-3.5-vision-instruct)

## Description

This is [microsoft/Phi-3.5-vision-instruct](https://huggingface.co/microsoft/Phi-3.5-vision-instruct) model converted to the [OpenVINO™ IR](https://docs.openvino.ai/2024/documentation/openvino-ir-format.html) (Intermediate Representation) format  with weights compressed to INT4 using Activation Aware Quantization (AWQ) by [NNCF](https://github.com/openvinotoolkit/nncf).

## Quantization Parameters

Weight compression was performed using `nncf.compress_weights` with the following parameters:

* mode: **INT4_ASYM**
* ratio: 1.0
* group_size: 128
* awq: True
* dataset: [contextual](https://huggingface.co/datasets/ucla-contextual/contextual_test)
* num_samples: 32

## Compatibility

The provided OpenVINO™ IR model is compatible with:

* OpenVINO version 2025.0.0 and higher
* Optimum Intel 1.21.0 and higher

## Running Model Inference with [Optimum Intel](https://huggingface.co/docs/optimum/intel/index)

1. Install packages required for using [Optimum Intel](https://huggingface.co/docs/optimum/intel/index) integration with the OpenVINO backend:

```
pip install --pre -U --extra-index-url https://storage.openvinotoolkit.org/simple/wheels/pre-release openvino_tokenizers openvino

pip install git+https://github.com/huggingface/optimum-intel.git
```

2. Run model inference

```
from PIL import Image 
import requests 
from optimum.intel.openvino import OVModelForVisualCausalLM
from transformers import AutoProcessor, TextStreamer

model_id = "OpenVINO/Phi-3.5-vision-instruct-int4-ov"

processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)

ov_model = OVModelForVisualCausalLM.from_pretrained(model_id, trust_remote_code=True)
prompt = "<|image_1|>\nWhat is unusual on this picture?"

url = "https://github.com/openvinotoolkit/openvino_notebooks/assets/29454499/d5fbbd1a-d484-415c-88cb-9986625b7b11"
image = Image.open(requests.get(url, stream=True).raw)

inputs = ov_model.preprocess_inputs(text=prompt, image=image, processor=processor)

generation_args = { 
    "max_new_tokens": 50, 
    "temperature": 0.0, 
    "do_sample": False,
    "streamer": TextStreamer(processor.tokenizer, skip_prompt=True, skip_special_tokens=True)
} 

generate_ids = ov_model.generate(**inputs, 
  eos_token_id=processor.tokenizer.eos_token_id, 
  **generation_args
)

generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
response = processor.batch_decode(generate_ids, 
  skip_special_tokens=True, 
  clean_up_tokenization_spaces=False)[0]

```

## Limitations


Check the original [model card](https://huggingface.co/microsoft/Phi-3.5-vision-instruct) for limitations.

## Legal information

The original model is distributed under [MIT](https://huggingface.co/microsoft/Phi-3.5-vision-instruct/blob/main/LICENSE) license. More details can be found in [original model card](https://huggingface.co/microsoft/Phi-3.5-vision-instruct).
