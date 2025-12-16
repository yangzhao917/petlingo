
"""Run locally:
  cd D:/Desktop/hackthon/DogAndCat/code
  # (activate your venv)
  pip install fastapi uvicorn python-multipart
  # (plus your existing requirements)
  uvicorn main_api:app --host 0.0.0.0 --port 8000 --reload

Docs:  http://127.0.0.1:8000/docs
Form:  http://127.0.0.1:8000/
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from typing import Optional
import tempfile
import os
import traceback
import base64
from PIL import Image
from openvino.runtime import Core

# 确保 predict.py 和本文件同目录，并且包含 AudioEmotionPredictor
from predict import AudioEmotionPredictor

app = FastAPI(title="Cat & Dog Voice Emotion API", version="0.1.1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor: Optional[AudioEmotionPredictor] = None
asr_pipeline = None
asr_model = None
asr_ms_pipeline = None
ov_llm_pipe = None
ov_llm_lock = None

@app.on_event("startup")
def _load_model_once():
    global predictor
    global ov_llm_pipe, ov_llm_lock
    try:
        predictor = AudioEmotionPredictor()
        predictor.load_model()  # 默认从 ../models 读取
    except Exception as e:
        traceback.print_exc()
        raise RuntimeError(f"Failed to initialize predictor: {e}")
    try:
        import openvino_genai as ov_genai
        model_dir = os.environ.get("QWEN3_NPU_MODEL_DIR") or os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "qwen3-8b-int4-cw-ov")
        if not os.path.exists(model_dir):
            # 允许用户将模型目录放在项目根目录下，例如 C:\Users\devcloud\Desktop\new\qwen3-8b-int4-cw-ov
            alt_dir = os.path.join(os.path.expanduser("~"), "Desktop", "new", "qwen3-8b-int4-cw-ov")
            model_dir = alt_dir if os.path.exists(alt_dir) else model_dir
        ov_llm_pipe = ov_genai.LLMPipeline(model_dir, device="NPU")
        import threading
        ov_llm_lock = threading.Lock()
    except Exception:
        # 不抛出启动错误，接口内返回明确错误
        ov_llm_pipe = None
        ov_llm_lock = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/labels")
def labels():
    global predictor
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "animal_labels": getattr(predictor, "animal_labels", None),
        "emotion_labels": getattr(predictor, "emotion_labels", None),
        "emotion_name_map": getattr(predictor, "emotion_name_map", None),
    }

@app.get("/")
def index():
    html = """
    <html>
    <head><title>Upload audio</title></head>
    <body>
      <h3>Upload a cat/dog audio (.m4a/.wav)</h3>
      <form action="/predict" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept="audio/*" required />
        <button type="submit">Predict</button>
      </form>
      <p>API docs: <a href="/docs">/docs</a></p>
      <p>猫咪图片识别: <a href="/cat_vision">/cat_vision</a></p>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

@app.get("/vision")
def vision_page():
    env_model_dir = os.environ.get("OV_VISION_MODEL_DIR") or ""
    html = f"""
    <html>
    <head>
      <meta charset=\"utf-8\" />
      <title>Vision Analyze</title>
      <style>
        body {{ font-family: Arial, sans-serif; max-width: 900px; margin: 24px auto; }}
        .row {{ margin: 8px 0; }}
        label {{ display: inline-block; width: 140px; }}
        select, input[type=text] {{ width: 420px; }}
        #resp {{ white-space: pre-wrap; background: #f6f8fa; padding: 12px; border: 1px solid #ddd; }}
      </style>
    </head>
    <body>
      <h2>图片识别（OpenVINO VLM）</h2>
      <div class=\"row\">
        <label>图片文件</label>
        <input type=\"file\" id=\"file\" accept=\"image/*\" />
      </div>
      <div class=\"row\">
        <label>推理设备</label>
        <select id=\"device\">
          <option value=\"GPU\" selected>GPU</option>
          <option value=\"CPU\">CPU</option>
          <option value=\"NPU\">NPU</option>
        </select>
        <label style=\"width:auto;margin-left:16px;\"><input type=\"checkbox\" id=\"strict\" checked /> 严格设备</label>
      </div>
      <div class=\"row\">
        <label>识别模式</label>
        <select id=\"mode\">
          <option value=\"emotion\" selected>emotion(JSON标签)</option>
          <option value=\"raw\">raw(原始文本)</option>
        </select>
      </div>
      <div class=\"row\">
        <label>模型选择</label>
        <select id=\"modelPreset\">
          <option value=\"OpenVINO/Phi-3.5-vision-instruct-int4-ov\" selected>Phi-3.5-vision-instruct-int4-ov</option>
          <option value=\"OpenVINO/InternVL2-2B-int4-ov\">InternVL2-2B-int4-ov</option>
          <option value=\"OpenVINO/Qwen2.5-VL-7B-instruct-int4-ov\">Qwen2.5-VL-7B-instruct-int4-ov</option>
        </select>
      </div>
      <div class=\"row\">
        <label>自定义模型</label>
        <input type=\"text\" id=\"modelId\" placeholder=\"例如: OpenVINO/Phi-3.5-vision-instruct-int4-ov 或本地目录\" value=\"{env_model_dir}\" />
      </div>
      <div class=\"row\">
        <button id=\"runBtn\">开始识别</button>
      </div>
      <h3>返回结果</h3>
      <div id=\"resp\"></div>
      <script>
        const btn = document.getElementById('runBtn');
        btn.onclick = async () => {{
          const f = document.getElementById('file');
          if (!f.files || !f.files[0]) {{ alert('请选择图片'); return; }}
          const fd = new FormData();
          fd.append('file', f.files[0]);
          const device = document.getElementById('device').value;
          const strict = document.getElementById('strict').checked ? 'true' : 'false';
          const mode = document.getElementById('mode').value;
          let model = document.getElementById('modelId').value.trim();
          if (!model) {{ model = document.getElementById('modelPreset').value; }}
          fd.append('device', device);
          fd.append('strict_device', strict);
          fd.append('mode', mode);
          if (model) fd.append('model_id', model);
          const resp = document.getElementById('resp');
          resp.textContent = '请求中...';
          try {{
            const r = await fetch('/vision_analyze', {{ method: 'POST', body: fd }});
            const t = await r.text();
            resp.textContent = t;
          }} catch(e) {{
            resp.textContent = String(e);
          }}
        }};
      </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

@app.get("/cat_vision")
def cat_vision_page():
    html = """
    <html>
    <head>
      <meta charset=\"utf-8\" />
      <title>猫咪图片识别</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 24px auto; }
        .row { margin: 8px 0; }
        label { display: inline-block; width: 140px; }
        select, input[type=text] { width: 420px; }
        #resp { white-space: pre-wrap; background: #f6f8fa; padding: 12px; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h2>猫咪图片识别（OpenVINO VLM）</h2>
      <div class=\"row\">
        <label>图片文件</label>
        <input type=\"file\" id=\"file\" accept=\"image/*\" />
      </div>
      <div class=\"row\">
        <label>推理设备</label>
        <select id=\"device\">
          <option value=\"GPU\" selected>GPU</option>
          <option value=\"CPU\">CPU</option>
          <option value=\"NPU\">NPU</option>
        </select>
        <label style=\"width:auto;margin-left:16px;\"><input type=\"checkbox\" id=\"strict\" checked /> 严格设备</label>
      </div>
      <div class=\"row\">
        <label>识别模式</label>
        <select id=\"mode\">
          <option value=\"emotion\" selected>emotion(JSON标签)</option>
          <option value=\"raw\">raw(原始文本)</option>
        </select>
      </div>
      <div class=\"row\">
        <label>模型选择</label>
        <select id=\"modelPreset\">
          <option value=\"OpenVINO/Phi-3.5-vision-instruct-int4-ov\" selected>Phi-3.5-vision-instruct-int4-ov</option>
        </select>
      </div>
      <div class=\"row\">
        <label>自定义模型</label>
        <input type=\"text\" id=\"modelId\" placeholder=\"可填写本地目录或在线模型ID\" />
      </div>
      <div class=\"row\">
        <button id=\"runBtn\">开始识别</button>
      </div>
      <h3>返回结果</h3>
      <div id=\"resp\"></div>
      <script>
        const btn = document.getElementById('runBtn');
        btn.onclick = async () => {
          const f = document.getElementById('file');
          if (!f.files || !f.files[0]) { alert('请选择图片'); return; }
          const fd = new FormData();
          fd.append('file', f.files[0]);
          const device = document.getElementById('device').value;
          const strict = document.getElementById('strict').checked ? 'true' : 'false';
          const mode = document.getElementById('mode').value;
          let model = document.getElementById('modelId').value.trim();
          if (!model) { model = document.getElementById('modelPreset').value; }
          fd.append('device', device);
          fd.append('strict_device', strict);
          fd.append('mode', mode);
          if (model) fd.append('model_id', model);
          const resp = document.getElementById('resp');
          resp.textContent = '请求中...';
          try {
            const r = await fetch('/vision_analyze', { method: 'POST', body: fd });
            const t = await r.text();
            resp.textContent = t;
          } catch(e) {
            resp.textContent = String(e);
          }
        };
      </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

def _normalize_output(res):
    """
    把任意返回值转成 JSON 友好结构：
    - dict 或 list[dict]：直接返回
    - (label, prob) / [label, prob]：转成 {label, confidence, raw}
    - 其他：包在 {"result": ...} 里
    """
    if isinstance(res, dict):
        return res
    if isinstance(res, list) and (len(res) == 0 or isinstance(res[0], dict)):
        return res
    if isinstance(res, (list, tuple)) and len(res) >= 2 and isinstance(res[0], str):
        label = res[0]
        conf = None
        try:
            conf = float(res[1])
        except Exception:
            pass
        return {"label": label, "confidence": conf, "raw": jsonable_encoder(res)}
    if isinstance(res, (str, int, float)):
        return {"result": res}
    return {"result": jsonable_encoder(res)}

@app.post("/predict")
def predict_api(file: UploadFile = File(...)):
    global predictor
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not ready")

    MAX_SIZE = 20 * 1024 * 1024  # 20MB
    try:
        contents = file.file.read()
        if len(contents) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read upload")

    suffix = os.path.splitext(file.filename or "upload")[1]
    if suffix == "":
        suffix = ".m4a"

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # 注意：不再传 return_json / top_k
        raw_result = predictor.predict_emotion(tmp_path)
        result = _normalize_output(raw_result)
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
    finally:
        try:
            if 'tmp_path' in locals() and os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass

@app.post("/expert_query")
def expert_query(payload: dict = Body(...)):
    try:
        question = str(payload.get("question") or "").strip()
        if not question:
            raise HTTPException(status_code=400, detail="question不能为空")
        max_length = int(payload.get("max_length") or 512)
        temperature = float(payload.get("temperature") or 0.7)
        top_p = float(payload.get("top_p") or 0.9)
        top_k = int(payload.get("top_k") or 50)
        global ov_llm_pipe, ov_llm_lock
        if ov_llm_pipe is None:
            raise HTTPException(status_code=503, detail="NPU模型未就绪，请检查 QWEN3_NPU_MODEL_DIR 或本地模型目录")
        system_prompt = (
            "你是一位宠物专家，擅长猫狗行为、训练、健康与安全。"
            "只回答与宠物相关的问题，给出可操作建议；如问题与宠物无关，请礼貌提醒并引导到宠物主题。"
        )
        prompt = f"{system_prompt}\n用户: {question}\n专家:"
        import time
        t0 = time.time()
        try:
            if ov_llm_lock:
                with ov_llm_lock:
                    answer = ov_llm_pipe.generate(prompt, max_length=max_length, temperature=temperature, top_p=top_p, top_k=top_k)
            else:
                answer = ov_llm_pipe.generate(prompt, max_length=max_length, temperature=temperature, top_p=top_p, top_k=top_k)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"NPU推理失败: {e}")
        latency_ms = int((time.time() - t0) * 1000)
        model_dir = getattr(ov_llm_pipe, "model_path", None) or "qwen3-8b-int4-cw-ov"
        return JSONResponse(content={
            "success": True,
            "answer": str(answer or ""),
            "model_dir": model_dir,
            "device": "NPU",
            "usage": {"prompt_tokens": len(prompt), "output_tokens": len(str(answer or ""))},
            "latency_ms": latency_ms,
        })
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Expert query failed: {e}")

@app.post("/translate")
def translate_api(file: UploadFile = File(...)):
    """翻译接口：识别输入音频的动物类型和情绪，返回对应的翻译音频文件路径"""
    global predictor
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not ready")

    MAX_SIZE = 20 * 1024 * 1024  # 20MB
    try:
        contents = file.file.read()
        if len(contents) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large")
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read upload")

    suffix = os.path.splitext(file.filename or "upload")[1]
    if suffix == "":
        suffix = ".m4a"

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # 预测情绪
        prediction_result = predictor.predict_emotion(tmp_path)
        
        if not prediction_result.get('success', False):
            raise HTTPException(status_code=500, detail=prediction_result.get('error', 'Prediction failed'))
        
        # 获取预测结果
        animal = prediction_result['animal']
        emotion = prediction_result['emotion']
        confidence = prediction_result['confidence']
        
        # 确定目标动物类型（翻译逻辑：猫->狗，狗->猫）
        target_animal = 'dog' if animal == 'cat' else 'cat'
        target_animal_cn = '狗' if animal == 'cat' else '猫'
        
        # 构建音频文件路径
        voice_dir = os.path.join('..', '..', 'voice(1)')
        if target_animal == 'cat':
            audio_folder = 'Catvoice'
        else:
            audio_folder = 'Dogvoice'
        
        audio_filename = f"{target_animal_cn}_{emotion}.m4a"
        audio_path = os.path.join(voice_dir, audio_folder, audio_filename)
        
        # 检查音频文件是否存在
        if not os.path.exists(audio_path):
            # 如果找不到对应情绪的音频，尝试一些通用的情绪映射
            emotion_mapping = {
                '兴奋捕猎': ['兴奋', '捕猎', '活跃'],
                '友好呼唤': ['友好', '呼唤', '打招呼'],
                '撒娇': ['撒娇', '可爱', '亲昵'],
                '警告': ['警告', '威胁', '生气'],
                '饿了': ['饿了', '要食物', '饥饿'],
                '着急': ['着急', '焦虑', '不安'],
                '求偶': ['求偶', '发情'],
                '哀求': ['哀求', '请求', '委屈']
            }
            
            # 尝试找到相似的情绪
            found_audio = None
            for available_emotion, similar_emotions in emotion_mapping.items():
                if emotion in similar_emotions:
                    test_filename = f"{target_animal_cn}_{available_emotion}.m4a"
                    test_path = os.path.join(voice_dir, audio_folder, test_filename)
                    if os.path.exists(test_path):
                        audio_path = test_path
                        audio_filename = test_filename
                        found_audio = available_emotion
                        break
            
            if not found_audio:
                # 如果还是找不到，使用默认音频（如果存在）
                default_emotions = ['打招呼', '撒娇', '友好呼唤']
                for default_emotion in default_emotions:
                    default_filename = f"{target_animal_cn}_{default_emotion}.m4a"
                    default_path = os.path.join(voice_dir, audio_folder, default_filename)
                    if os.path.exists(default_path):
                        audio_path = default_path
                        audio_filename = default_filename
                        break
        
        # 构建返回结果
        result = {
            'success': True,
            'original_animal': animal,
            'original_emotion': emotion,
            'original_emotion_name': prediction_result.get('emotion_name', emotion),
            'confidence': confidence,
            'target_animal': target_animal,
            'target_animal_name': target_animal_cn,
            'audio_filename': audio_filename,
            'audio_path': audio_path,
            'translation': f"这是一只{animal}的{emotion}声音，翻译成{target_animal_cn}语就是这样的",
            'description': f"检测到{animal}的{emotion}情绪（置信度：{confidence:.2f}），为您播放对应的{target_animal_cn}语音频"
        }
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Translation failed: {e}")
    finally:
        try:
            if 'tmp_path' in locals() and os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass

@app.get("/audio/{filename}")
def get_audio_file(filename: str):
    """获取音频文件"""
    try:
        # 构建音频文件路径
        voice_dir = os.path.join('..', '..', 'voice(1)')
        
        # 根据文件名判断是猫还是狗的音频
        if filename.startswith('猫_'):
            audio_folder = 'Catvoice'
        elif filename.startswith('狗_'):
            audio_folder = 'Dogvoice'
        else:
            raise HTTPException(status_code=404, detail="Audio file not found")
        
        audio_path = os.path.join(voice_dir, audio_folder, filename)
        
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=404, detail="Audio file not found")
        
        return FileResponse(
            path=audio_path,
            media_type="audio/m4a",
            filename=filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to serve audio file: {e}")

@app.post("/asr_transcribe")
def asr_transcribe(file: UploadFile = File(...), asr_model_id: Optional[str] = None):
    try:
        contents = file.file.read()
        if len(contents) > 30 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large")
        suffix = os.path.splitext(file.filename or "upload")[1]
        if suffix == "":
            suffix = ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
        global asr_model
        if asr_model is None or asr_model_id:
            model_sel = asr_model_id or os.environ.get("ASR_MODEL_DIR") or "paraformer-zh"
            try:
                from funasr import AutoModel
                asr_model = AutoModel(model=model_sel)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"ASR init failed: {e}")
        try:
            import soundfile as sf
            try:
                waveform, sr = sf.read(tmp_path)
                res = asr_model.generate(input=waveform, fs=sr, batch_size_s=60)
            except Exception:
                res = asr_model.generate(input=tmp_path, batch_size_s=60)
            text = ""
            if isinstance(res, list) and res and isinstance(res[0], dict):
                text = str(res[0].get("text") or "")
            elif isinstance(res, dict):
                text = res.get("text") or res.get("output") or ""
            else:
                text = str(res)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ASR run failed: {e}")
        return JSONResponse(content={"success": True, "text": text})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASR failed: {e}")

@app.post("/vision_analyze")
def vision_analyze(
    file: UploadFile = File(...),
    device: Optional[str] = None,
    strict_device: Optional[bool] = False,
    model_id: Optional[str] = None,
    mode: Optional[str] = "emotion",
):
    try:
        MAX_SIZE = 10 * 1024 * 1024
        contents = file.file.read()
        if len(contents) > MAX_SIZE:
            raise HTTPException(status_code=413, detail="File too large")

        suffix = os.path.splitext(file.filename or "upload")[1].lower()
        if suffix == "":
            suffix = ".jpg"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name


        model_dir = os.environ.get("OV_VISION_MODEL_DIR")
        cache_root = os.path.join(os.path.expanduser("~"), ".cache", "modelscope", "hub", "models")
        chosen_model = None
        if model_id:
            if os.path.isdir(model_id):
                chosen_model = model_id
            else:
                cached = os.path.join(cache_root, model_id.replace("/", os.sep))
                chosen_model = cached if os.path.isdir(cached) else model_id
        elif model_dir and os.path.isdir(model_dir):
            chosen_model = model_dir
        else:
            default_id = "OpenVINO/Phi-3.5-vision-instruct-int4-ov"
            cached_def = os.path.join(cache_root, default_id.replace("/", os.sep))
            chosen_model = cached_def if os.path.isdir(cached_def) else default_id
        if not model_id:
            has_model = False
            try:
                if model_dir and os.path.exists(model_dir):
                    has_model = True
            except Exception:
                has_model = False
            if not has_model and not (model_dir or model_id):
                return JSONResponse(content={
                    "emotion": "分析失败",
                    "confidence": 0,
                    "description": "本地视觉模型未安装或未配置。请设置环境变量 OV_VISION_MODEL_DIR 指向已下载的 OpenVINO 优化模型目录，或在请求中提供 model_id 以在线加载。",
                    "tips": [
                        "安装 openvino、optimum-intel、modelscope",
                        "提供 model_id=OpenVINO/Phi-3.5-vision-instruct-int4-ov",
                        "或设置 OV_VISION_MODEL_DIR 并重启服务"
                    ]
                })

        try:
            from optimum.intel.openvino import OVModelForVisualCausalLM
            from modelscope import AutoProcessor
            from PIL import Image
            requested_device = (device or os.environ.get("OV_DEVICE") or "GPU").upper()
            core = Core()
            available = core.available_devices
            device = requested_device if requested_device in available else "CPU"
            strict = strict_device or (os.environ.get("OV_STRICT_DEVICE", "0") == "1")
            if strict and device != requested_device:
                raise RuntimeError(f"Requested device {requested_device} not available: {available}")
            processor = AutoProcessor.from_pretrained(chosen_model, trust_remote_code=True)
            ov_model = OVModelForVisualCausalLM.from_pretrained(chosen_model, trust_remote_code=True, device=device)
            img = Image.open(tmp_path).convert("RGB")
            labels = [
                "兴奋捕猎","友好呼唤","吵架","好吃","委屈","想玩耍","打招呼","打架预备",
                "撒娇","无聊","求偶","求救","满足","着急","舒服","警告","走开","饿了"
            ]
            if mode == "raw":
                prompt = "<|image_1|>\nWhat is unusual on this picture?"
            else:
                prompt = (
                    "<|image_1|>\n"
                    + "请分析这张猫咪图片，从以下18个标签中选择一个最匹配的："
                    + ",".join(labels)
                    + "。仅输出一个不带任何代码块标记和反引号的纯JSON对象，不得输出额外文字或数组。"
                    + "JSON字段要求：{"
                    + "\"emotion\": 以上标签之一,"
                    + "\"confidence\": 0-100 的整数,"
                    + "\"description\": 用中文简要说明(不超过40字),"
                    + "\"tips\": [3条中文建议，每条不超过12字]"
                    + "}."
                )
            inputs = ov_model.preprocess_inputs(text=prompt, image=img, processor=processor)
            generate_ids = ov_model.generate(
                **inputs,
                eos_token_id=processor.tokenizer.eos_token_id,
                max_new_tokens=120,
                temperature=0.0,
                do_sample=False,
            )
            generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
            text = processor.batch_decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]
            if mode == "raw":
                return JSONResponse(content={
                    "response": text,
                    "model_dir": chosen_model,
                    "device": device,
                    "available_devices": available
                })
            parsed = None
            parsed_list = None
            try:
                import re, json
                clean = re.sub(r"```[\s\S]*?```", "", text)
                m_arr = re.search(r"\[[\s\S]*?\]", clean)
                if m_arr:
                    parsed_list = json.loads(m_arr.group(0))
                else:
                    m_obj = re.search(r"\{[\s\S]*?\}", clean)
                    if m_obj:
                        parsed = json.loads(m_obj.group(0))
            except Exception:
                parsed = None
            if parsed_list:
                candidate = None
                try:
                    for item in parsed_list:
                        if isinstance(item, dict) and ("emotion" in item or "confidence" in item):
                            candidate = item
                            break
                    if candidate is None:
                        for item in parsed_list:
                            if isinstance(item, dict):
                                candidate = item
                                break
                except Exception:
                    candidate = None
                if candidate:
                    emo = candidate.get("emotion") or "满足"
                    conf = candidate.get("confidence") or 0
                    try:
                        conf = int(conf)
                    except Exception:
                        conf = 0
                    if conf < 0:
                        conf = 0
                    if conf > 100:
                        conf = 100
                    desc = candidate.get("description") or ""
                    desc = str(desc).strip()[:40]
                    tips = candidate.get("tips") or []
                    if isinstance(tips, list):
                        tips = [str(t).strip()[:12] for t in tips][:3]
                    else:
                        tips = []
                    if emo not in labels:
                        for l in labels:
                            if l in text:
                                emo = l
                                break
                    return JSONResponse(content={
                        "emotion": emo,
                        "confidence": conf,
                        "description": desc,
                        "tips": tips,
                        "model_dir": chosen_model,
                        "device": device,
                        "available_devices": available,
                        "raw_text": text
                    })
            if parsed:
                emo = parsed.get("emotion") or "满足"
                conf = parsed.get("confidence") or 0
                try:
                    conf = int(conf)
                except Exception:
                    conf = 0
                if conf < 0:
                    conf = 0
                if conf > 100:
                    conf = 100
                desc = parsed.get("description") or ""
                desc = str(desc).strip()[:40]
                tips = parsed.get("tips") or []
                if isinstance(tips, list):
                    tips = [str(t).strip()[:12] for t in tips][:3]
                else:
                    tips = []
                if emo not in labels:
                    for l in labels:
                        if l in text:
                            emo = l
                            break
                return JSONResponse(content={
                    "emotion": emo,
                    "confidence": conf,
                    "description": desc,
                    "tips": tips,
                    "model_dir": chosen_model,
                    "device": device,
                    "available_devices": available,
                    "raw_text": text
                })
            chosen = None
            import re
            mc = re.search(r"confidence[^0-9]*(\d{1,3})", text, re.IGNORECASE)
            conf_val = 0
            if mc:
                try:
                    conf_val = int(mc.group(1))
                except Exception:
                    conf_val = 0
            if conf_val < 0:
                conf_val = 0
            if conf_val > 100:
                conf_val = 100
            for l in labels:
                if l in text:
                    chosen = l
                    break
            if not chosen:
                emo_from_text = None
                try:
                    import re
                    m_emo = re.search(r"\"emotion\"\s*:\s*\"([^\"]+)\"", text)
                    if m_emo:
                        emo_from_text = m_emo.group(1)
                except Exception:
                    emo_from_text = None
                return JSONResponse(content={
                    "emotion": emo_from_text or "满足",
                    "confidence": conf_val,
                    "description": text,
                    "tips": [],
                    "model_dir": chosen_model,
                    "device": device,
                    "available_devices": available,
                    "raw_text": text
                })
            return JSONResponse(content={
                "emotion": chosen,
                "confidence": conf_val,
                "description": text,
                "tips": [],
                "model_dir": chosen_model,
                "device": device,
                "available_devices": available,
                "raw_text": text
            })
        except Exception as e:
            return JSONResponse(content={
                "emotion": "分析失败",
                "confidence": 0,
                "description": f"推理失败: {e}",
                "tips": [
                    "确认模型目录可用",
                    "检查 Python 依赖是否安装",
                    "查看服务日志"
                ]
            })
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Vision analyze failed: {e}")
    finally:
        try:
            if 'tmp_path' in locals() and os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
