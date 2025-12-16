
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Star } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: "识别猫叫意图",
      description: "上传猫咪叫声音频，了解它想表达什么",
      icon: <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">🎤</div>,
      path: "/cat-audio",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      bgGradient: "from-purple-50 to-pink-50",
      emoji: "🎵",
      shadowColor: "shadow-purple-200"
    },
    {
      title: "猫咪图片分析",
      description: "上传猫咪照片，分析猫咪的情绪和意图",
      icon: <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">📷</div>,
      path: "/cat-image",
      gradient: "from-blue-400 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50",
      emoji: "📸",
      shadowColor: "shadow-blue-200"
    },
    {
      title: "猫狗沟通",
      description: "在猫狗之间进行语言转换，促进宠物交流",
      icon: <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">💡</div>,
      path: "/pet-communication",
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 to-emerald-50",
      emoji: "🐱🐶",
      shadowColor: "shadow-green-200"
    },
    {
      title: "学习猫语",
      description: "通过趣味游戏学习猫咪语言",
      icon: <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-xl">📚</div>,
      path: "/cat-language",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      bgGradient: "from-yellow-50 to-orange-50",
      emoji: "📚",
      shadowColor: "shadow-yellow-200"
    },
    {
      title: "猫咪学人语",
      description: "多邻国式界面，让猫咪学习人类语言表达",
      icon: <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl">🎓</div>,
      path: "/human-language-learning",
      gradient: "from-indigo-400 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-50 to-purple-50",
      emoji: "🎓",
      shadowColor: "shadow-indigo-200"
    },
  ];

  // 颜文字和emoji装饰数组
  const emojiDecorations = [
    '🐱', '😸', '😺', '😻', '😽', '🙀', '😿', '😾',
    '🐈', '🐈‍⬛', '🦁', '🐯', '🐶', '🐕', '🐕‍🦺', '🐩',
    '❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💟',
    '⭐', '✨', '🌟', '💫', '🌙', '☀️', '🌈', '🎈',
    '🎵', '🎶', '🎼', '🎤', '🔊', '📢', '📣', '🎯',
    '(=^･ω･^=)', '(=^‥^=)', '(=^･ｪ･^=)', '(^･o･^)ﾉ"',
    '(=｀ω´=)', '(=^‥^=)', '(=^･^=)', '(=^ω^=)',
    '( ͡° ͜ʖ ͡°)', '(◕‿◕)', '(｡◕‿◕｡)', '(◡ ‿ ◡)',
    '♪(´▽｀)', '♪(^∇^*)', '♪～(´ε｀ )', '♪(๑ᴖ◡ᴖ๑)♪',
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '✧*:･ﾟ✧*:･ﾟ✧', '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
    '(｡♥‿♥｡)', '(◍•ᴗ•◍)❤', '(´∩｡• ᵕ •｡∩`)',
    '(=ↀωↀ=)', '(=ＴェＴ=)', '(=①ω①=)', '(=⌒‿‿⌒=)'
  ];

  // ASCII艺术猫咪数组
  const asciiCats = [
    String.raw`
    /\_/\
   ( o.o )
    > ^ <`,
    String.raw`
    /\_/\
   ( . . )
    )   (
   (  v  )`,
    String.raw`
    /\_/\
   ( >.< )
    >< ><`,
    String.raw`
  /\**/\
 (  .. )
  )  ( 
 (  )( )`,
    String.raw`
    /\_/\
   ( ^.^ )
    >< ><`,
    String.raw`
    /\_/\
   ( o o )
    ==_==`,
    String.raw`
    /\ /\
   ( . .)
    )  (`,
    String.raw`
    |\---/|
    | o_o |
     \_^_/`,
    String.raw`
    /\ . /\
   ( . .)
    )   (`,
    String.raw`
    /\_/\
   ( ' ' )
   (  v  )`,
    String.raw`
    /\_/\
   ( -.- )
    )   (`,
    String.raw`
    /\_/\
   ( n n )
    )   (`
  ];

  // 固定位置的emoji装饰
  const fixedPositionEmojis = [
    { id: 1, emoji: emojiDecorations[0], top: "8%", left: "3%", size: "text-2xl" },
    { id: 2, emoji: emojiDecorations[1], top: "12%", left: "92%", size: "text-xl" },
    { id: 3, emoji: emojiDecorations[2], top: "18%", left: "88%", size: "text-lg" },
    { id: 4, emoji: emojiDecorations[3], top: "25%", left: "2%", size: "text-2xl" },
    { id: 5, emoji: emojiDecorations[4], top: "32%", left: "95%", size: "text-xl" },
    { id: 6, emoji: emojiDecorations[5], top: "45%", left: "1%", size: "text-lg" },
    { id: 7, emoji: emojiDecorations[6], top: "52%", left: "97%", size: "text-2xl" },
    { id: 8, emoji: emojiDecorations[7], top: "65%", left: "3%", size: "text-xl" },
    { id: 9, emoji: emojiDecorations[8], top: "72%", left: "94%", size: "text-lg" },
    { id: 10, emoji: emojiDecorations[9], top: "85%", left: "2%", size: "text-2xl" },
    { id: 11, emoji: emojiDecorations[10], top: "92%", left: "96%", size: "text-xl" },
    { id: 12, emoji: emojiDecorations[16], top: "15%", left: "50%", size: "text-sm" },
    { id: 13, emoji: emojiDecorations[17], top: "35%", left: "48%", size: "text-sm" },
    { id: 14, emoji: emojiDecorations[18], top: "55%", left: "52%", size: "text-sm" },
    { id: 15, emoji: emojiDecorations[19], top: "75%", left: "47%", size: "text-sm" },
    { id: 16, emoji: emojiDecorations[24], top: "22%", left: "25%", size: "text-xs" },
    { id: 17, emoji: emojiDecorations[25], top: "28%", left: "75%", size: "text-xs" },
    { id: 18, emoji: emojiDecorations[26], top: "42%", left: "20%", size: "text-xs" },
    { id: 19, emoji: emojiDecorations[27], top: "48%", left: "80%", size: "text-xs" },
    { id: 20, emoji: emojiDecorations[28], top: "62%", left: "25%", size: "text-xs" },
    { id: 21, emoji: emojiDecorations[29], top: "68%", left: "75%", size: "text-xs" },
    { id: 22, emoji: emojiDecorations[32], top: "38%", left: "15%", size: "text-sm" },
    { id: 23, emoji: emojiDecorations[33], top: "58%", left: "85%", size: "text-sm" },
    { id: 24, emoji: emojiDecorations[34], top: "78%", left: "15%", size: "text-sm" },
    { id: 25, emoji: emojiDecorations[35], top: "88%", left: "85%", size: "text-sm" }
  ];

  // 固定位置的ASCII艺术猫咪
  const fixedPositionCats = [
    { id: 1, cat: asciiCats[0], top: "10%", left: "5%" },
    { id: 2, cat: asciiCats[1], top: "20%", left: "85%" },
    { id: 3, cat: asciiCats[2], top: "15%", left: "45%" },
    { id: 4, cat: asciiCats[3], top: "75%", left: "10%" },
    { id: 5, cat: asciiCats[4], top: "80%", left: "80%" },
    { id: 6, cat: asciiCats[5], top: "50%", left: "25%" },
    { id: 7, cat: asciiCats[6], top: "65%", left: "70%" },
    { id: 8, cat: asciiCats[7], top: "35%", left: "15%" },
    { id: 9, cat: asciiCats[8], top: "40%", left: "85%" },
    { id: 10, cat: asciiCats[9], top: "85%", left: "45%" },
    { id: 11, cat: asciiCats[10], top: "5%", left: "65%" },
    { id: 12, cat: asciiCats[11], top: "30%", left: "50%" },
    { id: 13, cat: asciiCats[0], top: "70%", left: "30%" },
    { id: 14, cat: asciiCats[1], top: "10%", left: "25%" },
    { id: 15, cat: asciiCats[2], top: "60%", left: "55%" },
    { id: 16, cat: asciiCats[3], top: "45%", left: "5%" },
    { id: 17, cat: asciiCats[4], top: "25%", left: "75%" },
    { id: 18, cat: asciiCats[5], top: "55%", left: "90%" },
    { id: 19, cat: asciiCats[6], top: "85%", left: "20%" },
    { id: 20, cat: asciiCats[7], top: "5%", left: "90%" },
    { id: 21, cat: asciiCats[8], top: "90%", left: "65%" },
    { id: 22, cat: asciiCats[9], top: "35%", left: "35%" },
    { id: 23, cat: asciiCats[10], top: "65%", left: "40%" },
    { id: 24, cat: asciiCats[11], top: "20%", left: "60%" },
    { id: 25, cat: asciiCats[0], top: "75%", left: "50%" },
    { id: 26, cat: asciiCats[1], top: "15%", left: "10%" },
    { id: 27, cat: asciiCats[2], top: "50%", left: "80%" },
    { id: 28, cat: asciiCats[3], top: "80%", left: "35%" },
    { id: 29, cat: asciiCats[4], top: "40%", left: "65%" },
    { id: 30, cat: asciiCats[5], top: "5%", left: "40%" }
  ];

  // 生成固定位置的ASCII艺术猫咪
  const generateFixedCats = () => {
    return fixedPositionCats.map((item) => (
      <div
        key={item.id}
        className="absolute text-green-800 opacity-30 text-xs font-mono whitespace-pre z-0 pointer-events-none select-none"
        style={{
          top: item.top,
          left: item.left,
          transform: "rotate(0deg)",
          fontSize: "8px"
        }}
      >
        {item.cat}
      </div>
    ));
  };

  // 浮动装饰元素
  const FloatingDecorations = () => {
    const decorations = [
      { id: 1, emoji: '🐱', delay: 0, duration: 6 },
      { id: 2, emoji: '😸', delay: 1, duration: 8 },
      { id: 3, emoji: '💕', delay: 2, duration: 7 },
      { id: 4, emoji: '⭐', delay: 3, duration: 9 },
      { id: 5, emoji: '🌟', delay: 4, duration: 5 },
      { id: 6, emoji: '🎵', delay: 5, duration: 6 },
    ];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-2xl opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              rotate: 0
            }}
            animate={{
              y: -50,
              rotate: 360,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 现代化背景装饰 */}
      <div className="absolute inset-0">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-pink-950/50"></div>
        
        {/* 动态光晕效果 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-to-r from-violet-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* 星空效果 */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* 浮动猫咪表情 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
          >
            {['🐱', '😸', '😺', '😻', '🐈', '💕', '⭐', '✨', '🌟', '🎵', '🎶', '💖'][i]}
          </motion.div>
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-20">
        <div className="container mx-auto px-4">
          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20"
          >
            {/* 主图标 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-8 relative"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-9xl relative z-10"
              >
                🐱
              </motion.div>
              
              {/* 光环效果 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-8"
              >
                <div className="w-full h-full rounded-full border-2 border-gradient-to-r from-pink-400/30 via-purple-400/30 to-cyan-400/30 border-dashed"></div>
              </motion.div>
              
              {/* 内部光晕 */}
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            </motion.div>
            
            {/* 主标题 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-6xl md:text-8xl font-black mb-6 relative"
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% 200%' }}
              >
                猫咪星球
              </motion.span>
              
              {/* 标题装饰 */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-3xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 text-3xl"
              >
                🌟
              </motion.div>
            </motion.h1>
            
            {/* 副标题 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <motion.p
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                🌟 与你的毛茸茸朋友更好地沟通，探索它们的内心世界 🌟
              </motion.p>
              
              {/* 副标题装饰线 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ duration: 1, delay: 1.2 }}
                className="h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-6 rounded-full"
              ></motion.div>
            </motion.div>
          </motion.div>

          {/* 功能卡片网格 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-8xl mx-auto px-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 80, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1 + index * 0.15,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.08,
                  y: -15,
                  rotateY: 5,
                  transition: { duration: 0.4, type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <Link to={feature.path} className="block h-full">
                  <motion.div 
                    className={`
                      relative h-full p-10 rounded-3xl backdrop-blur-xl border-2 border-white/10
                      ${feature.gradient}
                      hover:border-white/30 transition-all duration-500
                      shadow-2xl hover:shadow-4xl
                      overflow-hidden transform-gpu
                      bg-gradient-to-br from-white/5 via-white/2 to-transparent
                    `}
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* 动态背景装饰 */}
                    <div className="absolute inset-0">
                      <motion.div 
                        animate={{ 
                          background: [
                            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 rounded-3xl"
                      />
                      
                      {/* 光晕效果 */}
                      <motion.div
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-3xl"
                      />
                      
                      {/* 网格纹理 */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    
                    {/* 图标区域 */}
                    <motion.div
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.3
                      }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="relative z-10 mb-8 flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                        className="relative"
                      >
                        {feature.icon}
                        
                        {/* 图标光晕 */}
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10"
                        />
                      </motion.div>
                      
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          y: [0, -2, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                        className="text-5xl filter drop-shadow-lg"
                      >
                        {feature.emoji}
                      </motion.div>
                    </motion.div>
                    
                    {/* 内容区域 */}
                    <div className="relative z-10 text-center">
                      <motion.h3 
                        className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-white/95 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-white/85 leading-relaxed group-hover:text-white/75 transition-colors duration-300 text-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                    
                    {/* 交互光效 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    />
                    
                    {/* 边框光效 */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'xor'
                      }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* 底部装饰区域 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-32 relative"
          >
            {/* 底部背景装饰 */}
            <div className="absolute inset-0 -mx-20">
              <motion.div
                animate={{ 
                  background: [
                    'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                    'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="w-full h-full rounded-full blur-3xl"
              />
            </div>
            
            {/* 猫咪表情动画 */}
            <motion.div
              className="flex justify-center items-center space-x-12 mb-12 relative z-10"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              {asciiCats.slice(0, 3).map((cat, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.8,
                    ease: "easeInOut"
                  }}
                  whileHover={{ 
                    scale: 1.3,
                    transition: { duration: 0.6 }
                  }}
                >
                  <div className="text-7xl filter drop-shadow-2xl font-mono text-white/80">
                    <pre>{cat}</pre>
                  </div>
                  
                  {/* 猫咪光晕 */}
                  <motion.div
                    animate={{ 
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: index * 0.5 
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 rounded-full blur-2xl -z-10"
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* 底部标语 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="text-center relative z-10"
            >
              <motion.div
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="inline-block"
              >
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  ✨ 让爱更有温度，让沟通更有意义 ✨
                </motion.p>
              </motion.div>
              
              {/* 装饰线条 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: 1.5, delay: 2.5 }}
                className="h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-8 rounded-full"
              />
              
              {/* 浮动心形 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl opacity-30"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 1.2
                    }}
                  >
                    💖
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* 底部渐变遮罩 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
