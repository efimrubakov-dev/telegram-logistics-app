# 🚀 部署指南 - Telegram Mini App

本指南将帮助您将 Telegram Mini App 部署到 Telegram。

## 📋 前置要求

1. **GitHub 账户** - 用于托管代码和部署
2. **Telegram Bot** - 通过 @BotFather 创建
3. **Node.js 18+** - 已安装在您的电脑上

---

## 🔧 步骤 1: 准备项目

### 1.1 构建项目

首先，确保项目可以正常构建：

```bash
npm install
npm run build
```

构建成功后，文件会在 `dist/` 目录中。

---

## 📤 步骤 2: 部署到 GitHub Pages

### 2.1 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 输入仓库名称（例如：`telegram-logistics-app`）
3. 选择 **Public**（GitHub Pages 免费版需要公开仓库）
4. 点击 **Create repository**

### 2.2 上传代码到 GitHub

在项目目录中运行：

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Telegram Mini App"

# 重命名分支为 main（如果需要）
git branch -M main

# 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/telegram-logistics-app.git

# 推送代码
git push -u origin main
```

### 2.3 启用 GitHub Pages

1. 打开您的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下选择 **GitHub Actions**
5. 保存设置

### 2.4 等待部署完成

- GitHub Actions 会自动开始部署
- 您可以在仓库的 **Actions** 标签页查看部署进度
- 部署完成后，您的应用将在以下地址可用：
  ```
  https://YOUR_USERNAME.github.io/telegram-logistics-app/
  ```

---

## 🤖 步骤 3: 在 Telegram 中配置 Mini App

### 3.1 创建或选择 Bot

1. 在 Telegram 中搜索 **@BotFather**
2. 发送 `/newbot` 创建新机器人，或使用现有机器人
3. 记录下您的 Bot Token（格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

### 3.2 创建 Mini App

1. 在 @BotFather 中发送 `/newapp`
2. 选择您的机器人
3. 按照提示输入：
   - **应用名称**：ES Логистика（或您想要的名称）
   - **简短描述**：物流和配送管理应用
   - **图标**：上传一个 512x512 像素的 PNG 图片
   - **GIF/视频**（可选）：可以跳过
   - **Web App URL**：`https://YOUR_USERNAME.github.io/telegram-logistics-app/`
   - **简短名称**：用于命令（例如：`eslogistics`）

### 3.3 测试 Mini App

1. 在 Telegram 中搜索您的机器人
2. 点击机器人，然后点击 **Menu** 按钮（或发送 `/start`）
3. 您应该能看到 Mini App 按钮
4. 点击按钮打开应用

---

## 🔍 步骤 4: 验证部署

### 4.1 检查应用是否正常加载

打开应用后，检查：
- ✅ 应用是否正常显示
- ✅ 导航是否工作
- ✅ Telegram 用户信息是否正确获取
- ✅ 所有功能是否正常

### 4.2 常见问题排查

**问题：应用无法加载**
- 检查 GitHub Pages 部署是否成功
- 确认 URL 是否正确
- 检查浏览器控制台是否有错误

**问题：Telegram SDK 未初始化**
- 确保应用在 Telegram 内打开（不是在浏览器中）
- 检查 `index.html` 中是否包含 Telegram SDK 脚本

**问题：样式显示异常**
- 清除浏览器缓存
- 检查构建是否成功

---

## 🔄 更新应用

每次更新代码后：

```bash
# 提交更改
git add .
git commit -m "更新描述"
git push origin main
```

GitHub Actions 会自动重新部署应用。

---

## 📝 重要提示

1. **HTTPS 要求**：Telegram Mini App 必须通过 HTTPS 访问
2. **域名限制**：确保使用正确的 GitHub Pages URL
3. **缓存问题**：更新后可能需要等待几分钟才能看到更改
4. **测试环境**：建议先在测试机器人上测试，再部署到生产环境

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查 GitHub Actions 日志
2. 查看浏览器控制台错误
3. 确认所有配置步骤都已完成
4. 参考 Telegram Bot API 文档：https://core.telegram.org/bots/webapps

---

**祝您部署顺利！🎉**
