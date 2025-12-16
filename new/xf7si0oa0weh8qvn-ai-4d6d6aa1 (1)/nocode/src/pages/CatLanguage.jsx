
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CardContent, Card } from '@/components/ui/card';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { LockIcon, RotateCcwIcon, CheckCircleIcon, PlayIcon } from 'lucide-react';
import { catLanguageApi } from '@/services/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// 关卡数据
const levels = [
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

// 主组件 - 关卡选择页面
const CatLanguage = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取关卡数据
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await catLanguageApi.getLevels();
        setLevels(data);
      } catch (error) {
        console.error("获取关卡数据失败:", error);
        // 失败时使用默认数据
        setLevels([
          // ... keep existing code (default levels data)
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const completeLesson = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      try {
        await catLanguageApi.completeLesson(lessonId);
        setCompletedLessons([...completedLessons, lessonId]);
      } catch (error) {
        console.error("完成课程失败:", error);
        // 失败时仍然更新本地状态
        setCompletedLessons([...completedLessons, lessonId]);
      }
    }
  };

  const resetProgress = async () => {
    try {
      await catLanguageApi.resetProgress();
      setCompletedLessons([]);
    } catch (error) {
      console.error("重置进度失败:", error);
      // 失败时仍然更新本地状态
      setCompletedLessons([]);
    }
  };

  const totalLessons = levels.reduce((acc, level) => acc + level.lessons.length, 0);
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  // 处理圆形节点点击事件
  const handleLevelClick = (levelId) => {
    // 检查关卡是否已解锁
    const levelIndex = levels.findIndex(level => level.id === levelId);
    const isUnlocked = levelIndex === 0 || 
      levels.slice(0, levelIndex).every(prevLevel => 
        prevLevel.lessons.every(lesson => 
          completedLessons.includes(lesson.id)
        )
      );
    
    if (isUnlocked) {
      navigate(`/cat-language/${levelId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-12 pt-8 pb-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-100/20 to-emerald-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🎓 学习猫语大冒险
          </motion.h1>
          <motion.p 
            className="text-xl text-teal-700 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            🐱 通过趣味闯关游戏，成为猫咪沟通专家
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 课程标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-white/80 to-emerald-50/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl shadow-xl shadow-emerald-100/50"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📚 猫语专家课程
                  </motion.h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetProgress}
                      className="text-teal-700 border-teal-300 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300 shadow-md"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <RotateCcwIcon className="mr-2 h-4 w-4" />
                      </motion.div>
                      重置进度
                    </Button>
                  </motion.div>
                </div>
                <motion.p 
                  className="text-teal-700 text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🌟 通过5个阶段的学习，全面掌握猫咪语言的秘密
                </motion.p>
                
                {/* 进度条 */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-teal-600">学习进度</span>
                    <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-teal-100 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </motion.div>
          </motion.div>

          {/* 关卡节点 */}
          <div className="relative">
            {levels.map((level, index) => {
              const isUnlocked = index === 0 || 
                levels.slice(0, index).every(prevLevel => 
                  prevLevel.lessons.every(lesson => 
                    completedLessons.includes(lesson.id)
                  )
                );
              
              // 检查当前关卡是否已完成所有课程
              const isLevelCompleted = level.lessons.every(lesson => 
                completedLessons.includes(lesson.id)
              );
              
              return (
                <div key={level.id} className="relative mb-20">

                  
                  {/* 关卡圆圈 */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.4 }}
                    whileHover={{ 
                      scale: isUnlocked ? 1.15 : 1.05,
                      rotateY: isUnlocked ? 10 : 0,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                    className={`relative mx-auto w-28 h-28 rounded-full flex items-center justify-center cursor-pointer z-10 border-4 ${
                      isLevelCompleted 
                        ? 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-2xl shadow-emerald-300/50 border-emerald-200' 
                        : isUnlocked 
                        ? `bg-gradient-to-br ${level.color} shadow-2xl border-white/50` 
                        : 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg border-gray-200'
                    }`}
                    onClick={() => handleLevelClick(level.id)}
                  >
                    {/* 内部光晕效果 */}
                    <div className={`absolute inset-2 rounded-full ${
                      isLevelCompleted 
                        ? 'bg-gradient-to-br from-emerald-200/30 to-green-300/30'
                        : isUnlocked 
                        ? 'bg-white/20'
                        : 'bg-gray-100/30'
                    }`} />
                    
                    <motion.span 
                      className="text-4xl relative z-10"
                      animate={isUnlocked ? {
                        scale: [1, 1.1, 1],
                        y: [0, -2, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {isLevelCompleted ? '🏆' : level.icon}
                    </motion.span>
                    
                    {/* 锁定状态 */}
                    {!isUnlocked && (
                      <motion.div 
                        className="absolute inset-0 bg-gray-500/60 backdrop-blur-sm rounded-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <LockIcon className="w-10 h-10 text-white drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* 完成状态的粒子效果 */}
                    {isLevelCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(16, 185, 129, 0.3)',
                            '0 0 40px rgba(16, 185, 129, 0.6)',
                            '0 0 20px rgba(16, 185, 129, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {/* 关卡信息 */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                    className="text-center mt-6"
                  >
                    <motion.h3 
                      className={`text-2xl font-bold mb-3 ${
                        isLevelCompleted ? 'text-emerald-600' : isUnlocked ? 'text-teal-700' : 'text-gray-500'
                      }`}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                    >
                      {level.title}
                    </motion.h3>
                    <motion.p 
                      className={`text-base max-w-sm mx-auto leading-relaxed ${
                        isLevelCompleted ? 'text-emerald-600' : isUnlocked ? 'text-teal-600' : 'text-gray-400'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.5 }}
                    >
                      {level.description}
                    </motion.p>
                    
                    {/* 课程数量徽章 */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.7, type: "spring", bounce: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge 
                        variant={isLevelCompleted ? 'default' : isUnlocked ? 'secondary' : 'outline'}
                        className={`mt-4 px-4 py-2 text-sm font-semibold shadow-md ${
                          isLevelCompleted 
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-300' 
                            : isUnlocked 
                            ? 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-teal-300'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 border-gray-300'
                        }`}
                      >
                        📖 {level.lessons.length} 个课程
                      </Badge>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 悬浮询问按钮 */}
      <button
        onClick={() => navigate('/pet-expert')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-xl border-2 border-white/30 flex items-center justify-center text-white text-2xl hover:from-teal-600 hover:to-cyan-600 transition-transform duration-200"
        aria-label="宠物专家询问"
      >
        ❓
      </button>
    </div>
  );
};

export default CatLanguage;
