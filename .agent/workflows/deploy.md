---
description: 部署网站到生产环境的步骤指南
---

# 网站部署指南

## 方式一：Vercel 部署（推荐新手）

### 前置准备
1. 将代码推送到 GitHub
2. 注册 Vercel 账号（使用 GitHub 登录）

### 部署步骤
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 从 GitHub 导入您的仓库
4. 配置环境变量：
   - 复制 `.env.local` 的内容
   - 在 Vercel 项目设置中添加相同的环境变量
5. 点击 "Deploy"

### ⚠️ 重要提醒
- Vercel 不支持 SQLite 数据库
- 需要迁移到云数据库（Turso、PlanetScale 等）

---

## 方式二：VPS/云服务器部署（本地数据库）

### 1. 服务器准备
- 操作系统：Ubuntu 20.04+
- 确保服务器可以访问外网
- 开放端口：80 (HTTP)、443 (HTTPS)、3000 (Next.js)

### 2. 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Nginx（反向代理）
sudo apt install -y nginx
```

### 3. 上传项目文件

```bash
# 使用 Git 克隆（推荐）
cd /var/www
sudo git clone <你的仓库地址> haolilai

# 或使用 FTP/SFTP 上传整个项目文件夹
```

### 4. 配置项目

```bash
cd /var/www/haolilai

# 安装依赖
npm install

# 复制环境变量
cp .env.local.example .env.local
nano .env.local  # 编辑环境变量

# 构建生产版本
npm run build
```

### 5. 使用 PM2 启动服务

```bash
# 启动 Next.js 应用
pm2 start npm --name "haolilai" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看运行状态
pm2 status
pm2 logs haolilai
```

### 6. 配置 Nginx 反向代理

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/haolilai
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/haolilai /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 7. 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 8. 数据库权限设置

```bash
# 确保 SQLite 数据库文件有正确权限
sudo chown -R www-data:www-data /var/www/haolilai
sudo chmod 664 /var/www/haolilai/sqlite.db
```

---

## 方式三：Docker 部署

### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./sqlite.db:/app/sqlite.db
      - ./public/uploads:/app/public/uploads
    restart: unless-stopped
```

### 3. 部署命令

```bash
# 构建镜像
docker-compose build

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止容器
docker-compose down
```

---

## 常见问题

### Q1: 部署后无法访问？
- 检查防火墙是否开放端口
- 检查 PM2 进程是否正常运行
- 查看 Nginx 错误日志：`sudo tail -f /var/log/nginx/error.log`

### Q2: 数据库连接错误？
- 确认 `.env.local` 文件已正确配置
- 检查数据库文件权限

### Q3: 如何更新网站？
```bash
cd /var/www/haolilai
git pull
npm install
npm run build
pm2 restart haolilai
```

### Q4: 如何备份数据库？
```bash
# 备份 SQLite
cp sqlite.db sqlite.db.backup-$(date +%Y%m%d)

# 或使用 PM2 定时任务
pm2 install pm2-auto-pull
```

---

## 推荐配置

- **小型网站**：Vercel（需迁移数据库）
- **中型网站**：VPS + PM2 + Nginx
- **大型网站**：Docker + Kubernetes + 云数据库
