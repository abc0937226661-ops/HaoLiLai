#!/bin/bash
# 好利来网站快速部署脚本
# 在您的 Ubuntu 服务器上运行此脚本

echo "=== 好利来网站部署脚本 ==="

# 1. 更新系统
echo "步骤 1/7: 更新系统..."
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js 18
echo "步骤 2/7: 安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 安装 PM2
echo "步骤 3/7: 安装 PM2..."
sudo npm install -g pm2

# 4. 安装 Nginx
echo "步骤 4/7: 安装 Nginx..."
sudo apt install -y nginx

# 5. 创建项目目录
echo "步骤 5/7: 创建项目目录..."
sudo mkdir -p /var/www/haolilai
sudo chown -R $USER:$USER /var/www/haolilai

echo ""
echo "✅ 基础环境安装完成！"
echo ""
echo "接下来请手动完成以下步骤："
echo "1. 将项目文件上传到 /var/www/haolilai"
echo "2. cd /var/www/haolilai"
echo "3. npm install"
echo "4. 配置 .env.local 文件"
echo "5. npm run build"
echo "6. pm2 start npm --name haolilai -- start"
echo "7. 配置 Nginx（参考 deploy.md 文档）"
echo ""
echo "详细说明请查看项目中的 .agent/workflows/deploy.md 文件"
