// GET /api/news?category=general|merger|crypto|forex  或  /api/news?symbol=AAPL
const ALLOWED = ["general", "merger", "crypto", "forex"];
const fmt = (d) => d.toISOString().slice(0, 10);

module.exports = async (req, res) => {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return res.status(500).json({ error: "服务器未设置 FINNHUB_API_KEY" });

  const { category = "general", symbol } = req.query;
  let url;
  if (symbol) {
    if (!/^[A-Za-z.\-]{1,10}$/.test(symbol)) return res.status(400).json({ error: "股票代码格式不对" });
    const to = new Date();
    const from = new Date(Date.now() - 7 * 864e5);
    url = `https://finnhub.io/api/v1/company-news?symbol=${symbol.toUpperCase()}&from=${fmt(from)}&to=${fmt(to)}&token=${key}`;
  } else {
    if (!ALLOWED.includes(category)) return res.status(400).json({ error: "不支持的分类" });
    url = `https://finnhub.io/api/v1/news?category=${category}&token=${key}`;
  }

  try {
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: `数据源返回 ${r.status}` });
    const data = await r.json();
    const items = (Array.isArray(data) ? data : []).slice(0, 30).map((n) => ({
      id: n.id,
      headline: n.headline,
      summary: (n.summary || "").slice(0, 160), // 只保留简短摘要，全文请跳转原站
      source: n.source,
      url: n.url,
      time: n.datetime,
      related: n.related || "",
    }));
    // 在 Vercel 边缘缓存 60 秒，避免超出免费额度
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.status(200).json(items);
  } catch (e) {
    res.status(502).json({ error: "获取新闻失败" });
  }
};
