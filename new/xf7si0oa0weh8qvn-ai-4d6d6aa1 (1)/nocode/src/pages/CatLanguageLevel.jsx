
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { CardContent, Card } from '@/components/ui/card';
import { MicIcon, XCircleIcon, ArrowLeftIcon, Volume2Icon, CheckCircleIcon, TrophyIcon, PlayIcon, HeartIcon } from 'lucide-react';
import { catLanguageApi } from '@/services/api';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
// 多邻国式关卡数据
const duolingoLevels = [
  {
    id: "1",
    title: "基础猫语识别",
    description: "学习识别猫咪的基本叫声含义",
    icon: "🐱",
    color: "bg-green-500",
    questions: [
      {
        id: "1-1",
        type: "listening", // 听音选择题
        question: "这只猫咪在表达什么？",
        audioFile: "/voice(1)/Catvoice/猫_打招呼.m4a",
        options: [
          { id: "a", text: "打招呼", correct: true },
          { id: "b", text: "生气", correct: false },
          { id: "c", text: "饿了", correct: false },
          { id: "d", text: "害怕", correct: false }
        ],
        explanation: "短促的'喵'声通常表示猫咪在打招呼或引起注意。"
      },
      {
        id: "1-2",
        type: "listening",
        question: "猫咪现在的情绪是？",
        audioFile: "/voice(1)/Catvoice/猫_饿了.m4a",
        options: [
          { id: "a", text: "开心", correct: false },
          { id: "b", text: "饿了", correct: true },
          { id: "c", text: "生病", correct: false },
          { id: "d", text: "想玩", correct: false }
        ],
        explanation: "持续的叫声通常表示猫咪有需求，比如饿了或渴了。"
      },
      {
        id: "1-3",
        type: "mimicry", // 模仿录音题
        question: "请模仿这个猫咪的叫声",
        audioFile: "/voice(1)/Catvoice/猫_撒娇.m4a",
        targetEmotion: "撒娇",
        explanation: "撒娇的叫声通常比较柔和、拖长，表达亲昵和依赖。"
      }
    ]
  },
  {
    id: "2",
    title: "情绪表达进阶",
    description: "识别猫咪复杂的情绪状态",
    icon: "😸",
    color: "bg-blue-500",
    questions: [
      {
        id: "2-1",
        type: "listening",
        question: "这只猫咪的情绪状态是？",
        audioFile: "/voice(1)/Catvoice/猫_警告.m4a",
        options: [
          { id: "a", text: "友好", correct: false },
          { id: "b", text: "警告", correct: true },
          { id: "c", text: "撒娇", correct: false },
          { id: "d", text: "无聊", correct: false }
        ],
        explanation: "低沉的嘶声或咆哮声是猫咪发出警告的信号。"
      },
      {
        id: "2-2",
        type: "listening",
        question: "猫咪想要什么？",
        audioFile: "/voice(1)/Catvoice/猫_想玩耍.m4a",
        options: [
          { id: "a", text: "食物", correct: false },
          { id: "b", text: "玩耍", correct: true },
          { id: "c", text: "睡觉", correct: false },
          { id: "d", text: "独处", correct: false }
        ],
        explanation: "活泼、短促的叫声通常表示猫咪想要玩耍。"
      },
      {
        id: "2-3",
        type: "mimicry",
        question: "模仿这个满足的猫咪叫声",
        audioFile: "/voice(1)/Catvoice/猫_满足.m4a",
        targetEmotion: "满足",
        explanation: "满足的猫咪通常发出轻柔的呼噜声或短促的喵声。"
      }
    ]
  },
  {
    id: "3",
    title: "高级猫语专家",
    description: "成为真正的猫语专家",
    icon: "🎓",
    color: "bg-purple-500",
    questions: [
      {
        id: "3-1",
        type: "listening",
        question: "这只猫咪在做什么？",
        audioFile: "/voice(1)/Catvoice/猫_兴奋捕猎.m4a",
        options: [
          { id: "a", text: "睡觉", correct: false },
          { id: "b", text: "兴奋捕猎", correct: true },
          { id: "c", text: "害怕", correct: false },
          { id: "d", text: "生病", correct: false }
        ],
        explanation: "快速、兴奋的叫声通常表示猫咪处于捕猎状态。"
      },
      {
        id: "3-2",
        type: "listening",
        question: "猫咪现在的状态是？",
        audioFile: "/voice(1)/Catvoice/猫_委屈.m4a",
        options: [
          { id: "a", text: "开心", correct: false },
          { id: "b", text: "委屈", correct: true },
          { id: "c", text: "愤怒", correct: false },
          { id: "d", text: "兴奋", correct: false }
        ],
        explanation: "拖长、带有哀怨的叫声通常表示猫咪感到委屈。"
      },
      {
        id: "3-3",
        type: "mimicry",
        question: "模仿这个求救的猫咪叫声",
        audioFile: "/voice(1)/Catvoice/猫_求救.m4a",
        targetEmotion: "求救",
        explanation: "求救的叫声通常比较急促、高亢，表达紧急需求。"
      }
    ]
  }
];

const CatLanguageLevel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const recordingRef = useRef(null);
  
  // 状态管理
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [similarity, setSimilarity] = useState(0);
  const [showMimicryResult, setShowMimicryResult] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // 初始化关卡数据
  useEffect(() => {
    const level = duolingoLevels.find(l => l.id === id);
    if (level) {
      setCurrentLevel(level);
    }
  }, [id]);

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-teal-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-sky-800 mb-4">关卡未找到</h1>
          <Button onClick={() => navigate('/cat-language')}>
            返回关卡选择
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = currentLevel.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / currentLevel.questions.length) * 100;

  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      setIsAudioPlaying(true);
      audioRef.current.play();
      audioRef.current.onended = () => setIsAudioPlaying(false);
    }
  };

  // 处理选择题答案
  const handleAnswerSelect = (optionId) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
  };

  // 提交答案
  const submitAnswer = () => {
    if (!selectedAnswer) return;
    
    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedAnswer);
    const isCorrect = selectedOption?.correct;
    
    setShowResult(true);
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setAnswerFeedback('correct');
      setShowCelebration(true);
      
      // 庆祝动画
      setTimeout(() => setShowCelebration(false), 1500);
    } else {
      // 错误答案处理
      setAnswerFeedback('incorrect');
      setHeartAnimation('shake');
      
      // 扣除爱心
      setHearts(prev => {
        const newHearts = prev - 1;
        if (newHearts <= 0) {
          setTimeout(() => setGameOver(true), 1000);
        }
        return newHearts;
      });
      
      // 重置动画
      setTimeout(() => {
        setHeartAnimation('');
      }, 600);
    }
    
    // 重置反馈动画
    setTimeout(() => {
      setAnswerFeedback(null);
    }, 1500);
    
    // 2秒后进入下一题（如果游戏没有结束）
    setTimeout(() => {
      if (hearts > 1 || isCorrect) {
        nextQuestion();
      }
    }, 2000);
  };

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // 停止所有音频轨道
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        // 模拟相似度计算
        const mockSimilarity = Math.random() * 40 + 60; // 60-100%
        setSimilarity(mockSimilarity);
        setShowMimicryResult(true);
        
        const isCorrect = mockSimilarity >= 75;
        setIsCorrectAnswer(isCorrect);
        
        if (isCorrect) {
          setScore(prev => prev + 15);
          setAnswerFeedback('correct');
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 1500);
        } else {
          setAnswerFeedback('incorrect');
          setHeartAnimation('shake');
          
          setHearts(prev => {
            const newHearts = prev - 1;
            if (newHearts <= 0) {
              setTimeout(() => setGameOver(true), 1000);
            }
            return newHearts;
          });
          
          setTimeout(() => {
            setHeartAnimation('');
          }, 600);
        }
        
        // 重置反馈动画
        setTimeout(() => {
          setAnswerFeedback(null);
        }, 1500);
        
        // 3秒后进入下一题（如果游戏没有结束）
        setTimeout(() => {
          if (hearts > 1 || isCorrect) {
            nextQuestion();
          }
        }, 3000);
      };

      recordingRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // 3秒后自动停止录音
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 3000);
    } catch (error) {
      console.error('录音失败:', error);
      alert('录音功能需要麦克风权限');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (recordingRef.current && recordingRef.current.state === 'recording') {
      recordingRef.current.stop();
      setIsRecording(false);
    }
  };

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < currentLevel.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowMimicryResult(false);
      setSimilarity(0);
      setRecordedAudio(null);
    } else {
      setLevelCompleted(true);
    }
  };

  // 重新开始关卡
  const restartLevel = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setHearts(3);
    setLevelCompleted(false);
    setShowMimicryResult(false);
    setSimilarity(0);
    setRecordedAudio(null);
  };

  // 关卡完成页面
  if (levelCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-b from-green-100 to-emerald-100 py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-3xl font-bold text-green-800 mb-4"
            >
              关卡完成！
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-2xl font-bold text-green-600 mb-6"
            >
              得分: {score}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate('/cat-language')}
                  className="w-full bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300"
                >
                  返回关卡选择
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={restartLevel}
                  variant="outline"
                  className="w-full shadow-lg transition-all duration-300"
                >
                  重新挑战
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // 游戏失败页面
  if (hearts <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-b from-red-100 to-pink-100 py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="text-6xl mb-4"
            >
              💔
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-3xl font-bold text-red-800 mb-4"
            >
              挑战失败
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-red-600 mb-6"
            >
              别灰心，再试一次吧！
            </motion.p>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-lg font-semibold text-red-700 mb-6"
            >
              当前得分: {score}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={restartLevel}
                  className="w-full bg-red-600 hover:bg-red-700 shadow-lg transition-all duration-300"
                >
                  重新开始
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate('/cat-language')}
                  variant="outline"
                  className="w-full shadow-lg transition-all duration-300"
                >
                  返回关卡选择
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-teal-100 py-8 pb-20">
      <div className="container mx-auto px-4">
        {/* 顶部状态栏 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/cat-language')}
            size="sm"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            退出
          </Button>
          
          <div className="flex items-center space-x-4">
            {/* 爱心 */}
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`text-2xl transition-all duration-300 ${
                    i < hearts ? 'text-red-500' : 'text-gray-300'
                  }`}
                  animate={{
                    scale: heartAnimation === 'shake' && i === hearts ? [1, 1.2, 0.8, 1.1, 1] : 1,
                    rotate: heartAnimation === 'shake' && i === hearts ? [0, -10, 10, -5, 0] : 0,
                    opacity: i < hearts ? 1 : 0.3
                  }}
                  transition={{
                    duration: heartAnimation === 'shake' ? 0.6 : 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <HeartIcon className={`w-6 h-6 ${
                    i < hearts ? 'fill-red-500 text-red-500' : 'fill-gray-300 text-gray-300'
                  }`} />
                </motion.div>
              ))}
            </div>
            
            {/* 分数 */}
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold">
              {score}
            </div>
          </div>
        </motion.div>

        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200" />
            <motion.div
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-2 text-sm text-teal-700 font-medium"
          >
            {currentQuestionIndex + 1} / {currentLevel.questions.length}
          </motion.div>
        </motion.div>

        {/* 题目卡片 */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: answerFeedback === 'correct' ? [1, 1.05, 1] : 
                   answerFeedback === 'incorrect' ? [1, 0.95, 1] : 1
          }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card className={`border-2 shadow-xl transition-all duration-300 ${
            answerFeedback === 'correct' ? 'border-green-400 bg-green-50 shadow-green-200' :
            answerFeedback === 'incorrect' ? 'border-red-400 bg-red-50 shadow-red-200' :
            'border-teal-300 bg-white'
          }`}>
            <CardContent className="p-8">
              <div className="relative">
                <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">
                  {currentQuestion.question}
                </h2>
                
                {/* 庆祝动画 */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="text-6xl animate-bounce">🎉</div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-4xl ml-4"
                      >
                        ⭐
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 音频播放区域 */}
              <div className="text-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    onClick={playAudio}
                    size="lg"
                    className={`w-20 h-20 rounded-full transition-all duration-300 shadow-lg ${
                      isAudioPlaying 
                        ? 'bg-green-500 hover:bg-green-600 shadow-green-300' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-blue-300'
                    }`}
                    disabled={isAudioPlaying}
                  >
                    <motion.div
                      animate={{
                        scale: isAudioPlaying ? [1, 1.2, 1] : 1,
                        rotate: isAudioPlaying ? [0, 5, -5, 0] : 0
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: isAudioPlaying ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      {isAudioPlaying ? (
                        <Volume2Icon className="h-8 w-8" />
                      ) : (
                        <PlayIcon className="h-8 w-8" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
                
                {/* 音频波形动画 */}
                {isAudioPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center mt-4 space-x-1"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full"
                        animate={{
                          height: [4, 20, 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                <audio ref={audioRef} src={currentQuestion.audioFile} preload="auto" />
                <p className="text-sm text-teal-600 mt-2">点击播放音频</p>
              </div>

              {/* 选择题 */}
              {currentQuestion.type === 'listening' && (
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option) => {
                    let buttonClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ";
                    let isSelected = option.id === selectedAnswer;
                    let isCorrect = option.correct;
                    let isWrong = isSelected && !isCorrect && showResult;
                    
                    if (showResult) {
                      if (isCorrect) {
                        buttonClass += "border-green-500 bg-green-100 text-green-800 shadow-lg shadow-green-200";
                      } else if (isWrong) {
                        buttonClass += "border-red-500 bg-red-100 text-red-800 shadow-lg shadow-red-200";
                      } else {
                        buttonClass += "border-gray-300 bg-gray-100 text-gray-600";
                      }
                    } else {
                      if (isSelected) {
                        buttonClass += "border-blue-500 bg-blue-100 text-blue-800 shadow-lg shadow-blue-200";
                      } else {
                        buttonClass += "border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md";
                      }
                    }

                    return (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                        animate={{
                          scale: showResult && isCorrect ? [1, 1.05, 1] : 
                                 showResult && isWrong ? [1, 0.95, 1] : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          onClick={() => handleAnswerSelect(option.id)}
                          className={buttonClass}
                          disabled={showResult}
                          variant="ghost"
                        >
                          <span className="font-medium mr-3">{option.id.toUpperCase()}.</span>
                          {option.text}
                          {showResult && isCorrect && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                              className="ml-auto"
                            >
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </motion.div>
                          )}
                          {showResult && isWrong && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                              className="ml-auto"
                            >
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* 模仿录音题 */}
              {currentQuestion.type === 'mimicry' && (
                <div className="text-center mb-6">
                  {!showMimicryResult ? (
                    <div>
                      <p className="text-teal-700 mb-4">先听音频，然后点击录音按钮模仿</p>
                      <motion.div
                        whileHover={{ scale: isRecording ? 1 : 1.05 }}
                        whileTap={{ scale: isRecording ? 1 : 0.95 }}
                        className="inline-block"
                      >
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          size="lg"
                          className={`w-20 h-20 rounded-full transition-all duration-300 shadow-lg ${
                            isRecording 
                              ? 'bg-red-500 shadow-red-300 animate-pulse' 
                              : 'bg-red-600 hover:bg-red-700 shadow-red-300'
                          }`}
                        >
                          <motion.div
                            animate={{
                              scale: isRecording ? [1, 1.3, 1] : 1,
                              rotate: isRecording ? [0, 10, -10, 0] : 0
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: isRecording ? Infinity : 0,
                              ease: "easeInOut"
                            }}
                          >
                            <MicIcon className="h-8 w-8" />
                          </motion.div>
                        </Button>
                      </motion.div>
                      
                      {/* 录音波形动画 */}
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-center items-center mt-4 space-x-1"
                        >
                          {[...Array(7)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-red-500 rounded-full"
                              animate={{
                                height: [8, 30, 8],
                              }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      
                      <p className="text-sm text-teal-600 mt-2">
                        {isRecording ? '录音中... (点击停止)' : '点击开始录音'}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-100 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-bold text-blue-800 mb-2">相似度评分</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {Math.round(similarity)}%
                      </div>
                      <div className={`text-lg font-medium ${
                        similarity >= 75 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {similarity >= 75 ? '太棒了！' : '继续练习！'}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 结果解释 */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-teal-100 rounded-xl p-4 mb-6"
                >
                  <h3 className="font-bold text-teal-800 mb-2">解释</h3>
                  <p className="text-teal-700">{currentQuestion.explanation}</p>
                </motion.div>
              )}

              {/* 提交按钮 */}
              {currentQuestion.type === 'listening' && !showResult && (
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: selectedAnswer ? 1.05 : 1 }}
                    whileTap={{ scale: selectedAnswer ? 0.95 : 1 }}
                    className="inline-block"
                  >
                    <Button
                      onClick={submitAnswer}
                      disabled={!selectedAnswer}
                      className={`px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 shadow-lg ${
                        selectedAnswer 
                          ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-300 cursor-pointer' 
                          : 'bg-gray-400 cursor-not-allowed shadow-gray-200'
                      }`}
                    >
                      <motion.span
                        animate={{
                          scale: selectedAnswer ? 1 : 0.95,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        提交答案
                      </motion.span>
                    </Button>
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CatLanguageLevel;
