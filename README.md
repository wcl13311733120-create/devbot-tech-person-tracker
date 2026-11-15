# 科技人物深度追踪与舆情分析平台 (Tech Person Tracker)

基于 X 热搜 Top 10 推文深度分析（黄仁勋慈善/价格/妻子发声、马斯克力挺开发者/xAI/DOGE、卢比奥罢免）开发的 MVP。

## 功能
- 👤 **人物库**：11 位科技人物（黄仁勋、马斯克、Sam Altman、Zuckerberg、Bezos、Cook、Pichai、Nadella、雷军、马化腾、马云）
- 📅 **事件时间线**：基于真实舆情的事件库，含情感标签与热度
- 📊 **舆情分析**：累计热度、情感分布、风险等级、热度趋势
- ⚖️ **对比分析**：两人并排对比指标
- 🔥 **热门事件榜**：按热度排序
- 📝 **报告生成**：一键生成 Markdown 舆情追踪报告
- 📌 **追踪记录**：本地/服务器记录追踪快照

## 技术栈
- Node.js + Express
- 前端：纯 HTML/CSS/JS（无框架）
- 数据：本地 JSON 文件（Node 模式）/ localStorage（静态 Pages 模式）

## 运行
```bash
npm install
npm start
# 访问 http://localhost:3000
```

## 部署
推送到 GitHub 仓库 `wcl13311733120-create/devbot-tech-person-tracker`，启用 GitHub Pages。
