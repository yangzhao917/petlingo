
import { motion } from 'framer-motion';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { CameraIcon, ImageIcon } from 'lucide-react';
import { catImageApi } from '@/services/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
const CatImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState('GPU');
  const [strictDevice, setStrictDevice] = useState(true);
  const [mode, setMode] = useState('emotion');
  const [modelId, setModelId] = useState('OpenVINO/Phi-3.5-vision-instruct-int4-ov');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setSelectedImage(event.target.result);
        // 自动调用硅基流动平台API进行分析
        setIsLoading(true);
        setResult(null); // 清除之前的结果
        try {
          const analysisResult = await catImageApi.analyzeImage(file, { device, strictDevice, mode, modelId });
          setResult(analysisResult);
        } catch (error) {
          console.error("分析失败:", error);
          setResult({
            emotion: "分析失败",
            confidence: 0,
            description: `图片分析失败: ${error.message}。请检查网络连接或稍后重试。`,
            tips: [
              "请检查网络连接是否正常",
              "确保上传的是清晰的猫咪图片",
              "如问题持续，请联系技术支持"
            ]
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'capture.png', { type: 'image/png' });
      const dataUrl = canvas.toDataURL('image/png');
      setSelectedImage(dataUrl);
      const analysisResult = await catImageApi.analyzeImage(file, { device, strictDevice, mode, modelId });
      setResult(analysisResult);
      stream.getTracks().forEach(t => t.stop());
    } catch (error) {
      setResult({
        emotion: "分析失败",
        confidence: 0,
        description: `拍照分析失败: ${error.message}`,
        tips: ["请授予摄像头权限","确保摄像头可用","稍后重试"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 动态背景装饰组件
  const PhotoDecorations = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 浮动的相机图标 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          📸
        </motion.div>
      ))}
      
      {/* 浮动的图片框架 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`frame-${i}`}
          className="absolute w-16 h-12 border-2 border-orange-300/20 rounded-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 180, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 12 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      {/* 渐变光晕效果 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 pt-8 relative">
      <PhotoDecorations />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📷 AI 猫咪相册分析
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🎨 上传猫咪照片，AI智能分析情绪与行为
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 上传区域 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm border border-orange-400/30 rounded-2xl shadow-2xl shadow-orange-500/10"
              whileHover={{ scale: 1.02, borderColor: 'rgba(251, 146, 60, 0.5)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <motion.h2 
                  className="text-2xl font-bold text-orange-300 mb-6 flex items-center"
                  animate={{ 
                    textShadow: ['0 0 10px rgba(251, 146, 60, 0.5)', '0 0 20px rgba(251, 146, 60, 0.8)', '0 0 10px rgba(251, 146, 60, 0.5)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    📸
                  </motion.div>
                  相册上传中心
                </motion.h2>
                <div className="space-y-6">
                    {/* 推理参数设置 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-orange-300 mb-1">推理设备</label>
                        <select className="w-full bg-black/30 text-orange-200 border border-orange-400/30 rounded px-3 py-2" value={device} onChange={(e)=>setDevice(e.target.value)}>
                          <option value="GPU">GPU</option>
                          <option value="CPU">CPU</option>
                          <option value="NPU">NPU</option>
                        </select>
                        <label className="inline-flex items-center mt-2 text-orange-300">
                          <input type="checkbox" className="mr-2" checked={strictDevice} onChange={(e)=>setStrictDevice(e.target.checked)} />严格设备
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm text-orange-300 mb-1">识别模式</label>
                        <select className="w-full bg-black/30 text-orange-200 border border-orange-400/30 rounded px-3 py-2" value={mode} onChange={(e)=>setMode(e.target.value)}>
                          <option value="emotion">emotion(JSON标签)</option>
                          <option value="raw">raw(原始文本)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-orange-300 mb-1">模型预设</label>
                        <select className="w-full bg-black/30 text-orange-200 border border-orange-400/30 rounded px-3 py-2" value={modelId} onChange={(e)=>setModelId(e.target.value)}>
                          <option value="OpenVINO/Phi-3.5-vision-instruct-int4-ov">Phi-3.5-vision-instruct-int4-ov</option>
                          <option value="snake7gun/Qwen3-VL-8B-Instruct-ov-int4">Qwen3-VL-8B-Instruct-ov-int4</option>
                          <option value="OpenVINO/InternVL2-2B-int4-ov">InternVL2-2B-int4-ov</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-orange-300 mb-1">模型ID / 本地目录</label>
                        <input className="w-full bg-black/30 text-orange-200 border border-orange-400/30 rounded px-3 py-2" value={modelId} onChange={(e)=>setModelId(e.target.value)} placeholder="OpenVINO/Phi-3.5-vision-instruct-int4-ov 或 C:\\path\\to\\model" />
                      </div>
                    </div>
                    {/* 图片预览区域 */}
                    <motion.div 
                      className="border-2 border-dashed border-orange-400/50 rounded-2xl p-8 text-center bg-gradient-to-br from-slate-700/30 to-purple-800/30 backdrop-blur-sm"
                      whileHover={{ borderColor: 'rgba(251, 146, 60, 0.8)', scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedImage ? (
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative group">
                            <motion.img
                              src={selectedImage}
                              alt="上传的猫咪图片"
                              className="mx-auto object-cover rounded-2xl max-h-80 shadow-2xl shadow-orange-500/20 border-2 border-orange-400/30"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                            {/* 相册风格的装饰边框 */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <motion.button
                            className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-orange-500/25"
                            onClick={() => {
                              setSelectedImage(null);
                              setResult(null);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🔄 重新选择
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <motion.div 
                              className="flex flex-col items-center justify-center py-12"
                              whileHover={{ y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-6xl mb-4"
                              >
                                📷
                              </motion.div>
                              <p className="text-xl font-bold text-orange-300 mb-2">
                                📸 点击上传猫咪照片
                              </p>
                              <p className="text-sm text-gray-400">
                                支持 JPG, PNG, GIF 格式 | 最大 10MB
                              </p>
                              <motion.div 
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full border border-orange-400/30"
                                animate={{ 
                                  boxShadow: ['0 0 10px rgba(251, 146, 60, 0.3)', '0 0 20px rgba(251, 146, 60, 0.6)', '0 0 10px rgba(251, 146, 60, 0.3)'],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <span className="text-orange-300 text-sm font-medium">拖拽或点击选择</span>
                              </motion.div>
                            </motion.div>
                          </label>
                        </motion.div>
                      )}
                  </motion.div>

                  {/* 拍照按钮 */}
                  <div className="text-center">
                    <motion.button
                      onClick={handleCameraCapture}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-4 text-lg rounded-full font-bold shadow-lg shadow-pink-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ rotate: isLoading ? 360 : 0 }}
                        transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                        className="inline-flex items-center"
                      >
                        📷
                        <span className="ml-2">拍摄猫咪照片</span>
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* 重新分析按钮 */}
                  {selectedImage && !isLoading && result && (
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.button
                        onClick={async () => {
                          setIsLoading(true);
                          setResult(null);
                          try {
                            // 重新获取文件进行分析
                            const fileInput = document.getElementById('image-upload');
                            if (fileInput.files[0]) {
                              const analysisResult = await catImageApi.analyzeImage(fileInput.files[0], { device, strictDevice, mode, modelId });
                              setResult(analysisResult);
                            }
                          } catch (error) {
                            console.error("重新分析失败:", error);
                            setResult({
                              emotion: "分析失败",
                              confidence: 0,
                              description: `重新分析失败: ${error.message}`,
                              tips: ["请检查网络连接", "确保图片格式正确", "稍后重试"]
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 text-base rounded-full font-medium shadow-lg shadow-orange-500/25 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        🔄 重新分析
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 结果显示区域 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-400/30 rounded-2xl shadow-2xl shadow-purple-500/10"
              whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.5)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <motion.h2 
                  className="text-2xl font-bold text-purple-300 mb-6 flex items-center"
                  animate={{ 
                    textShadow: ['0 0 10px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.8)', '0 0 10px rgba(168, 85, 247, 0.5)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    🎨
                  </motion.div>
                  AI 分析结果
                </motion.h2>
                
                {isLoading ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p 
                      className="text-purple-300 text-lg font-medium"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🔍 AI正在分析猫咪图片...
                    </motion.p>
                    <motion.div 
                      className="mt-4 flex space-x-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
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
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.5)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.h3 
                        className="text-xl font-bold text-purple-300 mb-4 flex items-center"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mr-2"
                        >
                          😸
                        </motion.span>
                        猫咪情绪分析
                      </motion.h3>
                      <div className="flex items-center justify-between">
                        <motion.div 
                          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
                          animate={{ 
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {result.emotion}
                        </motion.div>
                        <motion.div 
                          className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 px-4 py-2 rounded-full border border-green-400/30"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-green-300 font-bold">
                            置信度: {result.confidence}%
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {Array.isArray(result.tips) && result.tips.length > 0 && (
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-400/30 backdrop-blur-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                      >
                        <motion.h4 
                          className="font-bold text-blue-300 mb-4 flex items-center"
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mr-2"
                          >
                            💡
                          </motion.span>
                          专业建议
                        </motion.h4>
                        <div className="space-y-3">
                          {result.tips.map((tip, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start p-3 bg-black/20 rounded-lg border border-blue-400/20"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                              whileHover={{ x: 5, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                            >
                              <span className="text-blue-400 mr-3 text-lg">•</span>
                              <span className="text-gray-200">{tip}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div 
                      className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-6 border border-amber-400/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(245, 158, 11, 0.5)' }}
                    >
                      <motion.h4 
                        className="font-bold text-amber-300 mb-4 flex items-center"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="mr-2"
                        >
                          📖
                        </motion.span>
                        了解猫咪情绪
                      </motion.h4>
                      <motion.p 
                        className="text-gray-200 leading-relaxed bg-black/20 p-4 rounded-lg border border-amber-400/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {result.description}
                      </motion.p>
                      {result.device && (
                        <motion.div 
                          className="mt-4 p-4 bg-black/30 rounded-lg border border-purple-400/30 text-sm text-purple-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div>设备: {result.device}</div>
                          {result.modelDir && <div>模型: {result.modelDir}</div>}
                          {Array.isArray(result.availableDevices) && result.availableDevices.length > 0 && (
                            <div className="mt-1">可用设备: {result.availableDevices.join(', ')}</div>
                          )}
                        </motion.div>
                      )}
                      {result.rawResponse && (
                        <motion.div 
                          className="mt-4 p-4 bg-black/30 rounded-lg border border-pink-400/30 text-sm text-pink-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="font-bold mb-2">原始模型输出</div>
                          <pre className="whitespace-pre-wrap break-words">{result.rawResponse}</pre>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-64 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ 
                        y: [-10, 10, -10],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-6xl mb-6"
                    >
                      🖼️
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-bold text-purple-300 mb-3"
                      animate={{ 
                        textShadow: ['0 0 10px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.8)', '0 0 10px rgba(168, 85, 247, 0.5)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      等待分析
                    </motion.h3>
                    <motion.p 
                      className="text-purple-200 text-lg"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📸 上传猫咪图片后，AI分析结果将显示在这里
                    </motion.p>
                    <motion.div 
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30"
                      animate={{ 
                        boxShadow: ['0 0 10px rgba(168, 85, 247, 0.3)', '0 0 20px rgba(168, 85, 247, 0.6)', '0 0 10px rgba(168, 85, 247, 0.3)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-purple-300 text-sm font-medium">准备就绪，等待上传</span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CatImage;
