/**
 * 猫狗情绪意图标签与音频文件映射配置
 * 用于实现跨物种音频翻译功能
 */

// 英文情绪标签到中文情绪的映射
// 用于将Python后端返回的英文情绪转换为前端使用的中文情绪
export const englishToChinese = {
  // 猫咪情绪映射
  'mating_call': '求偶',
  'begging': '哀求',
  'acting_cute': '撒娇',
  'excited_hunting': '兴奋捕猎',
  'friendly_call': '友好呼唤',
  'fighting': '吵架',
  'enjoying_food': '好吃',
  'grieved': '委屈',
  'want_to_play': '想玩耍',
  'greeting': '打招呼',
  'fight_ready': '打架预备',
  'acting_cute': '撒娇',
  'bored': '无聊',
  'help_call': '求救',
  'satisfied': '满足',
  'anxious': '着急',
  'comfortable': '舒服',
  'warning': '警告',
  'go_away': '走开',
  'hungry': '饿了',
  // 狗狗情绪映射
  'fighting': '吵架',
  'begging': '哀求',
  'acting_cute': '撒娇',
  'mating_call': '求偶',
  'anxious': '着急',
  'warning': '警告',
  'hungry': '饿了'
};

/**
 * 将英文情绪标签转换为中文情绪
 * @param {string} englishEmotion - 英文情绪标签
 * @returns {string} 中文情绪标签
 */
export function convertEmotionToChinese(englishEmotion) {
  return englishToChinese[englishEmotion] || englishEmotion;
}

// 猫咪情绪到音频文件的映射
export const catEmotionMapping = {
  '兴奋捕猎': 'voice(1)/Catvoice/猫_兴奋捕猎.m4a',
  '友好呼唤': 'voice(1)/Catvoice/猫_友好呼唤.m4a',
  '吵架': 'voice(1)/Catvoice/猫_吵架.m4a',
  '好吃': 'voice(1)/Catvoice/猫_好吃.m4a',
  '委屈': 'voice(1)/Catvoice/猫_委屈.m4a',
  '想玩耍': 'voice(1)/Catvoice/猫_想玩耍.m4a',
  '打招呼': 'voice(1)/Catvoice/猫_打招呼.m4a',
  '打架预备': 'voice(1)/Catvoice/猫_打架预备.m4a',
  '撒娇': 'voice(1)/Catvoice/猫_撒娇.m4a',
  '无聊': 'voice(1)/Catvoice/猫_无聊.m4a',
  '求偶': 'voice(1)/Catvoice/猫_求偶.m4a',
  '求救': 'voice(1)/Catvoice/猫_求救.m4a',
  '满足': 'voice(1)/Catvoice/猫_满足.m4a',
  '着急': 'voice(1)/Catvoice/猫_着急.m4a',
  '舒服': 'voice(1)/Catvoice/猫_舒服.m4a',
  '警告': 'voice(1)/Catvoice/猫_警告.m4a',
  '走开': 'voice(1)/Catvoice/猫_走开.m4a',
  '饿了': 'voice(1)/Catvoice/猫_饿了.m4a'
};

// 狗狗情绪到音频文件的映射
export const dogEmotionMapping = {
  '吵架': 'voice(1)/Dogvoice/狗_吵架.m4a',
  '哀求': 'voice(1)/Dogvoice/狗_哀求.m4a',
  '撒娇': 'voice(1)/Dogvoice/狗_撒娇.m4a',
  '求偶': 'voice(1)/Dogvoice/狗_求偶.m4a',
  '着急': 'voice(1)/Dogvoice/狗_着急.m4a',
  '警告': 'voice(1)/Dogvoice/狗_警告.m4a',
  '饿了': 'voice(1)/Dogvoice/狗_饿了.m4a'
};

// 跨物种情绪映射关系
// 当检测到某种动物的情绪时，映射到另一种动物的对应情绪
export const crossSpeciesMapping = {
  // 猫 -> 狗的映射
  cat_to_dog: {
    '吵架': '吵架',
    '撒娇': '撒娇', 
    '求偶': '求偶',
    '着急': '着急',
    '警告': '警告',
    '饿了': '饿了',
    '委屈': '哀求',  // 猫的委屈对应狗的哀求
    '求救': '哀求',  // 猫的求救对应狗的哀求
    '友好呼唤': '撒娇', // 猫的友好呼唤对应狗的撒娇
    '打招呼': '撒娇',   // 猫的打招呼对应狗的撒娇
    '想玩耍': '撒娇',   // 猫的想玩耍对应狗的撒娇
    '打架预备': '警告', // 猫的打架预备对应狗的警告
    '走开': '警告',      // 猫的走开对应狗的警告
    '兴奋捕猎': '撒娇', // 猫的兴奋捕猎对应狗的撒娇
    '好吃': '撒娇',     // 猫的好吃对应狗的撒娇
    '满足': '撒娇',     // 猫的满足对应狗的撒娇
    '舒服': '撒娇',     // 猫的舒服对应狗的撒娇
    '无聊': '撒娇'      // 猫的无聊对应狗的撒娇
  },
  // 狗 -> 猫的映射
  dog_to_cat: {
    '吵架': '吵架',
    '撒娇': '撒娇',
    '求偶': '求偶', 
    '着急': '着急',
    '警告': '警告',
    '饿了': '饿了',
    '哀求': '委屈'  // 狗的哀求对应猫的委屈
  }
};

/**
 * 根据检测到的动物类型和情绪，获取对应的翻译音频文件路径
 * @param {string} sourceAnimal - 源动物类型 ('cat' 或 'dog')
 * @param {string} emotion - 检测到的情绪
 * @returns {object} 翻译结果包含目标动物类型和音频文件路径
 */
export function getTranslatedAudio(sourceAnimal, emotion) {
  let targetAnimal, targetEmotion, audioPath;
  
  if (sourceAnimal === 'cat') {
    targetAnimal = 'dog';
    // 查找猫情绪对应的狗情绪
    targetEmotion = crossSpeciesMapping.cat_to_dog[emotion];
    if (targetEmotion && dogEmotionMapping[targetEmotion]) {
      audioPath = dogEmotionMapping[targetEmotion];
    }
  } else if (sourceAnimal === 'dog') {
    targetAnimal = 'cat';
    // 查找狗情绪对应的猫情绪
    targetEmotion = crossSpeciesMapping.dog_to_cat[emotion];
    if (targetEmotion && catEmotionMapping[targetEmotion]) {
      audioPath = catEmotionMapping[targetEmotion];
    }
  }
  
  return {
    targetAnimal,
    targetEmotion,
    audioPath,
    hasTranslation: !!audioPath
  };
}

/**
 * 获取所有可用的情绪列表
 * @param {string} animalType - 动物类型 ('cat' 或 'dog')
 * @returns {array} 情绪列表
 */
export function getAvailableEmotions(animalType) {
  if (animalType === 'cat') {
    return Object.keys(catEmotionMapping);
  } else if (animalType === 'dog') {
    return Object.keys(dogEmotionMapping);
  }
  return [];
}

/**
 * 检查某个情绪是否支持跨物种翻译
 * @param {string} sourceAnimal - 源动物类型
 * @param {string} emotion - 情绪
 * @returns {boolean} 是否支持翻译
 */
export function canTranslate(sourceAnimal, emotion) {
  const translation = getTranslatedAudio(sourceAnimal, emotion);
  return translation.hasTranslation;
}

export default {
  catEmotionMapping,
  dogEmotionMapping,
  crossSpeciesMapping,
  getTranslatedAudio,
  getAvailableEmotions,
  canTranslate
};
