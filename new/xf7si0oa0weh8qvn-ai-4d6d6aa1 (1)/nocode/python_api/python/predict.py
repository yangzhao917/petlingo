#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
猫狗叫声情绪识别预测脚本

该脚本用于加载训练好的模型并进行实时预测
支持从命令行调用和API集成
"""

import os
import sys
import json
import pickle
import numpy as np
import librosa
import argparse
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

class AudioEmotionPredictor:
    def __init__(self, model_dir='../models'):
        self.model_dir = model_dir
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.config = None
        self.is_loaded = False
        
    def load_model(self):
        """
        加载训练好的模型和预处理器
        
        Returns:
            bool: 是否成功加载
        """
        try:
            # 检查模型文件是否存在
            model_path = os.path.join(self.model_dir, 'emotion_classifier.pkl')
            scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
            encoder_path = os.path.join(self.model_dir, 'label_encoder.pkl')
            config_path = os.path.join(self.model_dir, 'config.json')
            
            if not all(os.path.exists(p) for p in [model_path, scaler_path, encoder_path, config_path]):
                return False
            
            # 加载模型
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            # 加载预处理器
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            
            # 加载标签编码器
            with open(encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)
            
            # 加载配置
            with open(config_path, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
            
            self.is_loaded = True
            return True
            
        except Exception as e:
            print(f"加载模型失败: {e}")
            return False
    
    def extract_audio_features(self, audio_path, duration=3.0):
        """
        提取音频特征（与训练时保持一致）
        
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
            
            # 1. MFCC特征
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
            
            # 确保特征维度与训练时一致
            target_dim = self.config.get('feature_dim', 200)
            if len(flattened_features) < target_dim:
                flattened_features.extend([0] * (target_dim - len(flattened_features)))
            elif len(flattened_features) > target_dim:
                flattened_features = flattened_features[:target_dim]
            
            return np.array(flattened_features)
            
        except Exception as e:
            print(f"提取特征失败 {audio_path}: {e}")
            return None
    
    def predict_emotion(self, audio_path, animal_type=None):
        """
        预测音频的情绪
        
        Args:
            audio_path: 音频文件路径
            animal_type: 动物类型 ('cat' 或 'dog')，如果为None则自动检测
            
        Returns:
            dict: 预测结果
        """
        if not self.is_loaded:
            if not self.load_model():
                return {
                    'success': False,
                    'error': '模型未加载或不存在，请先训练模型'
                }
        
        # 提取特征
        features = self.extract_audio_features(audio_path)
        if features is None:
            return {
                'success': False,
                'error': '音频特征提取失败'
            }
        
        try:
            # 预处理特征
            features_scaled = self.scaler.transform([features])
            
            # 预测
            prediction = self.model.predict(features_scaled)[0]
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # 解码预测结果
            predicted_label = self.label_encoder.inverse_transform([prediction])[0]
            
            # 解析动物类型和情绪
            if '_' in predicted_label:
                pred_animal, pred_emotion = predicted_label.split('_', 1)
            else:
                pred_animal = 'unknown'
                pred_emotion = predicted_label
            
            # 获取置信度
            confidence = float(np.max(probabilities))
            
            # 获取所有可能的情绪及其概率
            all_emotions = {}
            for i, prob in enumerate(probabilities):
                label = self.label_encoder.inverse_transform([i])[0]
                if '_' in label:
                    animal, emotion = label.split('_', 1)
                    if animal == pred_animal:  # 只显示同类动物的情绪
                        # 直接使用中文情绪名称
                        all_emotions[emotion] = float(prob)
            
            # 情绪名称就是中文名称
            emotion_name = pred_emotion
            
            return {
                'success': True,
                'animal': pred_animal,
                'emotion': pred_emotion,
                'emotion_name': emotion_name,
                'confidence': confidence,
                'all_emotions': all_emotions,
                'raw_prediction': predicted_label
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'预测失败: {str(e)}'
            }
    
    def get_available_emotions(self, animal_type=None):
        """
        获取可用的情绪列表
        
        Args:
            animal_type: 动物类型 ('cat' 或 'dog')
            
        Returns:
            dict: 情绪列表
        """
        if not self.is_loaded:
            if not self.load_model():
                return {
                    'success': False,
                    'error': '模型未加载或不存在，请先训练模型'
                }
        
        try:
            if animal_type and animal_type in self.config['emotion_mapping']:
                emotions = self.config['emotion_mapping'][animal_type]
                # 获取该动物类型的所有情绪
                labels = self.label_encoder.classes_
                animal_emotions = []
                for label in labels:
                    if '_' in label:
                        animal, emotion = label.split('_', 1)
                        if animal == animal_type:
                            animal_emotions.append(emotion)
                return {
                    'success': True,
                    'emotions': animal_emotions
                }
            else:
                # 获取所有动物的情绪
                labels = self.label_encoder.classes_
                all_emotions = {'cat': [], 'dog': []}
                for label in labels:
                    if '_' in label:
                        animal, emotion = label.split('_', 1)
                        if animal in all_emotions:
                            all_emotions[animal].append(emotion)
                return {
                    'success': True,
                    'emotions': all_emotions
                }
        except Exception as e:
            return {
                'success': False,
                'error': f'获取情绪列表失败: {str(e)}'
            }

def main():
    """
    命令行接口
    """
    parser = argparse.ArgumentParser(description='猫狗叫声情绪识别预测')
    parser.add_argument('audio_path', help='音频文件路径')
    parser.add_argument('--animal', choices=['cat', 'dog'], help='动物类型')
    parser.add_argument('--model-dir', default='../models', help='模型目录路径')
    parser.add_argument('--json', action='store_true', help='输出JSON格式结果')
    
    args = parser.parse_args()
    
    # 检查音频文件是否存在
    if not os.path.exists(args.audio_path):
        if args.json:
            print(json.dumps({'success': False, 'error': '音频文件不存在'}, ensure_ascii=False))
        else:
            print(f"错误: 音频文件不存在 {args.audio_path}")
        sys.exit(1)
    
    # 创建预测器
    predictor = AudioEmotionPredictor(args.model_dir)
    
    # 进行预测
    result = predictor.predict_emotion(args.audio_path, args.animal)
    
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        if result['success']:
            print(f"预测结果:")
            print(f"  动物类型: {result['animal']}")
            print(f"  情绪: {result['emotion_name']} ({result['emotion']})")
            print(f"  置信度: {result['confidence']:.3f}")
            print(f"  所有情绪概率:")
            for emotion, prob in result['all_emotions'].items():
                print(f"    {emotion}: {prob:.3f}")
        else:
            print(f"预测失败: {result['error']}")
            sys.exit(1)

if __name__ == '__main__':
    main()