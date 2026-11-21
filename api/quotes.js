// GET /api/quotes  —— 用 ETF 代表三大指数（免费版不提供指数点位）
const LIST = [
  ["SPY", "标普 500"],
  ["QQQ", "纳斯达克 100"],
  ["DIA", "道琼斯"],
  ["IWM", "罗素 2000"],
];

module.exports = async (req, res) => {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return res.status(500).json({ error: "服务器未设置 FINNHUB_API_KEY" });
  try {
    const out = await Promise.all(
      LIST.map(async ([s, name]) => {
        const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${key}`);
        const q = await r.json();
        return { symbol: s, name, price: q.c, change: q.d, pct: q.dp };
      })
    );
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: "获取行情失败" });
  }
};
