# Git 安装和 GitHub 上传完整指南

## 第一步：安装 Git

### 方法 1：图形界面安装（推荐新手）

1. **下载 Git**
   - 访问：https://git-scm.com/download/win
   - 下载最新版本（约 60MB）

2. **安装 Git**
   - 双击下载的 `.exe` 文件
   - 按照以下选项配置：
     - ✅ 选择 "Git from the command line and also from 3rd-party software"
     - ✅ 选择 "Use Windows' default console window"
     - ✅ 其他选项保持默认
   - 点击 "Install" 完成安装

3. **验证安装**
   - 打开**新的** PowerShell 窗口（必须是新窗口）
   - 运行：`git --version`
   - 应该显示：`git version 2.x.x`

### 方法 2：命令行安装（需要管理员权限）

以**管理员身份**打开 PowerShell，然后运行：

```powershell
winget install --id Git.Git -e --source winget
```

安装完成后**重启 PowerShell**。

---

## 第二步：配置 Git

首次使用 Git 需要配置您的身份信息：

```powershell
# 设置用户名
git config --global user.name "您的名字"

# 设置邮箱（使用您的 GitHub 邮箱）
git config --global user.email "your-email@example.com"

# 验证配置
git config --list
```

---

## 第三步：创建 GitHub 仓库

1. **登录 GitHub**
   - 访问：https://github.com
   - 登录或注册账号

2. **创建新仓库**
   - 点击右上角的 "+" → "New repository"
   - 填写：
     - Repository name: `haolilai-website`
     - Description: `好利来官方网站`
     - 选择 **Private**（私有）或 **Public**（公开）
   - ⚠️ **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **复制仓库地址**
   - 创建完成后，复制显示的 HTTPS 地址
   - 格式：`https://github.com/您的用户名/haolilai-website.git`

---

## 第四步：上传项目到 GitHub

### ⚠️ 重要：忽略敏感文件

在上传之前，先创建 `.gitignore` 文件（如果不存在）：

**在项目根目录检查是否已有 `.gitignore`，如果没有则创建：**

```powershell
# 在项目目录下运行
cd "d:\好利來網頁架設\20260203"

# 创建 .gitignore 文件
@"
# 依赖
/node_modules
/.pnp
.pnp.js

# 测试
/coverage

# Next.js
/.next/
/out/

# 生产
/build

# 本地环境变量（包含敏感信息）
.env*.local
.env

# 调试日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# 数据库文件（包含敏感数据）
*.db
*.sqlite
*.sqlite3

# IDE
/.vscode
/.idea
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 调试脚本
check_*.js
debug_*.js
dump_*.js
inspect_*.js
migrate_*.js
verify_*.js
test_*.js
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

### 初始化和上传

```powershell
# 进入项目目录
cd "d:\好利來網頁架設\20260203"

# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件（会自动忽略 .gitignore 中的文件）
git add .

# 3. 查看将要提交的文件（可选，确认没有敏感文件）
git status

# 4. 提交到本地仓库
git commit -m "Initial commit: 好利来网站初始版本"

# 5. 添加远程仓库（替换为您的 GitHub 仓库地址）
git remote add origin https://github.com/您的用户名/haolilai-website.git

# 6. 推送到 GitHub
git push -u origin main
```

**如果推送时要求输入账号密码：**
- Username: 您的 GitHub 用户名
- Password: **不是密码**，而是 Personal Access Token（见下方）

---

## 第五步：创建 GitHub Personal Access Token

GitHub 已不再支持使用密码推送代码，需要使用 Token：

1. **创建 Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写：
     - Note: `Haolilai Website`
     - Expiration: `90 days`
     - 勾选：`repo`（完整访问权限）
   - 点击 "Generate token"
   - **⚠️ 立即复制 Token！关闭页面后无法再次查看**

2. **使用 Token 推送**
   - 当 `git push` 要求输入密码时
   - 粘贴您的 Token（不是密码）

---

## 常见问题解决

### Q1: `git push` 时提示 "fatal: 'origin' does not appear to be a git repository"

**解决方法：**
```powershell
# 重新添加远程仓库
git remote remove origin
git remote add origin https://github.com/您的用户名/haolilai-website.git
git push -u origin main
```

### Q2: 提示 "src refspec main does not match any"

**原因：** 默认分支可能是 `master` 而不是 `main`

**解决方法：**
```powershell
# 方法 1：重命名分支
git branch -M main
git push -u origin main

# 方法 2：直接推送到 master
git push -u origin master
```

### Q3: 推送时提示 "Updates were rejected"

**原因：** 远程仓库有冲突

**解决方法：**
```powershell
# 强制推送（⚠️ 会覆盖远程仓库）
git push -u origin main --force
```

### Q4: 如何更新代码到 GitHub？

```powershell
# 1. 查看修改的文件
git status

# 2. 添加所有修改
git add .

# 3. 提交修改
git commit -m "描述您的修改"

# 4. 推送到 GitHub
git push
```

---

## 后续维护

### 日常更新流程

```powershell
# 每次修改代码后
git add .
git commit -m "修改说明"
git push
```

### 版本管理最佳实践

```powershell
# 查看提交历史
git log --oneline

# 回退到某个版本
git reset --hard <commit-id>

# 创建新分支开发新功能
git checkout -b feature/new-feature

# 合并分支
git checkout main
git merge feature/new-feature
```

---

## ⚠️ 重要安全提示

**绝对不要上传以下文件到 GitHub：**
- ✅ `.env.local` - 环境变量（已在 .gitignore 中）
- ✅ `sqlite.db` - 数据库文件（已在 .gitignore 中）
- ✅ `node_modules/` - 依赖包（已在 .gitignore 中）
- ✅ 密码、API 密钥、敏感配置

**如果不小心上传了敏感文件：**
1. 立即删除仓库或将其设为 Private
2. 重置所有密码和 API 密钥
3. 使用 `git filter-branch` 或 `BFG Repo-Cleaner` 清理历史

---

## 部署到 Vercel 的快速通道

一旦代码上传到 GitHub，您可以直接部署到 Vercel：

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Import Project"
4. 选择您的 `haolilai-website` 仓库
5. 添加环境变量（复制 `.env.local` 的内容）
6. 点击 "Deploy"

⚠️ **记住**：Vercel 不支持 SQLite，需要迁移到云数据库！

---

## 需要帮助？

如果遇到任何问题，请告诉我：
- 错误信息的完整截图
- 您执行的具体命令
- 当前的操作步骤

我会帮您解决！
