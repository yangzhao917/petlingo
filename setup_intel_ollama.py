#!/usr/bin/env python3
"""
下载和设置 Intel 版本的 Ollama
支持 Intel GPU/NPU 加速
"""

import os
import requests
from tqdm import tqdm
import zipfile
import subprocess

def download_file(url, dest_path, chunk_size=8192):
    """分块下载文件"""
    print(f"下载: {url}")
    print(f"保存到: {dest_path}")
    
    if os.path.exists(dest_path):
        file_size = os.path.getsize(dest_path)
        print(f"文件已存在，大小: {file_size / (1024**2):.2f} MB")
        user_input = input("是否重新下载? (y/N): ").strip().lower()
        if user_input != 'y':
            return True
    
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(dest_path, 'wb') as f:
            with tqdm(total=total_size, unit='B', unit_scale=True, desc=os.path.basename(dest_path)) as pbar:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
                        pbar.update(len(chunk))
        
        print(f"✓ 下载完成: {dest_path}")
        return True
        
    except Exception as e:
        print(f"✗ 下载失败: {e}")
        return False

def extract_zip(zip_path, extract_to="."):
    """解压 ZIP 文件"""
    print(f"\n解压: {zip_path}")
    print(f"目标目录: {extract_to}")
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"✓ 解压完成")
        return True
    except Exception as e:
        print(f"✗ 解压失败: {e}")
        return False

def main():
    print("=" * 60)
    print("Intel Ollama 下载和安装工具")
    print("=" * 60)
    
    # Intel Ollama 下载链接
    # 从 ModelScope 下载
    ollama_url = "https://www.modelscope.cn/models/intel/ollama/resolve/master/ollama-intel-2.3.0b20250923-win.zip"
    ollama_zip = "ollama-intel-2.3.0b20250923-win.zip"
    ollama_dir = "ollama-intel"
    
    print("\n步骤 1: 下载 Intel Ollama")
    print(f"版本: 2.3.0b20250923")
    print(f"大小: ~96 MB")
    
    if not download_file(ollama_url, ollama_zip):
        print("\n下载失败，请手动下载:")
        print(f"访问: https://www.modelscope.cn/models/intel/ollama/files")
        return 1
    
    print("\n步骤 2: 解压文件")
    if not extract_zip(ollama_zip, ollama_dir):
        return 1
    
    print("\n" + "=" * 60)
    print("✓ Intel Ollama 安装完成！")
    print("=" * 60)
    
    print(f"\n安装位置: {os.path.abspath(ollama_dir)}")
    
    # 查找 ollama.exe
    ollama_exe = None
    for root, dirs, files in os.walk(ollama_dir):
        if "ollama.exe" in files:
            ollama_exe = os.path.join(root, "ollama.exe")
            break
    
    if ollama_exe:
        print(f"Ollama 可执行文件: {ollama_exe}")
        
        print("\n下一步:")
        print("1. 启动 Ollama 服务:")
        print(f"   {ollama_exe} serve")
        print("\n2. 在新终端中拉取模型:")
        print(f"   {ollama_exe} pull qwen2.5:7b")
        print("\n3. 运行模型:")
        print(f"   {ollama_exe} run qwen2.5:7b")
        
        # 创建快捷脚本
        print("\n创建快捷脚本...")
        
        # 启动服务脚本
        with open("start_ollama_server.bat", "w") as f:
            f.write(f'@echo off\n')
            f.write(f'echo Starting Intel Ollama Server...\n')
            f.write(f'"{ollama_exe}" serve\n')
        print("✓ 创建了 start_ollama_server.bat")
        
        # 拉取模型脚本
        with open("pull_qwen_model.bat", "w") as f:
            f.write(f'@echo off\n')
            f.write(f'echo Pulling Qwen2.5 7B model...\n')
            f.write(f'"{ollama_exe}" pull qwen2.5:7b\n')
            f.write(f'pause\n')
        print("✓ 创建了 pull_qwen_model.bat")
        
        # 运行模型脚本
        with open("run_qwen_model.bat", "w") as f:
            f.write(f'@echo off\n')
            f.write(f'echo Running Qwen2.5 7B model...\n')
            f.write(f'"{ollama_exe}" run qwen2.5:7b\n')
        print("✓ 创建了 run_qwen_model.bat")
        
        print("\n快速开始:")
        print("1. 双击 start_ollama_server.bat 启动服务")
        print("2. 双击 pull_qwen_model.bat 下载模型")
        print("3. 双击 run_qwen_model.bat 运行模型")
        
    else:
        print("警告: 未找到 ollama.exe")
    
    return 0

if __name__ == "__main__":
    exit(main())
