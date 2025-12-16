#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成测试音频文件

用于测试音频识别功能
"""

import numpy as np
import soundfile as sf
import os

def generate_test_audio(filename, duration=3.0, sample_rate=22050):
    """
    生成测试音频文件
    
    Args:
        filename: 输出文件名
        duration: 音频时长（秒）
        sample_rate: 采样率
    """
    # 生成时间轴
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 生成复合音频信号（模拟动物叫声）
    # 基频 + 谐波 + 噪声
    base_freq = 440  # A4音符
    signal = (
        0.5 * np.sin(2 * np.pi * base_freq * t) +  # 基频
        0.3 * np.sin(2 * np.pi * base_freq * 2 * t) +  # 二次谐波
        0.2 * np.sin(2 * np.pi * base_freq * 3 * t) +  # 三次谐波
        0.1 * np.random.randn(len(t))  # 白噪声
    )
    
    # 添加包络（模拟自然音频的起伏）
    envelope = np.exp(-t / (duration * 0.3))  # 指数衰减
    signal = signal * envelope
    
    # 归一化
    signal = signal / np.max(np.abs(signal)) * 0.8
    
    # 保存为WAV文件
    sf.write(filename, signal, sample_rate)
    print(f"生成测试音频: {filename}")

def main():
    """
    生成多个测试音频文件
    """
    # 创建测试音频目录
    test_dir = '../test_audio'
    os.makedirs(test_dir, exist_ok=True)
    
    # 生成不同类型的测试音频
    test_files = [
        'cat_happy_test.wav',
        'cat_sad_test.wav',
        'dog_happy_test.wav',
        'dog_angry_test.wav'
    ]
    
    for filename in test_files:
        filepath = os.path.join(test_dir, filename)
        generate_test_audio(filepath)
    
    print(f"\n所有测试音频已生成到: {test_dir}")

if __name__ == '__main__':
    main()