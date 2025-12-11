#!/usr/bin/env python3
"""
使用 ModelScope SDK 下载 Intel Ollama
"""

import os
import subprocess

def main():
    print("=" * 60)
    print("使用 ModelScope 下载 Intel Ollama")
    print("=" * 60)
    
    # 检查是否安装了 modelscope
    try:
        import modelscope
        print("✓ ModelScope SDK 已安装")
    except ImportError:
        print("正在安装 ModelScope SDK...")
        subprocess.run(["pip", "install", "modelscope", "-q"], check=True)
        print("✓ ModelScope SDK 安装完成")
    
    from modelscope.hub.file_download import model_file_download
    
    print("\n下载 Intel Ollama...")
    print("模型: intel/ollama")
    print("文件: ollama-intel-2.3.0b20250923-win.zip")
    
    try:
        local_path = model_file_download(
            model_id='intel/ollama',
            file_path='ollama-intel-2.3.0b20250923-win.zip',
            cache_dir='.'
        )
        
        print(f"\n✓ 下载完成！")
        print(f"文件位置: {local_path}")
        
        # 尝试解压
        print("\n尝试解压...")
        import zipfile
        
        extract_dir = "ollama-intel"
        os.makedirs(extract_dir, exist_ok=True)
        
        try:
            with zipfile.ZipFile(local_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            print(f"✓ 解压完成: {extract_dir}")
        except Exception as e:
            print(f"✗ Python zipfile 解压失败: {e}")
            print("\n请手动解压文件:")
            print(f"1. 右键点击: {local_path}")
            print(f"2. 选择 '全部解压缩' 或使用 7-Zip")
            print(f"3. 解压到: {extract_dir}")
            return 1
        
        # 查找 ollama.exe
        ollama_exe = None
        for root, dirs, files in os.walk(extract_dir):
            if "ollama.exe" in files:
                ollama_exe = os.path.join(root, "ollama.exe")
                break
        
        if ollama_exe:
            print(f"\n✓ 找到 Ollama: {ollama_exe}")
            
            # 创建启动脚本
            with open("start_ollama.bat", "w") as f:
                f.write(f'@echo off\n')
                f.write(f'cd /d "%~dp0"\n')
                f.write(f'echo Starting Intel Ollama Server...\n')
                f.write(f'"{ollama_exe}" serve\n')
            
            with open("ollama_pull_qwen.bat", "w") as f:
                f.write(f'@echo off\n')
                f.write(f'cd /d "%~dp0"\n')
                f.write(f'echo Pulling Qwen2.5 model...\n')
                f.write(f'"{ollama_exe}" pull qwen2.5:7b\n')
                f.write(f'pause\n')
            
            print("\n✓ 创建了启动脚本:")
            print("  - start_ollama.bat (启动服务)")
            print("  - ollama_pull_qwen.bat (下载模型)")
            
            print("\n下一步:")
            print("1. 运行 start_ollama.bat 启动服务")
            print("2. 在新终端运行 ollama_pull_qwen.bat 下载模型")
        
        return 0
        
    except Exception as e:
        print(f"\n✗ 下载失败: {e}")
        print("\n请手动下载:")
        print("访问: https://www.modelscope.cn/models/intel/ollama/files")
        return 1

if __name__ == "__main__":
    exit(main())
