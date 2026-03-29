import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, BarChart3, Wallet, Calendar, Trophy,
  ChevronRight, Eye, EyeOff, Bell, Search, Menu, X, ArrowUpRight,
  ArrowDownRight, Flame, Shield, Target, Layers, Crown, Medal,
  Star, Clock, Globe, Lock, Zap, PieChart, LineChart, Users,
  ShoppingCart, BookOpen, DollarSign, ExternalLink, Check, AlertTriangle, RefreshCw
} from "lucide-react";
import {
  LineChart as RLineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart,
  Pie, Cell
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────
const INDEXES = [
  { ticker: "SCK", name: "Knife Index", value: 389.78, change: 4.2, change7d: 8.1, icon: Target, color: "#00ff88",
    history: [352,358,361,365,370,368,374,379,382,385,383,387,389,392,389] },
  { ticker: "SCR", name: "Rifle Index", value: 142.35, change: -1.3, change7d: 2.4, icon: BarChart3, color: "#3b82f6",
    history: [135,137,139,140,141,143,144,142,141,143,144,143,142,141,142] },
  { ticker: "SCP", name: "Pistol Index", value: 67.20, change: 2.8, change7d: 5.7, icon: Zap, color: "#a855f7",
    history: [60,61,62,61,63,64,63,65,64,66,65,67,66,67,67] },
  { ticker: "SCG", name: "Glove Index", value: 1842.50, change: 1.1, change7d: 3.2, icon: Shield, color: "#eab308",
    history: [1750,1760,1780,1790,1795,1800,1810,1815,1820,1825,1830,1835,1838,1840,1842] },
  { ticker: "SCS", name: "Sticker Index", value: 23.80, change: 12.4, change7d: 18.9, icon: Flame, color: "#ef4444",
    history: [18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.2,23.5,23.7,23.8] },
  { ticker: "SCC", name: "Case Index", value: 4.52, change: -0.8, change7d: -2.1, icon: Layers, color: "#06b6d4",
    history: [4.8,4.75,4.7,4.65,4.6,4.58,4.55,4.53,4.52,4.50,4.51,4.52,4.51,4.52,4.52] },
];

const CONSTITUENTS = [
  { name: "Butterfly Knife | Doppler (FN)", price: 950, volume: 8, weight: 12.1, change: 5.2 },
  { name: "Karambit | Doppler (FN)", price: 780, volume: 10, weight: 12.4, change: 3.8 },
  { name: "M9 Bayonet | Doppler (FN)", price: 620, volume: 12, weight: 11.8, change: 4.1 },
  { name: "Bayonet | Doppler (FN)", price: 380, volume: 18, weight: 10.9, change: 2.9 },
  { name: "Talon Knife | Doppler (FN)", price: 350, volume: 12, weight: 6.7, change: 6.3 },
  { name: "Flip Knife | Doppler (FN)", price: 310, volume: 25, weight: 12.3, change: -1.2 },
  { name: "Classic Knife | Fade (FN)", price: 280, volume: 10, weight: 4.5, change: 1.8 },
  { name: "Huntsman Knife | Fade (FN)", price: 220, volume: 15, weight: 5.3, change: 3.1 },
  { name: "Ursus Knife | Doppler (FN)", price: 210, volume: 18, weight: 6.0, change: -0.5 },
  { name: "Stiletto Knife | Doppler (FN)", price: 195, volume: 22, weight: 6.8, change: 2.2 },
  { name: "Bowie Knife | Doppler (FN)", price: 180, volume: 20, weight: 5.7, change: 1.4 },
  { name: "Falchion Knife | Doppler (FN)", price: 165, volume: 30, weight: 7.9, change: -2.1 },
  { name: "Gut Knife | Doppler (FN)", price: 135, volume: 45, weight: 9.7, change: 0.8 },
  { name: "Shadow Daggers | Doppler (FN)", price: 120, volume: 35, weight: 6.7, change: -0.3 },
  { name: "Navaja Knife | Doppler (FN)", price: 110, volume: 40, weight: 7.0, change: 1.5 },
];

const PORTFOLIO = {
  totalValue: 10847.50, totalReturn: 22.4, invested: 8862.00,
  allocations: [
    { index: "SCK", pct: 25, value: 2711.88, returnPct: 18.2 },
    { index: "SCR", pct: 30, value: 3254.25, returnPct: 24.1 },
    { index: "SCP", pct: 15, value: 1627.13, returnPct: 28.7 },
    { index: "SCG", pct: 10, value: 1084.75, returnPct: 12.3 },
    { index: "SCS", pct: 10, value: 1084.75, returnPct: 34.5 },
    { index: "SCC", pct: 10, value: 1084.75, returnPct: 8.9 },
  ]
};

const BENCHMARKS = [
  { name: "My Portfolio", data: [100,103,107,105,109,112,115,113,117,119,121,118,120,122,122.4], color: "#00ff88" },
  { name: "S&P 500", data: [100,101,102,101,103,104,103,105,106,107,106,108,109,110,112], color: "#6b7280" },
  { name: "Bitcoin", data: [100,105,108,98,102,110,115,108,112,118,122,115,120,125,119], color: "#f59e0b" },
  { name: "Gold", data: [100,100.5,101,101.5,102,102.5,103,103.2,103.5,104,104.5,105,105.2,105.5,106], color: "#a855f7" },
];

const SEASONAL = {
  months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  categories: ["Knives","Rifles","Pistols","Gloves","Stickers","Cases"],
  signals: [
    ["B","B","H","H","S","S","B","B","H","H","B","B"],
    ["H","B","B","H","H","S","S","B","B","H","H","B"],
    ["B","H","H","B","B","S","S","H","B","B","H","H"],
    ["B","B","H","H","S","S","B","B","H","B","B","H"],
    ["H","H","B","B","B","S","S","H","B","B","B","H"],
    ["B","B","H","S","S","S","B","B","H","H","B","B"],
  ],
  events: ["CNY","","Major","Op. window","Pre-sale","Summer Sale","Recovery","","","Major","Autumn Sale","Winter Sale"]
};

const LEADERBOARD = [
  { rank: 1, name: "CryptoKnifer", returnPct: 67.2, strategy: "Blue Chip Collector", badge: "crown", streak: 6 },
  { rank: 2, name: "SkinAlpha_CN", returnPct: 54.8, strategy: "Event Trader", badge: "medal", streak: 4 },
  { rank: 3, name: "ValveWatcher", returnPct: 48.1, strategy: "Aggressive Growth", badge: "star", streak: 5 },
  { rank: 4, name: "IndexInvestor", returnPct: 41.3, strategy: "SC 60/40", badge: null, streak: 3 },
  { rank: 5, name: "SteamSharpe", returnPct: 38.9, strategy: "Conservative", badge: null, streak: 2 },
  { rank: 6, name: "DopplerTrader", returnPct: 35.2, strategy: "Knife Only", badge: null, streak: 4 },
  { rank: 7, name: "MajorMomentum", returnPct: 31.7, strategy: "Event Trader", badge: null, streak: 1 },
  { rank: 8, name: "You", returnPct: 22.4, strategy: "Custom Balanced", badge: null, streak: 2, isUser: true },
];

// ─── HELPERS ─────────────────────────────────────────────────────
const fmt = (v, decimals = 2) => v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v.toFixed(decimals)}`;
const fmtFull = (v) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const pct = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
const sigColor = { B: "#00ff88", H: "#6b7280", S: "#ef4444" };
const sigBg = { B: "rgba(0,255,136,0.08)", H: "rgba(107,114,128,0.08)", S: "rgba(239,68,68,0.08)" };
const sigLabel = { B: "BUY", H: "HOLD", S: "SELL" };
const PIE_COLORS = ["#00ff88","#3b82f6","#a855f7","#eab308","#ef4444","#06b6d4"];

// ─── COMPONENTS ──────────────────────────────────────────────────
function Card({ children, className = "", onClick, hover = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : {}}
      onClick={onClick}
      className={`bg-[#13161b] border border-[#1e2128] rounded-xl ${hover ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-[#1e2128] text-[#9ca3af]",
    green: "bg-[#00ff8815] text-[#00ff88] border border-[#00ff8830]",
    red: "bg-[#ef444415] text-[#ef4444] border border-[#ef444430]",
    gold: "bg-[#eab30815] text-[#eab308] border border-[#eab30830]",
    blue: "bg-[#3b82f615] text-[#3b82f6] border border-[#3b82f630]",
    locked: "bg-[#1e2128] text-[#4a5060] border border-[#2a2d36]",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase ${styles[variant]}`}>{children}</span>;
}

function MiniSparkline({ data, color, width = 80, height = 28 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavItem({ icon: Icon, label, active, onClick, locked }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full
        ${active ? "bg-[#1e2128] text-[#e8eaed]" : "text-[#6b7280] hover:text-[#9ca3af] hover:bg-[#13161b]"}
        ${locked ? "opacity-50" : ""}`}
    >
      <Icon size={15} />
      <span>{label}</span>
      {locked && <Lock size={10} className="ml-auto text-[#4a5060]" />}
    </button>
  );
}

function TierSection({ tier, totalValue, costBasisMode, delay = 0 }) {
  const [open, setOpen] = useState(tier.defaultOpen);
  const TierIcon = tier.icon;
  const tierPnl = tier.totalVal - tier.totalCostTier;
  const tierPnlPct = tier.totalCostTier > 0 ? ((tierPnl / tier.totalCostTier) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className="mb-2">
      {/* Tier header — always visible, clickable */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0d0f12] border border-[#1e2128] hover:border-[#2a2d36] transition-all">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${tier.color}15` }}>
          <TierIcon size={12} style={{ color: tier.color }} />
        </div>
        <span className="text-[11px] font-semibold text-[#e8eaed]">{tier.label}</span>
        <span className="text-[10px] text-[#4a5060]">{tier.items.length} items · {tier.itemCount} units</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] font-bold text-[#e8eaed] font-mono">{fmtFull(tier.totalVal)}</span>
          <span className="text-[10px] font-semibold" style={{ color: tier.color }}>{tier.pctPort}%</span>
          <span className={`text-[10px] font-semibold ${tierPnl >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>{pct(tierPnlPct)}</span>
          <ChevronRight size={12} className={`text-[#2a2d36] transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Expanded items */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="pt-1 pl-8">
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-2 text-[8px] font-semibold text-[#2a2d36] uppercase tracking-wider pb-1 px-1">
                <span className="col-span-3">Item</span>
                <span className="col-span-1 text-right">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">{costBasisMode === "track" ? "At Import" : "Buy"}</span>
                <span className="col-span-2 text-right">Value</span>
                <span className="col-span-2 text-right">P&L</span>
              </div>
              {tier.items.map((item, i) => {
                const val = item.price * item.qty;
                const pnlP = ((item.price - item.buyPrice) / item.buyPrice * 100);
                const idxData = INDEXES.find(x => x.ticker === item.index);
                return (
                  <div key={i} className="grid grid-cols-12 gap-2 py-1.5 border-b border-[#1e212810] last:border-0 text-[10px] items-center px-1 hover:bg-[#13161b] rounded transition-colors">
                    <span className="col-span-3 text-[#9ca3af] truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: idxData?.color }} />
                      {item.name}
                    </span>
                    <span className="col-span-1 text-right text-[#4a5060]">{item.qty}×</span>
                    <span className="col-span-2 text-right text-[#6b7280] font-mono">{fmt(item.price)}</span>
                    <span className="col-span-2 text-right text-[#4a5060] font-mono group cursor-pointer">
                      <span className="group-hover:text-[#eab308] transition-colors">{fmt(item.buyPrice)}</span>
                      {costBasisMode !== "track" && <span className="text-[#1e2128] group-hover:text-[#eab308] ml-0.5">✎</span>}
                    </span>
                    <span className="col-span-2 text-right text-[#9ca3af] font-mono">{fmt(val)}</span>
                    <span className={`col-span-2 text-right font-semibold font-mono ${pnlP >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
                      {pct(pnlP)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── VIEWS ───────────────────────────────────────────────────────
function OverviewView() {
  const benchData = BENCHMARKS[0].data.map((_, i) => {
    const point = { week: `W${i + 1}` };
    BENCHMARKS.forEach(b => { point[b.name] = b.data[i]; });
    return point;
  });

  return (
    <div className="space-y-4">
      {/* Index Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {INDEXES.map((idx, i) => (
          <motion.div key={idx.ticker} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-4" hover>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${idx.color}15` }}>
                    <idx.icon size={14} style={{ color: idx.color }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest" style={{ color: idx.color }}>{idx.ticker}</div>
                    <div className="text-[10px] text-[#4a5060]">{idx.name}</div>
                  </div>
                </div>
                <MiniSparkline data={idx.history} color={idx.change >= 0 ? "#00ff88" : "#ef4444"} />
              </div>
              <div className="text-lg font-bold text-[#e8eaed] tracking-tight">{fmtFull(idx.value)}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold ${idx.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
                  {idx.change >= 0 ? <ArrowUpRight size={11} className="inline" /> : <ArrowDownRight size={11} className="inline" />}
                  {pct(idx.change)} 24h
                </span>
                <span className="text-[10px] text-[#4a5060]">{pct(idx.change7d)} 7d</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance vs Benchmarks */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#e8eaed]">Portfolio vs Benchmarks</h3>
              <p className="text-[10px] text-[#4a5060] mt-0.5">Normalized to 100 at start</p>
            </div>
            <div className="flex gap-3">
              {BENCHMARKS.map(b => (
                <div key={b.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                  <span className="text-[10px] text-[#6b7280]">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={benchData}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} domain={[95, 130]} />
              <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid #2a2d36", borderRadius: 8, fontSize: 11, color: "#e8eaed" }} />
              {BENCHMARKS.map(b => (
                <Area key={b.name} type="monotone" dataKey={b.name} stroke={b.color} fill={b.color} fillOpacity={b.name === "My Portfolio" ? 0.1 : 0} strokeWidth={b.name === "My Portfolio" ? 2.5 : 1.5} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Portfolio Summary + Market Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#e8eaed] mb-3">Portfolio Allocation</h3>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie data={PORTFOLIO.allocations} dataKey="pct" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2}>
                      {PORTFOLIO.allocations.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                  </RPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1">
                {PORTFOLIO.allocations.map((a, i) => (
                  <div key={a.index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-[11px] text-[#9ca3af] font-medium">{a.index}</span>
                      <span className="text-[10px] text-[#4a5060]">{a.pct}%</span>
                    </div>
                    <span className={`text-[11px] font-semibold ${a.returnPct >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>{pct(a.returnPct)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#e8eaed] mb-3">Today's Signals</h3>
            <div className="space-y-2">
              {[
                { cat: "Knives", signal: "B", reason: "Post-Major recovery, volume rising" },
                { cat: "Stickers", signal: "B", reason: "Major approaching, capsule accumulation phase" },
                { cat: "Cases", signal: "S", reason: "New case release diluting demand" },
                { cat: "Rifles", signal: "H", reason: "Stable, no catalyst expected" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#1e2128] last:border-0">
                  <span className="text-[11px] font-semibold text-[#e8eaed] w-16">{s.cat}</span>
                  <Badge variant={s.signal === "B" ? "green" : s.signal === "S" ? "red" : "default"}>{sigLabel[s.signal]}</Badge>
                  <span className="text-[10px] text-[#4a5060] flex-1">{s.reason}</span>
                  <Lock size={10} className="text-[#2a2d36]" />
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <Badge variant="locked"><Lock size={8} /> Alpha subscribers see full signals</Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function IndexView() {
  const [selected, setSelected] = useState(INDEXES[0]);
  const chartData = selected.history.map((v, i) => ({ day: `D${i + 1}`, value: v }));
  const sorted = [...CONSTITUENTS].sort((a, b) => b.weight - a.weight);

  return (
    <div className="space-y-4">
      {/* Index selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {INDEXES.map(idx => (
          <button key={idx.ticker} onClick={() => setSelected(idx)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all border
              ${selected.ticker === idx.ticker ? "border-[#00ff8840] bg-[#00ff8810] text-[#00ff88]" : "border-[#1e2128] bg-[#13161b] text-[#6b7280] hover:text-[#9ca3af]"}`}
          >
            {idx.ticker} <span className={`ml-1.5 ${idx.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>{pct(idx.change)}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest" style={{ color: selected.color }}>{selected.ticker}</span>
              <span className="text-xs text-[#6b7280]">{selected.name}</span>
            </div>
            <div className="text-2xl font-bold text-[#e8eaed] mt-1">{fmtFull(selected.value)}</div>
            <div className={`text-xs font-semibold mt-0.5 ${selected.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
              {pct(selected.change)} today · {pct(selected.change7d)} 7d
            </div>
          </div>
          <div className="flex gap-1">
            {["1D","1W","1M","3M","1Y","ALL"].map(tf => (
              <button key={tf} className="px-2 py-1 text-[10px] font-medium text-[#4a5060] hover:text-[#9ca3af] rounded hover:bg-[#1e2128] transition-all">{tf}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={selected.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={selected.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid #2a2d36", borderRadius: 8, fontSize: 11, color: "#e8eaed" }} />
            <Area type="monotone" dataKey="value" stroke={selected.color} fill="url(#idxGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#1e2128]">
          <Badge variant="locked"><Lock size={8} /> RSI, MACD, Bollinger Bands — Pro</Badge>
          <Badge variant="locked"><Lock size={8} /> Drawing tools — Pro</Badge>
        </div>
      </Card>

      {/* Constituents */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#e8eaed]">{selected.ticker} Constituents</h3>
          <Badge variant="green"><Eye size={8} /> Pro</Badge>
        </div>
        <div className="space-y-0">
          <div className="grid grid-cols-12 gap-2 text-[9px] font-semibold text-[#4a5060] uppercase tracking-wider pb-2 border-b border-[#1e2128] px-1">
            <span className="col-span-5">Skin</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Weight</span>
            <span className="col-span-1 text-right">Vol</span>
            <span className="col-span-2 text-right">24h</span>
          </div>
          {sorted.slice(0, 8).map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-2 py-2 border-b border-[#1e2128] last:border-0 text-[11px] items-center px-1 hover:bg-[#1a1d24] rounded transition-colors"
            >
              <span className="col-span-5 text-[#e8eaed] font-medium truncate">{c.name.replace(" (FN)", "")}</span>
              <span className="col-span-2 text-right text-[#9ca3af] font-mono">${c.price}</span>
              <span className="col-span-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  <div className="w-12 h-1.5 bg-[#1e2128] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.weight * 6}%`, background: selected.color }} />
                  </div>
                  <span className="text-[#6b7280] font-mono text-[10px]">{c.weight}%</span>
                </div>
              </span>
              <span className="col-span-1 text-right text-[#4a5060] font-mono">{c.volume}</span>
              <span className={`col-span-2 text-right font-semibold font-mono ${c.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>{pct(c.change)}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Badge variant="locked"><Lock size={8} /> View all {CONSTITUENTS.length} constituents — Pro</Badge>
        </div>
      </Card>
    </div>
  );
}

function SeasonalView() {
  const currentMonth = 2; // March (0-indexed)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#e8eaed]">Seasonal Heatmap</h3>
              <p className="text-[10px] text-[#4a5060] mt-0.5">Backtested signals based on historical patterns</p>
            </div>
            <Badge variant="green"><Eye size={8} /> Pro — Live Updated</Badge>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Header */}
              <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "80px repeat(12, 1fr)" }}>
                <div />
                {SEASONAL.months.map((m, i) => (
                  <div key={m} className={`text-center text-[9px] font-semibold tracking-wider py-1.5 rounded-md
                    ${i === currentMonth ? "text-[#00ff88] bg-[#00ff8810]" : "text-[#4a5060]"}`}>
                    {m}
                  </div>
                ))}
              </div>
              {/* Event row */}
              <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: "80px repeat(12, 1fr)" }}>
                <div className="text-[8px] text-[#4a5060] self-center">EVENTS</div>
                {SEASONAL.events.map((e, i) => (
                  <div key={i} className="text-center text-[7px] text-[#4a5060] truncate">{e}</div>
                ))}
              </div>
              {/* Signal rows */}
              {SEASONAL.categories.map((cat, r) => (
                <div key={cat} className="grid gap-1 mb-1" style={{ gridTemplateColumns: "80px repeat(12, 1fr)" }}>
                  <div className="text-[11px] font-semibold text-[#e8eaed] self-center">{cat}</div>
                  {SEASONAL.signals[r].map((sig, c) => (
                    <motion.div key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (r * 12 + c) * 0.008 }}
                      onClick={() => setSelectedMonth(c)}
                      className={`text-center py-2 rounded-md text-[9px] font-bold tracking-wider border cursor-pointer hover:brightness-125 transition-all
                        ${c === currentMonth ? "ring-1 ring-[#00ff8860]" : ""}
                        ${c === selectedMonth ? "ring-2 ring-[#eab30880]" : ""}
                      `}
                      style={{ color: sigColor[sig], background: sigBg[sig], borderColor: `${sigColor[sig]}20` }}
                    >
                      {sigLabel[sig]}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Daily Drilldown Heatmap */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#e8eaed]">Daily Drilldown — {SEASONAL.months[selectedMonth]}</h3>
              <p className="text-[10px] text-[#4a5060] mt-0.5">Day-by-day signals within the selected month. Optimal entry and exit timing.</p>
            </div>
            <Badge variant="gold"><Crown size={8} /> Alpha</Badge>
          </div>

          {/* Month selector */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {SEASONAL.months.map((m, i) => (
              <button key={m} onClick={() => setSelectedMonth(i)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-md text-[10px] font-semibold transition-all border
                  ${selectedMonth === i ? "border-[#eab30840] bg-[#eab30810] text-[#eab308]" : "border-[#1e2128] text-[#4a5060] hover:text-[#6b7280]"}`}>
                {m}
              </button>
            ))}
          </div>

          {/* Daily grid */}
          <div>
            {SEASONAL.categories.map((cat, r) => {
              const monthSig = SEASONAL.signals[r][selectedMonth];
              const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31][selectedMonth];
              const prevMonthSig = selectedMonth > 0 ? SEASONAL.signals[r][selectedMonth - 1] : SEASONAL.signals[r][11];
              const nextMonthSig = selectedMonth < 11 ? SEASONAL.signals[r][selectedMonth + 1] : SEASONAL.signals[r][0];
              const startDow = (selectedMonth * 3 + 1) % 7;
              
              const dailySignals = Array.from({ length: daysInMonth }, (_, d) => {
                if (d < 3) return prevMonthSig === monthSig ? monthSig : (d < 1 ? prevMonthSig : monthSig);
                if (d >= daysInMonth - 3) return nextMonthSig === monthSig ? monthSig : (d >= daysInMonth - 1 ? nextMonthSig : monthSig);
                const seed = (r * 31 + d * 7 + selectedMonth * 13) % 10;
                if (seed === 0 && monthSig !== "H") return "H";
                return monthSig;
              });

              // Flat array: leading empties + days + trailing empties
              const flat = [];
              for (let i = 0; i < startDow; i++) flat.push(null);
              dailySignals.forEach((sig, i) => flat.push({ sig, day: i + 1 }));
              while (flat.length % 7 !== 0) flat.push(null);

              return (
                <div key={cat} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#e8eaed]">{cat}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-bold"
                      style={{ color: sigColor[monthSig], background: sigBg[monthSig] }}>
                      {sigLabel[monthSig]}
                    </span>
                  </div>
                  {r === 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 3 }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                        <div key={d} style={{ textAlign: "center", fontSize: 8, color: "#2a2d36", fontWeight: 600, padding: "2px 0", letterSpacing: 1 }}>{d}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                    {flat.map((cell, i) => {
                      if (!cell) return <div key={i} style={{ height: 28 }} />;
                      const isToday = cell.day === 15 && selectedMonth === currentMonth;
                      return (
                        <div key={i} style={{
                          height: 28, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                          position: "relative", color: sigColor[cell.sig], background: sigBg[cell.sig],
                          border: `1px solid ${sigColor[cell.sig]}20`,
                          outline: isToday ? "2px solid #00ff8880" : "none", outlineOffset: -1
                        }}>
                          <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1 }}>{sigLabel[cell.sig]}</span>
                          <span style={{ position: "absolute", top: 1, right: 3, fontSize: 6, color: "#4a5060" }}>{cell.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend + insight */}
          <div className="mt-4 pt-3 border-t border-[#1e2128]">
            <div className="flex items-center gap-4 mb-2">
              {[
                { sig: "B", label: "Buy — accumulate position" },
                { sig: "H", label: "Hold — maintain current" },
                { sig: "S", label: "Sell — reduce exposure" },
              ].map(l => (
                <div key={l.sig} className="flex items-center gap-1.5">
                  <div className="w-4 h-3 rounded-[2px]" style={{ background: sigBg[l.sig], border: `1px solid ${sigColor[l.sig]}30` }} />
                  <span className="text-[9px]" style={{ color: sigColor[l.sig] }}>{l.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#4a5060] italic">
              Daily signals are derived from intra-month price patterns, historical volume spikes, and event proximity. 
              Note transition periods at month boundaries where signals shift. 
              Strongest conviction days are mid-month when patterns are most consistent.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Key events */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#e8eaed] mb-3">Upcoming Catalysts</h3>
          <div className="space-y-2.5">
            {[
              { event: "Steam Summer Sale", date: "~Jun 26", impact: "Prices dip 5-15% as players liquidate for games", signal: "S" },
              { event: "CS2 Major (Cologne)", date: "~Jul 12", impact: "Sticker capsules spike 30-80%. Buy before, sell during.", signal: "B" },
              { event: "New Case Release", date: "TBA Q3", impact: "Existing weapon skins in same category drop 5-10%", signal: "S" },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: sigBg[e.signal] }}>
                  <Calendar size={14} style={{ color: sigColor[e.signal] }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#e8eaed]">{e.event}</span>
                    <span className="text-[9px] text-[#4a5060]">{e.date}</span>
                  </div>
                  <span className="text-[10px] text-[#6b7280]">{e.impact}</span>
                </div>
                <Badge variant={e.signal === "B" ? "green" : "red"}>{sigLabel[e.signal]}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function LeaderboardView() {
  const badgeIcon = { crown: Crown, medal: Medal, star: Star };
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#e8eaed]">Top Investors — Q1 2026</h3>
              <p className="text-[10px] text-[#4a5060] mt-0.5">Paper trading performance ranked by quarterly return</p>
            </div>
            <div className="flex gap-1">
              {["Quarter","Month","Week","All-Time"].map(tf => (
                <button key={tf} className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all
                  ${tf === "Quarter" ? "bg-[#1e2128] text-[#e8eaed]" : "text-[#4a5060] hover:text-[#6b7280]"}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {LEADERBOARD.map((user, i) => {
              const BadgeIcon = user.badge ? badgeIcon[user.badge] : null;
              return (
                <motion.div key={user.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                    ${user.isUser ? "bg-[#00ff8808] border-[#00ff8825]" : "bg-[#0d0f12] border-[#1e2128] hover:border-[#2a2d36]"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${user.rank <= 3 ? "bg-[#eab30815] text-[#eab308]" : "bg-[#1e2128] text-[#4a5060]"}`}>
                    {user.rank <= 3 && BadgeIcon ? <BadgeIcon size={14} /> : `#${user.rank}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-semibold ${user.isUser ? "text-[#00ff88]" : "text-[#e8eaed]"}`}>{user.name}</span>
                      {user.isUser && <Badge variant="green">YOU</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#4a5060]">{user.strategy}</span>
                      <span className="text-[10px] text-[#4a5060]">·</span>
                      <span className="text-[10px] text-[#4a5060]">{user.streak}mo streak</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#00ff88]">{pct(user.returnPct)}</div>
                    <div className="text-[9px] text-[#4a5060]">quarterly</div>
                  </div>
                  <ChevronRight size={14} className="text-[#2a2d36] flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── ASSET MAPPING DATA ──────────────────────────────────────────
const ASSET_MAP = [
  { cs2: "Keys ($2.50 each)", finance: "Gas Fee / Fiat Currency", logic: "Fixed denomination, burned on use. Deflationary — exits system permanently.", icon: DollarSign, color: "#00ff88" },
  { cs2: "Knives & Gloves", finance: "Gold / Precious Metals", logic: "Scarce, desirable, no yield. Multiple grades. The hard asset of skins.", icon: Shield, color: "#eab308" },
  { cs2: "Blue-chip Skins (Dragon Lore)", finance: "Trophy Real Estate / Fine Art", logic: "Fixed supply, no new issuance. Pure scarcity-driven store of value.", icon: Crown, color: "#a855f7" },
  { cs2: "Mid-tier Weapon Skins", finance: "Equities / Stocks", logic: "Broad risk/return. Driven by demand, streamer exposure, meta changes.", icon: BarChart3, color: "#3b82f6" },
  { cs2: "Cheap Skins (Mil-Spec)", finance: "Penny Stocks / Small Caps", logic: "High volume, low value, volatile. Traded speculatively in bulk.", icon: Zap, color: "#06b6d4" },
  { cs2: "Cases (Discontinued)", finance: "Depleting Commodity (Oil Reserve)", logic: "Supply only shrinks — every opened case is destroyed forever.", icon: Flame, color: "#ef4444" },
  { cs2: "Sticker Capsules (Major)", finance: "Event-driven Options", logic: "Time-bound expiry catalyst. Speculative pre-event, crystallizes post.", icon: Target, color: "#f59e0b" },
  { cs2: "StatTrak™ Versions", finance: "Preferred Shares", logic: "Same underlying + added feature (kill counter). Consistent premium.", icon: Star, color: "#8b5cf6" },
  { cs2: "Case Openings", finance: "Far OTM Call Options", logic: "Fixed premium ($2.50 key), probabilistic payout. Negative EV.", icon: AlertTriangle, color: "#ef4444" },
  { cs2: "Valve Corporation", finance: "Central Bank + Regulator", logic: "Controls supply, sets 15% tax, changes rules unilaterally.", icon: Globe, color: "#6b7280" },
  { cs2: "Trade-up Contracts", finance: "Structured Products / CDOs", logic: "Combine 10 lower-tier → 1 higher-tier. Calculable EV.", icon: Layers, color: "#14b8a6" },
  { cs2: "Float Value (0.00–1.00)", finance: "Condition Grading (PSA/4Cs)", logic: "Continuous quality metric. FN 0.001 = PSA 10 gem mint.", icon: Eye, color: "#f97316" },
];

const STRATEGIES = [
  // Classic Finance Allocations
  { name: "The SC 60/40", category: "Classic", desc: "The most famous allocation in finance. 60% growth assets (weapons), 40% defensive (knives + cases). Rebalance quarterly.", alloc: { SVR: 35, SVP: 25, SVK: 25, SVC: 15 }, returnQ: 15.2, risk: "Medium", origin: "Bogle / Vanguard 60/40" },
  { name: "All-Weather", category: "Classic", desc: "Ray Dalio's all-weather: diversified across all conditions. Equal risk contribution from each asset class.", alloc: { SVK: 25, SVR: 20, SVG: 20, SVC: 20, SVS: 10, SVP: 5 }, returnQ: 11.8, risk: "Low", origin: "Bridgewater All-Weather" },
  { name: "Permanent Portfolio", category: "Classic", desc: "Harry Browne's 4×25: equal weight across growth, safety, inflation hedge, cash. Works in all macro environments.", alloc: { SVR: 25, SVK: 25, SVC: 25, SVP: 25 }, returnQ: 13.4, risk: "Low", origin: "Harry Browne Permanent Portfolio" },
  { name: "Barbell Strategy", category: "Classic", desc: "Nassim Taleb's barbell: 85% ultra-safe blue chips, 15% high-risk event plays. Nothing in the middle.", alloc: { SVK: 50, SVG: 35, SVS: 15 }, returnQ: 16.7, risk: "Medium", origin: "Taleb Barbell / Antifragile" },
  { name: "Growth Tilt", category: "Classic", desc: "Overweight equities for maximum appreciation. Accept higher volatility for higher long-term returns.", alloc: { SVR: 40, SVP: 30, SVS: 15, SVK: 10, SVC: 5 }, returnQ: 24.1, risk: "High", origin: "Growth-oriented equity tilt" },
  { name: "Income / Yield", category: "Classic", desc: "Focus on assets with predictable appreciation curves. Low drama, steady compounding.", alloc: { SVC: 35, SVK: 35, SVG: 20, SVR: 10 }, returnQ: 10.2, risk: "Low", origin: "Dividend / income investing" },
  
  // Seasonal / Event-Driven
  { name: "Pre-Summer Rotation", category: "Seasonal", desc: "Sell in May, go away. Rotate to defensive (knives, gloves) before Steam Summer Sale crashes weapon prices in June.", alloc: { SVK: 45, SVG: 35, SVC: 20 }, returnQ: 9.1, risk: "Low", origin: "Sell in May (seasonal equity anomaly)", timing: "Activate: May 1 → Revert: Jul 15" },
  { name: "Major Momentum", category: "Seasonal", desc: "Load sticker capsules 4 weeks before a Major. Sell during group stage when hype peaks. Pure event alpha.", alloc: { SVS: 65, SVR: 20, SVK: 15 }, returnQ: 38.2, risk: "Very High", origin: "Event-driven trading / earnings plays", timing: "Activate: 4 wks pre-Major → Exit: group stage" },
  { name: "Chinese New Year Bull", category: "Seasonal", desc: "Asian buying pressure spikes in Jan-Feb. Front-run the demand surge by loading knives and gloves in December.", alloc: { SVK: 40, SVG: 40, SVR: 20 }, returnQ: 14.8, risk: "Medium", origin: "CNY / Lunar NY commodity rally", timing: "Activate: Dec 15 → Exit: Feb 28" },
  { name: "Post-Sale Recovery", category: "Seasonal", desc: "Buy the dip after Steam Summer Sale. Prices typically recover 10-20% by August. Contrarian play.", alloc: { SVR: 35, SVP: 30, SVK: 20, SVC: 15 }, returnQ: 18.6, risk: "Medium", origin: "Mean reversion / buy the dip", timing: "Activate: Jul 1 → Hold through Sep" },
  { name: "Q4 Accumulation", category: "Seasonal", desc: "Autumn + Winter sales create buying opportunities. Accumulate before Chinese NY demand hits in January.", alloc: { SVK: 30, SVG: 25, SVC: 25, SVR: 20 }, returnQ: 12.3, risk: "Low", origin: "Tax-loss harvesting / year-end accumulation", timing: "Activate: Oct 1 → Hold through Feb" },
  { name: "Operation Drop Hedge", category: "Seasonal", desc: "New Valve operations inject supply. Short-term defensive: rotate out of weapon skins into knives until prices stabilize.", alloc: { SVK: 50, SVG: 30, SVC: 20 }, returnQ: 7.4, risk: "Low", origin: "Defensive rotation on dilution events", timing: "Activate: on operation announcement → 4 wks" },

  // Risk-profile based
  { name: "The Conservative", category: "Risk Profile", desc: "Sleep at night. Blue chips and depleting assets only. Low volatility, slow appreciation.", alloc: { SVK: 40, SVC: 30, SVG: 20, SVR: 10 }, returnQ: 8.9, risk: "Low", origin: "Capital preservation / retirement" },
  { name: "The Aggressive", category: "Risk Profile", desc: "Maximum growth. High volatility, high upside. For conviction players.", alloc: { SVR: 30, SVS: 25, SVP: 20, SVK: 15, SVC: 10 }, returnQ: 28.4, risk: "High", origin: "Aggressive growth / venture-style" },
  { name: "Blue Chip Collector", category: "Risk Profile", desc: "100% scarce items. Never sells. Plays the 5-year game. The Warren Buffett of skins.", alloc: { SVK: 50, SVG: 50 }, returnQ: 12.1, risk: "Low", origin: "Buffett buy-and-hold / value investing" },
];

// ─── USER IMPORTED PORTFOLIO (DEMO) ──────────────────────────────
const IMPORTED_PORTFOLIO = [
  // Blue Chip ($50+)
  { name: "★ Butterfly Knife | Fade (FN)", category: "Knife", price: 1620.00, buyPrice: 1450.00, qty: 1, index: "SCK" },
  { name: "Sport Gloves | Vice (MW)", category: "Glove", price: 3150.00, buyPrice: 2800.00, qty: 1, index: "SCG" },
  { name: "Glock-18 | Fade (FN)", category: "Pistol", price: 1050.00, buyPrice: 980.00, qty: 1, index: "SCP" },
  { name: "Desert Eagle | Blaze (FN)", category: "Pistol", price: 455.00, buyPrice: 420.00, qty: 1, index: "SCP" },
  { name: "★ Gut Knife | Doppler (FN)", category: "Knife", price: 140.00, buyPrice: 130.00, qty: 1, index: "SCK" },
  { name: "M4A1-S | Printstream (FN)", category: "Rifle", price: 132.00, buyPrice: 145.00, qty: 2, index: "SCR" },
  // Core ($5-50)
  { name: "AK-47 | Redline (FT)", category: "Rifle", price: 14.80, buyPrice: 12.50, qty: 3, index: "SCR" },
  { name: "AWP | Asiimov (FT)", category: "Rifle", price: 38.50, buyPrice: 32.00, qty: 1, index: "SCR" },
  { name: "USP-S | Kill Confirmed (MW)", category: "Pistol", price: 44.50, buyPrice: 48.00, qty: 4, index: "SCP" },
  { name: "AK-47 | Asiimov (FT)", category: "Rifle", price: 22.40, buyPrice: 18.00, qty: 2, index: "SCR" },
  { name: "M4A4 | Neo-Noir (FT)", category: "Rifle", price: 8.50, buyPrice: 7.20, qty: 1, index: "SCR" },
  { name: "Sticker | NaVi (Holo) Kato 2024", category: "Sticker", price: 8.50, buyPrice: 3.20, qty: 10, index: "SCS" },
  { name: "AWP | Fever Dream (FT)", category: "Rifle", price: 5.20, buyPrice: 4.80, qty: 1, index: "SCR" },
  // Micro ($1-5)
  { name: "Kilowatt Case", category: "Case", price: 1.85, buyPrice: 0.90, qty: 50, index: "SCC" },
  { name: "AK-47 | Slate (FT)", category: "Rifle", price: 3.20, buyPrice: 2.80, qty: 2, index: "SCR" },
  { name: "Glock-18 | Water Elemental (FT)", category: "Pistol", price: 2.10, buyPrice: 1.80, qty: 1, index: "SCP" },
  { name: "USP-S | Blueprint (FN)", category: "Pistol", price: 1.40, buyPrice: 1.20, qty: 3, index: "SCP" },
  { name: "P250 | See Ya Later (FT)", category: "Pistol", price: 1.80, buyPrice: 1.50, qty: 1, index: "SCP" },
  { name: "Dreams & Nightmares Case", category: "Case", price: 1.20, buyPrice: 0.60, qty: 25, index: "SCC" },
  { name: "Revolution Case", category: "Case", price: 1.05, buyPrice: 0.50, qty: 30, index: "SCC" },
  // Dust (under $1)
  { name: "P90 | Asiimov (WW)", category: "Rifle", price: 0.82, buyPrice: 0.70, qty: 1, index: "SCR" },
  { name: "Galil AR | Chatterbox (BS)", category: "Rifle", price: 0.45, buyPrice: 0.40, qty: 1, index: "SCR" },
  { name: "MP7 | Nemesis (FT)", category: "Rifle", price: 0.35, buyPrice: 0.30, qty: 2, index: "SCR" },
  { name: "FAMAS | Meltdown (FT)", category: "Rifle", price: 0.28, buyPrice: 0.25, qty: 1, index: "SCR" },
  { name: "Nova | Hyper Beast (FT)", category: "Rifle", price: 0.22, buyPrice: 0.20, qty: 3, index: "SCR" },
  { name: "PP-Bizon | Jungle Slipstream (FN)", category: "Rifle", price: 0.15, buyPrice: 0.12, qty: 2, index: "SCR" },
  { name: "Negev | Power Loader (FT)", category: "Rifle", price: 0.08, buyPrice: 0.06, qty: 4, index: "SCR" },
  { name: "Tec-9 | Bamboozle (FT)", category: "Pistol", price: 0.12, buyPrice: 0.10, qty: 2, index: "SCP" },
  { name: "SG 553 | Danger Close (MW)", category: "Rifle", price: 0.06, buyPrice: 0.05, qty: 5, index: "SCR" },
  { name: "MAG-7 | Popdog (FT)", category: "Rifle", price: 0.04, buyPrice: 0.03, qty: 8, index: "SCR" },
  { name: "Sawed-Off | Apocalypto (BS)", category: "Rifle", price: 0.03, buyPrice: 0.03, qty: 6, index: "SCR" },
  { name: "Sticker | Silver (Cologne 2024)", category: "Sticker", price: 0.05, buyPrice: 0.03, qty: 40, index: "SCS" },
  { name: "Graffiti | Still Happy (War Green)", category: "Sticker", price: 0.03, buyPrice: 0.03, qty: 15, index: "SCS" },
];

// ─── INVEST / SHOPPING LIST VIEW ─────────────────────────────────
function InvestView() {
  const [amount, setAmount] = useState(1000);
  const [selectedTarget, setSelectedTarget] = useState("SCK");
  const [showList, setShowList] = useState(false);

  const targets = [
    { id: "SCK", label: "SVK — Knife Index" },
    { id: "SCR", label: "SVR — Rifle Index" },
    { id: "6040", label: "SC 60/40 Strategy" },
    { id: "conservative", label: "Conservative Strategy" },
    { id: "aggressive", label: "Aggressive Strategy" },
  ];

  // Generate shopping list from SVK constituents
  const generateList = () => {
    const sorted = [...CONSTITUENTS].sort((a, b) => b.weight - a.weight);
    let remaining = amount;
    const items = [];
    
    // First pass: buy whole units weighted by priority
    for (const skin of sorted) {
      if (remaining < skin.price) continue;
      const targetAlloc = (skin.weight / 100) * amount;
      const qty = Math.min(Math.floor(targetAlloc / skin.price), Math.floor(remaining / skin.price));
      if (qty > 0) {
        items.push({ ...skin, qty, total: qty * skin.price, targetPct: skin.weight, actualPct: 0 });
        remaining -= qty * skin.price;
      }
    }
    
    // Second pass: fill remaining with cheapest available
    for (const skin of [...sorted].reverse()) {
      if (remaining < skin.price) continue;
      const existing = items.find(i => i.name === skin.name);
      if (existing) { existing.qty += 1; existing.total += skin.price; }
      else items.push({ ...skin, qty: 1, total: skin.price, targetPct: skin.weight, actualPct: 0 });
      remaining -= skin.price;
    }

    const totalDeployed = amount - remaining;
    items.forEach(i => { i.actualPct = ((i.total / totalDeployed) * 100).toFixed(1); });
    
    return { items, deployed: totalDeployed, remaining, trackingError: (Math.random() * 4 + 1).toFixed(1) };
  };

  const list = showList ? generateList() : null;

  return (
    <div className="space-y-4">
      {/* Input Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={16} className="text-[#00ff88]" />
            <h3 className="text-sm font-bold text-[#e8eaed]">Investment Calculator</h3>
          </div>
          <p className="text-[11px] text-[#6b7280] mb-4">Enter your budget and select an index or strategy. We'll generate an exact shopping list of skins to buy with marketplace links.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-1.5 block">Investment Amount ($)</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5060]" />
                <input type="number" value={amount} onChange={e => { setAmount(Number(e.target.value)); setShowList(false); }}
                  className="w-full pl-8 pr-3 py-2.5 bg-[#0d0f12] border border-[#2a2d36] rounded-lg text-[#e8eaed] text-sm font-semibold focus:outline-none focus:border-[#00ff8860]" />
              </div>
            </div>
            <div>
              <label className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-1.5 block">Target Index / Strategy</label>
              <select value={selectedTarget} onChange={e => { setSelectedTarget(e.target.value); setShowList(false); }}
                className="w-full px-3 py-2.5 bg-[#0d0f12] border border-[#2a2d36] rounded-lg text-[#e8eaed] text-xs focus:outline-none focus:border-[#00ff8860]">
                {targets.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => setShowList(true)}
                className="w-full py-2.5 bg-[#00ff88] text-[#0a0c0f] rounded-lg text-xs font-bold hover:bg-[#00e67a] transition-colors">
                Generate Shopping List
              </button>
            </div>
          </div>

          {/* Quick amount buttons */}
          <div className="flex gap-2">
            {[250, 500, 1000, 2500, 5000, 10000].map(a => (
              <button key={a} onClick={() => { setAmount(a); setShowList(false); }}
                className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all border
                  ${amount === a ? "border-[#00ff8840] bg-[#00ff8810] text-[#00ff88]" : "border-[#1e2128] text-[#4a5060] hover:text-[#6b7280]"}`}>
                ${a >= 1000 ? `${a/1000}K` : a}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Shopping List Results */}
      <AnimatePresence>
        {showList && list && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Deployed", value: fmtFull(list.deployed), color: "#00ff88" },
                { label: "Cash Remaining", value: fmtFull(list.remaining), color: list.remaining > amount * 0.3 ? "#eab308" : "#6b7280" },
                { label: "Items to Buy", value: list.items.reduce((s, i) => s + i.qty, 0).toString(), color: "#3b82f6" },
                { label: "Tracking Error", value: `${list.trackingError}%`, color: parseFloat(list.trackingError) > 3 ? "#eab308" : "#00ff88" },
              ].map((s, i) => (
                <Card key={i} className="p-3">
                  <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-1">{s.label}</div>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                </Card>
              ))}
            </div>

            {/* Item list */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#e8eaed]">Your Shopping List</h3>
                <Badge variant="green"><ShoppingCart size={8} /> {list.items.length} items</Badge>
              </div>

              <div className="space-y-0">
                <div className="grid grid-cols-12 gap-2 text-[9px] font-semibold text-[#4a5060] uppercase tracking-wider pb-2 border-b border-[#1e2128] px-1">
                  <span className="col-span-4">Skin</span>
                  <span className="col-span-1 text-right">Qty</span>
                  <span className="col-span-2 text-right">Unit Price</span>
                  <span className="col-span-2 text-right">Total</span>
                  <span className="col-span-1 text-right">Wt%</span>
                  <span className="col-span-2 text-right">Action</span>
                </div>
                {list.items.map((item, i) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-12 gap-2 py-2.5 border-b border-[#1e2128] last:border-0 text-[11px] items-center px-1 hover:bg-[#1a1d24] rounded transition-colors">
                    <span className="col-span-4 text-[#e8eaed] font-medium truncate">{item.name.replace(" (FN)", "")}</span>
                    <span className="col-span-1 text-right text-[#00ff88] font-bold">{item.qty}×</span>
                    <span className="col-span-2 text-right text-[#9ca3af] font-mono">${item.price}</span>
                    <span className="col-span-2 text-right text-[#e8eaed] font-semibold font-mono">${item.total}</span>
                    <span className="col-span-1 text-right text-[#4a5060] font-mono">{item.actualPct}%</span>
                    <span className="col-span-2 text-right">
                      <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#00ff8810] border border-[#00ff8825] text-[#00ff88] text-[9px] font-semibold hover:bg-[#00ff8820] transition-colors">
                        Buy <ExternalLink size={8} />
                      </button>
                    </span>
                  </motion.div>
                ))}
              </div>

              {list.remaining > 50 && (
                <div className="mt-4 p-3 rounded-lg bg-[#eab30808] border border-[#eab30820]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={12} className="text-[#eab308]" />
                    <span className="text-[11px] text-[#eab308] font-medium">
                      ${list.remaining.toFixed(0)} undeployed — skins are whole units. 
                      {amount < 2000 && " Invest $2,500+ for tighter index tracking."}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-[#4a5060]">All "Buy" links go to best-priced marketplace (affiliate)</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e2128] text-[11px] text-[#9ca3af] font-medium hover:bg-[#2a2d36] transition-colors">
                  <RefreshCw size={11} /> Recalculate
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ASSET MAPPING VIEW ──────────────────────────────────────────
function MappingView() {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-[#a855f7]" />
            <h3 className="text-sm font-bold text-[#e8eaed]">CS2 → Traditional Finance</h3>
          </div>
          <p className="text-[10px] text-[#4a5060] mb-4">How every tradeable CS2 asset maps to a traditional financial instrument. Built for investors who think in portfolios.</p>

          <div className="space-y-2">
            {ASSET_MAP.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128] hover:border-[#2a2d36] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}15` }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#e8eaed]">{item.cs2}</span>
                    <ChevronRight size={10} className="text-[#2a2d36]" />
                    <span className="text-[11px] font-semibold" style={{ color: item.color }}>{item.finance}</span>
                  </div>
                  <p className="text-[10px] text-[#6b7280] mt-1 leading-relaxed">{item.logic}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── STRATEGIES VIEW ─────────────────────────────────────────────
function StrategiesView() {
  const [expanded, setExpanded] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const categories = ["All", "Classic", "Seasonal", "Risk Profile"];
  const filtered = filterCat === "All" ? STRATEGIES : STRATEGIES.filter(s => s.category === filterCat);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#3b82f6]" />
              <h3 className="text-sm font-bold text-[#e8eaed]">Model Strategies</h3>
              <span className="text-[10px] text-[#4a5060]">({STRATEGIES.length} strategies)</span>
            </div>
          </div>
          <p className="text-[10px] text-[#4a5060] mb-4">Proven investment frameworks from traditional finance, adapted to the CS2 skin economy. Paper trade any of them or use as a rebalancing target.</p>

          {/* Category filter */}
          <div className="flex gap-1.5 mb-4">
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all border
                  ${filterCat === c ? "border-[#3b82f640] bg-[#3b82f610] text-[#3b82f6]" : "border-[#1e2128] text-[#4a5060] hover:text-[#6b7280]"}`}>
                {c} {c !== "All" && <span className="text-[#2a2d36] ml-1">({STRATEGIES.filter(s => c === "All" || s.category === c).length})</span>}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((strat, i) => {
              const globalIdx = STRATEGIES.indexOf(strat);
              const isOpen = expanded === globalIdx;
              const allocEntries = Object.entries(strat.alloc);
              const catColor = { Classic: "#3b82f6", Seasonal: "#eab308", "Risk Profile": "#a855f7" }[strat.category];
              return (
                <motion.div key={globalIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div onClick={() => setExpanded(isOpen ? null : globalIdx)}
                    className={`rounded-lg border transition-all cursor-pointer ${isOpen ? "bg-[#13161b] border-[#2a2d36]" : "bg-[#0d0f12] border-[#1e2128] hover:border-[#2a2d36]"}`}>
                    <div className="flex items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[12px] font-bold text-[#e8eaed]">{strat.name}</span>
                          <Badge variant={strat.risk === "Low" ? "green" : strat.risk === "Medium" ? "gold" : "red"}>{strat.risk}</Badge>
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: catColor, background: `${catColor}15` }}>{strat.category}</span>
                        </div>
                        <p className="text-[10px] text-[#6b7280] leading-relaxed">{strat.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-[#00ff88]">{pct(strat.returnQ)}</div>
                        <div className="text-[9px] text-[#4a5060]">last quarter</div>
                      </div>
                      <ChevronRight size={14} className={`text-[#2a2d36] transition-transform flex-shrink-0 ${isOpen ? "rotate-90" : ""}`} />
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden">
                          <div className="px-4 pb-4 pt-0">
                            <div className="border-t border-[#1e2128] pt-3 space-y-3">
                              {/* Origin */}
                              <div className="flex items-center gap-2">
                                <BookOpen size={11} className="text-[#4a5060]" />
                                <span className="text-[10px] text-[#6b7280]">Based on: <span className="text-[#9ca3af] font-medium">{strat.origin}</span></span>
                              </div>

                              {/* Timing for seasonal */}
                              {strat.timing && (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-[#eab30808] border border-[#eab30820]">
                                  <Clock size={11} className="text-[#eab308]" />
                                  <span className="text-[10px] text-[#eab308] font-medium">{strat.timing}</span>
                                </div>
                              )}

                              {/* Allocation */}
                              <div>
                                <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-2">Allocation</div>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                  {allocEntries.map(([idx, pctVal]) => {
                                    const idxData = INDEXES.find(x => x.ticker === idx);
                                    return (
                                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0a0c0f] border border-[#1e2128]">
                                        <div className="w-2 h-2 rounded-full" style={{ background: idxData?.color || "#6b7280" }} />
                                        <span className="text-[10px] font-semibold text-[#e8eaed]">{idx}</span>
                                        <span className="text-[10px] text-[#4a5060]">{pctVal}%</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="h-2.5 rounded-full overflow-hidden flex mb-3">
                                  {allocEntries.map(([idx, pctVal]) => {
                                    const idxData = INDEXES.find(x => x.ticker === idx);
                                    return <div key={idx} style={{ width: `${pctVal}%`, background: idxData?.color || "#6b7280" }} />;
                                  })}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button className="flex-1 py-2 rounded-lg bg-[#00ff88] text-[#0a0c0f] text-[10px] font-bold hover:bg-[#00e67a] transition-colors">
                                  Paper Trade This Strategy
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-[#1e2128] text-[#9ca3af] text-[10px] font-medium border border-[#2a2d36] hover:bg-[#2a2d36] transition-colors">
                                  Rebalance My Portfolio to This
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── IMPORT PORTFOLIO + REBALANCE VIEW ───────────────────────────
function PortfolioView() {
  const [imported, setImported] = useState(true);
  const [targetStrategy, setTargetStrategy] = useState("");
  const [showRebalance, setShowRebalance] = useState(false);
  const [steamUrl, setSteamUrl] = useState("https://steamcommunity.com/id/yourprofile");
  const [costBasisMode, setCostBasisMode] = useState("track");

  // Compute current allocation from imported items
  const totalValue = IMPORTED_PORTFOLIO.reduce((s, i) => s + i.price * i.qty, 0);
  const totalCost = IMPORTED_PORTFOLIO.reduce((s, i) => s + i.buyPrice * i.qty, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = (totalPnl / totalCost) * 100;

  const byIndex = {};
  IMPORTED_PORTFOLIO.forEach(item => {
    if (!byIndex[item.index]) byIndex[item.index] = { value: 0, cost: 0, items: [] };
    byIndex[item.index].value += item.price * item.qty;
    byIndex[item.index].cost += item.buyPrice * item.qty;
    byIndex[item.index].items.push(item);
  });

  const currentAlloc = {};
  Object.entries(byIndex).forEach(([idx, data]) => {
    currentAlloc[idx] = parseFloat(((data.value / totalValue) * 100).toFixed(1));
  });

  // Rebalancing plan
  const computeRebalance = () => {
    const strat = STRATEGIES.find(s => s.name === targetStrategy);
    if (!strat) return null;
    
    const targetAlloc = strat.alloc;
    const actions = [];
    
    // For each index, compute over/underweight
    const allIndexes = new Set([...Object.keys(currentAlloc), ...Object.keys(targetAlloc)]);
    allIndexes.forEach(idx => {
      const current = currentAlloc[idx] || 0;
      const target = targetAlloc[idx] || 0;
      const diff = target - current;
      const diffDollar = (diff / 100) * totalValue;
      
      if (Math.abs(diff) > 1) {
        const idxItems = byIndex[idx]?.items || [];
        if (diff < 0) {
          // Overweight → SELL
          const sellAmount = Math.abs(diffDollar);
          const sellItems = [];
          let remaining = sellAmount;
          // Sell worst performers first
          const sorted = [...idxItems].sort((a, b) => {
            const aRet = (a.price - a.buyPrice) / a.buyPrice;
            const bRet = (b.price - b.buyPrice) / b.buyPrice;
            return aRet - bRet;
          });
          for (const item of sorted) {
            if (remaining <= 0) break;
            const sellQty = Math.min(item.qty, Math.ceil(remaining / item.price));
            if (sellQty > 0) {
              sellItems.push({ ...item, sellQty, sellValue: sellQty * item.price });
              remaining -= sellQty * item.price;
            }
          }
          actions.push({ idx, action: "SELL", diff, diffDollar, current, target, items: sellItems });
        } else {
          // Underweight → BUY
          actions.push({ idx, action: "BUY", diff, diffDollar, current, target, items: [] });
        }
      } else {
        actions.push({ idx, action: "HOLD", diff, diffDollar: 0, current, target, items: [] });
      }
    });
    
    return actions.sort((a, b) => Math.abs(b.diffDollar) - Math.abs(a.diffDollar));
  };

  const rebalancePlan = showRebalance ? computeRebalance() : null;
  const actionColor = { SELL: "#ef4444", BUY: "#00ff88", HOLD: "#6b7280" };
  const actionBg = { SELL: "#ef444410", BUY: "#00ff8810", HOLD: "#1e2128" };

  return (
    <div className="space-y-4">
      {/* Import Section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-[#00ff88]" />
            <h3 className="text-sm font-bold text-[#e8eaed]">Import Your Inventory</h3>
          </div>
          <p className="text-[10px] text-[#6b7280] mb-4">Paste your Steam profile URL and we'll auto-import your CS2 inventory. We'll map every item to our indexes and show your current allocation.</p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5060]" />
              <input value={steamUrl} onChange={e => setSteamUrl(e.target.value)} placeholder="https://steamcommunity.com/id/yourprofile"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0f12] border border-[#2a2d36] rounded-lg text-[#e8eaed] text-[11px] focus:outline-none focus:border-[#00ff8860] placeholder:text-[#2a2d36]" />
            </div>
            <button className="px-5 py-2.5 bg-[#00ff88] text-[#0a0c0f] rounded-lg text-[11px] font-bold hover:bg-[#00e67a] transition-colors flex-shrink-0">
              {imported ? "✓ Imported" : "Import"}
            </button>
          </div>

          {imported && (
            <div className="text-[10px] text-[#4a5060] flex items-center gap-2">
              <Check size={12} className="text-[#00ff88]" />
              <span>Inventory imported: <span className="text-[#e8eaed] font-medium">{IMPORTED_PORTFOLIO.length} items</span> worth <span className="text-[#00ff88] font-semibold">{fmtFull(totalValue)}</span></span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Cost Basis Setup */}
      {imported && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-[#eab308]" />
              <h3 className="text-sm font-bold text-[#e8eaed]">Cost Basis</h3>
            </div>
            <p className="text-[10px] text-[#6b7280] mb-3">
              Steam doesn't tell us what you paid for each skin. Choose how to set your cost basis — this determines how we calculate your returns.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {[
                { id: "track", label: "Track from Now", desc: "Today's prices become your cost basis. Returns tracked from this moment forward.", badge: "Recommended", badgeColor: "green" },
                { id: "estimate", label: "Auto-Estimate", desc: "We estimate buy prices using 90-day historical average. You can override any item.", badge: "Quick", badgeColor: "blue" },
                { id: "manual", label: "Manual Entry", desc: "Enter your exact buy price for each item. Most accurate for P&L tracking.", badge: "Precise", badgeColor: "gold" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setCostBasisMode(opt.id)}
                  className={`p-3 rounded-lg border text-left transition-all
                    ${costBasisMode === opt.id ? "border-[#eab30840] bg-[#eab30808]" : "border-[#1e2128] bg-[#0d0f12] hover:border-[#2a2d36]"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#e8eaed]">{opt.label}</span>
                    <Badge variant={opt.badgeColor}>{opt.badge}</Badge>
                  </div>
                  <p className="text-[9px] text-[#4a5060] leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>

            {costBasisMode === "track" && (
              <div className="p-2.5 rounded-lg bg-[#00ff8808] border border-[#00ff8820]">
                <div className="flex items-center gap-2">
                  <Clock size={11} className="text-[#00ff88]" />
                  <span className="text-[10px] text-[#00ff88]">Cost basis set to today's prices. All returns below show performance <span className="font-semibold">since tracking started</span>.</span>
                </div>
              </div>
            )}
            {costBasisMode === "estimate" && (
              <div className="p-2.5 rounded-lg bg-[#3b82f608] border border-[#3b82f620]">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={11} className="text-[#3b82f6]" />
                  <span className="text-[10px] text-[#3b82f6]">Buy prices estimated from 90-day averages. Click any price in the table below to override with your actual purchase price.</span>
                </div>
              </div>
            )}
            {costBasisMode === "manual" && (
              <div className="p-2.5 rounded-lg bg-[#eab30808] border border-[#eab30820]">
                <div className="flex items-center gap-2">
                  <Eye size={11} className="text-[#eab308]" />
                  <span className="text-[10px] text-[#eab308]">Click any buy price in the table below to enter your actual cost. Items without manual entry will use today's price as fallback.</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Current Holdings */}
      {imported && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Total Value", value: fmtFull(totalValue), color: "#e8eaed" },
              { label: costBasisMode === "track" ? "Value at Import" : "Total Invested", value: fmtFull(totalCost), color: "#9ca3af" },
              { label: costBasisMode === "track" ? "Since Tracking" : "Unrealized P&L", value: `${totalPnl >= 0 ? "+" : ""}${fmtFull(Math.abs(totalPnl))}`, color: totalPnl >= 0 ? "#00ff88" : "#ef4444" },
              { label: costBasisMode === "track" ? "Return (tracked)" : "Return", value: pct(totalPnlPct), color: totalPnlPct >= 0 ? "#00ff88" : "#ef4444" },
            ].map((s, i) => (
              <Card key={i} className="p-3">
                <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
              </Card>
            ))}
          </div>

          {/* Current allocation vs target */}
          <Card className="p-5 mb-4">
            <h3 className="text-sm font-bold text-[#e8eaed] mb-3">Your Current Allocation</h3>
            <div className="h-3 rounded-full overflow-hidden flex mb-3">
              {Object.entries(currentAlloc).map(([idx, pctVal]) => {
                const idxData = INDEXES.find(x => x.ticker === idx);
                return <div key={idx} style={{ width: `${pctVal}%`, background: idxData?.color || "#6b7280" }} title={`${idx}: ${pctVal}%`} />;
              })}
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {Object.entries(currentAlloc).map(([idx, pctVal]) => {
                const idxData = INDEXES.find(x => x.ticker === idx);
                const data = byIndex[idx];
                const ret = ((data.value - data.cost) / data.cost * 100);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: idxData?.color || "#6b7280" }} />
                    <span className="text-[11px] font-semibold text-[#e8eaed]">{idx}</span>
                    <span className="text-[10px] text-[#4a5060]">{pctVal}%</span>
                    <span className={`text-[10px] font-semibold ${ret >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>{pct(ret)}</span>
                  </div>
                );
              })}
            </div>

            {/* Tiered Holdings */}
            {(() => {
              // Categorize items into tiers
              const tiers = [
                { id: "bluechip", label: "Blue Chip Holdings", min: 50, icon: Crown, color: "#eab308", defaultOpen: true },
                { id: "core", label: "Core Portfolio", min: 5, icon: BarChart3, color: "#3b82f6", defaultOpen: true },
                { id: "micro", label: "Micro Positions", min: 1, icon: Zap, color: "#a855f7", defaultOpen: false },
                { id: "dust", label: "Dust", min: 0, icon: Layers, color: "#4a5060", defaultOpen: false },
              ];

              const categorized = tiers.map(tier => {
                const nextTier = tiers[tiers.indexOf(tier) - 1];
                const maxPrice = nextTier ? nextTier.min : Infinity;
                const items = IMPORTED_PORTFOLIO
                  .filter(item => {
                    const unitVal = item.price;
                    return unitVal >= tier.min && unitVal < maxPrice;
                  })
                  .sort((a, b) => (b.price * b.qty) - (a.price * a.qty));
                const totalVal = items.reduce((s, i) => s + i.price * i.qty, 0);
                const totalCostTier = items.reduce((s, i) => s + i.buyPrice * i.qty, 0);
                const itemCount = items.reduce((s, i) => s + i.qty, 0);
                return { ...tier, items, totalVal, totalCostTier, itemCount, pctPort: ((totalVal / totalValue) * 100).toFixed(1) };
              }).filter(t => t.items.length > 0);

              return categorized.map((tier, ti) => (
                <TierSection key={tier.id} tier={tier} totalValue={totalValue} costBasisMode={costBasisMode} delay={ti * 0.05} />
              ));
            })()}
          </Card>

          {/* ── FINANCIAL WORLD TRANSLATION ── */}
          <Card className="p-5 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={16} className="text-[#f59e0b]" />
              <h3 className="text-sm font-bold text-[#e8eaed]">Your Portfolio in Traditional Finance</h3>
            </div>
            <p className="text-[10px] text-[#6b7280] mb-4">If your CS2 skins were real-world assets, here's exactly what you'd be holding.</p>

            {(() => {
              // Map each ACTUAL ITEM to its finance equivalent
              const itemFinMap = {
                Knife: { asset: "Gold Bullion", color: "#eab308", icon: Shield, etf: "GLD" },
                Glove: { asset: "Fine Art / Luxury Real Estate", color: "#f59e0b", icon: Crown, etf: "Sotheby's" },
                Rifle: { asset: "Large-Cap Equities", color: "#3b82f6", icon: BarChart3, etf: "SPY" },
                Pistol: { asset: "Mid-Cap / Growth Stocks", color: "#a855f7", icon: Zap, etf: "IJH" },
                Sticker: { asset: "Event-Driven Options", color: "#ef4444", icon: Flame, etf: "VIX Calls" },
                Case: { asset: "Crude Oil Barrels", color: "#06b6d4", icon: Layers, etf: "USO" },
              };

              // Build item-level translations
              const translations = IMPORTED_PORTFOLIO.map(item => {
                const fin = itemFinMap[item.category] || itemFinMap.Rifle;
                const val = item.price * item.qty;
                const pctPort = ((val / totalValue) * 100).toFixed(1);
                
                // Generate specific real-world equivalent
                let realEquiv = "";
                if (item.category === "Knife" && item.price > 1000) realEquiv = `${item.qty} kg gold bar${item.qty > 1 ? "s" : ""} (store of value, scarce, status)`;
                else if (item.category === "Knife") realEquiv = `${item.qty} oz gold coin${item.qty > 1 ? "s" : ""} (smaller denomination, liquid hard asset)`;
                else if (item.category === "Glove") realEquiv = `A Basquiat sketch or a fractional share in a Monaco penthouse (trophy asset, illiquid, prestige-driven)`;
                else if (item.category === "Rifle" && item.price > 100) realEquiv = `${item.qty} share${item.qty > 1 ? "s" : ""} of Apple or Microsoft (blue-chip equity, steady growth)`;
                else if (item.category === "Rifle") realEquiv = `${item.qty * 3} shares of a mid-cap ETF (diversified equity exposure, liquid)`;
                else if (item.category === "Pistol" && item.price > 500) realEquiv = `${item.qty} share${item.qty > 1 ? "s" : ""} of Tesla or NVIDIA (high-value growth stock, volatile)`;
                else if (item.category === "Pistol") realEquiv = `${item.qty * 5} shares of a growth-stock ETF (broad growth exposure)`;
                else if (item.category === "Sticker") realEquiv = `${item.qty} call option contracts expiring around the next Major (event-driven speculation)`;
                else if (item.category === "Case") realEquiv = `${item.qty} barrels of crude oil in storage (depleting commodity, consumed on use)`;
                else realEquiv = "Miscellaneous financial instrument";

                return { ...item, fin, val, pctPort, realEquiv };
              }).sort((a, b) => b.val - a.val);

              // Aggregate by financial category for pie chart
              const byFinCat = {};
              translations.forEach(t => {
                const key = t.fin.asset;
                if (!byFinCat[key]) byFinCat[key] = { value: 0, color: t.fin.color, icon: t.fin.icon, etf: t.fin.etf, items: [] };
                byFinCat[key].value += t.val;
                byFinCat[key].items.push(t);
              });
              const pieData = Object.entries(byFinCat).map(([name, d]) => ({
                name, value: parseFloat(((d.value / totalValue) * 100).toFixed(1)), color: d.color, icon: d.icon, etf: d.etf, dollarValue: d.value, items: d.items
              })).sort((a, b) => b.value - a.value);

              // Risk profile
              const defensiveValue = translations.filter(t => ["Knife","Glove","Case"].includes(t.category)).reduce((s, t) => s + t.val, 0);
              const growthValue = translations.filter(t => ["Rifle","Pistol"].includes(t.category)).reduce((s, t) => s + t.val, 0);
              const specValue = translations.filter(t => t.category === "Sticker").reduce((s, t) => s + t.val, 0);
              const defensivePct = (defensiveValue / totalValue) * 100;
              const growthPct = (growthValue / totalValue) * 100;
              const specPct = (specValue / totalValue) * 100;
              let riskProfile = "Balanced";
              let riskColor = "#eab308";
              if (defensivePct > 60) { riskProfile = "Conservative"; riskColor = "#00ff88"; }
              else if (growthPct > 50) { riskProfile = "Growth"; riskColor = "#3b82f6"; }
              else if (specPct > 15) { riskProfile = "Aggressive / Speculative"; riskColor = "#ef4444"; }

              // Narrative based on actual items
              const topItem = translations[0];
              const topCat = pieData[0];
              let narrative = `Your most valuable holding is ${topItem.name} (${fmtFull(topItem.val)}, ${topItem.pctPort}% of portfolio) — `;
              if (topItem.category === "Glove") narrative += `the equivalent of owning a Basquiat painting. A single illiquid trophy asset dominates your portfolio. Any art dealer would tell you: beautiful piece, terrible diversification. `;
              else if (topItem.category === "Knife" && topItem.price > 1000) narrative += `like holding a kilogram gold bar. It's your core hard asset — scarce, desirable, and historically appreciating. `;
              else if (topItem.category === "Pistol" && topItem.price > 500) narrative += `comparable to holding shares of Tesla — a high-conviction, high-volatility growth bet. `;
              else narrative += `a solid ${topCat.name.toLowerCase()} position. `;

              narrative += `Overall, your portfolio breaks down to ${defensivePct.toFixed(0)}% hard assets (gold/commodities), ${growthPct.toFixed(0)}% equities, and ${specPct.toFixed(0)}% speculative positions. `;
              narrative += `At ${fmtFull(totalValue)}, this is equivalent to a small self-directed brokerage account. `;

              return (
                <div>
                  {/* Side by side: actual items → finance equivalent */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Actual skins */}
                    <div className="p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                      <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-2">Your Actual Skins</div>
                      <div className="h-3 rounded-full overflow-hidden flex mb-2">
                        {pieData.map(p => <div key={p.name} style={{ width: `${p.value}%`, background: p.color }} />)}
                      </div>
                      <div className="space-y-1">
                        {translations.slice(0, 6).map((t, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[10px] text-[#9ca3af] truncate flex-1 mr-2">{t.name}</span>
                            <span className="text-[10px] text-[#e8eaed] font-semibold flex-shrink-0">{fmtFull(t.val)}</span>
                          </div>
                        ))}
                        {translations.length > 6 && <div className="text-[9px] text-[#4a5060]">+{translations.length - 6} more items</div>}
                      </div>
                    </div>

                    {/* Finance equivalent */}
                    <div className="p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                      <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-2">What You'd Hold on Wall Street</div>
                      <div className="h-3 rounded-full overflow-hidden flex mb-2">
                        {pieData.map(p => <div key={p.name} style={{ width: `${p.value}%`, background: p.color }} />)}
                      </div>
                      <div className="space-y-1">
                        {pieData.map(p => (
                          <div key={p.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                              <span className="text-[10px] text-[#9ca3af]">{p.name}</span>
                            </div>
                            <span className="text-[10px] font-mono" style={{ color: p.color }}>{p.value}% · {p.etf}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Item-by-item mapping */}
                  <div className="space-y-1.5 mb-4">
                    {translations.map((t, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0f12] border border-[#1e2128] hover:border-[#2a2d36] transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${t.fin.color}15` }}>
                          <t.fin.icon size={13} style={{ color: t.fin.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-[#e8eaed] truncate">{t.qty > 1 ? `${t.qty}× ` : ""}{t.name}</span>
                            <ChevronRight size={9} className="text-[#2a2d36] flex-shrink-0" />
                            <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: t.fin.color }}>{t.fin.asset}</span>
                          </div>
                          <p className="text-[9px] text-[#4a5060] mt-0.5">{t.realEquiv}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[10px] font-semibold text-[#e8eaed]">{fmtFull(t.val)}</div>
                          <div className="text-[9px] text-[#4a5060]">{t.pctPort}%</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pie chart + category summary */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-32 h-32 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={52} paddingAngle={2}>
                            {pieData.map((p, i) => <Cell key={i} fill={p.color} />)}
                          </Pie>
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {pieData.map(p => (
                        <div key={p.name} className="flex items-start gap-2">
                          <p.icon size={12} style={{ color: p.color, marginTop: 2 }} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-[#e8eaed]">{p.name}</span>
                              <span className="text-[10px] font-bold" style={{ color: p.color }}>{p.value}%</span>
                              <span className="text-[10px] text-[#4a5060]">{fmtFull(p.dollarValue)}</span>
                            </div>
                            <span className="text-[9px] text-[#4a5060]">{p.items.length} item{p.items.length !== 1 ? "s" : ""} · ETF equivalent: {p.etf}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Profile Badge */}
                  <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ background: `${riskColor}08`, border: `1px solid ${riskColor}20` }}>
                    <Shield size={18} style={{ color: riskColor }} />
                    <div>
                      <div className="text-[11px] font-bold" style={{ color: riskColor }}>Risk Profile: {riskProfile}</div>
                      <div className="text-[10px] text-[#6b7280]">
                        {defensivePct.toFixed(0)}% hard assets (gold/commodities) · {growthPct.toFixed(0)}% equities · {specPct.toFixed(0)}% speculative
                      </div>
                    </div>
                  </div>

                  {/* Narrative */}
                  <div className="p-4 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={12} className="text-[#f59e0b]" />
                      <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest">Portfolio Analysis</span>
                    </div>
                    <p className="text-[11px] text-[#9ca3af] leading-relaxed">{narrative}</p>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed mt-2">
                      A financial advisor would say: {defensivePct > 60 
                        ? "\"Heavy on hard assets. You're well-protected against downturns, but missing growth opportunities. Consider rotating some gold (knives) into equities (weapon skins) for better long-term returns.\""
                        : growthPct > 50 
                          ? "\"Growth-heavy portfolio. Strong upside potential but exposed to corrections. Add 15-20% in hard assets (knives = gold) as a hedge against Valve updates and seasonal dips.\""
                          : topItem.val / totalValue > 0.35
                            ? "\"Extreme concentration risk. Your largest position is over 35% of the portfolio. If that single asset drops 20%, your whole portfolio takes a major hit. Diversify.\""
                            : "\"Reasonably diversified across asset classes. Consider your time horizon — if you're holding long-term, tilt toward hard assets. If trading actively, the growth allocation makes sense.\""
                      }
                    </p>
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* Rebalance Section */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw size={16} className="text-[#a855f7]" />
              <h3 className="text-sm font-bold text-[#e8eaed]">Rebalance to a Strategy</h3>
            </div>
            <p className="text-[10px] text-[#6b7280] mb-4">Select a target strategy and we'll tell you exactly what to sell, hold, and buy to match the allocation — with specific items and quantities.</p>

            <div className="flex gap-2 mb-4">
              <select value={targetStrategy} onChange={e => { setTargetStrategy(e.target.value); setShowRebalance(false); }}
                className="flex-1 px-3 py-2.5 bg-[#0d0f12] border border-[#2a2d36] rounded-lg text-[#e8eaed] text-xs focus:outline-none focus:border-[#a855f760]">
                <option value="">Select target strategy...</option>
                {STRATEGIES.map(s => <option key={s.name} value={s.name}>{s.name} ({s.category}) — {s.risk} Risk</option>)}
              </select>
              <button onClick={() => setShowRebalance(true)} disabled={!targetStrategy}
                className={`px-5 py-2.5 rounded-lg text-[11px] font-bold transition-colors flex-shrink-0
                  ${targetStrategy ? "bg-[#a855f7] text-white hover:bg-[#9333ea]" : "bg-[#1e2128] text-[#4a5060] cursor-not-allowed"}`}>
                Generate Plan
              </button>
            </div>

            <AnimatePresence>
              {showRebalance && rebalancePlan && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* Current vs Target comparison */}
                  <div className="mb-4 p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                    <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-2">Current → {targetStrategy}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[9px] text-[#4a5060] mb-1">Current</div>
                        <div className="h-2.5 rounded-full overflow-hidden flex">
                          {Object.entries(currentAlloc).map(([idx, p]) => {
                            const c = INDEXES.find(x => x.ticker === idx)?.color || "#6b7280";
                            return <div key={idx} style={{ width: `${p}%`, background: c }} />;
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#4a5060] mb-1">Target</div>
                        <div className="h-2.5 rounded-full overflow-hidden flex">
                          {Object.entries(STRATEGIES.find(s => s.name === targetStrategy)?.alloc || {}).map(([idx, p]) => {
                            const c = INDEXES.find(x => x.ticker === idx)?.color || "#6b7280";
                            return <div key={idx} style={{ width: `${p}%`, background: c }} />;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action plan */}
                  <div className="space-y-2">
                    {rebalancePlan.map((action, i) => {
                      const idxData = INDEXES.find(x => x.ticker === action.idx);
                      return (
                        <motion.div key={action.idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                          className="rounded-lg border p-3" style={{ borderColor: `${actionColor[action.action]}25`, background: actionBg[action.action] }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: actionColor[action.action], background: `${actionColor[action.action]}20` }}>
                                {action.action}
                              </span>
                              <span className="text-[11px] font-semibold" style={{ color: idxData?.color }}>{action.idx}</span>
                              <span className="text-[10px] text-[#4a5060]">{idxData?.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-[#6b7280]">{action.current.toFixed(1)}% → {action.target.toFixed(1)}%</span>
                              {action.action !== "HOLD" && (
                                <span className="text-[10px] font-semibold ml-2" style={{ color: actionColor[action.action] }}>
                                  {action.action === "SELL" ? "-" : "+"}${Math.abs(action.diffDollar).toFixed(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Specific items to sell */}
                          {action.items.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {action.items.map((item, j) => (
                                <div key={j} className="flex items-center justify-between text-[10px] py-1 px-2 rounded bg-[#0a0c0f] border border-[#1e2128]">
                                  <span className="text-[#e8eaed]">
                                    {action.action === "SELL" ? "Sell" : "Buy"} <span className="font-semibold">{item.sellQty || item.qty}×</span> {item.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#6b7280]">${(item.sellValue || item.price * item.qty).toFixed(0)}</span>
                                    <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e2128] text-[#9ca3af] hover:text-[#e8eaed] transition-colors">
                                      <ExternalLink size={8} /> {action.action === "SELL" ? "List" : "Buy"}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {action.action === "BUY" && (
                            <div className="mt-2 text-[10px] text-[#6b7280] flex items-center gap-1">
                              <ShoppingCart size={10} />
                              Use the Invest tab to generate a shopping list for ${Math.abs(action.diffDollar).toFixed(0)} into {action.idx}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[#a855f708] border border-[#a855f720]">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={11} className="text-[#a855f7]" />
                      <span className="text-[10px] text-[#a855f7] font-semibold">When to rebalance?</span>
                    </div>
                    <span className="text-[10px] text-[#6b7280]">
                      We recommend rebalancing quarterly or when any index drifts more than 5% from target. 
                      Enable alerts (Pro) to get notified automatically.
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ─── MACRO DASHBOARD DATA ────────────────────────────────────────
const MACRO_INDICATORS = [
  { name: "CNY/USD", value: "7.28", change: -0.8, color: "#ef4444", impact: "Bearish for skins",
    correlation: -0.72, corrWith: "SCK", 
    explanation: "Yuan weakening = capital flight into alternative assets including CS2 skins. Historically the strongest macro driver of high-end skin prices.",
    data: [7.15,7.18,7.20,7.19,7.22,7.24,7.21,7.23,7.25,7.26,7.24,7.27,7.26,7.28,7.28] },
  { name: "Bitcoin", value: "$94,200", change: 3.2, color: "#f59e0b", impact: "Bullish spillover",
    correlation: 0.64, corrWith: "Market Cap",
    explanation: "Massive audience overlap. Crypto wealth effect drives skin spending. Third-party marketplaces accept BTC/ETH for deposits. When crypto runs, skins follow.",
    data: [82,83,85,84,87,88,86,89,90,91,89,92,91,93,94] },
  { name: "S&P 500", value: "5,842", change: 0.4, color: "#3b82f6", impact: "Mild positive",
    correlation: 0.31, corrWith: "SCR",
    explanation: "Weak but positive correlation. Risk-on sentiment in traditional markets supports speculative digital asset spending. Effect is indirect through consumer confidence.",
    data: [5600,5620,5650,5640,5680,5700,5690,5720,5740,5760,5750,5780,5800,5820,5842] },
  { name: "Gold (XAU)", value: "$3,285", change: 1.1, color: "#eab308", impact: "Parallel trend",
    correlation: 0.58, corrWith: "SCK",
    explanation: "Both are scarce, non-yielding stores of value. When investors seek hard assets, both gold and rare skins appreciate. Knife Index tracks gold surprisingly well.",
    data: [3050,3070,3080,3100,3120,3140,3130,3160,3180,3200,3210,3240,3260,3275,3285] },
  { name: "Fed Funds Rate", value: "4.50%", change: 0, color: "#6b7280", impact: "Neutral (holding)",
    correlation: -0.41, corrWith: "Market Cap",
    explanation: "Higher rates increase opportunity cost of holding non-yielding skins. Rate cuts historically positive for speculative assets. Currently on hold — watch for 2026 cuts.",
    data: [5.25,5.25,5.25,5.00,5.00,4.75,4.75,4.75,4.50,4.50,4.50,4.50,4.50,4.50,4.50] },
  { name: "CS2 Players (Peak)", value: "1.42M", change: 2.8, color: "#00ff88", impact: "Bullish",
    correlation: 0.82, corrWith: "Market Cap",
    explanation: "The most direct leading indicator. More players = more demand for skins = higher prices. Peaks around Major tournaments and new operations.",
    data: [1.1,1.12,1.15,1.18,1.2,1.22,1.25,1.28,1.3,1.32,1.35,1.38,1.4,1.41,1.42] },
];

const MACRO_EVENTS = [
  { date: "Apr 2", event: "China PMI Release", impact: "If weak → yuan pressure → bullish for skins", risk: "medium" },
  { date: "May 7", event: "Fed FOMC Decision", impact: "Rate cut signal → bullish for speculative assets", risk: "high" },
  { date: "Jun 12", event: "EU Digital Services Vote", impact: "Loot box regulation could affect case supply", risk: "high" },
  { date: "Jun 26", event: "Steam Summer Sale", impact: "Seasonal price dip across all categories", risk: "medium" },
  { date: "Jul 12", event: "CS2 Major (Cologne)", impact: "Sticker capsule spike, viewership surge", risk: "low" },
  { date: "Q3 TBA", event: "Valve New Case Release", impact: "New supply dilutes existing weapon skins", risk: "medium" },
];

// Correlation overlay chart data — SVK vs Gold (normalized to 100)
const CORR_CHART_DATA = Array.from({ length: 15 }, (_, i) => ({
  week: `W${i + 1}`,
  SVK: 100 + (INDEXES[0].history[i] - INDEXES[0].history[0]) / INDEXES[0].history[0] * 100,
  Gold: 100 + (MACRO_INDICATORS[3].data[i] - MACRO_INDICATORS[3].data[0]) / MACRO_INDICATORS[3].data[0] * 100,
  BTC: 100 + (MACRO_INDICATORS[1].data[i] - MACRO_INDICATORS[1].data[0]) / MACRO_INDICATORS[1].data[0] * 100,
  CNY: 100 + (MACRO_INDICATORS[0].data[i] - MACRO_INDICATORS[0].data[0]) / MACRO_INDICATORS[0].data[0] * 100 * -10, // inverted & amplified for viz
}));

// ─── MACRO DASHBOARD VIEW ────────────────────────────────────────
function MacroView() {
  const [selectedOverlay, setSelectedOverlay] = useState(["SCK", "Gold"]);

  const toggleOverlay = (key) => {
    setSelectedOverlay(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const overlayColors = { SVK: "#00ff88", Gold: "#eab308", BTC: "#f59e0b", CNY: "#ef4444" };

  return (
    <div className="space-y-4">
      {/* Correlation Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-[#f59e0b]" />
              <h3 className="text-sm font-bold text-[#e8eaed]">Macro Correlation Chart</h3>
            </div>
            <Badge variant="gold"><Crown size={8} /> Alpha</Badge>
          </div>
          <p className="text-[10px] text-[#4a5060] mb-3">CS2 skin indexes overlaid with traditional asset prices. All normalized to 100 at start.</p>

          {/* Overlay toggles */}
          <div className="flex gap-2 mb-3">
            {Object.entries(overlayColors).map(([key, color]) => (
              <button key={key} onClick={() => toggleOverlay(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all border
                  ${selectedOverlay.includes(key) ? `border-transparent` : "border-[#1e2128] text-[#4a5060]"}`}
                style={selectedOverlay.includes(key) ? { color, background: `${color}15`, borderColor: `${color}40` } : {}}>
                <div className="w-2 h-2 rounded-full" style={{ background: selectedOverlay.includes(key) ? color : "#2a2d36" }} />
                {key === "CNY" ? "CNY/USD (inv.)" : key}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <RLineChart data={CORR_CHART_DATA}>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4a5060" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid #2a2d36", borderRadius: 8, fontSize: 11, color: "#e8eaed" }} />
              {selectedOverlay.map(key => (
                <Line key={key} type="monotone" dataKey={key} stroke={overlayColors[key]} strokeWidth={key === "SCK" ? 2.5 : 1.5} dot={false} strokeDasharray={key === "SCK" ? "0" : "5 3"} />
              ))}
            </RLineChart>
          </ResponsiveContainer>

          <div className="mt-3 pt-3 border-t border-[#1e2128]">
            <p className="text-[10px] text-[#6b7280] italic">The Knife Index tracks gold with a 0.58 correlation — both are scarce, non-yielding stores of value. Bitcoin shows a 0.64 correlation driven by audience overlap and crypto wealth effects.</p>
          </div>
        </Card>
      </motion.div>

      {/* Indicator Cards */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#e8eaed] mb-3">External Indicators</h3>
          <div className="space-y-2">
            {MACRO_INDICATORS.map((ind, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128] hover:border-[#2a2d36] transition-colors">
                <div className="flex items-center gap-3">
                  {/* Sparkline */}
                  <div className="flex-shrink-0">
                    <MiniSparkline data={ind.data} color={ind.change >= 0 ? "#00ff88" : "#ef4444"} width={60} height={24} />
                  </div>

                  {/* Name & value */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#e8eaed]">{ind.name}</span>
                      <span className="text-[11px] font-bold font-mono" style={{ color: ind.color }}>{ind.value}</span>
                      <span className={`text-[10px] font-semibold ${ind.change >= 0 ? "text-[#00ff88]" : ind.change < 0 ? "text-[#ef4444]" : "text-[#6b7280]"}`}>
                        {ind.change !== 0 ? pct(ind.change) : "HOLD"}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#4a5060] mt-0.5 leading-relaxed">{ind.explanation}</p>
                  </div>

                  {/* Correlation badge */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[9px] text-[#4a5060] uppercase tracking-wider mb-0.5">Corr w/ {ind.corrWith}</div>
                    <div className={`text-sm font-bold font-mono ${Math.abs(ind.correlation) > 0.5 ? (ind.correlation > 0 ? "text-[#00ff88]" : "text-[#ef4444]") : "text-[#6b7280]"}`}>
                      {ind.correlation > 0 ? "+" : ""}{ind.correlation.toFixed(2)}
                    </div>
                    <div className="text-[8px] text-[#4a5060]">
                      {Math.abs(ind.correlation) > 0.7 ? "Strong" : Math.abs(ind.correlation) > 0.4 ? "Moderate" : "Weak"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Macro Events */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-[#a855f7]" />
            <h3 className="text-sm font-bold text-[#e8eaed]">Macro Calendar</h3>
            <span className="text-[10px] text-[#4a5060]">Events that could move the skin market</span>
          </div>
          <div className="space-y-1.5">
            {MACRO_EVENTS.map((evt, i) => {
              const riskC = { low: "#00ff88", medium: "#eab308", high: "#ef4444" }[evt.risk];
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2 px-2 border-b border-[#1e2128] last:border-0 hover:bg-[#13161b] rounded transition-colors">
                  <div className="w-14 flex-shrink-0">
                    <span className="text-[10px] font-mono font-semibold text-[#9ca3af]">{evt.date}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: riskC }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-[#e8eaed]">{evt.event}</span>
                    <span className="text-[10px] text-[#4a5060] ml-2">{evt.impact}</span>
                  </div>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ color: riskC, background: `${riskC}15` }}>
                    {evt.risk} impact
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Key Insight / Research Teaser */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-[#f59e0b]" />
            <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest">Research Insight</span>
          </div>
          <h4 className="text-[13px] font-bold text-[#e8eaed] mb-2">Why does the Knife Index track gold?</h4>
          <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-2">
            Both assets share the same economic DNA: fixed supply, no productive yield, value driven by scarcity and status. 
            When Chinese investors face yuan depreciation, they move capital into hard assets — gold through Shanghai Gold Exchange, CS2 knives through BUFF163. 
            The correlation strengthened significantly after 2023 when Chinese real estate restrictions tightened, pushing more capital toward alternative stores of value.
          </p>
          <p className="text-[11px] text-[#6b7280] leading-relaxed">
            Over the past 3 years, the Skinconomy Knife Index has returned 142% vs gold's 38% and S&P 500's 31%. 
            However, the Knife Index has 3.2× the volatility of gold, giving it a comparable risk-adjusted return (Sharpe ratio ~1.8 vs gold's ~1.6).
          </p>
          <div className="mt-3 text-center">
            <Badge variant="locked"><Lock size={8} /> Full research reports — Alpha subscribers</Badge>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── SENTIMENT VIEW ──────────────────────────────────────────────
function SentimentView() {
  // Sentiment data per index based on price velocity + volume
  const sentimentData = [
    { ticker: "SCK", name: "Knife Index", sentiment: 72, velocity: 3.8, volChange: 18, buyPressure: 68, signal: "Bullish", momentum: "Accelerating",
      drivers: "Post-Major recovery + Chinese buying pressure. Volume up 18% week-over-week. Price breaking above 20-day MA." },
    { ticker: "SCR", name: "Rifle Index", sentiment: 45, velocity: -0.6, volChange: -5, buyPressure: 47, signal: "Neutral", momentum: "Flat",
      drivers: "New case rumors suppressing demand. Volume declining. Waiting for catalyst." },
    { ticker: "SCP", name: "Pistol Index", sentiment: 61, velocity: 1.9, volChange: 8, buyPressure: 58, signal: "Mildly Bullish", momentum: "Building",
      drivers: "Glock Fade and Deagle Blaze driving category. Steady accumulation on dips." },
    { ticker: "SCG", name: "Glove Index", sentiment: 78, velocity: 2.1, volChange: 25, buyPressure: 74, signal: "Bullish", momentum: "Strong",
      drivers: "Trophy asset demand surging. Low supply + high-end collectors competing. BUFF163 volume spiking." },
    { ticker: "SCS", name: "Sticker Index", sentiment: 88, velocity: 8.4, volChange: 45, buyPressure: 85, signal: "Very Bullish", momentum: "Explosive",
      drivers: "Major 4 weeks out. Capsule accumulation phase in full swing. Historical pattern: +30-80% in next 30 days." },
    { ticker: "SCC", name: "Case Index", sentiment: 32, velocity: -1.2, volChange: -12, buyPressure: 35, signal: "Bearish", momentum: "Declining",
      drivers: "New Kilowatt Case still flooding supply. Older cases stable but new release diluting attention." },
  ];

  // Overall market sentiment (weighted average)
  const overallSentiment = Math.round(sentimentData.reduce((s, d) => {
    const idx = INDEXES.find(x => x.ticker === d.ticker);
    return s + d.sentiment * (idx?.value || 1);
  }, 0) / sentimentData.reduce((s, d) => {
    const idx = INDEXES.find(x => x.ticker === d.ticker);
    return s + (idx?.value || 1);
  }, 0));

  const fearGreedLabel = overallSentiment >= 80 ? "Extreme Greed" : overallSentiment >= 60 ? "Greed" : overallSentiment >= 45 ? "Neutral" : overallSentiment >= 25 ? "Fear" : "Extreme Fear";
  const fearGreedColor = overallSentiment >= 80 ? "#ef4444" : overallSentiment >= 60 ? "#00ff88" : overallSentiment >= 45 ? "#eab308" : overallSentiment >= 25 ? "#f97316" : "#ef4444";

  // Gauge component
  const Gauge = ({ value, size = 120, label }) => {
    const angle = (value / 100) * 180 - 90; // -90 to 90 degrees
    const r = size / 2 - 10;
    const cx = size / 2;
    const cy = size / 2 + 5;
    // Arc path
    const startX = cx + r * Math.cos(Math.PI);
    const startY = cy + r * Math.sin(Math.PI);
    const endX = cx + r * Math.cos(0);
    const endY = cy + r * Math.sin(0);
    // Needle
    const needleAngle = ((value / 100) * Math.PI);
    const nx = cx - r * 0.75 * Math.cos(needleAngle);
    const ny = cy - r * 0.75 * Math.sin(needleAngle);
    
    return (
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 25}`}>
        {/* Background arc */}
        <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none" stroke="#1e2128" strokeWidth="8" strokeLinecap="round" />
        {/* Colored arc segments */}
        {[
          { start: 0, end: 25, color: "#ef4444" },
          { start: 25, end: 45, color: "#f97316" },
          { start: 45, end: 55, color: "#eab308" },
          { start: 55, end: 75, color: "#00ff88" },
          { start: 75, end: 100, color: "#ef4444" },
        ].map((seg, i) => {
          const s = Math.PI - (seg.start / 100) * Math.PI;
          const e = Math.PI - (seg.end / 100) * Math.PI;
          const sx = cx + r * Math.cos(s);
          const sy = cy - r * Math.sin(s);
          const ex = cx + r * Math.cos(e);
          const ey = cy - r * Math.sin(e);
          return <path key={i} d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
            fill="none" stroke={seg.color} strokeWidth="8" strokeLinecap="round" opacity="0.3" />;
        })}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={fearGreedColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill={fearGreedColor} />
        {/* Value */}
        <text x={cx} y={cy + 18} textAnchor="middle" fill="#e8eaed" fontSize="16" fontWeight="700" fontFamily="DM Sans">{value}</text>
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Fear & Greed Gauge */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-[#e8eaed]">CS2 Skin Market Sentiment</h3>
              <p className="text-[10px] text-[#4a5060] mt-0.5">Composite index based on price velocity, volume momentum, and buy/sell pressure across all categories</p>
            </div>
            <Badge variant="green"><Eye size={8} /> Pro — Live</Badge>
          </div>
          
          <div className="flex flex-col items-center py-4">
            <Gauge value={overallSentiment} size={180} />
            <div className="mt-2 text-center">
              <span className="text-lg font-bold" style={{ color: fearGreedColor }}>{fearGreedLabel}</span>
              <div className="flex items-center justify-center gap-4 mt-1">
                <span className="text-[9px] text-[#4a5060]">0 — Extreme Fear</span>
                <span className="text-[9px] text-[#4a5060]">50 — Neutral</span>
                <span className="text-[9px] text-[#4a5060]">100 — Extreme Greed</span>
              </div>
            </div>
          </div>

          {/* Component breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { label: "Price Velocity", value: "+2.4%/wk", desc: "Avg weekly price change", color: "#00ff88" },
              { label: "Volume Momentum", value: "+13%", desc: "Week-over-week volume", color: "#3b82f6" },
              { label: "Buy Pressure", value: "62%", desc: "Buy vs sell order ratio", color: "#a855f7" },
              { label: "Volatility", value: "Medium", desc: "14-day price dispersion", color: "#eab308" },
            ].map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                <div className="text-[8px] text-[#4a5060] uppercase tracking-widest mb-1">{c.label}</div>
                <div className="text-sm font-bold" style={{ color: c.color }}>{c.value}</div>
                <div className="text-[8px] text-[#2a2d36]">{c.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Per-Index Sentiment */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#e8eaed] mb-3">Sentiment by Index</h3>
          <div className="space-y-2">
            {sentimentData.map((item, i) => {
              const idx = INDEXES.find(x => x.ticker === item.ticker);
              const sentColor = item.sentiment >= 70 ? "#00ff88" : item.sentiment >= 50 ? "#eab308" : "#ef4444";
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Sentiment bar */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold" style={{ color: idx?.color }}>{item.ticker}</span>
                          <span className="text-[10px] text-[#6b7280]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold" style={{ color: sentColor }}>{item.signal}</span>
                          <span className="text-[10px] font-semibold" style={{ color: sentColor }}>{item.sentiment}</span>
                        </div>
                      </div>
                      {/* Sentiment bar visual */}
                      <div className="h-2 rounded-full bg-[#1e2128] overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.sentiment}%` }} transition={{ delay: i * 0.05 + 0.2, duration: 0.6 }}
                          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${sentColor}88, ${sentColor})` }} />
                      </div>
                    </div>
                  </div>

                  {/* Velocity metrics */}
                  <div className="flex items-center gap-4 mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#4a5060] uppercase">Velocity</span>
                      <span className={`text-[10px] font-bold ${item.velocity >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
                        {item.velocity >= 0 ? "+" : ""}{item.velocity}%/wk
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#4a5060] uppercase">Volume</span>
                      <span className={`text-[10px] font-bold ${item.volChange >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
                        {item.volChange >= 0 ? "+" : ""}{item.volChange}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#4a5060] uppercase">Buy Pressure</span>
                      <span className="text-[10px] font-bold" style={{ color: item.buyPressure > 55 ? "#00ff88" : item.buyPressure < 45 ? "#ef4444" : "#eab308" }}>
                        {item.buyPressure}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-[#4a5060] uppercase">Momentum</span>
                      <span className="text-[10px] font-semibold text-[#9ca3af]">{item.momentum}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-[#4a5060] leading-relaxed">{item.drivers}</p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Historical Sentiment Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#e8eaed]">Sentiment History (30d)</h3>
            <Badge variant="gold"><Crown size={8} /> Alpha</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={Array.from({ length: 30 }, (_, i) => ({
              day: `${i + 1}`,
              sentiment: Math.max(15, Math.min(90, 55 + Math.sin(i * 0.3) * 20 + (i > 20 ? 10 : 0) + (Math.random() - 0.5) * 8)),
            }))}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={0.15} />
                  <stop offset="50%" stopColor="#eab308" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#2a2d36" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#2a2d36" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid #2a2d36", borderRadius: 8, fontSize: 11, color: "#e8eaed" }} />
              {/* Zones */}
              <Area type="monotone" dataKey={() => 100} fill="#ef444408" stroke="none" />
              <Area type="monotone" dataKey={() => 75} fill="#00ff8805" stroke="none" />
              <Area type="monotone" dataKey="sentiment" stroke="#eab308" fill="url(#sentGrad)" strokeWidth={2} dot={false} />
              {/* Reference lines */}
              <Line type="monotone" dataKey={() => 50} stroke="#2a2d36" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[8px] text-[#ef4444]">← Fear</span>
            <span className="text-[8px] text-[#4a5060]">Neutral</span>
            <span className="text-[8px] text-[#00ff88]">Greed →</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── TECHNICAL ANALYSIS VIEW ─────────────────────────────────────
// TradingView Lightweight Charts — imported from npm package
import { createChart as lwcCreateChart } from "lightweight-charts";
const lwcLoaded = { lib: { createChart: lwcCreateChart } };

function TAView() {
  const [selectedIdx, setSelectedIdx] = useState(INDEXES[0]);
  const [timeframe, setTimeframe] = useState("1D");
  const [activeIndicators, setActiveIndicators] = useState(["MA20", "Volume"]);
  const [chartType, setChartType] = useState("candle");
  // LWC is loaded synchronously via import
  const lwcReady = true;
  const [lwcFailed] = useState(false);
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  const toggleIndicator = (id) => {
    setActiveIndicators(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Generate stable OHLCV data (seeded, not random per render)
  const ohlcvData = useState(() => {
    return INDEXES.map(idx => {
      let seed = idx.ticker.charCodeAt(0) * 100;
      const seededRand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
      const baseDate = new Date("2025-01-01");
      return idx.history.map((close, i) => {
        const range = close * (0.01 + seededRand() * 0.03);
        const open = close + (seededRand() - 0.5) * range;
        const high = Math.max(open, close) + seededRand() * range * 0.5;
        const low = Math.min(open, close) - seededRand() * range * 0.5;
        const vol = Math.floor(500 + seededRand() * 800);
        const ma20 = i >= 3 ? idx.history.slice(Math.max(0, i - 4), i + 1).reduce((s, v) => s + v, 0) / Math.min(5, i + 1) : null;
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i * 3);
        const time = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
        return { time, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), vol, ma20: ma20 ? +ma20.toFixed(2) : null };
      });
    });
  })[0];

  const currentData = ohlcvData[INDEXES.findIndex(x => x.ticker === selectedIdx.ticker)] || ohlcvData[0];
  const latestBar = currentData[currentData.length - 1];
  const isBullish = latestBar.close >= latestBar.open;

  // Create/update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const createChart = lwcLoaded.lib.createChart;

    // Clear previous
    if (chartRef.current) { try { chartRef.current.remove(); } catch(e) {} chartRef.current = null; }
    chartContainerRef.current.innerHTML = "";

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 360,
      layout: { background: { color: "#0d0f12" }, textColor: "#4a5060", fontSize: 10, fontFamily: "DM Sans" },
      grid: { vertLines: { color: "#1e212850" }, horzLines: { color: "#1e212850" } },
      crosshair: { mode: 0, vertLine: { color: "#4a506040", labelBackgroundColor: "#1e2128" }, horzLine: { color: "#4a506040", labelBackgroundColor: "#1e2128" } },
      rightPriceScale: { borderColor: "#1e2128", scaleMargins: { top: 0.1, bottom: 0.2 } },
      timeScale: { borderColor: "#1e2128", timeVisible: false },
    });
    chartRef.current = chart;

    // Main series
    if (chartType === "candle") {
      const candleSeries = chart.addCandlestickSeries({
        upColor: "#00ff88", downColor: "#ef4444", borderUpColor: "#00ff88", borderDownColor: "#ef4444",
        wickUpColor: "#00ff8888", wickDownColor: "#ef444488",
      });
      candleSeries.setData(currentData.map(d => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close })));

      // MA20 overlay
      if (activeIndicators.includes("MA20")) {
        const maSeries = chart.addLineSeries({ color: "#f59e0b", lineWidth: 1.5, lineStyle: 2, priceLineVisible: false, lastValueVisible: false });
        maSeries.setData(currentData.filter(d => d.ma20 !== null).map(d => ({ time: d.time, value: d.ma20 })));
      }
    } else {
      const lineSeries = chart.addAreaSeries({
        lineColor: selectedIdx.color, topColor: `${selectedIdx.color}30`, bottomColor: `${selectedIdx.color}05`,
        lineWidth: 2, priceLineVisible: false,
      });
      lineSeries.setData(currentData.map(d => ({ time: d.time, value: d.close })));

      if (activeIndicators.includes("MA20")) {
        const maSeries = chart.addLineSeries({ color: "#f59e0b", lineWidth: 1.5, lineStyle: 2, priceLineVisible: false, lastValueVisible: false });
        maSeries.setData(currentData.filter(d => d.ma20 !== null).map(d => ({ time: d.time, value: d.ma20 })));
      }
    }

    // Volume
    if (activeIndicators.includes("Volume")) {
      const volSeries = chart.addHistogramSeries({
        priceFormat: { type: "volume" }, priceScaleId: "vol",
      });
      chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
      volSeries.setData(currentData.map(d => ({
        time: d.time, value: d.vol, color: d.close >= d.open ? "#00ff8830" : "#ef444430",
      })));
    }

    chart.timeScale().fitContent();

    // Resize handler
    const handleResize = () => { if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth }); };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); };
  }, [lwcReady, selectedIdx.ticker, chartType, activeIndicators]);

  const indicators = [
    { id: "MA20", label: "MA (20)", desc: "20-period Moving Average", tier: "free" },
    { id: "MA50", label: "MA (50)", desc: "50-period Moving Average", tier: "free" },
    { id: "Volume", label: "Volume", desc: "Trading volume bars", tier: "free" },
    { id: "RSI", label: "RSI", desc: "Relative Strength Index", tier: "pro" },
    { id: "MACD", label: "MACD", desc: "Moving Avg Convergence Divergence", tier: "pro" },
    { id: "BB", label: "Bollinger", desc: "Bollinger Bands (20, 2)", tier: "pro" },
    { id: "VWAP", label: "VWAP", desc: "Volume-Weighted Avg Price", tier: "pro" },
    { id: "Fib", label: "Fibonacci", desc: "Auto Fibonacci Retracement", tier: "alpha" },
    { id: "Ichimoku", label: "Ichimoku", desc: "Ichimoku Cloud", tier: "alpha" },
    { id: "OBV", label: "OBV", desc: "On-Balance Volume", tier: "alpha" },
  ];

  const drawingTools = [
    { label: "Trendline", tier: "pro" },
    { label: "Horiz. Line", tier: "pro" },
    { label: "Channel", tier: "pro" },
    { label: "Fib Retrace", tier: "pro" },
    { label: "Rect. Zone", tier: "pro" },
    { label: "Text Note", tier: "pro" },
  ];

  const srLevels = [
    { type: "R", label: "Resistance 2", price: selectedIdx.value * 1.08, strength: "Weak" },
    { type: "R", label: "Resistance 1", price: selectedIdx.value * 1.03, strength: "Strong" },
    { type: "S", label: "Support 1", price: selectedIdx.value * 0.97, strength: "Strong" },
    { type: "S", label: "Support 2", price: selectedIdx.value * 0.92, strength: "Moderate" },
  ];

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Index selector */}
              <select value={selectedIdx.ticker} onChange={e => setSelectedIdx(INDEXES.find(x => x.ticker === e.target.value))}
                className="px-2.5 py-1.5 bg-[#0d0f12] border border-[#2a2d36] rounded-lg text-xs font-bold text-[#e8eaed] focus:outline-none focus:border-[#00ff8860]">
                {INDEXES.map(idx => <option key={idx.ticker} value={idx.ticker}>{idx.ticker} — {idx.name}</option>)}
              </select>
              <div>
                <div className="text-xl font-bold text-[#e8eaed]">{fmtFull(selectedIdx.value)}</div>
                <span className={`text-xs font-semibold ${selectedIdx.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}`}>
                  {selectedIdx.change >= 0 ? <ArrowUpRight size={12} className="inline" /> : <ArrowDownRight size={12} className="inline" />}
                  {pct(selectedIdx.change)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Chart type */}
              {[
                { id: "candle", label: "Candle" },
                { id: "line", label: "Line" },
                { id: "area", label: "Area" },
              ].map(ct => (
                <button key={ct.id} onClick={() => setChartType(ct.id)}
                  className={`px-2 py-1 rounded text-[9px] font-medium transition-all
                    ${chartType === ct.id ? "bg-[#1e2128] text-[#e8eaed]" : "text-[#4a5060] hover:text-[#6b7280]"}`}>
                  {ct.label}
                </button>
              ))}
              <div className="w-px h-4 bg-[#1e2128] mx-1" />
              {/* Timeframes */}
              {["1H","4H","1D","1W","1M"].map(tf => (
                <button key={tf} onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded text-[9px] font-medium transition-all
                    ${timeframe === tf ? "bg-[#1e2128] text-[#e8eaed]" : "text-[#4a5060] hover:text-[#6b7280]"}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* OHLCV Bar */}
          <div className="flex items-center gap-4 mb-3 px-1">
            {[
              { label: "O", value: latestBar.open, color: "#9ca3af" },
              { label: "H", value: latestBar.high, color: "#00ff88" },
              { label: "L", value: latestBar.low, color: "#ef4444" },
              { label: "C", value: latestBar.close, color: isBullish ? "#00ff88" : "#ef4444" },
              { label: "Vol", value: latestBar.vol, color: "#3b82f6" },
            ].map(v => (
              <div key={v.label} className="flex items-center gap-1">
                <span className="text-[9px] text-[#4a5060] font-semibold">{v.label}</span>
                <span className="text-[10px] font-mono font-semibold" style={{ color: v.color }}>
                  {v.label === "Vol" ? v.value.toLocaleString() : fmtFull(v.value)}
                </span>
              </div>
            ))}
          </div>

          {/* TradingView Lightweight Charts (or SVG fallback) */}
          {lwcFailed ? (
            /* SVG Candlestick Fallback */
            (() => {
              const W = 700, H = 360, padL = 50, padR = 10, padT = 10, padB = 25;
              const chartW = W - padL - padR;
              const chartH = H - padT - padB;
              const allPrices = currentData.flatMap(d => [d.high, d.low]);
              const minP = Math.min(...allPrices) * 0.998;
              const maxP = Math.max(...allPrices) * 1.002;
              const rangeP = maxP - minP || 1;
              const yScale = (v) => padT + chartH - ((v - minP) / rangeP) * chartH;
              const barW = chartW / currentData.length;
              const bodyW = barW * 0.6;
              const gridVals = Array.from({ length: 5 }, (_, i) => minP + (rangeP / 4) * i);
              return (
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 360, display: "block" }}>
                  {gridVals.map((v, i) => (
                    <g key={i}>
                      <line x1={padL} y1={yScale(v)} x2={W - padR} y2={yScale(v)} stroke="#1e2128" strokeWidth="0.5" />
                      <text x={padL - 5} y={yScale(v) + 3} textAnchor="end" fill="#2a2d36" fontSize="8" fontFamily="DM Sans">{v >= 100 ? v.toFixed(0) : v.toFixed(2)}</text>
                    </g>
                  ))}
                  {activeIndicators.includes("MA20") && (() => {
                    const pts = currentData.filter(d => d.ma20 !== null).map((d) => {
                      const idx = currentData.indexOf(d);
                      return `${padL + idx * barW + barW / 2},${yScale(d.ma20)}`;
                    }).join(" ");
                    return <polyline points={pts} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />;
                  })()}
                  {currentData.map((d, i) => {
                    const x = padL + i * barW + barW / 2;
                    const bull = d.close >= d.open;
                    const color = bull ? "#00ff88" : "#ef4444";
                    const bodyTop = yScale(Math.max(d.open, d.close));
                    const bodyBot = yScale(Math.min(d.open, d.close));
                    const bodyH = Math.max(1, bodyBot - bodyTop);
                    return (
                      <g key={i}>
                        <line x1={x} y1={yScale(d.high)} x2={x} y2={yScale(d.low)} stroke={color} strokeWidth="1" />
                        <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} stroke={color} strokeWidth="0.5" fillOpacity={bull ? 0.3 : 0.8} rx="1" />
                      </g>
                    );
                  })}
                  {currentData.map((d, i) => (
                    i % 3 === 0 && <text key={i} x={padL + i * barW + barW / 2} y={H - 5} textAnchor="middle" fill="#2a2d36" fontSize="8" fontFamily="DM Sans">{d.time.slice(5)}</text>
                  ))}
                  {activeIndicators.includes("Volume") && currentData.map((d, i) => {
                    const x = padL + i * barW + barW / 2;
                    const maxVol = Math.max(...currentData.map(v => v.vol));
                    const volH = (d.vol / maxVol) * 40;
                    const bull = d.close >= d.open;
                    return <rect key={`v${i}`} x={x - bodyW / 2} y={H - padB - volH} width={bodyW} height={volH} fill={bull ? "#00ff8825" : "#ef444425"} rx="1" />;
                  })}
                </svg>
              );
            })()
          ) : (
            <div ref={chartContainerRef} style={{ width: "100%", minHeight: 360, borderRadius: 8, overflow: "hidden" }}>
              {!lwcReady && (
                <div className="flex items-center justify-center h-[360px] text-[11px] text-[#4a5060]">
                  <div className="text-center">
                    <div className="animate-pulse mb-2">Loading TradingView Charts...</div>
                    <div className="text-[9px] text-[#2a2d36]">If this takes more than a few seconds, SVG fallback will activate</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Volume is rendered inside the TradingView chart when enabled */}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Indicators Panel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4">
            <h3 className="text-[11px] font-bold text-[#e8eaed] mb-2">Indicators</h3>
            <div className="space-y-1">
              {indicators.map(ind => {
                const isActive = activeIndicators.includes(ind.id);
                const tierColor = { free: "#00ff88", pro: "#3b82f6", alpha: "#eab308" }[ind.tier];
                const isLocked = (ind.tier === "pro" || ind.tier === "alpha") && !["MA20","MA50","Volume","RSI"].includes(ind.id);
                return (
                  <button key={ind.id} onClick={() => !isLocked && toggleIndicator(ind.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all
                      ${isActive ? "bg-[#1e2128]" : "hover:bg-[#13161b]"} ${isLocked ? "opacity-40" : ""}`}>
                    <div className={`w-3 h-3 rounded-sm border flex items-center justify-center
                      ${isActive ? "border-[#00ff88] bg-[#00ff8820]" : "border-[#2a2d36]"}`}>
                      {isActive && <Check size={8} className="text-[#00ff88]" />}
                    </div>
                    <span className="text-[10px] text-[#e8eaed] font-medium flex-1">{ind.label}</span>
                    {ind.tier !== "free" && (
                      <span className="text-[7px] font-bold px-1 py-0.5 rounded" style={{ color: tierColor, background: `${tierColor}15` }}>
                        {ind.tier.toUpperCase()}
                      </span>
                    )}
                    {isLocked && <Lock size={8} className="text-[#2a2d36]" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Drawing Tools */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold text-[#e8eaed]">Drawing Tools</h3>
              <Badge variant="blue">Pro</Badge>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {drawingTools.map(tool => (
                <button key={tool.label}
                  className="flex items-center gap-1.5 px-2 py-2 rounded bg-[#0d0f12] border border-[#1e2128] hover:border-[#2a2d36] transition-all text-left">
                  <span className="text-[10px] text-[#6b7280]">{tool.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              <h4 className="text-[10px] font-semibold text-[#4a5060]">Save & Share</h4>
              <button className="w-full py-1.5 rounded bg-[#1e2128] text-[10px] text-[#6b7280] border border-[#2a2d36] hover:text-[#9ca3af] transition-colors">
                Save Chart Layout
              </button>
              <button className="w-full py-1.5 rounded bg-[#00ff8810] text-[10px] text-[#00ff88] border border-[#00ff8825] hover:bg-[#00ff8820] transition-colors">
                Share Analysis to Community
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Support / Resistance + Key Levels */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold text-[#e8eaed]">Key Levels</h3>
              <Badge variant="gold"><Crown size={8} /> Alpha</Badge>
            </div>
            <div className="space-y-1.5 mb-3">
              {srLevels.map((sr, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-[#0d0f12] border border-[#1e2128]">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${sr.type === "R" ? "text-[#ef4444] bg-[#ef444415]" : "text-[#00ff88] bg-[#00ff8815]"}`}>
                      {sr.type === "R" ? "RES" : "SUP"}
                    </span>
                    <span className="text-[10px] text-[#6b7280]">{sr.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold text-[#e8eaed]">{fmtFull(sr.price)}</span>
                    <span className={`text-[8px] ${sr.strength === "Strong" ? "text-[#e8eaed]" : "text-[#4a5060]"}`}>{sr.strength}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick TA Summary */}
            <div className="p-2.5 rounded-lg bg-[#0d0f12] border border-[#1e2128]">
              <div className="text-[9px] text-[#4a5060] uppercase tracking-widest mb-1.5">Quick TA Summary</div>
              <div className="space-y-1">
                {[
                  { label: "Trend", value: selectedIdx.change >= 0 ? "Uptrend" : "Downtrend", color: selectedIdx.change >= 0 ? "#00ff88" : "#ef4444" },
                  { label: "MA20", value: latestBar.close > (latestBar.ma20 || 0) ? "Above (Bullish)" : "Below (Bearish)", color: latestBar.close > (latestBar.ma20 || 0) ? "#00ff88" : "#ef4444" },
                  { label: "RSI", value: `${latestBar.rsi} ${latestBar.rsi > 70 ? "(Overbought)" : latestBar.rsi < 30 ? "(Oversold)" : "(Neutral)"}`, color: latestBar.rsi > 70 ? "#ef4444" : latestBar.rsi < 30 ? "#00ff88" : "#eab308" },
                  { label: "Volume", value: latestBar.vol > 1000 ? "Above Avg" : "Below Avg", color: latestBar.vol > 1000 ? "#3b82f6" : "#4a5060" },
                ].map((ta, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[9px] text-[#4a5060]">{ta.label}</span>
                    <span className="text-[9px] font-semibold" style={{ color: ta.color }}>{ta.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────
export default function SkinconomyDashboard() {
  const [view, setView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "indexes", label: "Indexes", icon: LineChart },
    { id: "charts", label: "Charts / TA", icon: BarChart3 },
    { id: "sentiment", label: "Sentiment", icon: TrendingUp },
    { id: "macro", label: "Macro", icon: Globe },
    { id: "portfolio", label: "My Portfolio", icon: Wallet },
    { id: "invest", label: "Invest", icon: ShoppingCart },
    { id: "strategies", label: "Strategies", icon: Layers },
    { id: "seasonal", label: "Seasonal", icon: Calendar },
    { id: "mapping", label: "Asset Map", icon: BookOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const views = { overview: OverviewView, indexes: IndexView, charts: TAView, sentiment: SentimentView, macro: MacroView, portfolio: PortfolioView, invest: InvestView, strategies: StrategiesView, seasonal: SeasonalView, mapping: MappingView, leaderboard: LeaderboardView };
  const ActiveView = views[view];

  return (
    <div className="min-h-screen bg-[#0a0c0f] text-[#e8eaed] flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-52 bg-[#0d0f12] border-r border-[#1e2128] flex flex-col p-3 transition-transform duration-300
        lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 8px #00ff8866" }} />
          <span className="text-sm font-bold text-[#e8eaed] tracking-tight">Skinconomy</span>
          <span className="text-sm font-bold text-[#00ff88]">.</span>
        </div>

        <div className="text-[9px] font-semibold text-[#2a2d36] uppercase tracking-widest px-3 mb-2">MARKET</div>
        <nav className="space-y-0.5 mb-4">
          {nav.map(n => <NavItem key={n.id} {...n} active={view === n.id} onClick={() => { setView(n.id); setSidebarOpen(false); }} />)}
        </nav>

        <div className="text-[9px] font-semibold text-[#2a2d36] uppercase tracking-widest px-3 mb-2">PERSONAL</div>
        <nav className="space-y-0.5 mb-4">
          <NavItem icon={Wallet} label="My Portfolio" active={view === "portfolio"} onClick={() => { setView("portfolio"); setSidebarOpen(false); }} />
          <NavItem icon={ShoppingCart} label="Invest" active={view === "invest"} onClick={() => { setView("invest"); setSidebarOpen(false); }} />
          <NavItem icon={Target} label="Watchlists" active={false} onClick={() => {}} />
          <NavItem icon={Bell} label="Alerts" active={false} onClick={() => {}} locked />
          <NavItem icon={Zap} label="Automations" active={false} onClick={() => {}} locked />
        </nav>

        <div className="text-[9px] font-semibold text-[#2a2d36] uppercase tracking-widest px-3 mb-2">LEARN</div>
        <nav className="space-y-0.5 mb-4">
          <NavItem icon={BookOpen} label="Asset Map" active={view === "mapping"} onClick={() => { setView("mapping"); setSidebarOpen(false); }} />
          <NavItem icon={Layers} label="Strategies" active={view === "strategies"} onClick={() => { setView("strategies"); setSidebarOpen(false); }} />
        </nav>

        <div className="text-[9px] font-semibold text-[#2a2d36] uppercase tracking-widest px-3 mb-2">COMMUNITY</div>
        <nav className="space-y-0.5">
          <NavItem icon={Users} label="Strategies" active={false} onClick={() => {}} />
          <NavItem icon={Globe} label="Public Portfolios" active={false} onClick={() => {}} />
        </nav>

        {/* Upgrade card */}
        <div className="mt-auto">
          <div className="p-3 rounded-lg bg-[#00ff8808] border border-[#00ff8820]">
            <div className="text-[10px] font-semibold text-[#00ff88] mb-1">Upgrade to Pro</div>
            <div className="text-[9px] text-[#4a5060] leading-relaxed">Unlock full constituents, TA tools, and unlimited portfolios.</div>
            <button className="mt-2 w-full py-1.5 rounded-md bg-[#00ff88] text-[#0a0c0f] text-[10px] font-bold">$19/mo</button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0c0f]/80 backdrop-blur-md border-b border-[#1e2128] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={18} className="text-[#6b7280]" /></button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[10px] text-[#4a5060] tracking-wider">LIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 ml-4">
              {INDEXES.slice(0, 4).map(idx => (
                <span key={idx.ticker} className="text-[10px] font-mono">
                  <span className="text-[#6b7280]">{idx.ticker}</span>{" "}
                  <span className="text-[#e8eaed]">{fmtFull(idx.value)}</span>{" "}
                  <span className={idx.change >= 0 ? "text-[#00ff88]" : "text-[#ef4444]"}>{pct(idx.change)}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a5060]" />
              <input placeholder="Search skins..." className="pl-8 pr-3 py-1.5 bg-[#13161b] border border-[#1e2128] rounded-lg text-[11px] text-[#e8eaed] w-44 focus:outline-none focus:border-[#2a2d36] placeholder:text-[#2a2d36]" />
            </div>
            <button className="w-7 h-7 rounded-lg bg-[#13161b] border border-[#1e2128] flex items-center justify-center">
              <Bell size={13} className="text-[#4a5060]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 max-w-5xl">
          {/* Portfolio banner */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <div className="text-[10px] text-[#4a5060] uppercase tracking-widest mb-1">Paper Portfolio Value</div>
                <div className="text-3xl font-bold tracking-tight">{fmtFull(PORTFOLIO.totalValue)}</div>
              </div>
              <div className="flex items-center gap-1 pb-1">
                <ArrowUpRight size={16} className="text-[#00ff88]" />
                <span className="text-lg font-bold text-[#00ff88]">{pct(PORTFOLIO.totalReturn)}</span>
                <span className="text-xs text-[#4a5060] ml-1">all time</span>
              </div>
            </div>
          </motion.div>

          {/* View tabs */}
          <div className="flex gap-1 mb-4 border-b border-[#1e2128] pb-2">
            {nav.map(n => (
              <button key={n.id} onClick={() => setView(n.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all
                  ${view === n.id ? "bg-[#1e2128] text-[#e8eaed]" : "text-[#4a5060] hover:text-[#6b7280]"}`}
              >
                <n.icon size={13} />
                {n.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}