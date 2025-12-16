import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CardContent, Card } from '@/components/ui/card';
import { 
  ArrowLeftIcon, 
  Volume2Icon, 
  CheckCircleIcon, 
  XCircleIcon, 
  HeartIcon, 
  TrophyIcon,
  RotateCcwIcon,
  PlayIcon
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// 猫咪学习人类语言的题目数据
const learningQuestions = {
  cat: [
    {
      id: "cat-1",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20orange%20cartoon%20cat%20staring%20at%20empty%20cat%20food%20bowl%20with%20big%20sad%20eyes%2C%20hungry%20expression%2C%20cat%20food%20kibbles%20scattered%20around%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我饿了",
      options: ["我累了", "我饿了", "我生气了", "我开心"],
      audioFile: "/voice/human/我饿了.mp3",
      explanation: "当小猫咪看着空空的猫粮碗，用可怜的眼神望着主人时，它想说'我饿了'。"
    },
    {
      id: "cat-2",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=adorable%20cartoon%20cat%20rubbing%20against%20human%20leg%20with%20heart%20eyes%2C%20showing%20affection%2C%20pink%20hearts%20floating%20around%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我爱你",
      options: ["我爱你", "我想出去", "我害怕", "我生病了"],
      audioFile: "/voice/human/我爱你.mp3",
      explanation: "当小猫咪蹭着主人的腿，眼中满含爱意时，它想表达'我爱你'。"
    },
    {
      id: "cat-3",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=sleepy%20cartoon%20cat%20yawning%20with%20droopy%20eyes%2C%20stretching%20paws%2C%20cozy%20blanket%20nearby%2C%20tired%20expression%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我困了",
      options: ["我困了", "我冷", "我无聊", "我想吃"],
      audioFile: "/voice/human/我困了.mp3",
      explanation: "当小猫咪打哈欠，眼睛眯成一条线时，它想说'我困了'。"
    },
    {
      id: "cat-4",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=playful%20cartoon%20cat%20with%20feather%20toy%2C%20pouncing%20position%2C%20excited%20expression%2C%20colorful%20cat%20toys%20around%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我想玩",
      options: ["我想睡觉", "我想玩", "我想吃", "我想出去"],
      audioFile: "/voice/human/我想玩.mp3",
      explanation: "当小猫咪摆出扑击姿势，盯着羽毛玩具时，它想说'我想玩'。"
    },
    {
      id: "cat-5",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20cat%20drinking%20water%20from%20blue%20water%20bowl%2C%20pink%20tongue%20out%2C%20thirsty%20expression%2C%20water%20droplets%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我渴了",
      options: ["我渴了", "我热", "我饱了", "我冷"],
      audioFile: "/voice/human/我渴了.mp3",
      explanation: "当小猫咪伸出粉色小舌头喝水时，它想表达'我渴了'。"
    },
    {
      id: "cat-6",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20cat%20sitting%20by%20window%20looking%20outside%2C%20curious%20expression%2C%20birds%20flying%20outside%2C%20longing%20eyes%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我想出去",
      options: ["我想出去", "我害怕", "我想睡觉", "我生气了"],
      audioFile: "/voice/human/我想出去.mp3",
      explanation: "当小猫咪坐在窗边，眼神渴望地看着外面的世界时，它想说'我想出去'。"
    },
    {
      id: "cat-7",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cartoon%20cat%20with%20droopy%20ears%20and%20sad%20eyes%2C%20apologetic%20expression%2C%20knocked%20over%20plant%20pot%20nearby%2C%20guilty%20look%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "对不起",
      options: ["对不起", "谢谢", "再见", "你好"],
      audioFile: "/voice/human/对不起.mp3",
      explanation: "当小猫咪做错事后，耷拉着耳朵露出愧疚表情时，它想说'对不起'。"
    },
    {
      id: "cat-8",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20cartoon%20cat%20with%20full%20food%20bowl%2C%20satisfied%20expression%2C%20licking%20lips%2C%20content%20and%20grateful%20look%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "谢谢",
      options: ["谢谢", "再见", "你好", "晚安"],
      audioFile: "/voice/human/谢谢.mp3",
      explanation: "当小猫咪吃饱后，满足地舔舔嘴唇看着主人时，它想表达'谢谢'。"
    }
  ],
  dog: [
    {
      id: "dog-1",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20wagging%20tail%20happily%20with%20big%20smile%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "你好",
      options: ["你好", "再见", "谢谢", "对不起"],
      audioFile: "/voice/human/你好.mp3",
      explanation: "看到狗狗摇尾巴开心的样子，应该选择'你好'来打招呼。"
    },
    {
      id: "dog-2",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20looking%20at%20empty%20food%20bowl%20with%20sad%20puppy%20eyes%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我饿了",
      options: ["我饿了", "我累了", "我病了", "我怕"],
      audioFile: "/voice/human/我饿了.mp3",
      explanation: "看到空碗和可怜的表情，狗狗在说'我饿了'。"
    },
    {
      id: "dog-3",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20running%20in%20park%20with%20frisbee%2C%20energetic%20and%20happy%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "我想玩",
      options: ["我想玩", "我想睡", "我想吃", "我想走"],
      audioFile: "/voice/human/我想玩.mp3",
      explanation: "看到狗狗在公园里奔跑玩飞盘，应该选择'我想玩'。"
    },
    {
      id: "dog-4",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20giving%20thanks%20with%20paws%20together%2C%20grateful%20expression%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "谢谢",
      options: ["谢谢", "对不起", "没关系", "不客气"],
      audioFile: "/voice/human/谢谢.mp3",
      explanation: "看到狗狗双爪合十感谢的姿势，应该选择'谢谢'。"
    },
    {
      id: "dog-5",
      image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20looking%20sorry%20with%20droopy%20ears%20and%20apologetic%20eyes%2C%20kawaii%20style%2C%20simple%20illustration&image_size=square",
      correctAnswer: "对不起",
      options: ["对不起", "没关系", "谢谢", "再见"],
      audioFile: "/voice/human/对不起.mp3",
      explanation: "看到狗狗耷拉着耳朵道歉的表情，应该选择'对不起'。"
    }
  ]
};

const HumanLanguageLearning = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  // 状态管理
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const currentQuestions = learningQuestions.cat;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / currentQuestions.length) * 100;

  // 播放音频
  const playAudio = (audioFile) => {
    // 模拟播放音频，实际项目中需要真实的音频文件
    setIsAudioPlaying(true);
    
    // 使用 Web Speech API 进行语音合成
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(audioFile.replace('/voice/human/', '').replace('.mp3', ''));
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsAudioPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      // 如果不支持语音合成，模拟播放时间
      setTimeout(() => {
        setIsAudioPlaying(false);
      }, 1500);
    }
  };

  // 处理答案选择
  const handleAnswerSelect = (option) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    setIsCorrectAnswer(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setAnswerFeedback('correct');
      setShowCelebration(true);
      
      // 播放正确答案的音频
      playAudio(currentQuestion.audioFile);
      
      // 庆祝动画
      setTimeout(() => setShowCelebration(false), 1500);
    } else {
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
    
    // 2秒后进入下一题
    setTimeout(() => {
      if (hearts > 1 || isCorrect) {
        nextQuestion();
      }
    }, 2500);
  };

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setLevelCompleted(true);
    }
  };

  // 重新开始
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setHearts(3);
    setLevelCompleted(false);
    setGameOver(false);
  };

  // 游戏结束页面
  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-100 py-12 relative overflow-hidden"
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/40 to-rose-300/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/40 to-red-300/40 rounded-full blur-3xl"></div>
          
          {/* 飘落的心碎表情 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              💔
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 300 }}
            className="max-w-md mx-auto relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border-2 border-red-200/50 relative overflow-hidden">
                {/* 卡片装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-rose-300/30 rounded-full blur-2xl"></div>
                
                <motion.div 
                  className="text-8xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  😿
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-6"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  学习暂停
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-red-600 mb-8 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  💪 小猫咪别灰心，继续努力学习人类语言吧！
                </motion.p>
                
                <motion.p 
                  className="text-3xl font-bold bg-gradient-to-r from-red-700 to-rose-700 bg-clip-text text-transparent mb-8 p-4 bg-red-50/50 rounded-2xl border border-red-200"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🏆 最终得分: {score}分
                </motion.p>
                
                <div className="flex gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={restartGame} 
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-lg h-14 px-8 shadow-lg border-0"
                    >
                      <RotateCcwIcon className="mr-3 h-5 w-5" />
                      🔄 重新开始
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="text-red-700 border-2 border-red-300 hover:bg-red-100 bg-white/80 backdrop-blur-sm font-bold text-lg h-14 px-8 shadow-lg"
                    >
                      <ArrowLeftIcon className="mr-3 h-5 w-5" />
                      🏠 返回主页
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // 关卡完成页面
  if (levelCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-12 relative overflow-hidden"
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/40 to-emerald-300/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/40 to-green-300/40 rounded-full blur-3xl"></div>
          
          {/* 飘落的庆祝表情 */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              {['🎉', '🎊', '⭐', '🌟', '✨', '🏆', '🎈', '🎁'][i]}
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 300 }}
            className="max-w-md mx-auto relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border-2 border-green-200/50 relative overflow-hidden">
                {/* 卡片装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/30 to-green-300/30 rounded-full blur-xl"></div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎉 学习完成！
                </motion.h1>
                
                <motion.p 
                  className="text-lg text-green-600 mb-8 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🐱 恭喜小猫咪！你已经学会了基本的人类语言表达！
                </motion.p>
                
                <motion.p 
                  className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-8 p-4 bg-green-50/50 rounded-2xl border border-green-200"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🏆 最终得分: {score}分
                </motion.p>
                
                <div className="flex gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={restartGame} 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg h-14 px-8 shadow-lg border-0"
                    >
                      <RotateCcwIcon className="mr-3 h-5 w-5" />
                      🔄 再次练习
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="text-green-700 border-2 border-green-300 hover:bg-green-100 bg-white/80 backdrop-blur-sm font-bold text-lg h-14 px-8 shadow-lg"
                    >
                      <ArrowLeftIcon className="mr-3 h-5 w-5" />
                      🏠 返回主页
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 py-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-amber-300/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/40 to-orange-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-amber-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
        
        {/* 浮动的猫咪表情 */}
        <motion.div
          className="absolute top-20 right-20 text-4xl"
          animate={{ 
            y: [0, -20, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🐱
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-16 text-3xl"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          💭
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-10 text-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          ❤️
        </motion.div>
      </div>
      
      {/* 庆祝动画 */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div 
              className="text-8xl"
              animate={{
              scale: [1, 1.2, 1]
            }}
              transition={{ duration: 1.5 }}
            >
              🎉
            </motion.div>
            {/* 粒子效果 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: Math.cos(i * 45 * Math.PI / 180) * 200,
                  y: Math.sin(i * 45 * Math.PI / 180) * 200,
                  opacity: 0
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        {/* 头部信息 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-100/50 backdrop-blur-sm border border-orange-200/50 shadow-lg transition-all duration-300"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              返回主页
            </Button>
          </motion.div>
          
          <div className="flex items-center gap-6">
            {/* 猫咪学习标识 */}
            <motion.div 
              className="flex items-center bg-gradient-to-r from-orange-100/80 to-amber-100/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-orange-200/50"
              animate={{ 
                boxShadow: [
                  '0 4px 20px rgba(251, 146, 60, 0.2)',
                  '0 8px 30px rgba(251, 146, 60, 0.3)',
                  '0 4px 20px rgba(251, 146, 60, 0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-3xl mr-3"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🐱
              </motion.span>
              <span className="text-orange-800 font-bold text-lg">猫咪学人话</span>
            </motion.div>
            
            {/* 爱心生命值 */}
            <motion.div 
              className={`flex gap-2 ${heartAnimation}`}
              whileHover={{ scale: 1.1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < hearts ? {
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                >
                  <HeartIcon
                    className={`h-8 w-8 transition-all duration-300 ${
                      i < hearts ? 'text-red-500 fill-red-500 drop-shadow-lg' : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* 分数 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Badge 
                variant="secondary" 
                className="text-xl px-6 py-3 bg-gradient-to-r from-amber-200 to-orange-200 text-orange-800 font-bold shadow-lg border border-orange-300/50"
              >
                ⭐ {score}分
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 relative z-10"
        >
          <motion.div 
            className="bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎓 小猫咪学人类语言
              </motion.h2>
              <motion.span 
                className="text-lg text-orange-600 font-semibold bg-orange-100/50 px-4 py-2 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                📝 第 {currentQuestionIndex + 1} 题 / 共 {currentQuestions.length} 题
              </motion.span>
            </div>
            
            {/* 自定义进度条 */}
            <div className="relative">
              <div className="w-full bg-orange-100 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-full shadow-sm relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* 进度条光效 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
              
              {/* 进度百分比 */}
              <motion.div 
                className="absolute right-0 -top-8 text-sm font-bold text-orange-600"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* 题目卡片 */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="max-w-2xl mx-auto relative z-10"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Card className="border-2 border-orange-300/50 bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden relative">
              {/* 卡片装饰 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-300/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/30 to-orange-300/30 rounded-full blur-2xl"></div>
              
              <CardContent className="p-8 relative">
                {/* 题目图片 */}
                <motion.div 
                  className="text-center mb-8 relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative inline-block">
                    <motion.img
                      src={currentQuestion.image}
                      alt="学习图片"
                      className="w-64 h-64 mx-auto rounded-2xl shadow-2xl object-cover border-4 border-white/50"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        boxShadow: [
                          '0 10px 30px rgba(251, 146, 60, 0.2)',
                          '0 15px 40px rgba(251, 146, 60, 0.3)',
                          '0 10px 30px rgba(251, 146, 60, 0.2)'
                        ]
                      }}
                      transition={{ duration: 0.5, boxShadow: { duration: 2, repeat: Infinity } }}
                    />
                    {/* 图片光环效果 */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/20 via-transparent to-amber-400/20"
                    />
                  </div>
                </motion.div>

                {/* 题目说明 */}
                <motion.div 
                  className="text-center mb-8 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.h3 
                    className="text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent mb-4"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🐱 小猫咪想表达什么？
                  </motion.h3>
                  <motion.p 
                    className="text-orange-600 text-lg font-medium flex items-center justify-center gap-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-xl">🤔</span>
                    根据图片选择小猫咪想学会的人类语言表达
                    <span className="text-xl">✨</span>
                  </motion.p>
                </motion.div>

                {/* 选项按钮 */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "h-20 text-lg font-semibold transition-all duration-500 relative overflow-hidden ";
                    let emoji = "";
                    
                    if (showResult) {
                      if (option === currentQuestion.correctAnswer) {
                        buttonClass += "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 shadow-xl";
                        emoji = "✅";
                      } else if (option === selectedAnswer) {
                        buttonClass += "bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-400 text-red-800 shadow-xl";
                        emoji = "❌";
                      } else {
                        buttonClass += "bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300 text-gray-600 opacity-60";
                        emoji = "⚪";
                      }
                    } else {
                      buttonClass += "bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-800 border-2 border-orange-300 hover:border-orange-400 hover:shadow-xl";
                      emoji = "🔸";
                    }
                    
                    return (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.5 }}
                      >
                        <motion.div
                          whileHover={{ 
                            scale: !showResult ? 1.05 : 1,
                            y: !showResult ? -3 : 0
                          }}
                          whileTap={{ scale: !showResult ? 0.95 : 1 }}
                        >
                          <Button
                            className={buttonClass}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={showResult}
                          >
                            {/* 背景光效 */}
                            {!showResult && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-orange-200/0 via-orange-200/30 to-orange-200/0 rounded-lg"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}
                            
                            <div className="relative z-10 flex items-center justify-between w-full px-2">
                              <span className="flex-1 text-center">{option}</span>
                              <motion.span 
                                className="text-xl ml-2"
                                animate={showResult && (option === currentQuestion.correctAnswer || option === selectedAnswer) ? {
                                  scale: [1, 1.3, 1]
                                } : {}}
                                transition={{ duration: 0.6 }}
                              >
                                {emoji}
                              </motion.span>
                            </div>
                            
                            {showResult && option === currentQuestion.correctAnswer && (
                              <CheckCircleIcon className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                            )}
                            {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                              <XCircleIcon className="absolute top-2 right-2 h-5 w-5 text-red-600" />
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 结果解释 */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    className={`p-8 rounded-2xl border-2 shadow-xl relative overflow-hidden ${
                      isCorrectAnswer 
                        ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border-green-200/50' 
                        : 'bg-gradient-to-r from-red-50/80 to-rose-50/80 backdrop-blur-sm border-red-200/50'
                    }`}
                  >
                    {/* 装饰元素 */}
                    <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-xl ${
                      isCorrectAnswer 
                        ? 'bg-gradient-to-br from-green-300/20 to-emerald-400/20' 
                        : 'bg-gradient-to-br from-red-300/20 to-rose-400/20'
                    }`}></div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        {isCorrectAnswer ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-6 w-6 text-red-600" />
                        )}
                      </motion.div>
                      <motion.span 
                        className={`font-bold text-xl ${
                          isCorrectAnswer ? 'text-green-800' : 'text-red-800'
                        }`}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {isCorrectAnswer ? '🎉 回答正确！' : '❌ 回答错误'}
                      </motion.span>
                    </div>
                    
                    <motion.p 
                      className={`text-lg leading-relaxed mb-4 ${
                        isCorrectAnswer ? 'text-green-700' : 'text-red-700'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {currentQuestion.explanation}
                    </motion.p>
                    
                    {isCorrectAnswer && (
                      <motion.div 
                        className="mt-4 flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border border-green-200"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Volume2Icon className="h-5 w-5 text-green-600" />
                        </motion.div>
                        <span className="text-green-600 font-semibold">
                          {isAudioPlaying ? '🔊 正在播放...' : '✅ 已播放正确答案'}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  </div>
  );
};

export default HumanLanguageLearning;