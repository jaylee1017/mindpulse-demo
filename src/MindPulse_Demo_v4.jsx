import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { useState, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════
   🌿 MindPulse v4 — 전시회 데모 (실제 데이터 + 슬라이더)
   사용자: 621e2e8e67b776a24055b564
   Baseline: 2021-05-24 ~ 2021-06-06 (14일)
   분석 기간: 2021-06-07 ~ 2021-08-01 (56일)
   ═══════════════════════════════════════════ */

const C = {
  bg: "#FAF7F2", bgWarm: "#F5F0E8", bgCare: "#F0F5F2",
  surface: "#FFFFFF", surfacePeach: "#FFF5EE", surfaceSage: "#F0F6F1",
  surfaceBlue: "#F0F4FF", surfaceLavender: "#F6F0FF", surfaceAmber: "#FFF8EE",
  border: "#EDE8DF", borderSoft: "#F0EBE3",
  text: "#2D2A26", textBody: "#4A4640", textSoft: "#7A756D", textMuted: "#A9A49B",
  peach: "#F2855E", sage: "#5A9E6F", sageDark: "#3D7A52", sageLight: "#E8F3EB",
  blue: "#5B8DEF", blueLight: "#ECF1FF",
  lavender: "#9B7ADB", lavenderLight: "#F3EDFF",
  coral: "#E8695C", coralLight: "#FFEEEC",
  amber: "#D4953D", amberLight: "#FFF6E6",
  teal: "#4AABB8", tealLight: "#E8F6F8",
};

/* ── Baseline (첫 14일 평균) ── */
const BL = {
  stress: 54.7, dep: 49.5, sleepH: 49.9,
  sleep_h: 9.6, steps: 9465, rhr: 62.1, sed: 664,
};

/* ── 56일 전체 데이터 ── */
const ALL_DAYS = [
  {d:"6/7",stress:50.1,dep:45.0,sleep:52.8,sleep_h:9.2,steps:8378,rhr:59.6,sed:706,eff:92.0,rmssd:122.1,vam:34.0},
  {d:"6/8",stress:66.4,dep:48.3,sleep:29.2,sleep_h:5.9,steps:8872,rhr:60.0,sed:893,eff:96.0,rmssd:97.1,vam:37.0},
  {d:"6/9",stress:57.7,dep:49.8,sleep:56.7,sleep_h:8.9,steps:8114,rhr:59.8,sed:719,eff:93.0,rmssd:99.7,vam:40.0},
  {d:"6/10",stress:45.3,dep:52.3,sleep:null,sleep_h:null,steps:8792,rhr:59.9,sed:1241,eff:null,rmssd:null,vam:37.0},
  {d:"6/11",stress:45.0,dep:50.9,sleep:null,sleep_h:null,steps:10215,rhr:59.9,sed:1253,eff:null,rmssd:null,vam:45.0},
  {d:"6/12",stress:45.7,dep:52.3,sleep:null,sleep_h:null,steps:9308,rhr:59.9,sed:1252,eff:null,rmssd:null,vam:39.0},
  {d:"6/13",stress:48.8,dep:58.1,sleep:null,sleep_h:null,steps:5381,rhr:59.9,sed:1265,eff:null,rmssd:null,vam:18.0},
  {d:"6/14",stress:53.4,dep:57.7,sleep:null,sleep_h:null,steps:9705,rhr:60.8,sed:1196,eff:null,rmssd:null,vam:33.0},
  {d:"6/15",stress:54.9,dep:58.1,sleep:null,sleep_h:null,steps:9619,rhr:60.8,sed:1222,eff:null,rmssd:null,vam:39.0},
  {d:"6/16",stress:62.4,dep:53.7,sleep:56.6,sleep_h:8.9,steps:9653,rhr:61.5,sed:685,eff:90.0,rmssd:97.1,vam:40.0},
  {d:"6/17",stress:55.6,dep:48.8,sleep:53.0,sleep_h:9.9,steps:9321,rhr:61.2,sed:670,eff:93.0,rmssd:102.0,vam:34.0},
  {d:"6/18",stress:59.1,dep:47.3,sleep:54.4,sleep_h:9.7,steps:10999,rhr:60.3,sed:634,eff:91.0,rmssd:96.0,vam:42.0},
  {d:"6/19",stress:53.6,dep:30.1,sleep:43.7,sleep_h:10.4,steps:9842,rhr:59.5,sed:634,eff:95.0,rmssd:107.8,vam:47.0},
  {d:"6/20",stress:68.1,dep:40.9,sleep:52.7,sleep_h:9.2,steps:2455,rhr:58.1,sed:767,eff:94.0,rmssd:99.4,vam:0.0},
  {d:"6/21",stress:53.9,dep:38.1,sleep:56.9,sleep_h:8.9,steps:9606,rhr:57.6,sed:698,eff:93.0,rmssd:107.4,vam:28.0},
  {d:"6/22",stress:50.1,dep:40.0,sleep:51.6,sleep_h:9.1,steps:10545,rhr:57.9,sed:638,eff:92.0,rmssd:114.0,vam:34.0},
  {d:"6/23",stress:69.4,dep:48.3,sleep:55.6,sleep_h:8.8,steps:8550,rhr:58.5,sed:722,eff:90.0,rmssd:86.7,vam:29.0},
  {d:"6/24",stress:57.9,dep:39.1,sleep:55.0,sleep_h:9.5,steps:8063,rhr:58.0,sed:694,eff:94.0,rmssd:93.8,vam:39.0},
  {d:"6/25",stress:46.5,dep:41.7,sleep:54.2,sleep_h:9.4,steps:10200,rhr:57.7,sed:693,eff:93.0,rmssd:120.6,vam:37.0},
  {d:"6/26",stress:61.4,dep:44.1,sleep:54.4,sleep_h:8.6,steps:4816,rhr:57.8,sed:727,eff:92.0,rmssd:108.6,vam:17.0},
  {d:"6/27",stress:66.6,dep:41.1,sleep:55.3,sleep_h:9.6,steps:8762,rhr:56.4,sed:674,eff:90.0,rmssd:97.9,vam:20.0},
  {d:"6/28",stress:56.2,dep:27.5,sleep:55.2,sleep_h:8.7,steps:14393,rhr:56.2,sed:607,eff:94.0,rmssd:97.9,vam:65.0},
  {d:"6/29",stress:61.8,dep:39.0,sleep:55.8,sleep_h:8.8,steps:9896,rhr:56.1,sed:651,eff:91.0,rmssd:97.5,vam:38.0},
  {d:"6/30",stress:56.7,dep:42.9,sleep:54.6,sleep_h:9.5,steps:10316,rhr:57.2,sed:617,eff:92.0,rmssd:104.7,vam:35.0},
  {d:"7/1",stress:51.4,dep:41.8,sleep:53.1,sleep_h:9.9,steps:9184,rhr:57.8,sed:669,eff:93.0,rmssd:104.6,vam:34.0},
  {d:"7/2",stress:63.5,dep:44.5,sleep:51.6,sleep_h:9.1,steps:10203,rhr:58.0,sed:709,eff:93.0,rmssd:92.4,vam:31.0},
  {d:"7/3",stress:53.5,dep:34.9,sleep:53.0,sleep_h:9.2,steps:8347,rhr:57.8,sed:712,eff:94.0,rmssd:117.5,vam:36.0},
  {d:"7/4",stress:25.3,dep:44.0,sleep:null,sleep_h:null,steps:4545,rhr:57.9,sed:1269,eff:null,rmssd:null,vam:8.0},
  {d:"7/5",stress:54.8,dep:43.6,sleep:62.1,sleep_h:9.4,steps:8205,rhr:57.9,sed:706,eff:95.0,rmssd:100.3,vam:25.0},
  {d:"7/6",stress:55.0,dep:40.0,sleep:54.5,sleep_h:9.7,steps:11002,rhr:58.0,sed:629,eff:91.0,rmssd:99.4,vam:49.0},
  {d:"7/7",stress:77.4,dep:50.3,sleep:50.3,sleep_h:9.2,steps:6249,rhr:58.6,sed:741,eff:89.0,rmssd:80.2,vam:16.0},
  {d:"7/8",stress:56.4,dep:40.2,sleep:55.1,sleep_h:9.5,steps:9967,rhr:58.5,sed:634,eff:95.0,rmssd:89.9,vam:37.0},
  {d:"7/9",stress:57.6,dep:42.9,sleep:51.4,sleep_h:9.0,steps:10111,rhr:57.8,sed:682,eff:94.0,rmssd:95.1,vam:41.0},
  {d:"7/10",stress:49.1,dep:36.8,sleep:41.1,sleep_h:10.8,steps:7783,rhr:57.0,sed:610,eff:95.0,rmssd:99.6,vam:35.0},
  {d:"7/11",stress:68.2,dep:42.5,sleep:56.7,sleep_h:8.9,steps:11235,rhr:57.1,sed:681,eff:90.0,rmssd:97.9,vam:32.0},
  {d:"7/12",stress:56.9,dep:38.1,sleep:55.2,sleep_h:8.7,steps:8846,rhr:57.2,sed:698,eff:94.0,rmssd:100.4,vam:32.0},
  {d:"7/13",stress:60.2,dep:46.3,sleep:53.6,sleep_h:9.8,steps:8513,rhr:57.4,sed:663,eff:91.0,rmssd:96.7,vam:33.0},
  {d:"7/14",stress:60.6,dep:45.8,sleep:54.6,sleep_h:7.8,steps:8768,rhr:58.4,sed:713,eff:92.0,rmssd:105.6,vam:45.0},
  {d:"7/15",stress:57.2,dep:51.5,sleep:53.5,sleep_h:9.9,steps:8585,rhr:60.4,sed:651,eff:94.0,rmssd:90.9,vam:28.0},
  {d:"7/16",stress:63.9,dep:50.1,sleep:52.4,sleep_h:8.3,steps:9985,rhr:60.6,sed:744,eff:91.0,rmssd:96.3,vam:43.0},
  {d:"7/17",stress:54.7,dep:40.1,sleep:57.2,sleep_h:9.0,steps:8882,rhr:61.0,sed:552,eff:94.0,rmssd:103.0,vam:28.0},
  {d:"7/18",stress:54.3,dep:40.7,sleep:51.5,sleep_h:9.0,steps:10071,rhr:60.4,sed:670,eff:94.0,rmssd:107.1,vam:27.0},
  {d:"7/19",stress:60.6,dep:54.6,sleep:39.3,sleep_h:10.7,steps:10208,rhr:61.4,sed:537,eff:87.0,rmssd:94.6,vam:34.0},
  {d:"7/20",stress:65.0,dep:49.4,sleep:40.1,sleep_h:6.6,steps:10565,rhr:60.6,sed:794,eff:92.0,rmssd:98.5,vam:27.0},
  {d:"7/21",stress:44.5,dep:41.8,sleep:53.2,sleep_h:9.9,steps:10232,rhr:59.6,sed:633,eff:96.0,rmssd:106.3,vam:33.0},
  {d:"7/22",stress:63.0,dep:51.3,sleep:54.6,sleep_h:8.6,steps:9592,rhr:60.1,sed:717,eff:90.0,rmssd:101.8,vam:37.0},
  {d:"7/23",stress:60.4,dep:38.8,sleep:55.2,sleep_h:7.9,steps:12525,rhr:60.0,sed:704,eff:93.0,rmssd:103.5,vam:45.0},
  {d:"7/24",stress:60.3,dep:39.4,sleep:53.5,sleep_h:9.9,steps:11918,rhr:61.2,sed:573,eff:96.0,rmssd:85.3,vam:35.0},
  {d:"7/25",stress:71.9,dep:49.5,sleep:52.7,sleep_h:9.2,steps:2472,rhr:61.0,sed:746,eff:94.0,rmssd:87.0,vam:0.0},
  {d:"7/26",stress:61.9,dep:45.6,sleep:56.7,sleep_h:8.9,steps:12090,rhr:61.4,sed:698,eff:95.0,rmssd:81.7,vam:61.0},
  {d:"7/27",stress:61.7,dep:49.6,sleep:55.1,sleep_h:9.5,steps:1911,rhr:61.1,sed:764,eff:94.0,rmssd:100.6,vam:0.0},
  {d:"7/28",stress:54.0,dep:46.6,sleep:45.9,sleep_h:10.1,steps:8522,rhr:61.1,sed:655,eff:95.0,rmssd:97.2,vam:38.0},
  {d:"7/29",stress:52.8,dep:45.0,sleep:55.4,sleep_h:9.6,steps:18004,rhr:62.0,sed:568,eff:91.0,rmssd:103.6,vam:65.0},
  {d:"7/30",stress:65.7,dep:49.3,sleep:23.3,sleep_h:5.1,steps:9841,rhr:61.9,sed:838,eff:96.0,rmssd:90.6,vam:45.0},
  {d:"7/31",stress:62.4,dep:50.6,sleep:55.3,sleep_h:9.6,steps:11435,rhr:62.8,sed:609,eff:94.0,rmssd:86.2,vam:30.0},
  {d:"8/1",stress:61.9,dep:51.2,sleep:52.8,sleep_h:9.2,steps:3593,rhr:62.9,sed:546,eff:93.0,rmssd:null,vam:2.0},
];

/* ── 주간 평균 (8주) ── */
const WEEKLY_AVG = [
  { w: "1주", stress: 51.3, sleep: 46.2, dep: 51.0 },
  { w: "2주", stress: 58.2, sleep: 52.1, dep: 48.1 },
  { w: "3주", stress: 58.0, sleep: 54.7, dep: 41.8 },
  { w: "4주", stress: 52.6, sleep: 53.9, dep: 39.2 },
  { w: "5주", stress: 59.8, sleep: 53.0, dep: 42.3 },
  { w: "6주", stress: 58.2, sleep: 54.0, dep: 44.6 },
  { w: "7주", stress: 60.8, sleep: 49.8, dep: 46.4 },
  { w: "8주", stress: 60.1, sleep: 49.2, dep: 48.3 },
];

const radarData = [
  { axis: "수면", v: 32 }, { axis: "심박/ANS", v: 11 },
  { axis: "활동", v: 79 }, { axis: "체온", v: 65 },
];

/* ── Icons ── */
const Ico = {
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Care: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Pen: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Doc: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

/* ── Shared Components ── */
const AiBubble = ({ children, emoji = "🌿" }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: "fadeUp 0.4s ease" }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.sage}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 2px 10px ${C.sage}30` }}>{emoji}</div>
    <div style={{ flex: 1, background: C.surface, borderRadius: "4px 18px 18px 18px", padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", fontSize: 13, color: C.textBody, lineHeight: 1.75 }}>{children}</div>
  </div>
);
const Tip = ({ content, children }) => (<span className="tipWrap" tabIndex={0}>{children}<span className="tipText" role="tooltip">{content}</span></span>);
const Card = ({ children, style }) => (<div style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.03)", ...style }}>{children}</div>);
const Pill = ({ children, color = C.sage, bg }) => (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg || `${color}15` }}>{children}</span>);
const ScoreCircle = ({ score, size = 76, color, label }) => { const r = (size - 8) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ; const emoji = score <= 30 ? "😊" : score <= 50 ? "🙂" : score <= 70 ? "😐" : "😟"; return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><div style={{ position: "relative", width: size, height: size }}><svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={7}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}/></svg><div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: size * 0.18 }}>{emoji}</span><span style={{ fontSize: size * 0.24, fontWeight: 700, color: C.text }}>{score}</span></div></div><span style={{ fontSize: 11, fontWeight: 600, color: C.textSoft }}>{label}</span></div>); };
const Bar2 = ({ value, color, h = 6 }) => (<div style={{ width: "100%", height: h, borderRadius: h, background: `${color}18`, overflow: "hidden" }}><div style={{ width: `${Math.min(value, 100)}%`, height: "100%", borderRadius: h, background: color, transition: "width 0.8s ease" }}/></div>);
const Head = ({ emoji, title, sub, right }) => (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}><div><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{emoji && <span style={{ fontSize: 17 }}>{emoji}</span>}<h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h3></div>{sub && <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>{sub}</p>}</div>{right}</div>);
const CompareRow = ({ label, good, bad, unit = "", better = "low" }) => { const goodBetter = better === "low" ? parseFloat(good) < parseFloat(bad) : parseFloat(good) > parseFloat(bad); return (<div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}><span style={{ flex: 1, fontSize: 13, color: C.textBody }}>{label}</span><span style={{ width: 80, textAlign: "center", fontSize: 13, fontWeight: 700, color: goodBetter ? C.sage : C.textSoft }}>{good}{unit}</span><span style={{ width: 16, textAlign: "center", fontSize: 10, color: C.textMuted }}>vs</span><span style={{ width: 80, textAlign: "center", fontSize: 13, fontWeight: 700, color: !goodBetter ? C.coral : C.textSoft }}>{bad}{unit}</span></div>); };

/* ── Baseline 점선 라벨 ── */
const BLLabel = ({ viewBox, value, label }) => { const { x, y } = viewBox || {}; return (<text x={(x||0)+4} y={(y||0)-4} fill={C.textMuted} fontSize={9} fontWeight={600}>{label} {value}</text>); };

// ═══════════════════════════════════════════
// HOME (슬라이더 + Baseline 기준선)
// ═══════════════════════════════════════════
const HomePage = ({ dayIdx, setDayIdx, goTo }) => {
  const today = ALL_DAYS[dayIdx];
  const yesterday = dayIdx > 0 ? ALL_DAYS[dayIdx - 1] : null;
  const last7 = ALL_DAYS.slice(Math.max(0, dayIdx - 6), dayIdx + 1);
  const dayNum = dayIdx + 1;

  // 케어 아이템 — 오늘 데이터에 따라 동적 생성
  const careItems = useMemo(() => {
    const items = [];
    if (today.sleep_h !== null && today.sleep_h < BL.sleep_h - 1) items.push({ emoji: "🌙", title: "수면 시간 부족", desc: `오늘 ${today.sleep_h}시간으로 평소(${BL.sleep_h}h)보다 ${(BL.sleep_h - today.sleep_h).toFixed(1)}시간 적어요. 내일은 수면 시간을 꼭 확보하세요.`, tone: "lavender" });
    else items.push({ emoji: "🫁", title: "호흡으로 심박 안정화", desc: "심박/ANS 축 이탈이 89.5%로 가장 불안정해요. 4-7-8 호흡법으로 부교감신경을 활성화하세요.", tone: "teal" });
    if (today.steps !== null && today.steps < 5000) items.push({ emoji: "🚶", title: "걸음수 회복하기", desc: `오늘 ${today.steps.toLocaleString()}보로 평소(${BL.steps.toLocaleString()}보)의 ${Math.round(today.steps/BL.steps*100)}%예요. 가벼운 산책이라도 추가하세요.`, tone: "sage" });
    else items.push({ emoji: "🚶", title: "활동량 유지하기", desc: `하루 9,000보 이상 걷기를 유지하면 스트레스가 평균 12점 낮아져요.`, tone: "sage" });
    items.push({ emoji: "🌙", title: "수면 9시간 확보", desc: `이 사용자의 baseline 수면은 ${BL.sleep_h}시간이에요. 일반적인 8시간이 아닌, 본인 기준 9시간 이상이 필요해요.`, tone: "lavender" });
    return items;
  }, [dayIdx]);

  const toneOf = (t) => t === "lavender" ? { bg: C.surfaceLavender, bd: `${C.lavender}22`, accent: C.lavender } : t === "teal" ? { bg: C.tealLight, bd: `${C.teal}22`, accent: C.teal } : { bg: C.surfaceSage, bd: `${C.sage}22`, accent: C.sage };
  const [careIdx, setCareIdx] = useState(0);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dxRef = useRef(0);
  const clampIdx = (i) => Math.max(0, Math.min(i, careItems.length - 1));
  const goToIdx = (i) => setCareIdx(clampIdx(i));
  const next = () => goToIdx(careIdx + 1);
  const prev = () => goToIdx(careIdx - 1);
  const applyTransform = (idx, extraPx = 0, wt = true) => { const el = trackRef.current; if (!el) return; el.style.transition = wt ? "transform 260ms ease" : "none"; el.style.transform = `translate3d(calc(${-idx * 100}% + ${extraPx}px), 0, 0)`; };
  useEffect(() => { applyTransform(careIdx, 0, true); }, [careIdx]);
  useEffect(() => { setCareIdx(0); }, [dayIdx]);
  const onPointerDown = (e) => { isDraggingRef.current = true; startXRef.current = e.clientX; dxRef.current = 0; e.currentTarget.setPointerCapture?.(e.pointerId); applyTransform(careIdx, 0, false); };
  const onPointerMove = (e) => { if (!isDraggingRef.current) return; const dx = e.clientX - startXRef.current; dxRef.current = dx; applyTransform(careIdx, (careIdx === 0 && dx > 0) || (careIdx === careItems.length - 1 && dx < 0) ? dx * 0.35 : dx, false); };
  const endDrag = () => { if (!isDraggingRef.current) return; isDraggingRef.current = false; const dx = dxRef.current; if (dx <= -60 && careIdx < careItems.length - 1) setCareIdx(i => i + 1); else if (dx >= 60 && careIdx > 0) setCareIdx(i => i - 1); else applyTransform(careIdx, 0, true); };

  const stressScore = today.stress !== null ? Math.round(today.stress) : "—";
  const depScore = today.dep !== null ? Math.round(today.dep) : "—";
  const sleepScore = today.sleep !== null ? Math.round(today.sleep) : "—";

  // 변화 표시
  const delta = (cur, prev, flip = false) => {
    if (cur === null || prev === null || cur === "—" || prev === "—") return null;
    const d = cur - prev;
    if (Math.abs(d) < 0.5) return <span style={{ fontSize: 11, color: C.textMuted }}>변화 없음</span>;
    const up = d > 0;
    const good = flip ? !up : up; // flip: 높을수록 좋은 경우
    return <span style={{ fontSize: 11, color: good ? C.sage : C.coral }}>{up ? "▲" : "▼"} {Math.abs(d).toFixed(1)}</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* 날짜 슬라이더 */}
      <Card style={{ padding: "14px 16px", background: C.bgWarm }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>📅 날짜 탐색</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{dayNum}일차 / 56일</span>
        </div>
        <input
          type="range" min={0} max={ALL_DAYS.length - 1} value={dayIdx}
          onChange={e => setDayIdx(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.sage, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.textMuted }}>6/7</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.sage }}>2021년 {today.d}</span>
          <span style={{ fontSize: 10, color: C.textMuted }}>8/1</span>
        </div>
      </Card>

      <div>
        <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>2021년 {today.d} · 모니터링 {dayNum}일차</p>
        <h2 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, color: C.text }}>오늘의 건강 상태</h2>
      </div>

      {/* 3대 점수 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "space-around" }}>
          <ScoreCircle score={stressScore} color={C.peach} label="스트레스" />
          <ScoreCircle score={depScore} color={C.blue} label="우울경향" />
          <ScoreCircle score={sleepScore} color={C.sage} label="수면건강" />
        </div>
        <Tip content={<div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div><strong>스트레스</strong>: 낮을수록 좋음. Baseline 평균 {BL.stress}점</div><div><strong>우울경향</strong>: 경향 지표, 진단 아님. Baseline 평균 {BL.dep}점</div><div><strong>수면건강</strong>: Baseline 평균 {BL.sleepH}점</div></div>}>
          <button type="button" style={{ all: "unset", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 10, background: C.bgWarm, border: `1px solid ${C.border}`, cursor: "help" }}><Ico.Info /></button>
        </Tip>
      </div>

      {/* AI 리포트 */}
      <AiBubble emoji="💡">
        <Head emoji="📝" title="일간 리포트" />
        {today.stress !== null ? (<>
          <strong>스트레스 {today.stress}점</strong> — {today.stress <= 50 ? "좋은 편" : today.stress <= 60 ? "보통" : "약간 높음"}이에요.
          Baseline({BL.stress}점) 대비 {today.stress > BL.stress ? `+${(today.stress - BL.stress).toFixed(1)}점 높아요.` : `${(BL.stress - today.stress).toFixed(1)}점 낮아요 ✓`}
          <br/><br/>
          {today.steps !== null && today.steps < 5000 && <>걸음수가 <strong>{today.steps.toLocaleString()}보</strong>로 평소({BL.steps.toLocaleString()}보)의 {Math.round(today.steps/BL.steps*100)}%예요. 활동량 부족이 눈에 띄어요.<br/><br/></>}
          {today.sleep_h !== null && today.sleep_h < 7 && <>수면이 <strong>{today.sleep_h}시간</strong>으로 baseline({BL.sleep_h}h) 대비 매우 부족해요. 내일 컨디션에 영향을 줄 수 있어요.<br/><br/></>}
          {today.sleep_h !== null && today.sleep_h >= 9 && today.steps !== null && today.steps >= 8000 && <>수면({today.sleep_h}h)과 활동({today.steps.toLocaleString()}보) 모두 양호해요 ✓</>}
        </>) : <span>이 날은 일부 데이터가 누락되어 점수를 계산할 수 없어요.</span>}
      </AiBubble>

      {/* 캐러셀 */}
      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted, fontWeight: 600 }}>오늘 제안하는 케어</p>
          <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{careIdx + 1}/{careItems.length}</p>
        </div>
        <div className="careOneWrap" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div ref={trackRef} className="careOneTrack">
            {careItems.map((x, idx) => { const tone = toneOf(x.tone); return (
              <div key={idx} className="careOneSlide"><div style={{ background: `linear-gradient(135deg, ${tone.bg}, ${C.surface})`, borderRadius: 18, padding: "16px 18px", border: `1.5px solid ${tone.bd}`, height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 26 }}>{x.emoji}</span><div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>추천 케어</p><p style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 800, color: tone.accent }}>{x.title}</p></div></div>
                <p style={{ margin: "10px 0 0", fontSize: 12, color: C.textBody, lineHeight: 1.6 }}>{x.desc}</p>
              </div></div>
            ); })}
          </div>
          <button type="button" className="careNavBtn left" onClick={(e) => { e.stopPropagation(); prev(); }} disabled={careIdx === 0}>‹</button>
          <button type="button" className="careNavBtn right" onClick={(e) => { e.stopPropagation(); next(); }} disabled={careIdx === careItems.length - 1}>›</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {careItems.map((_, i) => (<button key={i} type="button" onClick={() => goToIdx(i)} style={{ width: i === careIdx ? 18 : 7, height: 7, borderRadius: 999, border: "none", cursor: "pointer", background: i === careIdx ? C.sage : `${C.textMuted}40`, transition: "all .2s ease" }}/>))}
        </div>
      </div>

      {/* 최근 7일 추이 + Baseline 기준선 */}
      <Card>
        <Head emoji="📊" title="최근 7일 추이" sub={`${last7[0]?.d} ~ ${last7[last7.length-1]?.d}`} />
        <div style={{ height: 180 }}>
          <ResponsiveContainer>
            <AreaChart data={last7} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.peach} stopOpacity={0.2}/><stop offset="100%" stopColor={C.peach} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="d" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]}/>
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 12 }}/>
              <ReferenceLine y={BL.stress} stroke={C.peach} strokeDasharray="6 3" strokeOpacity={0.6} label={{ value: `BL ${BL.stress}`, position: "right", fill: C.peach, fontSize: 9 }}/>
              <Area type="monotone" dataKey="stress" stroke={C.peach} strokeWidth={2.5} fill="url(#sg)" dot={{ r: 3, fill: C.peach }} connectNulls name="스트레스"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 0, borderTop: `2px dashed ${C.peach}`, opacity: 0.6 }}/> Baseline ({BL.stress}점)</span>
        </div>
      </Card>

      {/* 빠른 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ background: C.surfacePeach, border: `1px solid ${C.peach}10`, padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textSoft }}>어젯밤 수면</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>
            {today.sleep_h !== null ? today.sleep_h : "—"}<span style={{ fontSize: 12, fontWeight: 400, color: C.textSoft }}>시간</span>
          </p>
          {today.sleep_h !== null && <p style={{ margin: "2px 0 0", fontSize: 11, color: today.sleep_h >= BL.sleep_h - 0.5 ? C.sage : C.coral }}>
            평소 {BL.sleep_h}h 대비 {today.sleep_h >= BL.sleep_h ? "+" : ""}{(today.sleep_h - BL.sleep_h).toFixed(1)}h
          </p>}
        </Card>
        <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}10`, padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textSoft }}>걸음수</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>
            {today.steps !== null ? today.steps.toLocaleString() : "—"}<span style={{ fontSize: 12, fontWeight: 400, color: C.textSoft }}>보</span>
          </p>
          {today.steps !== null && <p style={{ margin: "2px 0 0", fontSize: 11, color: today.steps >= BL.steps * 0.8 ? C.sage : C.coral }}>
            평소({BL.steps.toLocaleString()}보) 대비 {today.steps >= BL.steps ? "+" : ""}{Math.round((today.steps/BL.steps - 1)*100)}%
          </p>}
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// CARE
// ═══════════════════════════════════════════
const CarePage = () => {
  const [section, setSection] = useState("type");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>맞춤 케어</h2><p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMuted }}>56일간 데이터 기반 패턴 분석</p></div>
      <div style={{ display: "flex", gap: 6, background: C.bgWarm, padding: 4, borderRadius: 14 }}>
        {[{ k: "type", l: "나의 유형" }, { k: "condition", l: "좋은 날의 조건" }, { k: "guide", l: "케어 가이드" }].map(t => (
          <button key={t.k} onClick={() => setSection(t.k)} style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 11, fontSize: 12, fontWeight: 600, cursor: "pointer", background: section === t.k ? C.surface : "transparent", color: section === t.k ? C.sage : C.textMuted, boxShadow: section === t.k ? "0 1px 6px rgba(0,0,0,0.06)" : "none" }}>{t.l}</button>
        ))}
      </div>

      {section === "type" && (<>
        <Card style={{ background: `linear-gradient(135deg, ${C.lavenderLight}, ${C.surface})`, border: `1.5px solid ${C.lavender}20`, textAlign: "center", padding: 28 }}>
          <span style={{ fontSize: 44 }}>❤️‍🩹</span>
          <p style={{ margin: "8px 0 2px", fontSize: 13, color: C.textMuted }}>56일간 데이터 분석 결과</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: C.lavender, margin: 0 }}>자율신경 민감형</p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: C.textSoft }}>심박/ANS 축 89.5% · 수면 축 68.4% 이탈</p>
        </Card>
        <AiBubble emoji="🔬"><strong>왜 자율신경 민감형?</strong><br/><br/>56일간 <strong>심박/ANS 축 이탈 89.5%</strong> (1위). bpm, 안정시심박, HRV, nremhr이 baseline 대비 ±1.5σ 벗어난 날이 거의 매일이에요. 수면(68.4%) 2위, 체온(35.1%) 3위, <strong>활동(21.1%)</strong>은 안정적.</AiBubble>
        <Card>
          <Head emoji="📉" title="축별 불안정도" sub="±1.5σ 이상 벗어난 비율"/>
          {[{ axis: "심박/자율신경", score: 89.5, rank: 1, color: C.coral },{ axis: "수면", score: 68.4, rank: 2, color: C.coral },{ axis: "체온", score: 35.1, rank: 3, color: C.amber },{ axis: "활동", score: 21.1, rank: 4, color: C.sage }].map((item, i) => (
            <div key={item.axis} style={{ marginBottom: i < 3 ? 14 : 0 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 22, height: 22, borderRadius: 7, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: item.rank <= 2 ? "#fff" : C.textSoft, background: item.rank <= 2 ? item.color : C.bgWarm }}>{item.rank}</span><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.axis}</span></div><span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.score}%</span></div><Bar2 value={item.score} color={item.color}/></div>
          ))}
        </Card>
        <Card>
          <Head emoji="🕸️" title="안정도 레이더" sub="높을수록 안정적"/>
          <div style={{ height: 200 }}><ResponsiveContainer><RadarChart data={radarData}><PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="axis" tick={{ fill: C.textSoft, fontSize: 12 }}/><PolarRadiusAxis tick={false} axisLine={false} domain={[0,100]}/><Radar dataKey="v" stroke={C.lavender} strokeWidth={2} fill={C.lavender} fillOpacity={0.12} dot={{ r: 4, fill: C.lavender }}/></RadarChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <Head emoji="⚡" title="리스크 트리거 패턴" sub="동시 이탈 조합"/>
          {[{ combo: "수면 + 심박/ANS 동시 이탈", freq: 26, care: "가장 빈번한 리스크 조합" },{ combo: "심박/ANS + 활동 동시 이탈", freq: 10, care: "자율신경 불안정 시 활동도 감소" },{ combo: "3개 축 동시 이탈", freq: 3, care: "가장 위험한 날" }].map((p, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 8, background: C.bgWarm, border: `1px solid ${C.borderSoft}` }}><p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>{p.combo}</p><p style={{ margin: "4px 0 6px", fontSize: 12, color: C.textMuted }}>{p.freq}일 (56일 중)</p><div style={{ padding: 8, borderRadius: 8, background: C.sageLight }}><p style={{ margin: 0, fontSize: 12, color: C.sageDark, fontWeight: 600 }}>💚 {p.care}</p></div></div>
          ))}
        </Card>
      </>)}

      {section === "condition" && (<>
        <AiBubble emoji="📊">56일에서 <strong>스트레스 하위 25% (≤53.6점)</strong>과 <strong>상위 25% (≥62.0점)</strong> 각 14일 비교.</AiBubble>
        <Card>
          <Head emoji="⚖️" title="좋은 날 vs 나쁜 날" sub="스트레스 상/하위 25%"/>
          <div style={{ display: "flex", padding: "0 0 8px", borderBottom: `1px solid ${C.border}` }}><span style={{ flex: 1 }}/><span style={{ width: 80, textAlign: "center", fontSize: 11, fontWeight: 700, color: C.sage }}>😊 좋은 날</span><span style={{ width: 16 }}/><span style={{ width: 80, textAlign: "center", fontSize: 11, fontWeight: 700, color: C.coral }}>😟 나쁜 날</span></div>
          <CompareRow label="스트레스" good="47.3" bad="66.7" unit="점"/>
          <CompareRow label="수면 시간" good="9.6" bad="8.4" unit="h" better="high"/>
          <CompareRow label="안정시 심박" good="59.1" bad="59.7" unit="bpm"/>
          <CompareRow label="걸음수" good="9,330" bad="8,562" unit="보" better="high"/>
          <CompareRow label="수면 효율" good="93.2" bad="92.1" unit="%" better="high"/>
          <CompareRow label="고강도 활동" good="34.9" bad="27.6" unit="분" better="high"/>
        </Card>
        <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}18` }}>
          <Head emoji="🌱" title="회복 프로파일"/>
          <div style={{ textAlign: "center", padding: "8px 0 12px" }}><p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>리스크 이벤트(62+점) 후 평균 회복</p><p style={{ margin: "6px 0", fontSize: 40, fontWeight: 700, color: C.amber }}>2.9<span style={{ fontSize: 16, fontWeight: 400, color: C.textSoft }}>일</span></p><Pill color={C.amber}>보통 회복형</Pill></div>
          <AiBubble emoji="📊">14번 리스크 중 10번 회복 추적. 빠르면 <strong>1일</strong>, 느리면 <strong>6일</strong>. 충분한 수면 후 회복이 빠른 패턴.</AiBubble>
        </Card>
        <Card>
          <Head emoji="📈" title="수면 → 다음날 스트레스"/>
          <div style={{ height: 170 }}><ResponsiveContainer><BarChart data={[{range:"~6h",stress:60.0},{range:"6~7h",stress:44.5},{range:"7~8h",stress:58.7},{range:"8~9h",stress:57.1},{range:"9h~",stress:59.1}]} margin={{top:5,right:5,left:-25,bottom:0}}><CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/><XAxis dataKey="range" tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/><YAxis tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} domain={[0,100]}/><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,fontSize:12}}/><Bar dataKey="stress" radius={[8,8,0,0]} name="다음날 스트레스">{[C.coral,C.sage,C.amber,C.amber,C.amber].map((c,i)=>(<Cell key={i} fill={c}/>))}</Bar></BarChart></ResponsiveContainer></div>
        </Card>
      </>)}

      {section === "guide" && (<>
        <AiBubble emoji="💚"><strong>자율신경 민감형</strong> 맞춤 케어 가이드. 심박/ANS 안정화가 핵심.</AiBubble>
        <Card style={{ borderLeft: `4px solid ${C.lavender}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Pill color={C.lavender}>최우선</Pill><span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🫁 자율신경 안정화</span></div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>심박/ANS 축 <strong>89.5% 이탈</strong>. 호흡과 이완 기법이 핵심.</p>
          {[{title:"4-7-8 호흡법 (하루 2회)",why:"RHR 좋은 날 59.1 vs 나쁜 날 59.7bpm",ev:"부교감신경 활성화 → HRV 개선 (Shaffer & Ginsberg, 2017)"},{title:"점진적 근이완법 (PMR)",why:"ANS 축 89.5% 이탈 — 가장 시급한 영역",ev:"PMR → 코르티솔 감소, RMSSD 개선 (meta-analysis, N=1,200+)"}].map((x,i)=>(
            <div key={i} style={{padding:14,borderRadius:14,marginBottom:10,background:C.bgWarm,border:`1px solid ${C.borderSoft}`}}><p style={{margin:0,fontSize:14,fontWeight:600,color:C.text}}>{x.title}</p><p style={{margin:"6px 0",fontSize:12,color:C.lavender,lineHeight:1.5}}>📊 {x.why}</p><p style={{margin:0,fontSize:11,color:C.textMuted,lineHeight:1.5}}>📚 {x.ev}</p></div>
          ))}
        </Card>
        <Card style={{ borderLeft: `4px solid ${C.blue}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Pill color={C.blue}>중요</Pill><span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🌙 수면 관리</span></div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>수면 축 <strong>68.4%</strong> 이탈. Baseline 수면 {BL.sleep_h}시간인 장시간 수면자.</p>
          {[{title:"매일 9시간 이상 수면",why:"좋은 날 9.6h vs 나쁜 날 8.4h — 1.2h 차이 = 스트레스 19점",ev:"개인 baseline 대비 수면 부족 시 RHR↑ RMSSD↓ (Sleep Medicine)"},{title:"취침/기상 시간 일정하게",why:"수면 중간점 변동 → 다음날 스트레스 상승 관찰",ev:"수면 규칙성 > 수면 시간의 사망률 예측력 (UK Biobank, N=60,000+)"}].map((x,i)=>(
            <div key={i} style={{padding:14,borderRadius:14,marginBottom:10,background:C.bgWarm,border:`1px solid ${C.borderSoft}`}}><p style={{margin:0,fontSize:14,fontWeight:600,color:C.text}}>{x.title}</p><p style={{margin:"6px 0",fontSize:12,color:C.blue,lineHeight:1.5}}>📊 {x.why}</p><p style={{margin:0,fontSize:11,color:C.textMuted,lineHeight:1.5}}>📚 {x.ev}</p></div>
          ))}
        </Card>
        <Card style={{ borderLeft: `4px solid ${C.sage}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Pill color={C.sage}>보조</Pill><span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🚶 활동 관리</span></div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>활동 축 <strong>21.1%</strong>로 안정적. 좋은 날 9,330보 vs 나쁜 날 8,562보.</p>
          {[{title:"하루 9,000보 이상",why:"baseline 9,465보. 유지가 핵심",ev:"7,000보/일 시 우울 위험 31% 감소 (JAMA, N=96,173)"},{title:"고강도 활동 30분+",why:"좋은 날 34.9분 vs 나쁜 날 27.6분",ev:"중강도 이상 운동 → HRV 개선 (Frontiers in Psychology)"}].map((x,i)=>(
            <div key={i} style={{padding:14,borderRadius:14,marginBottom:10,background:C.bgWarm,border:`1px solid ${C.borderSoft}`}}><p style={{margin:0,fontSize:14,fontWeight:600,color:C.text}}>{x.title}</p><p style={{margin:"6px 0",fontSize:12,color:C.sage,lineHeight:1.5}}>📊 {x.why}</p><p style={{margin:0,fontSize:11,color:C.textMuted,lineHeight:1.5}}>📚 {x.ev}</p></div>
          ))}
        </Card>
      </>)}
    </div>
  );
};

// ═══════════════════════════════════════════
// JOURNAL
// ═══════════════════════════════════════════
const JournalPage = ({ dayIdx }) => {
  const today = ALL_DAYS[dayIdx];
  const [text, setText] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [mood, setMood] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>오늘의 기록</h2><p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMuted }}>2021년 {today.d}</p></div>
      <Card>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: C.textBody }}>지금 기분이 어떤가요?</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{e:"😊",l:"좋음"},{e:"😐",l:"보통"},{e:"😔",l:"우울"},{e:"😰",l:"불안"},{e:"😤",l:"짜증"}].map(m => (
            <button key={m.e} onClick={() => setMood(m.e)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 12px", borderRadius: 14, cursor: "pointer", border: `1.5px solid ${mood === m.e ? C.peach : C.border}`, background: mood === m.e ? C.surfacePeach : C.surface }}>
              <span style={{ fontSize: 20 }}>{m.e}</span><span style={{ fontSize: 10, color: mood === m.e ? C.peach : C.textMuted, fontWeight: 600 }}>{m.l}</span>
            </button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="오늘 있었던 일을 자유롭게 적어보세요..." style={{ width: "100%", minHeight: 110, background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, color: C.text, fontSize: 14, resize: "vertical", lineHeight: 1.7, outline: "none", boxSizing: "border-box" }}/>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={() => setShowAI(true)} style={{ background: C.sage, color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>저장 & 분석</button>
        </div>
      </Card>
      {showAI && (
        <AiBubble emoji="🤗">
          오늘 기록에서 <strong style={{ color: C.amber }}>"다 망했어"</strong>라는 표현이 보여요.<br/><br/>
          데이터를 보면 스트레스 62점 이상이었던 <strong>14번 중 10번은 평균 2.9일 내 회복</strong>했어요.<br/><br/>
          정말 "전부" 망한 건지, <strong>오늘 하루가 힘들었던 건지</strong> 한번 생각해봐요. 🌿
        </AiBubble>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// REPORT (탭 선택식 Baseline 차트)
// ═══════════════════════════════════════════
const CHART_TABS = [
  { key: "stress", label: "스트레스", dataKey: "stress", color: C.peach, bl: BL.stress, avg: 57.4, emoji: "🔥", desc: "낮을수록 좋음", trend: "1주 51.3 → 8주 60.1 (상승 추세)" },
  { key: "dep", label: "우울경향", dataKey: "dep", color: C.blue, bl: BL.dep, avg: 45.2, emoji: "💙", desc: "낮을수록 좋음", trend: "4주 39.2 → 8주 48.3 (최근 상승 ⚠)" },
  { key: "sleep", label: "수면건강", dataKey: "sleep", color: C.sage, bl: BL.sleepH, avg: 52.0, emoji: "🌙", desc: "높을수록 좋음", trend: "6주 54.0 → 8주 49.2 (하락 추세)" },
];

const ReportPage = () => {
  const [chartTab, setChartTab] = useState("stress");
  const tab = CHART_TABS.find(t => t.key === chartTab);
  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>전체 리포트</h2>
    <AiBubble emoji="📋">
      <strong>56일간 종합:</strong> 스트레스 평균 57.4점, 우울경향 45.2점, 수면건강 52.0점.
      <strong style={{ color: C.lavender }}> 자율신경 민감형</strong>. 우울경향이 <strong>42.3→48.3 상승 추세</strong>라 주의 필요.
    </AiBubble>

    <Card>
      <Head emoji="📈" title="8주 추이" sub="탭을 눌러 지표별로 확인하세요"/>
      {/* 탭 선택 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: C.bgWarm, padding: 4, borderRadius: 14 }}>
        {CHART_TABS.map(t => (
          <button key={t.key} onClick={() => setChartTab(t.key)} style={{
            flex: 1, padding: "8px 4px", border: "none", borderRadius: 11, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: chartTab === t.key ? C.surface : "transparent",
            color: chartTab === t.key ? t.color : C.textMuted,
            boxShadow: chartTab === t.key ? "0 1px 6px rgba(0,0,0,0.06)" : "none",
            transition: "all .2s ease",
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>
      {/* 차트 */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={WEEKLY_AVG} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad_${tab.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tab.color} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={tab.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="w" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[20, 80]}/>
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 11 }}/>
            <ReferenceLine y={tab.bl} stroke={tab.color} strokeDasharray="6 3" strokeOpacity={0.5} label={{ value: `BL ${tab.bl}`, position: "insideTopRight", fill: tab.color, fontSize: 10, fontWeight: 600 }}/>
            <Area type="monotone" dataKey={tab.dataKey} stroke={tab.color} strokeWidth={2.5} fill={`url(#grad_${tab.key})`} dot={{ r: 4, fill: tab.color, stroke: "#fff", strokeWidth: 2 }} name={tab.label}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 3, borderRadius: 2, background: tab.color }}/>{tab.label}</span>
        <span style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 14, height: 0, borderTop: `1.5px dashed ${tab.color}`, opacity: 0.5 }}/>Baseline</span>
      </div>
      {/* 요약 박스 */}
      <div style={{ marginTop: 10, padding: "10px 14px", background: `${tab.color}08`, borderRadius: 12, border: `1px solid ${tab.color}15` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: tab.color }}>{tab.emoji} {tab.label}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{tab.desc}</span>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>56일 평균</span><p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{tab.avg}</p></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>Baseline</span><p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tab.color }}>{tab.bl}</p></div>
          <div><span style={{ fontSize: 10, color: C.textMuted }}>차이</span><p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tab.avg > tab.bl ? (tab.key === "sleep" ? C.sage : C.coral) : (tab.key === "sleep" ? C.coral : C.sage) }}>{tab.avg > tab.bl ? "+" : ""}{(tab.avg - tab.bl).toFixed(1)}</p></div>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: C.textSoft }}>{tab.trend}</p>
      </div>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[{l:"평균 스트레스",v:"57.4",u:"/100",bl:`BL ${BL.stress}`},{l:"평균 수면",v:"9.1",u:"시간",bl:`BL ${BL.sleep_h}h`},{l:"회복 속도",v:"2.9",u:"일",bl:""},{l:"안정시 심박",v:"59.3",u:"bpm",bl:`BL ${BL.rhr}`}].map(m => (
        <Card key={m.l} style={{ padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>{m.l}</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>{m.v}<span style={{ fontSize: 12, color: C.textMuted }}>{m.u}</span></p>
          {m.bl && <p style={{ margin: "2px 0 0", fontSize: 10, color: C.textMuted }}>{m.bl}</p>}
        </Card>
      ))}
    </div>

    <Card>
      <Head emoji="🌙" title="수면 구조 (추정)"/>
      {[{stage:"깊은 수면",pct:20.5,ok:true,color:C.blue},{stage:"REM 수면",pct:21.9,ok:true,color:C.lavender},{stage:"얕은 수면",pct:49.7,ok:true,color:C.teal},{stage:"깨어있음",pct:7.9,ok:true,color:C.amber}].map(s => (
        <div key={s.stage} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: C.textBody }}>{s.stage}</span><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.pct}%</span><span style={{ fontSize: 10, color: C.sage }}>✓</span></div></div><Bar2 value={s.pct} color={s.color}/></div>
      ))}
    </Card>

    <Card>
      <Head emoji="🚨" title="주요 발견"/>
      {[
        {text:"심박/ANS 축 89.5% 이탈 — 56일 중 51일",color:C.coral},
        {text:"우울경향 4주간 42.3→48.3 상승 추세 ⚠",color:C.coral},
        {text:"수면+심박 동시 이탈 26일 — 최빈 리스크 트리거",color:C.amber},
        {text:"7/7 스트레스 77.4점 최고 (RMSSD 80.2 최저)",color:C.amber},
      ].map((f,i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 11, borderRadius: 12, marginBottom: 8, background: `${f.color}06`, border: `1px solid ${f.color}12` }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: f.color, flexShrink: 0 }}/><span style={{ fontSize: 12, color: C.textBody }}>{f.text}</span>
        </div>
      ))}
    </Card>

    <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}15` }}>
      <Head emoji="💚" title="종합 케어"/>
      <AiBubble emoji="🌿">
        <strong>1순위:</strong> 호흡/이완 (ANS 89.5%)<br/>
        <strong>2순위:</strong> 수면 9h+ (BL {BL.sleep_h}h)<br/>
        <strong>3순위:</strong> 9,000보 + 고강도 30분<br/><br/>
        <strong style={{color:C.coral}}>⚠ 우울경향 상승 추세</strong> — 전문가 상담 권유.
      </AiBubble>
    </Card>
  </div>
  );
};

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
export default function MindPulseDemo() {
  const [page, setPage] = useState("home");
  const [dayIdx, setDayIdx] = useState(ALL_DAYS.length - 1);
  const pages = { home: <HomePage dayIdx={dayIdx} setDayIdx={setDayIdx} goTo={setPage}/>, care: <CarePage/>, journal: <JournalPage dayIdx={dayIdx}/>, report: <ReportPage/> };
  const nav = [{k:"home",l:"홈",i:<Ico.Home/>},{k:"care",l:"케어",i:<Ico.Care/>},{k:"journal",l:"기록",i:<Ico.Pen/>},{k:"report",l:"리포트",i:<Ico.Doc/>}];

  return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard Variable', -apple-system, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        *{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg}}::-webkit-scrollbar{width:0}textarea::placeholder{color:${C.textMuted}}button{font-family:inherit}button:active{transform:scale(0.97)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .tipWrap{position:relative;display:inline-flex;align-items:center;justify-content:center;cursor:help;color:${C.textMuted}}
        .tipText{position:absolute;left:50%;bottom:140%;transform:translateX(-50%);width:max-content;max-width:280px;white-space:normal;padding:10px 12px;border-radius:12px;font-size:12px;line-height:1.45;background:rgba(0,0,0,0.86);color:#fff;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s ease;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.18)}
        .tipWrap:hover .tipText,.tipWrap:focus .tipText,.tipWrap:focus-within .tipText{opacity:1;visibility:visible;transform:translateX(-50%) translateY(-2px)}
        .tipText::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:rgba(0,0,0,0.86)}
        .careOneWrap{position:relative;overflow:hidden;border-radius:18px;touch-action:pan-y;user-select:none}
        .careOneTrack{display:flex;width:100%;transform:translate3d(0,0,0)}.careOneSlide{flex:0 0 100%}
        .careNavBtn{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:12px;border:1px solid ${C.border};background:${C.surface};color:${C.textSoft};cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.08);user-select:none}
        .careNavBtn.left{left:10px}.careNavBtn.right{right:10px}
        .careNavBtn:active{transform:translateY(-50%) scale(0.97)}.careNavBtn:disabled{opacity:0.35;cursor:not-allowed}
        input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:${C.border};outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:${C.sage};cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.15);border:3px solid #fff}
        input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${C.sage};cursor:pointer;border:3px solid #fff}
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 10px", position: "sticky", top: 0, zIndex: 100, background: `${C.bg}ee`, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: `linear-gradient(135deg, ${C.sage}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 10px ${C.sage}30` }}><span style={{ fontSize: 18 }}>🌿</span></div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>MindMap</span>
        </div>
      </div>

      <div style={{ padding: "6px 16px 100px" }}>{pages[page]}</div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, padding: "6px 8px 22px", background: `${C.bg}f8`, backdropFilter: "blur(16px)", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", zIndex: 100 }}>
        {nav.map(n => (
          <button key={n.k} onClick={() => setPage(n.k)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", color: page === n.k ? C.sage : C.textMuted, position: "relative" }}>
            {n.i}<span style={{ fontSize: 10, fontWeight: page === n.k ? 700 : 400 }}>{n.l}</span>
            {page === n.k && <span style={{ position: "absolute", top: -6, width: 20, height: 3, borderRadius: 2, background: C.sage }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
