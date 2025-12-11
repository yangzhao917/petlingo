#!/usr/bin/env python3
"""
手动下载 Qwen3-8B 模型的大文件
使用分块下载避免内存问题
"""

import os
import requests
from tqdm import tqdm

def download_file(url, dest_path, chunk_size=8192):
    """分块下载大文件"""
    print(f"下载: {url}")
    print(f"保存到: {dest_path}")
    
    # 创建目录
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    # 检查文件是否已存在
    if os.path.exists(dest_path):
        file_size = os.path.getsize(dest_path)
        print(f"文件已存在，大小: {file_size / (1024**3):.2f} GB")
        user_input = input("是否重新下载? (y/N): ").strip().lower()
        if user_input != 'y':
            print("跳过下载")
            return True
    
    try:
        # 发送请求
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        # 获取文件大小
        total_size = int(response.headers.get('content-length', 0))
        
        # 下载文件
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

def main():
    print("=" * 60)
    print("Qwen3-8B INT4 OpenVINO 模型下载工具")
    print("=" * 60)
    
    model_dir = "qwen3-8b-int4-cw-ov"
    
    # HuggingFace 模型文件 URL
    base_url = "https://huggingface.co/OpenVINO/qwen3-8b-int4-cw-ov/resolve/main"
    
    # 需要下载的大文件
    files_to_download = [
        ("openvino_model.bin", f"{base_url}/openvino_model.bin"),
    ]
    
    print(f"\n将下载以下文件到: {model_dir}/")
    for filename, _ in files_to_download:
        print(f"  - {filename}")
    
    print("\n开始下载...")
    
    success_count = 0
    for filename, url in files_to_download:
        dest_path = os.path.join(model_dir, filename)
        print(f"\n[{success_count + 1}/{len(files_to_download)}]")
        
        if download_file(url, dest_path):
            success_count += 1
        else:
            print(f"警告: {filename} 下载失败")
    
    print("\n" + "=" * 60)
    if success_count == len(files_to_download):
        print("✓ 所有文件下载完成！")
        print(f"模型路径: {os.path.abspath(model_dir)}")
        print("\n现在可以运行: python deploy_qwen3_npu.py")
    else:
        print(f"✗ 部分文件下载失败 ({success_count}/{len(files_to_download)})")
        print("请检查网络连接后重试")
    print("=" * 60)

if __name__ == "__main__":
    main()
