#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
猫狗叫声情绪识别模型训练脚本

该脚本用于训练基于音频特征的情绪分类模型
支持猫咪和狗狗的多种情绪识别
"""

import os
import sys
import json
import numpy as np
import librosa
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

class AudioEmotionTrainer:
    def __init__(self, data_dir='../audio_data'):
        self.data_dir = data_dir
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        
        # 情绪标签映射
        # 根据实际音频文件重新设计的情绪映射表
        self.emotion_mapping = {
            'cat': {
                '兴奋捕猎': 'excited_hunting',
                '友好呼唤': 'friendly_call', 
                '吵架': 'fighting',
                '好吃': 'enjoying_food',
                '委屈': 'grieved',
                '想玩耍': 'want_to_play',
                '打招呼': 'greeting',
                '打架预备': 'fight_ready',
                '撒娇': 'acting_cute',
                '无聊': 'bored',
                '求偶': 'mating_call',
                '求救': 'help_call',
                '满足': 'satisfied',
                '着急': 'anxious',
                '舒服': 'comfortable',
                '警告': 'warning',
                '走开': 'go_away',
                '饿了': 'hungry'
            },
            'dog': {
                '吵架': 'fighting',
                '哀求': 'begging',
                '撒娇': 'acting_cute',
                '求偶': 'mating_call',
                '着急': 'anxious',
                '警告': 'warning',
                '饿了': 'hungry'
            }
        }
    
    def extract_audio_features(self, audio_path, duration=3.0):
        """
        提取音频特征
        
        Args:
            audio_path: 音频文件路径
            duration: 音频时长（秒）
            
        Returns:
            features: 特征向量
        """
        try:
            # 加载音频文件
            y, sr = librosa.load(audio_path, duration=duration, sr=22050)
            
            # 如果音频太短，进行填充
            if len(y) < sr * duration:
                y = np.pad(y, (0, int(sr * duration - len(y))), mode='constant')
            
            features = []
            
            # 1. MFCC特征 (梅尔频率倒谱系数)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            features.extend([
                np.mean(mfccs, axis=1),
                np.std(mfccs, axis=1),
                np.max(mfccs, axis=1),
                np.min(mfccs, axis=1)
            ])
            
            # 2. 色度特征
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            features.extend([
                np.mean(chroma, axis=1),
                np.std(chroma, axis=1)
            ])
            
            # 3. 梅尔频谱特征
            mel = librosa.feature.melspectrogram(y=y, sr=sr)
            features.extend([
                np.mean(mel, axis=1),
                np.std(mel, axis=1)
            ])
            
            # 4. 谱质心
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            features.extend([
                np.mean(spectral_centroids),
                np.std(spectral_centroids)
            ])
            
            # 5. 谱带宽
            spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            features.extend([
                np.mean(spectral_bandwidth),
                np.std(spectral_bandwidth)
            ])
            
            # 6. 谱对比度
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            features.extend([
                np.mean(spectral_contrast, axis=1),
                np.std(spectral_contrast, axis=1)
            ])
            
            # 7. 谱滚降
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            features.extend([
                np.mean(spectral_rolloff),
                np.std(spectral_rolloff)
            ])
            
            # 8. 零交叉率
            zcr = librosa.feature.zero_crossing_rate(y)
            features.extend([
                np.mean(zcr),
                np.std(zcr)
            ])
            
            # 9. 基频特征
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
            pitch_values = []
            for t in range(pitches.shape[1]):
                index = magnitudes[:, t].argmax()
                pitch = pitches[index, t]
                if pitch > 0:
                    pitch_values.append(pitch)
            
            if pitch_values:
                features.extend([
                    np.mean(pitch_values),
                    np.std(pitch_values),
                    np.max(pitch_values),
                    np.min(pitch_values)
                ])
            else:
                features.extend([0, 0, 0, 0])
            
            # 10. 能量特征
            energy = np.sum(y ** 2) / len(y)
            features.append(energy)
            
            # 展平所有特征
            flattened_features = []
            for feature in features:
                if isinstance(feature, np.ndarray):
                    flattened_features.extend(feature.flatten())
                else:
                    flattened_features.append(feature)
            
            return np.array(flattened_features)
            
        except Exception as e:
            print(f"提取特征失败 {audio_path}: {e}")
            return None
    
    def load_training_data(self):
        """
        加载训练数据 - 根据文件名格式：动物_情绪.m4a
        
        Returns:
            X: 特征矩阵
            y: 标签向量
            animal_types: 动物类型
        """
        X = []
        y = []
        animal_types = []
        
        print("开始加载训练数据...")
        
        # 处理猫咪音频
        cat_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Catvoice')
        if os.path.exists(cat_dir):
            print("处理猫咪音频...")
            for audio_file in os.listdir(cat_dir):
                if audio_file.lower().endswith(('.wav', '.mp3', '.m4a', '.flac')):
                    # 解析文件名：猫_情绪.m4a
                    if '_' in audio_file:
                        parts = audio_file.split('_')
                        if len(parts) >= 2:
                            emotion_cn = parts[1].split('.')[0]  # 去掉扩展名
                            
                            # 检查情绪是否在映射表中
                            if emotion_cn in self.emotion_mapping['cat']:
                                emotion_en = self.emotion_mapping['cat'][emotion_cn]
                                audio_path = os.path.join(cat_dir, audio_file)
                                features = self.extract_audio_features(audio_path)
                                
                                if features is not None:
                                    X.append(features)
                                    y.append(f"cat_{emotion_en}")
                                    animal_types.append('cat')
                                    print(f"  加载猫咪音频: {audio_file} -> {emotion_en}")
                            else:
                                print(f"  跳过未知情绪: {audio_file} (情绪: {emotion_cn})")
        else:
            print(f"警告: 猫咪音频目录不存在: {cat_dir}")
        
        # 处理狗狗音频
        dog_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Dogvoice')
        if os.path.exists(dog_dir):
            print("处理狗狗音频...")
            for audio_file in os.listdir(dog_dir):
                if audio_file.lower().endswith(('.wav', '.mp3', '.m4a', '.flac')):
                    # 解析文件名：狗_情绪.m4a
                    if '_' in audio_file:
                        parts = audio_file.split('_')
                        if len(parts) >= 2:
                            emotion_cn = parts[1].split('.')[0]  # 去掉扩展名
                            
                            # 检查情绪是否在映射表中
                            if emotion_cn in self.emotion_mapping['dog']:
                                emotion_en = self.emotion_mapping['dog'][emotion_cn]
                                audio_path = os.path.join(dog_dir, audio_file)
                                features = self.extract_audio_features(audio_path)
                                
                                if features is not None:
                                    X.append(features)
                                    y.append(f"dog_{emotion_en}")
                                    animal_types.append('dog')
                                    print(f"  加载狗狗音频: {audio_file} -> {emotion_en}")
                            else:
                                print(f"  跳过未知情绪: {audio_file} (情绪: {emotion_cn})")
        else:
            print(f"警告: 狗狗音频目录不存在: {dog_dir}")
        
        if len(X) == 0:
            raise ValueError("没有找到有效的训练数据")
        
        print(f"总共加载了 {len(X)} 个样本")
        
        # 确保所有特征向量长度一致
        max_length = max(len(features) for features in X)
        X_padded = []
        for features in X:
            if len(features) < max_length:
                padded = np.pad(features, (0, max_length - len(features)), mode='constant')
                X_padded.append(padded)
            else:
                X_padded.append(features[:max_length])
        
        return np.array(X_padded), np.array(y), np.array(animal_types)
    
    def create_mock_data(self):
        """
        创建模拟数据用于演示
        
        Returns:
            X: 特征矩阵
            y: 标签向量
            animal_types: 动物类型
        """
        print("创建模拟训练数据...")
        
        np.random.seed(42)
        X = []
        y = []
        animal_types = []
        
        # 为每种动物和情绪创建模拟数据
        for animal in ['cat', 'dog']:
            for emotion in self.emotion_mapping[animal].keys():
                # 每种情绪生成10个样本
                for _ in range(10):
                    # 生成随机特征向量 (模拟音频特征)
                    features = np.random.randn(200)  # 200维特征
                    
                    # 为不同情绪添加特定的特征模式
                    if emotion == 'happy':
                        features[:50] += 2  # 高频特征更强
                    elif emotion == 'sad':
                        features[50:100] -= 1  # 中频特征较弱
                    elif emotion == 'angry':
                        features[100:150] += 3  # 特定频段很强
                    elif emotion == 'excited':
                        features += np.random.randn(200) * 0.5  # 更多变化
                    
                    X.append(features)
                    y.append(f"{animal}_{emotion}")
                    animal_types.append(animal)
        
        print(f"创建了 {len(X)} 个模拟样本")
        return np.array(X), np.array(y), np.array(animal_types)
    
    def train_model(self, X, y):
        """
        训练模型
        
        Args:
            X: 特征矩阵
            y: 标签向量
        """
        print("开始训练模型...")
        
        # 数据预处理
        X_scaled = self.scaler.fit_transform(X)
        y_encoded = self.label_encoder.fit_transform(y)
        
        # 检查样本数量，如果太少则不进行分层抽样
        unique_labels, counts = np.unique(y_encoded, return_counts=True)
        min_samples = np.min(counts)
        
        if min_samples < 2:
            print(f"警告: 最少的类别只有 {min_samples} 个样本，无法进行分层抽样")
            print("使用简单随机分割...")
            # 如果样本太少，使用简单分割而不是分层分割
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y_encoded, test_size=0.2, random_state=42
            )
        else:
            # 分割训练集和测试集
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
            )
        
        # 训练随机森林模型
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # 评估模型
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"训练集准确率: {train_score:.3f}")
        print(f"测试集准确率: {test_score:.3f}")
        
        # 交叉验证（只有在样本足够时才进行）
        if min_samples >= 5:  # 至少需要5个样本才能进行5折交叉验证
            cv_scores = cross_val_score(self.model, X_scaled, y_encoded, cv=5)
            print(f"交叉验证准确率: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
            print(f"各折准确率: {cv_scores}")
        elif min_samples >= 2:
            # 如果样本数量在2-4之间，使用较少的折数
            cv_folds = min(min_samples, 3)
            cv_scores = cross_val_score(self.model, X_scaled, y_encoded, cv=cv_folds)
            print(f"交叉验证准确率 ({cv_folds}折): {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
            print(f"各折准确率: {cv_scores}")
        else:
            print("样本数量太少，跳过交叉验证")
        
        # 详细分类报告
        y_pred = self.model.predict(X_test)
        if len(y_test) > 0:
            # 只获取测试集中实际出现的类别
            unique_test_labels = np.unique(y_test)
            test_class_names = self.label_encoder.inverse_transform(unique_test_labels)
            print("\n分类报告:")
            print(classification_report(y_test, y_pred, labels=unique_test_labels, target_names=test_class_names))
        else:
            print("\n测试集为空，跳过分类报告")
        
        return train_score, test_score
    
    def save_model(self, model_dir='../models'):
        """
        保存训练好的模型
        
        Args:
            model_dir: 模型保存目录
        """
        os.makedirs(model_dir, exist_ok=True)
        
        # 保存模型
        model_path = os.path.join(model_dir, 'emotion_classifier.pkl')
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        # 保存预处理器
        scaler_path = os.path.join(model_dir, 'scaler.pkl')
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        # 保存标签编码器
        encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
        with open(encoder_path, 'wb') as f:
            pickle.dump(self.label_encoder, f)
        
        # 保存配置信息
        config = {
            'emotion_mapping': self.emotion_mapping,
            'classes': self.label_encoder.classes_.tolist(),
            'feature_dim': len(self.scaler.mean_) if hasattr(self.scaler, 'mean_') else 200
        }
        
        config_path = os.path.join(model_dir, 'config.json')
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        
        print(f"模型已保存到: {model_dir}")
        print(f"  - 模型文件: {model_path}")
        print(f"  - 预处理器: {scaler_path}")
        print(f"  - 标签编码器: {encoder_path}")
        print(f"  - 配置文件: {config_path}")

def main():
    """
    主函数
    """
    print("=" * 50)
    print("猫狗叫声情绪识别模型训练")
    print("=" * 50)
    
    trainer = AudioEmotionTrainer()
    
    try:
        # 尝试加载真实数据
        X, y, animal_types = trainer.load_training_data()
    except (ValueError, FileNotFoundError) as e:
        print(f"加载真实数据失败: {e}")
        print("使用模拟数据进行训练...")
        X, y, animal_types = trainer.create_mock_data()
    
    # 显示数据统计
    unique_labels, counts = np.unique(y, return_counts=True)
    print("\n数据分布:")
    for label, count in zip(unique_labels, counts):
        print(f"  {label}: {count} 个样本")
    
    # 训练模型
    train_acc, test_acc = trainer.train_model(X, y)
    
    # 保存模型
    trainer.save_model()
    
    print("\n=" * 50)
    print("训练完成！")
    print(f"最终测试准确率: {test_acc:.3f}")
    print("=" * 50)

if __name__ == '__main__':
    main()