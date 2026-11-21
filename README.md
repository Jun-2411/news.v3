# 美股快讯：部署说明（Vercel）

## 1. 获取 API 密钥
1. 打开 https://finnhub.io 注册免费账号（不需要信用卡）。
2. 登录后在 Dashboard 复制 API Key。

## 2. 部署
方式 A：网页操作（最简单）
1. 把本文件夹上传到 GitHub 新仓库。
2. 打开 https://vercel.com ，用 GitHub 登录，点 Add New → Project，选择该仓库。
3. 在 Environment Variables 中添加：
   名称 FINNHUB_API_KEY，值为你的密钥。
4. 点 Deploy，完成后得到一个网址。

方式 B：命令行
    npm i -g vercel
    cd us-finance-news
    vercel            # 按提示登录并创建项目
    vercel env add FINNHUB_API_KEY
    vercel --prod

## 3. 注意
- 密钥只放在 Vercel 环境变量里，不要写进代码或上传到 GitHub。
- 免费版为个人非商业用途；如果要商用或对外收费，需升级套餐。
- 指数行情用 ETF（SPY、QQQ、DIA、IWM）代替，因为免费版不提供指数点位。
- 新闻标题为英文原文。
- 改完代码后重新部署即可更新。
