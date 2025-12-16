// 模拟API服务，包含所有功能接口
const API_BASE_URL = '/api';

// 模拟延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 导入工具函数
import { convertEmotionToChinese, canTranslate, getTranslatedAudio } from '../utils/emotionMapping';

// 猪叫意图识别API
export const catAudioApi = {
  // 上传音频文件进行分析
  async analyzeAudio(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 发送 fetch 请求到本地 Python FastAPI
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `API请求失败 (${response.status})`;
        if (response.status === 422) {
          errorMessage = '文件格式不支持或参数错误，请检查音频文件格式（支持.m4a, .wav, .mp3）';
        } else if (response.status === 413) {
          errorMessage = '文件过大，请确保音频文件小于20MB';
        } else if (response.status === 503) {
          errorMessage = 'AI模型未就绪，请稍后重试';
        } else if (response.status >= 500) {
          errorMessage = '服务器内部错误，请稍后重试';
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('响应数据:', result);
      
      // 转换后端返回格式为前端期望格式
      if (result.success) {
        const emotion = convertEmotionToChinese(result.emotion || result.label || '未知');
        return {
          intent: emotion,
          confidence: Math.round((result.confidence || 0) * 100),
          description: `检测到猫咪的${emotion}情绪 (置信度: ${Math.round((result.confidence || 0) * 100)}%)`,
          allEmotions: result.all_emotions || {}
        };
      } else if (result.label) {
        // 处理标准化输出格式
        const emotion = convertEmotionToChinese(result.label);
        return {
          intent: emotion,
          confidence: Math.round((result.confidence || 0) * 100),
          description: `检测到猫咪的${emotion}情绪 (置信度: ${Math.round((result.confidence || 0) * 100)}%)`,
          allEmotions: {}
        };
      } else {
        throw new Error('无法解析分析结果');
      }
      
    } catch (error) {
      console.error('猫叫分析失败:', error);
      // 失败时返回错误信息而不是模拟数据
      throw new Error(`分析失败: ${error.message}`);
    }
  },

  // 录制音频进行分析
  async analyzeRecording(audioBlob) {
    try {
      // 将录音的Blob转换为File对象
      const file = new File([audioBlob], 'recording.webm', { type: audioBlob.type });
      
      // 调用相同的分析API
      return await this.analyzeAudio(file);
    } catch (error) {
      console.error('录音分析失败:', error);
      throw new Error(`录音分析失败: ${error.message}`);
    }
  }
  ,async transcribeAudio(file) {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch('http://localhost:8000/asr_transcribe', { method: 'POST', body: formData });
    if (!resp.ok) throw new Error(`ASR请求失败 (${resp.status})`);
    const data = await resp.json();
    if (!data.success) throw new Error(data.error || 'ASR分析失败');
    return data.text || '';
  },
  async transcribeRecording(audioBlob) {
    const file = new File([audioBlob], 'recording.webm', { type: audioBlob.type || 'audio/webm' });
    return await this.transcribeAudio(file);
  }
};

// 猫咪图片分析API - 集成硅基流动平台视觉模型
export const catImageApi = {
  async analyzeImage(file, opts = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const params = new URLSearchParams({
        device: opts.device || 'GPU',
        strict_device: opts.strictDevice === false ? 'false' : 'true',
        model_id: opts.modelId || 'OpenVINO/Phi-3.5-vision-instruct-int4-ov',
        mode: opts.mode || 'emotion',
      });
      const response = await fetch(`http://localhost:8000/vision_analyze?${params.toString()}`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        let errorMessage = `API请求失败 (${response.status})`;
        if (response.status === 422) {
          errorMessage = '图片格式不支持或解析失败，请上传 JPG/PNG 等标准格式';
        } else if (response.status === 413) {
          errorMessage = '图片过大，请确保图片小于10MB';
        } else if (response.status >= 500) {
          errorMessage = '服务器内部错误，请稍后重试';
        }
        throw new Error(errorMessage);
      }
      const result = await response.json();
      return {
        emotion: result.emotion || '分析失败',
        confidence: result.confidence || 0,
        description: result.description || '',
        tips: result.tips || [],
        device: result.device,
        modelDir: result.model_dir,
        availableDevices: result.available_devices,
        rawResponse: result.raw_text || result.response || ''
      };
    } catch (error) {
      return {
        emotion: '分析失败',
        confidence: 0,
        description: `图片分析失败: ${error.message}`,
        tips: [
          '请检查本地模型是否已安装',
          '确保已设置 OV_VISION_MODEL_DIR',
          '稍后重试'
        ]
      };
    }
  },

  // 拍照分析
  async analyzePhoto(imageBlobOrFile, opts = {}) {
    const file = imageBlobOrFile instanceof File
      ? imageBlobOrFile
      : new File([imageBlobOrFile], 'capture.png', { type: imageBlobOrFile?.type || 'image/png' });
    return await this.analyzeImage(file, opts);
  }
};

// 宠物专家大模型API（NPU本地模型）
export const expertLLMApi = {
  async askQuestion(text, opts = {}) {
    const body = {
      question: text,
      max_length: opts.maxLength || 512,
      temperature: opts.temperature ?? 0.7,
      top_p: opts.topP ?? 0.9,
      top_k: opts.topK ?? 50,
    };
    const resp = await fetch('http://localhost:8000/expert_query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`专家接口失败(${resp.status}): ${txt}`);
    }
    const data = await resp.json();
    if (!data.success) throw new Error(data.error || '专家接口返回失败');
    return data;
  }
};

// 猫狗沟通翻译API
export const petCommunicationApi = {
  // 上传音频进行翻译
  async translateAudio(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 发送 fetch 请求
      const response = await fetch('http://117.50.34.14:8000/translate', {
        method: 'POST',
        body: formData
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `API请求失败 (${response.status})`;
        if (response.status === 422) {
          errorMessage = '文件格式不支持或参数错误，请检查音频文件格式（支持.m4a, .wav, .mp3）';
        } else if (response.status === 413) {
          errorMessage = '文件过大，请确保音频文件小于20MB';
        } else if (response.status === 503) {
          errorMessage = 'AI模型未就绪，请稍后重试';
        } else if (response.status >= 500) {
          errorMessage = '服务器内部错误，请稍后重试';
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('响应数据:', result);
      
      if (result.success) {
        // 使用后端返回的正确字段名
        const sourceAnimal = result.original_animal;
        const englishEmotion = result.original_emotion;
        
        // 将英文情绪转换为中文情绪
        const sourceEmotion = convertEmotionToChinese(englishEmotion);
        
        // 构建返回结果 - 使用后端返回的完整信息
        const translationResult = {
          success: true,
          original: {
            type: sourceAnimal === 'cat' ? '猫叫' : '狗叫',
            intent: sourceEmotion, // 现在显示中文情绪
            description: `检测到${sourceAnimal === 'cat' ? '猫咪' : '狗狗'}的${sourceEmotion}情绪 (置信度: ${(result.confidence * 100).toFixed(1)}%)`,
            confidence: result.confidence,
            rawPrediction: result.raw_prediction,
            originalEnglishEmotion: englishEmotion // 保留原始英文情绪用于调试
          },
          converted: {
            type: result.target_animal_name === '猫' ? '猫叫' : '狗叫',
            intent: result.original_emotion_name,
            description: result.description
          },
          audioFilename: result.audio_filename,
          audioPath: result.audio_filename, // 使用文件名而不是完整路径
          canTranslate: true,
          allEmotions: result.all_emotions || {},
          translation: result.translation
        };
        
        return translationResult;
      } else {
        throw new Error(result.error || '翻译失败');
      }
    } catch (error) {
      console.error('翻译API调用失败:', error);
      throw error;
    }
  },

  // 录制音频进行翻译
  async translateRecording(audioBlob) {
    try {
      // 将录音的Blob转换为File对象
      const file = new File([audioBlob], 'recording.webm', { type: audioBlob.type });
      
      // 调用相同的翻译API
      return await this.translateAudio(file);
    } catch (error) {
      console.error('录音翻译失败:', error);
      throw error;
    }
  }
};

// 猫语学习API
export const catLanguageApi = {
  // 获取所有关卡数据
  async getLevels() {
    await delay(500); // 模拟网络延迟
    // 返回关卡数据
    return [
      {
        id: "1",
        title: "基础喵语",
        description: "学习猫咪最基本的叫声含义",
        icon: "🐱",
        color: "bg-green-500",
        lessons: [
          {
            id: "1-1",
            title: "短促喵声",
            content: "猫咪短促的'喵'声通常表示打招呼或引起注意。",
            example: "当猫咪看到你回家时发出的叫声",
            tip: "这种叫声通常伴随着尾巴竖立"
          },
          {
            id: "1-2",
            title: "长音喵声",
            content: "持续的长音喵声通常表示猫咪有需求。",
            example: "猫咪在食盆前发出的叫声",
            tip: "可能表示饥饿或口渴"
          },
          {
            id: "1-3",
            title: "重复喵声",
            content: "连续的喵声表示猫咪非常想要某样东西。",
            example: "猫咪在关着的门前反复叫唤",
            tip: "不要立即回应，避免强化这种行为"
          }
        ]
      },
      {
        id: "2",
        title: "情绪表达",
        description: "通过叫声识别猫咪的情绪状态",
        icon: "😸",
        color: "bg-blue-500",
        lessons: [
          {
            id: "2-1",
            title: "满足的呼噜声",
            content: "呼噜声通常表示猫咪感到满足和放松。",
            example: "猫咪在被抚摸时发出的声音",
            tip: "这是猫咪表达快乐的方式"
          },
          {
            id: "2-2",
            title: "警告嘶声",
            content: "嘶声是猫咪表达恐惧或愤怒的警告信号。",
            example: "猫咪遇到威胁时发出的声音",
            tip: "此时应给猫咪足够的空间"
          },
          {
            id: "2-3",
            title: "颤抖叫声",
            content: "颤抖的叫声通常表示极度兴奋或焦虑。",
            example: "猫咪看到窗外鸟儿时的叫声",
            tip: "观察身体语言以判断是兴奋还是焦虑"
          }
        ]
      },
      {
        id: "3",
        title: "高级沟通",
        description: "掌握复杂的猫咪语言技巧",
        icon: "😻",
        color: "bg-purple-500",
        lessons: [
          {
            id: "3-1",
            title: "无声交流",
            content: "猫咪通过肢体语言进行无声沟通。",
            example: "缓慢眨眼表示信任和爱意",
            tip: "你可以用缓慢眨眼回应猫咪"
          },
          {
            id: "3-2",
            title: "尾巴语言",
            content: "尾巴的姿态传达猫咪的情绪状态。",
            example: "竖立的尾巴表示自信和满足",
            tip: "弯曲的尾巴通常表示友好"
          },
          {
            id: "3-3",
            title: "综合应用",
            content: "结合声音和肢体语言全面理解猫咪。",
            example: "呼噜声+头部摩擦=极度满足",
            tip: "多观察才能成为猫咪沟通专家"
          }
        ]
      },
      {
        id: "4",
        title: "行为解读",
        description: "深入理解猫咪的日常行为",
        icon: "🐾",
        color: "bg-amber-500",
        lessons: [
          {
            id: "4-1",
            title: "抓挠行为",
            content: "猫咪抓挠不仅是磨爪，也是标记领域的方式。",
            example: "猫咪在家具上抓挠的行为",
            tip: "提供足够的抓挠板可以保护家具"
          },
          {
            id: "4-2",
            title: "埋便习惯",
            content: "猫咪掩埋排泄物是天性，表示清洁和隐藏气味。",
            example: "猫咪使用猫砂盆后的行为",
            tip: "保持猫砂盆清洁很重要"
          },
          {
            id: "4-3",
            title: "夜间活动",
            content: "猫咪是晨昏活跃动物，夜间活动是正常的。",
            example: "猫咪在夜间玩耍和探索的行为",
            tip: "可以通过日间游戏消耗精力"
          }
        ]
      },
      {
        id: "5",
        title: "专家进阶",
        description: "成为真正的猫咪沟通专家",
        icon: "🎓",
        color: "bg-pink-500",
        lessons: [
          {
            id: "5-1",
            title: "品种差异",
            content: "不同品种的猫咪有不同的沟通方式。",
            example: "暹罗猫比波斯猫更爱叫",
            tip: "了解你的猫咪品种特点"
          },
          {
            id: "5-2",
            title: "个体识别",
            content: "每只猫咪都有独特的个性和沟通方式。",
            example: "观察你家猫咪的独特习惯",
            tip: "建立与你猫咪的专属沟通方式"
          },
          {
            id: "5-3",
            title: "健康信号",
            content: "异常的叫声和行为可能是健康问题的信号。",
            example: "持续的哀鸣或躲藏行为",
            tip: "注意任何行为上的突然变化"
          }
        ]
      }
    ];
  },

  // 完成课程
  async completeLesson(lessonId) {
    await delay(300); // 模拟网络延迟
    // 模拟API响应
    return { success: true, message: "课程完成" };
  },

  // 重置进度
  async resetProgress() {
    await delay(300); // 模拟网络延迟
    // 模拟API响应
    return { success: true, message: "进度已重置" };
  }
};
