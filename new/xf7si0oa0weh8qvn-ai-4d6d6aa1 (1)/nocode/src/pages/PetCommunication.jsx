import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  MicIcon,
  Volume2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightLeftIcon,
  Play,
  Pause,
  MessageCircle,
  Heart,
  Zap,
  Sparkles
} from 'lucide-react';

// 对话气泡装饰组件
const ChatDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 浮动对话气泡 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.1
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MessageCircle 
            className={`w-6 h-6 ${
              i % 4 === 0 ? 'text-pink-300' :
              i % 4 === 1 ? 'text-blue-300' :
              i % 4 === 2 ? 'text-purple-300' : 'text-green-300'
            }`} 
          />
        </motion.div>
      ))}
      
      {/* 心形装饰 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            scale: 0.5
          }}
          animate={{
            y: -50,
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeOut"
          }}
        >
          <Heart className="w-4 h-4 text-pink-200 fill-pink-200" />
        </motion.div>
      ))}
      
      {/* 闪烁星星 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </motion.div>
      ))}
    </div>
  );
};

const PetCommunication = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const autoDetectionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);

  // 情绪标签与狗叫音频文件的映射关系 - 只包含实际存在的7个音频文件
  const emotionToDogAudioMap = {
    '吵架': '狗_吵架.m4a',
    '哀求': '狗_哀求.m4a',
    '撒娇': '狗_撒娇.m4a',
    '求偶': '狗_求偶.m4a',
    '着急': '狗_着急.m4a',
    '警告': '狗_警告.m4a',
    '饿了': '狗_饿了.m4a'
  };

  // 调用本地Python FastAPI进行音频分析
  const analyzeAudioWithLocalAPI = async (audioFile) => {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData
      });

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
      console.log('本地API响应数据:', result);
      
      // 获取概率最高的情绪标签
      let highestEmotion = '';
      let highestConfidence = 0;
      
      if (result.success && result.all_emotions) {
        // 找到概率最高的情绪
        for (const [emotion, confidence] of Object.entries(result.all_emotions)) {
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            highestEmotion = emotion;
          }
        }
      } else if (result.label) {
        highestEmotion = result.label;
        highestConfidence = result.confidence || 0;
      }
      
      // 转换为中文情绪标签
      const chineseEmotion = convertEmotionToChinese(highestEmotion);
      
      return {
        success: true,
        emotion: chineseEmotion,
        confidence: Math.round(highestConfidence * 100),
        original: {
          type: "猫叫分析",
          intent: chineseEmotion,
          description: `检测到猫咪的${chineseEmotion}情绪 (置信度: ${Math.round(highestConfidence * 100)}%)`
        },
        converted: {
          type: "狗叫回应",
          intent: chineseEmotion,
          description: `将播放对应${chineseEmotion}情绪的狗叫声音`
        },
        canTranslate: emotionToDogAudioMap.hasOwnProperty(chineseEmotion),
        audioPath: emotionToDogAudioMap[chineseEmotion] || null,
        allEmotions: result.all_emotions || {}
      };
      
    } catch (error) {
      console.error('本地API调用失败:', error);
      throw error;
    }
  };

  // 情绪转换函数
  const convertEmotionToChinese = (englishEmotion) => {
    const emotionMap = {
      'fighting': '吵架',
      'begging': '哀求', 
      'acting_cute': '撒娇',
      'mating': '求偶',
      'anxious': '着急',
      'warning': '警告',
      'hungry': '饿了',
      'excited_hunting': '兴奋捕猎',
      'friendly_call': '友好呼唤',
      'good_food': '好吃',
      'wronged': '委屈',
      'want_to_play': '想玩耍',
      'greeting': '打招呼',
      'fight_ready': '打架预备',
      'bored': '无聊',
      'satisfied': '满足',
      'comfortable': '舒服',
      'go_away': '走开'
    };
    return emotionMap[englishEmotion] || englishEmotion;
  };

  const handleRecord = async () => {
    if (!isRecording) {
      // 开始录音
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // 停止所有音频轨道
          stream.getTracks().forEach(track => track.stop());
          
          // 调用本地Python FastAPI进行分析
          setIsLoading(true);
          try {
            const analysisResult = await analyzeAudioWithLocalAPI(audioBlob);
            setResult(analysisResult);
            setCurrentEmotion(analysisResult.emotion);
            toast.success('录音分析完成！');
            
            // 自动播放对应的狗音频
            if (analysisResult.success && analysisResult.audioPath) {
              setTimeout(() => {
                playDogAudio(analysisResult.audioPath);
              }, 1000); // 延迟1秒播放，让用户看到识别结果
            } else if (analysisResult.success && !analysisResult.audioPath) {
              toast.info(`识别到${analysisResult.emotion}情绪，但暂无对应的狗音频文件`);
            }
          } catch (error) {
            console.error("录音分析失败:", error);
            toast.error('录音分析失败: ' + error.message);
            // 显示错误信息
            setResult({
              success: false,
              error: error.message,
              original: {
                type: "录音",
                intent: "分析失败",
                description: error.message
              },
              converted: {
                type: "建议",
                intent: "重试或使用文件上传",
                description: "请检查网络连接和麦克风权限，或使用文件上传功能"
              }
            });
          } finally {
            setIsLoading(false);
          }
        };
        
        setIsRecording(true);
        setResult(null);
        mediaRecorderRef.current.start();
        toast.success('开始录音，请让宠物叫一声！');
        
      } catch (error) {
        console.error('录音权限获取失败:', error);
        toast.error('无法访问麦克风，请检查浏览器权限设置');
        setResult({
          success: false,
          error: '麦克风权限被拒绝',
          original: {
            type: "权限错误",
            intent: "无法录音",
            description: "浏览器无法访问麦克风，请检查权限设置"
          },
          converted: {
            type: "建议",
            intent: "使用文件上传",
            description: "请使用文件上传功能进行音频翻译"
          }
        });
      }
    } else {
      // 停止录音
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.info('录音已停止，正在处理...');
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      setIsPlaying(false);
      setResult(null); // 清除之前的结果
      setCurrentEmotion(null);
      try {
        // 调用本地Python FastAPI进行分析
        const analysisResult = await analyzeAudioWithLocalAPI(file);
        setResult(analysisResult);
        setCurrentEmotion(analysisResult.emotion);
        toast.success('音频分析完成！');
        
        // 自动播放对应的狗音频
        if (analysisResult.success && analysisResult.audioPath) {
          setTimeout(() => {
            playDogAudio(analysisResult.audioPath);
          }, 1000); // 延迟1秒播放，让用户看到识别结果
        } else if (analysisResult.success && !analysisResult.audioPath) {
          toast.info(`识别到${analysisResult.emotion}情绪，但暂无对应的狗音频文件`);
        }
      } catch (error) {
        console.error("分析失败:", error);
        toast.error('分析失败: ' + error.message);
        // 显示错误信息
        setResult({
          success: false,
          error: error.message,
          original: {
            type: "错误",
            intent: "分析失败",
            description: error.message
          },
          converted: {
            type: "错误",
            intent: "分析失败",
            description: "请检查文件格式和网络连接，然后重试"
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const playDogAudio = async (audioFileName) => {
    try {
      setIsPlaying(true);
      
      // 构建狗叫音频文件的本地路径
      const audioUrl = `/voice(1)/Dogvoice/${encodeURIComponent(audioFileName)}`;
      console.log('播放狗叫音频URL:', audioUrl);
      
      audioRef.current.src = audioUrl;
      
      // 设置音频事件监听器
      audioRef.current.onended = handleAudioEnded;
      audioRef.current.onerror = handleAudioError;
      
      await audioRef.current.play();
      toast.success(`正在播放${currentEmotion}情绪的狗叫声`);
    } catch (error) {
      console.error('狗叫音频播放失败:', error);
      setIsPlaying(false);
      toast.error('狗叫音频播放失败: ' + error.message);
    }
  };

  const handlePlayDogAudio = async () => {
    if (!result?.audioPath) {
      console.error('没有可播放的狗叫音频文件');
      toast.error('该情绪暂无对应的狗叫音频');
      return;
    }

    await playDogAudio(result.audioPath);
  };

  // 音频播放结束事件处理
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 音频播放错误事件处理
  const handleAudioError = (error) => {
    console.error('音频播放错误:', error);
    setIsPlaying(false);
  };

  // 初始化音频上下文和分析器
  const initializeAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      return true;
    } catch (error) {
      console.error('音频上下文初始化失败:', error);
      toast.error('无法访问麦克风，请检查权限设置');
      return false;
    }
  };

  // 检测音频音量
  const detectAudioLevel = () => {
    if (!analyserRef.current) return 0;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // 计算平均音量
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    
    return average;
  };

  // 录制音频片段用于分析
  const recordAudioSegment = async () => {
    return new Promise((resolve) => {
      if (!streamRef.current) {
        resolve(null);
        return;
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };
      
      mediaRecorder.start();
      
      // 录制1秒
      setTimeout(() => {
        mediaRecorder.stop();
      }, 1000);
    });
  };

  // 自动检测和分析音频
  const autoDetectAndAnalyze = async () => {
    if (!isAutoDetecting || !analyserRef.current) return;
    
    const currentLevel = detectAudioLevel();
    setAudioLevel(currentLevel);
    
    // 音量阈值，超过此值认为有声音
    const VOLUME_THRESHOLD = 30;
    const currentTime = Date.now();
    
    // 检测到声音且距离上次检测超过3秒（避免频繁检测）
    if (currentLevel > VOLUME_THRESHOLD && 
        currentTime - lastDetectionTimeRef.current > 3000 && 
        !isLoading && !isPlaying) {
      
      lastDetectionTimeRef.current = currentTime;
      console.log('检测到声音，开始分析...', currentLevel);
      
      try {
        setIsLoading(true);
        const audioBlob = await recordAudioSegment();
        
        if (audioBlob) {
          const analysisResult = await analyzeAudioWithLocalAPI(audioBlob);
          setResult(analysisResult);
          setCurrentEmotion(analysisResult.emotion);
          
          // 自动播放对应的狗叫声
          if (analysisResult.success && analysisResult.audioPath) {
            setTimeout(() => {
              playDogAudio(analysisResult.audioPath);
            }, 500); // 延迟500ms播放
          }
          
          toast.success(`自动检测到${analysisResult.emotion}情绪`);
        }
      } catch (error) {
        console.error('自动分析失败:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 开始自动检测
  const startAutoDetection = async () => {
    if (isAutoDetecting) return;
    
    const initialized = await initializeAudioContext();
    if (!initialized) return;
    
    setIsAutoDetecting(true);
    toast.success('自动检测已开启，每秒监听音频...');
    
    // 每秒检测一次
    autoDetectionRef.current = setInterval(autoDetectAndAnalyze, 1000);
  };

  // 停止自动检测
  const stopAutoDetection = () => {
    setIsAutoDetecting(false);
    
    if (autoDetectionRef.current) {
      clearInterval(autoDetectionRef.current);
      autoDetectionRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
    toast.info('自动检测已停止');
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopAutoDetection();
    };
  }, []);

  // 自动开启检测（页面加载后自动开始）
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoDetection();
    }, 1000); // 延迟1秒自动开启
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 动态背景装饰 */}
      <ChatDecorations />
      
      {/* 渐变网格背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] opacity-30"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
      }}></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            💬 跨物种沟通翻译器 🐱🐶
          </motion.h1>
          <motion.p 
            className="text-xl text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            让猫咪和狗狗能够互相理解，架起宠物间的沟通桥梁
          </motion.p>
        </motion.div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 上传区域 - 对话气泡风格 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            {/* 对话气泡尾巴 */}
            <div className="absolute -left-4 top-8 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[20px] border-r-purple-500/20"></div>
            
            <Card className="h-full border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md shadow-2xl shadow-purple-500/20">
              <CardHeader>
                <motion.div>
                  <CardTitle className="text-purple-200 flex items-center text-xl">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <MicIcon className="mr-3 h-6 w-6 text-pink-400" />
                    </motion.div>
                    🎤 猫咪对话中心
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 文件上传 - 对话气泡风格 */}
                  <motion.div 
                    className="border-2 border-dashed border-pink-400/50 rounded-2xl p-8 text-center cursor-pointer bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm hover:from-purple-700/40 hover:to-pink-700/40 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      id="audio-upload"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Volume2Icon className="h-12 w-12 text-pink-400 mb-3" />
                        </motion.div>
                        <motion.p 
                          className="text-lg font-medium text-purple-200 mb-1"
                          animate={{ opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          📁 点击上传猫咪音频文件
                        </motion.p>
                        <p className="text-sm text-purple-300">
                          🎵 支持 MP3, WAV, M4A 格式
                        </p>
                      </div>
                    </label>
                  </motion.div>

                  {/* 自动检测状态显示 */}
                  <motion.div 
                    className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-2xl p-4 border border-green-400/30 backdrop-blur-sm shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-green-200 flex items-center">
                        <Zap className="mr-2 h-4 w-4 text-green-400" />
                        🤖 自动检测模式
                      </h4>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={isAutoDetecting ? stopAutoDetection : startAutoDetection}
                          size="sm"
                          className={`${
                            isAutoDetecting
                              ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                              : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          } text-white px-4 py-2 rounded-full border border-white/20`}
                        >
                          {isAutoDetecting ? '⏹️ 停止' : '▶️ 开启'}
                        </Button>
                      </motion.div>
                    </div>
                    
                    {isAutoDetecting && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-300">🎵 音量检测:</span>
                          <span className="text-white font-mono">{Math.round(audioLevel)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                            style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                            animate={{ opacity: audioLevel > 30 ? [0.7, 1, 0.7] : 1 }}
                            transition={{ duration: 0.5, repeat: audioLevel > 30 ? Infinity : 0 }}
                          />
                        </div>
                        <motion.p 
                          className="text-xs text-green-200"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔊 正在监听音频...检测到声音将自动分析
                        </motion.p>
                      </div>
                    )}
                  </motion.div>

                  {/* 录音按钮 - 对话气泡风格 */}
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleRecord}
                        disabled={isRecording || isLoading || isAutoDetecting}
                        className={`${
                          isRecording
                            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30"
                            : isAutoDetecting
                            ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30"
                        } text-white px-8 py-6 text-lg rounded-full border-2 border-white/20 backdrop-blur-sm`}
                      >
                        {isRecording ? (
                          <motion.div 
                            className="flex items-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <motion.div 
                              className="w-3 h-3 bg-white rounded-full mr-3"
                              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            ></motion.div>
                            🎙️ 录制中...点击停止
                          </motion.div>
                        ) : isAutoDetecting ? (
                          <div className="flex items-center">
                            <MicIcon className="mr-3 h-5 w-5" />
                            🤖 自动模式运行中
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <motion.div>
                              <MicIcon className="mr-3 h-5 w-5" />
                            </motion.div>
                            🎤 手动录制猫咪叫声
                          </div>
                        )}
                      </Button>
                    </motion.div>
                    {isRecording && (
                      <motion.p 
                        className="mt-3 text-purple-300"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🎵 正在录制...请让猫咪对着麦克风叫一声
                      </motion.p>
                    )}
                    {isAutoDetecting && (
                      <motion.p 
                        className="mt-3 text-green-300"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🤖 自动检测模式：每秒监听，有声音自动分析播放
                      </motion.p>
                    )}
                  </div>

                  <motion.div 
                    className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-2xl p-6 border border-yellow-400/30 backdrop-blur-sm shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.h4 
                      className="font-bold text-yellow-200 mb-3 flex items-center text-lg"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div>
                        <ArrowRightLeftIcon className="mr-3 h-5 w-5 text-yellow-400" />
                      </motion.div>
                      💫 跨物种沟通魔法
                    </motion.h4>
                    <p className="text-yellow-100 text-sm leading-relaxed">
                      🧠 我们的AI技术可以识别猫咪叫声中的情感和意图，然后播放对应情绪的狗叫声音，帮助猫狗之间更好地沟通理解。
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 结果显示区域 - 对话气泡风格 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            {/* 对话气泡尾巴 */}
            <div className="absolute -right-4 top-8 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[20px] border-l-indigo-500/20"></div>
            
            <Card className="h-full border-2 border-indigo-400/30 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-md shadow-2xl shadow-indigo-500/20">
              <CardHeader>
                <motion.div>
                  <CardTitle className="text-indigo-200 flex items-center text-xl">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <MessageCircle className="mr-3 h-6 w-6 text-blue-400" />
                    </motion.div>
                    💬 AI 对话分析
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="relative mb-6"
                    >
                      <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full"></div>
                      <motion.div
                        className="absolute inset-2 border-4 border-purple-400/30 border-b-purple-400 rounded-full"
                      ></motion.div>
                    </motion.div>
                    <motion.p 
                      className="text-indigo-200 text-lg"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🧠 AI正在分析猫咪情绪...
                    </motion.p>
                    <motion.div 
                      className="flex space-x-2 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        ></motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {result.success ? (
                      <>
                        <motion.div 
                          className="text-center"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
                          </motion.div>
                          <motion.h3 
                            className="text-xl font-semibold text-green-300 mb-2"
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ✨ 分析成功！
                          </motion.h3>
                          <motion.p 
                            className="text-green-200 mb-4 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            🎯 已成功识别猫咪情绪：<span className="font-bold text-green-300">{currentEmotion}</span>
                          </motion.p>
                        </motion.div>

                        <motion.div 
                          className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-6 rounded-2xl mb-4 border border-blue-400/30 backdrop-blur-sm shadow-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <motion.h4 
                            className="font-semibold text-blue-200 mb-3 flex items-center text-lg"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🐱 猫咪情绪分析
                          </motion.h4>
                          <motion.p 
                            className="text-blue-100 mb-2 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <strong className="text-blue-300">🎭 识别情绪：</strong> 
                            <span className="ml-2 px-3 py-1 bg-blue-500/30 rounded-full text-blue-200 font-medium">
                              {currentEmotion}
                            </span>
                          </motion.p>
                          <motion.p 
                            className="text-blue-100 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <strong className="text-blue-300">📊 置信度：</strong> 
                            <span className="ml-2 px-3 py-1 bg-green-500/30 rounded-full text-green-200 font-medium">
                              {result.confidence ? `${result.confidence.toFixed(3)}` : '高'}
                            </span>
                          </motion.p>
                        </motion.div>

                        <motion.div 
                          className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-6 rounded-2xl mb-4 border border-green-400/30 backdrop-blur-sm shadow-lg"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <motion.h4 
                            className="font-semibold text-green-200 mb-3 flex items-center text-lg"
                            animate={{ x: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🐶 狗狗智能回应
                          </motion.h4>
                          <motion.p 
                            className="text-green-100 mb-2 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <strong className="text-green-300">🔊 回应类型：</strong> 
                            <span className="ml-2 px-3 py-1 bg-green-500/30 rounded-full text-green-200 font-medium">
                              狗叫声
                            </span>
                          </motion.p>
                          <motion.p 
                            className="text-green-100 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 }}
                          >
                            <strong className="text-green-300">💝 表达情绪：</strong> 
                            <span className="ml-2 px-3 py-1 bg-purple-500/30 rounded-full text-purple-200 font-medium">
                              {currentEmotion}
                            </span>
                          </motion.p>
                        </motion.div>

                        {/* 音频播放区域 - 对话气泡风格 */}
                        {currentEmotion && (
                          <motion.div 
                            className="text-center pt-6 border-t border-purple-400/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                          >
                            <motion.p 
                              className="text-sm text-purple-200 mb-4 flex items-center justify-center"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <motion.span
                                className="mr-2"
                              >
                                🎵
                              </motion.span>
                              播放狗叫回应音频
                            </motion.p>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={handlePlayDogAudio}
                                disabled={isPlaying}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 border border-purple-400/30 backdrop-blur-sm disabled:opacity-50"
                              >
                                {isPlaying ? (
                                  <motion.div 
                                    className="flex items-center"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <motion.div>
                                      <Pause className="w-6 h-6" />
                                    </motion.div>
                                    🎵 播放中...
                                  </motion.div>
                                ) : (
                                  <motion.div 
                                    className="flex items-center"
                                    whileHover={{ x: 2 }}
                                  >
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                      <Play className="w-6 h-6" />
                                    </motion.div>
                                    🐕 播放狗叫回应
                                  </motion.div>
                                )}
                              </Button>
                            </motion.div>
                            <audio ref={audioRef} style={{ display: 'none' }} />
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <XCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        </motion.div>
                        <motion.h3 
                          className="text-xl font-semibold text-red-300 mb-2"
                          animate={{ opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ❌ 分析失败
                        </motion.h3>
                        <motion.p 
                          className="text-red-200 mb-4 text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {result?.error || '🚫 无法识别猫咪情绪，请重试'}
                        </motion.p>
                        <motion.div 
                          className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-6 rounded-2xl border border-yellow-400/30 backdrop-blur-sm text-left"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.h4 
                            className="font-semibold text-yellow-200 mb-3 flex items-center"
                            animate={{ x: [0, 2, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <motion.span
                              className="mr-2"
                            >
                              💡
                            </motion.span>
                            建议：
                          </motion.h4>
                          <motion.ul 
                            className="text-yellow-100 text-sm space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            {[
                              '🔊 确保音频清晰，背景噪音较少',
                              '⏱️ 录制时长建议在2-10秒之间', 
                              '📱 让猫咪靠近麦克风',
                              '🎵 尝试不同的猫叫声类型'
                            ].map((tip, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="flex items-center"
                              >
                                <span className="mr-2">•</span>
                                {tip}
                              </motion.li>
                            ))}
                          </motion.ul>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-64 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRightLeftIcon className="h-16 w-16 text-indigo-400 mb-4" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-medium text-indigo-200 mb-2"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      💬 等待对话翻译
                    </motion.h3>
                    <motion.p 
                      className="text-indigo-300 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      🎙️ 上传或录制宠物叫声后，翻译结果将显示在这里
                    </motion.p>
                    <motion.div 
                      className="flex justify-center space-x-2 mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        ></motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PetCommunication;
