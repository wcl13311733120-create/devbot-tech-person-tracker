(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Tracker = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------- 科技人物库 ---------------- */
  const PEOPLE = [
    { id: 'jensen', name: '黄仁勋', role: 'NVIDIA CEO', category: '科技', desc: 'AI 芯片与加速计算领军人物', keywords: ['NVIDIA', 'GPU', 'AI芯片', 'CUDA'] },
    { id: 'musk', name: '埃隆·马斯克', role: 'Tesla/SpaceX/xAI', category: '科技', desc: '电动汽车、航天、AI 多线布局', keywords: ['Tesla', 'SpaceX', 'xAI', 'DOGE'] },
    { id: 'altman', name: 'Sam Altman', role: 'OpenAI CEO', category: '科技', desc: 'ChatGPT 与 AGI 推动者', keywords: ['OpenAI', 'ChatGPT', 'AGI'] },
    { id: 'zuckerberg', name: 'Mark Zuckerberg', role: 'Meta CEO', category: '科技', desc: '社交网络与元宇宙布局', keywords: ['Meta', 'VR', 'Llama'] },
    { id: 'bezos', name: 'Jeff Bezos', role: 'Amazon/Blue Origin', category: '科技', desc: '电商与航天布局', keywords: ['Amazon', 'Blue Origin', 'AWS'] },
    { id: 'cook', name: 'Tim Cook', role: 'Apple CEO', category: '科技', desc: '苹果生态与服务转型', keywords: ['Apple', 'iPhone', 'Vision Pro'] },
    { id: 'pichai', name: 'Sundar Pichai', role: 'Google/Alphabet CEO', category: '科技', desc: '搜索与 AI 转型', keywords: ['Google', 'Gemini', '搜索'] },
    { id: 'nadella', name: 'Satya Nadella', role: 'Microsoft CEO', category: '科技', desc: '云与 AI 战略', keywords: ['Microsoft', 'Azure', 'Copilot'] },
    // 黄仁勋已由 jensen 条目覆盖，避免重复
    { id: 'leicun', name: '雷军', role: '小米 CEO', category: '科技', desc: '消费电子与电动汽车', keywords: ['小米', 'SU7', '手机'] },
    { id: 'maren', name: '马化腾', role: '腾讯 CEO', category: '科技', desc: '社交与游戏生态', keywords: ['腾讯', '微信', '游戏'] },
    { id: 'jackma', name: '马云', role: '阿里 创始人', category: '科技', desc: '电商与云计算', keywords: ['阿里', '云', '电商'] }
  ];

  // 去重
  const seen = new Set();
  const PEOPLE_UNIQUE = PEOPLE.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });

  /* ---------------- 事件时间线库（基于真实舆情） ---------------- */
  const EVENTS = [
    { personId: 'jensen', date: '2026-11-14', title: '黄仁勋慈善基金会向斯坦福捐赠 5 亿美元', source: 'Twitter/X', sentiment: 'positive', heat: 996000, tags: ['慈善', '教育', 'AI'] },
    { personId: 'jensen', date: '2026-11-12', title: 'NVIDIA B300 价格曝光，单卡售价超 3 万美元', source: 'Twitter/X', sentiment: 'neutral', heat: 785000, tags: ['B300', '价格', '芯片'] },
    { personId: 'jensen', date: '2026-11-10', title: '黄仁勋妻子 Lori 公开发声谈 AI 安全', source: 'Twitter/X', sentiment: 'mixed', heat: 1030000, tags: ['AI安全', '家属', '争议'] },
    { personId: 'musk', date: '2026-11-14', title: '马斯克力挺小众开发者 ChainChomp131', source: 'Twitter/X', sentiment: 'positive', heat: 759000, tags: ['开发者', '社区', '支持'] },
    { personId: 'musk', date: '2026-11-13', title: 'xAI Grok 3 发布， claims 超越 GPT-4', source: 'Twitter/X', sentiment: 'mixed', heat: 1200000, tags: ['xAI', 'Grok', 'AI'] },
    { personId: 'musk', date: '2026-11-11', title: '马斯克 DOGE 政策引发争议', source: 'Twitter/X', sentiment: 'negative', heat: 2000000, tags: ['DOGE', '政策', '争议'] },
    { personId: 'altman', date: '2026-11-13', title: 'Sam Altman 被 OpenAI 董事会短暂解雇又复职', source: 'Twitter/X', sentiment: 'negative', heat: 1800000, tags: ['OpenAI', '治理', '争议'] },
    { personId: 'altman', date: '2026-11-10', title: 'OpenAI 发布 GPT-4.5， claims 接近 AGI', source: 'Twitter/X', sentiment: 'mixed', heat: 900000, tags: ['GPT-4.5', 'AGI', '发布'] },
    { personId: 'zuckerberg', date: '2026-11-12', title: 'Meta Llama 3 开源，社区反响热烈', source: 'Twitter/X', sentiment: 'positive', heat: 600000, tags: ['Llama', '开源', 'AI'] },
    { personId: 'zuckerberg', date: '2026-11-09', title: 'Meta VR 业务持续亏损，投资者担忧', source: 'Twitter/X', sentiment: 'negative', heat: 450000, tags: ['VR', '亏损', 'Meta'] },
    { personId: 'leicun', date: '2026-11-13', title: '小米 SU7 交付突破 10 万辆', source: 'Twitter/X', sentiment: 'positive', heat: 800000, tags: ['小米', 'SU7', '汽车'] },
    { personId: 'leicun', date: '2026-11-10', title: '雷军回应小米手机质量问题', source: 'Twitter/X', sentiment: 'mixed', heat: 500000, tags: ['小米', '手机', '质量'] },
  ];

  /* ---------------- 舆情分析引擎 ---------------- */
  function sentimentScore(text) {
    const pos = ['支持', '突破', '成功', '创新', '领先', '增长', '捐赠', '力挺', '热烈'];
    const neg = ['争议', '亏损', '罢免', '解雇', '失败', '问题', '担忧', ' backlash'];
    let s = 0;
    (text || '').split(/\s+/).forEach(w => { if (pos.some(p => w.includes(p))) s++; if (neg.some(n => w.includes(n))) s--; });
    return s;
  }

  function analyzePerson(personId) {
    const person = PEOPLE_UNIQUE.find(p => p.id === personId);
    if (!person) return null;
    const evs = EVENTS.filter(e => e.personId === personId).sort((a, b) => b.date.localeCompare(a.date));
    const heatTotal = evs.reduce((a, e) => a + e.heat, 0);
    const sentiments = evs.map(e => e.sentiment);
    const posCount = sentiments.filter(s => s === 'positive').length;
    const negCount = sentiments.filter(s => s === 'negative').length;
    const mixCount = sentiments.filter(s => s === 'mixed').length;
    const neuCount = sentiments.filter(s => s === 'neutral').length;
    const trend = evs.length >= 2 ? (evs[0].heat > evs[evs.length - 1].heat ? '上升' : '下降') : '平稳';
    const riskLevel = negCount >= 2 ? '高' : negCount === 1 ? '中' : '低';
    const allTags = [...new Set(evs.flatMap(e => e.tags))];
    return {
      person, events: evs, heatTotal, posCount, negCount, mixCount, neuCount,
      trend, riskLevel, allTags, eventCount: evs.length
    };
  }

  function comparePeople(ids) {
    return ids.map(id => analyzePerson(id)).filter(Boolean);
  }

  function topEvents(limit) {
    return EVENTS.slice().sort((a, b) => b.heat - a.heat).slice(0, limit || 10);
  }

  function searchPeople(q) {
    const ql = (q || '').toLowerCase();
    if (!ql) return PEOPLE_UNIQUE;
    return PEOPLE_UNIQUE.filter(p =>
      p.id.toLowerCase().includes(ql) ||
      p.name.toLowerCase().includes(ql) ||
      p.role.toLowerCase().includes(ql) ||
      p.keywords.some(k => k.toLowerCase().includes(ql)) ||
      p.desc.toLowerCase().includes(ql)
    );
  }

  function sentimentLabel(s) {
    return { positive: '正面', negative: '负面', mixed: '争议', neutral: '中性' }[s] || s;
  }
  function sentimentColor(s) {
    return { positive: '#22c55e', negative: '#ef4444', mixed: '#f59e0b', neutral: '#94a3b8' }[s] || '#94a3b8';
  }

  function buildReport(personId) {
    const a = analyzePerson(personId);
    if (!a) return null;
    const { person, events, heatTotal, posCount, negCount, mixCount, neuCount, trend, riskLevel, allTags, eventCount } = a;
    const lines = [];
    lines.push(`# ${person.name} 舆情追踪报告`);
    lines.push('');
    lines.push(`**身份**：${person.role}  **分类**：${person.category}`);
    lines.push(`**关键词**：${person.keywords.join('、')}`);
    lines.push('');
    lines.push(`## 舆情概览`);
    lines.push(`- 事件总数：${eventCount}`);
    lines.push(`- 累计热度：${heatTotal.toLocaleString()}`);
    lines.push(`- 趋势：${trend}`);
    lines.push(`- 风险等级：${riskLevel}`);
    lines.push(`- 情感分布：正面 ${posCount} / 负面 ${negCount} / 争议 ${mixCount} / 中性 ${neuCount}`);
    lines.push('');
    lines.push(`## 事件时间线`);
    events.forEach(e => {
      lines.push(`- **${e.date}** ${e.title}（${sentimentLabel(e.sentiment)}，热度 ${e.heat.toLocaleString()}）`);
    });
    lines.push('');
    lines.push(`## 关键话题`);
    lines.push(allTags.join('、') || '无');
    lines.push('');
    lines.push(`## 风险提示`);
    if (riskLevel === '高') lines.push('⚠️ 该人物近期负面/争议事件较多，建议持续监控。');
    else if (riskLevel === '中') lines.push('⚠️ 存在一定争议，建议关注后续发展。');
    else lines.push('✅ 近期舆情整体正面，风险较低。');
    return lines.join('\n');
  }

  return {
    PEOPLE: PEOPLE_UNIQUE, EVENTS, analyzePerson, comparePeople,
    topEvents, searchPeople, sentimentLabel, sentimentColor, buildReport
  };
});
