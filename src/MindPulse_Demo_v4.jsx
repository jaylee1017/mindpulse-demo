
import { CiCircleInfo } from "react-icons/ci";
import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   🌿 MindPulse v4 — 전시회 데모 버전
   
   핵심 전제:
   - LifeSnaps 71명 데이터 중 1명의 실제 데이터를 사용
   - 실시간 추적 X, 실천 효과 측정 X
   - "이미 수집된 데이터에서 발견한 패턴" 기반 케어
   
   케어 전략:
   1. 좋았던 날 vs 나빴던 날 비교 → "어떤 조건에서 좋아지는지"
   2. 유형 분류 → 근거 기반 케어 가이드
   3. 회복 패턴 발견 → 이 사람만의 회복 조건
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

// ─── 실제 데이터 기반 샘플 (621e2e8e... 사용자의 패턴 반영) ───
const weeklyScores = [
  { d: "6/7", stress: 50, sleep: 53, dep: 45 },
  { d: "6/8", stress: 66, sleep: 29, dep: 48 },
  { d: "6/9", stress: 58, sleep: 57, dep: 50 },
  { d: "6/10", stress: 45, sleep: null, dep: 52 },
  { d: "6/11", stress: 45, sleep: null, dep: 51 },
  { d: "6/12", stress: 46, sleep: null, dep: 52 },
  { d: "6/13", stress: 49, sleep: null, dep: 58 },
];

const goodVsBad = {
  good: { stress: 38, sleep_h: 9.2, rhr: 60, steps: 9400, sed: 660, eff: 94 },
  bad: { stress: 68, sleep_h: 5.9, rhr: 72, steps: 4200, sed: 1240, eff: 82 },
};

const monthTrend = [
  { w: "1주", stress: 52, sleep: 48, dep: 47 },
  { w: "2주", stress: 48, sleep: 55, dep: 45 },
  { w: "3주", stress: 56, sleep: 42, dep: 53 },
  { w: "4주", stress: 44, sleep: 60, dep: 41 },
];

const radarData = [
  { axis: "수면", v: 38 }, { axis: "심박", v: 75 },
  { axis: "활동", v: 55 }, { axis: "체온", v: 82 }, { axis: "리듬", v: 60 },
];

// ─── Icons ───
const Ico = {
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Care: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Chart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-6.22-8.56"/><path d="M21 3v9h-9"/></svg>,
  Pen: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Doc: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// ─── Shared Components ───
const AiBubble = ({ children, emoji = "🌿" }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: "fadeUp 0.4s ease" }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.sage}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 2px 10px ${C.sage}30` }}>{emoji}</div>
    <div style={{ flex: 1, background: C.surface, borderRadius: "4px 18px 18px 18px", padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)", fontSize: 13, color: C.textBody, lineHeight: 1.75 }}>{children}</div>
  </div>
);

const Tip = ({ content, children }) => (
  <span className="tipWrap" tabIndex={0} aria-label="설명 보기">
    {children}
    <span className="tipText" role="tooltip">
      {content}
    </span>
  </span>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.03)", ...style }}>{children}</div>
);

const Pill = ({ children, color = C.sage, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg || `${color}15` }}>{children}</span>
);

const ScoreCircle = ({ score, size = 76, color, label }) => {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ;
  const emoji = score <= 30 ? "😊" : score <= 50 ? "🙂" : score <= 70 ? "😐" : "😟";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={7}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size * 0.18 }}>{emoji}</span>
          <span style={{ fontSize: size * 0.24, fontWeight: 700, color: C.text }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.textSoft }}>{label}</span>
    </div>
  );
};

const Bar2 = ({ value, color, h = 6 }) => (
  <div style={{ width: "100%", height: h, borderRadius: h, background: `${color}18`, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", borderRadius: h, background: color, transition: "width 0.8s ease" }}/>
  </div>
);

const Head = ({ emoji, title, sub, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {emoji && <span style={{ fontSize: 17 }}>{emoji}</span>}
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text }}>{title}</h3>
      </div>
      {sub && <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>{sub}</p>}
    </div>
    {right}
  </div>
);

// Compare Row for good vs bad
const CompareRow = ({ label, good, bad, unit = "", better = "low" }) => {
  const goodBetter = better === "low" ? parseFloat(good) < parseFloat(bad) : parseFloat(good) > parseFloat(bad);
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
      <span style={{ flex: 1, fontSize: 13, color: C.textBody }}>{label}</span>
      <span style={{ width: 80, textAlign: "center", fontSize: 13, fontWeight: 700, color: goodBetter ? C.sage : C.textSoft }}>{good}{unit}</span>
      <span style={{ width: 16, textAlign: "center", fontSize: 10, color: C.textMuted }}>vs</span>
      <span style={{ width: 80, textAlign: "center", fontSize: 13, fontWeight: 700, color: !goodBetter ? C.coral : C.textSoft }}>{bad}{unit}</span>
    </div>
  );
};


// ═══════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════
const HomePage = ({ goTo }) => {
  // ✅ 추천 케어 데이터
  const careItems = [
    {
      emoji: "🌙",
      title: "규칙적인 수면 습관",
      desc: "취침/기상 시간을 고정하면, 수면 민감형의 스트레스 변동이 크게 줄어듭니다.",
      tone: "lavender",
    },
    {
      emoji: "🚶",
      title: "운동량 늘리기",
      desc: "가벼운 걷기(7,000보 이상)를 확보하면 좌식 시간 리스크를 낮출 수 있어요.",
      tone: "sage",
    },
    {
      emoji: "🫁",
      title: "호흡·이완 루틴",
      desc: "취침 전 5분 호흡으로 심박을 안정화하면 다음날 컨디션 회복이 빨라집니다.",
      tone: "teal",
    },
  ];

  // ✅ 톤(색) 매핑
  const toneOf = (t) =>
    t === "lavender"
      ? { bg: C.surfaceLavender, bd: `${C.lavender}22`, accent: C.lavender }
      : t === "teal"
      ? { bg: C.tealLight, bd: `${C.teal}22`, accent: C.teal }
      : { bg: C.surfaceSage, bd: `${C.sage}22`, accent: C.sage };

  // ✅ 한 장씩 넘기는 캐러셀 상태
  const [careIdx, setCareIdx] = useState(0);

  // ✅ 스와이프/드래그 구현용 ref
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dxRef = useRef(0);

  const clampIdx = (i) => Math.max(0, Math.min(i, careItems.length - 1));
  const goToIdx = (i) => setCareIdx(clampIdx(i));
  const next = () => goToIdx(careIdx + 1);
  const prev = () => goToIdx(careIdx - 1);

  // ✅ 트랙 transform 적용
  const applyTransform = (idx, extraPx = 0, withTransition = true) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition ? "transform 260ms ease" : "none";
    el.style.transform = `translate3d(calc(${-idx * 100}% + ${extraPx}px), 0, 0)`;
  };

  // idx 바뀔 때마다 위치 반영
  useEffect(() => {
    applyTransform(careIdx, 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careIdx]);

  // ✅ Pointer Events: 마우스/터치 통합 스와이프
  const onPointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    dxRef.current = 0;

    e.currentTarget.setPointerCapture?.(e.pointerId);
    applyTransform(careIdx, 0, false);
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dxRef.current = dx;

    // 양 끝에서 저항(고무줄 느낌)
    let damped = dx;
    if ((careIdx === 0 && dx > 0) || (careIdx === careItems.length - 1 && dx < 0)) {
      damped = dx * 0.35;
    }

    applyTransform(careIdx, damped, false);
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const dx = dxRef.current;
    const THRESHOLD = 60;

    if (dx <= -THRESHOLD && careIdx < careItems.length - 1) {
      setCareIdx((i) => i + 1);
    } else if (dx >= THRESHOLD && careIdx > 0) {
      setCareIdx((i) => i - 1);
    } else {
      applyTransform(careIdx, 0, true);
    }
  };

  const onPointerUp = () => endDrag();
  const onPointerCancel = () => endDrag();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>2021년 6월 13일 · 사용자 #A01</p>
        <h2 style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, color: C.text }}>오늘의 건강 상태</h2>
      </div>

      {/* 3대 점수 + 툴팁 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "space-around" }}>
          <ScoreCircle score={49} color={C.peach} label="스트레스" />
          <ScoreCircle score={58} color={C.blue} label="우울경향" />
          <ScoreCircle score={53} color={C.sage} label="수면건강" />
        </div>

        <Tip
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <strong>스트레스 점수</strong>: 심박/수면/활동/체온을 종합해 0~100으로 계산. <strong>낮을수록 좋음</strong>.
              </div>
              <div>
                <strong>우울경향</strong>: 회복/활동/리듬/수면 패턴 기반의 “경향” 지표. <strong>진단이 아님</strong>.
              </div>
              <div>
                <strong>수면건강</strong>: 수면 시간·효율·규칙성 등을 반영. 점수가 낮으면 “부족/불안정” 가능성이 큼.
              </div>
            </div>
          }
        >
          <button
            type="button"
            style={{
              all: "unset",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 10,
              background: C.bgWarm,
              border: `1px solid ${C.border}`,
              cursor: "help",
            }}
            aria-label="점수 설명"
          >
            <CiCircleInfo size={18} />
          </button>
        </Tip>
      </div>

      <AiBubble emoji="💡">
        <Head emoji="📝" title="일간 리포트" />
        <strong>스트레스 49점</strong> — 보통 수준이에요. 심박수, 수면, 활동량, 체온을 종합해서 0~100으로 계산한 거예요.
        숫자가 <strong>낮을수록 좋은</strong> 거예요.
        <br />
        <br />
        <strong>수면건강 53점</strong>은 "보통 이하"인데, 수면 시간이 들쭉날쭉한 게 주요 원인이에요.
        어제에 비하면 스트레스 지수는 낮아졌지만 우울 점수는 높아졌어요.
        이건 수면의 질이 안좋아서 그래요. 
      </AiBubble>

      {/* ✅ 추천 케어 (한 장씩 + 스와이프/드래그) */}
      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted, fontWeight: 600 }}>오늘 제안하는 케어</p>
          <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>
            {careIdx + 1}/{careItems.length}
          </p>
        </div>

        <div
          className="careOneWrap"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div ref={trackRef} className="careOneTrack">
            {careItems.map((x, idx) => {
              const tone = toneOf(x.tone);
              return (
                <div key={idx} className="careOneSlide">
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${tone.bg}, ${C.surface})`,
                      borderRadius: 18,
                      padding: "16px 18px",
                      border: `1.5px solid ${tone.bd}`,
                      height: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{x.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>추천 케어</p>
                        <p style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 800, color: tone.accent }}>
                          {x.title}
                        </p>
                      </div>
                    </div>

                    <p style={{ margin: "10px 0 0", fontSize: 12, color: C.textBody, lineHeight: 1.6 }}>{x.desc}</p>

                    <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: tone.accent,
                          background: `${tone.accent}12`,
                          padding: "5px 10px",
                          borderRadius: 999,
                        }}
                      >
                        오늘의 우선순위
                      </span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>← 드래그/스와이프로 넘기기 →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 버튼(드래그 불가 환경 대비) */}
          <button
            type="button"
            className="careNavBtn left"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            disabled={careIdx === 0}
            aria-label="이전 케어"
          >
            ‹
          </button>
          <button
            type="button"
            className="careNavBtn right"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            disabled={careIdx === careItems.length - 1}
            aria-label="다음 케어"
          >
            ›
          </button>
        </div>

        {/* 도트 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {careItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToIdx(i)}
              style={{
                width: i === careIdx ? 18 : 7,
                height: 7,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: i === careIdx ? C.sage : `${C.textMuted}40`,
                transition: "all .2s ease",
              }}
              aria-label={`케어 ${i + 1}로 이동`}
            />
          ))}
        </div>
      </div>

      {/* 주간 추이 */}
      <Card>
        <Head emoji="📊" title="최근 7일 추이" />
        <div style={{ height: 170 }}>
          <ResponsiveContainer>
            <AreaChart data={weeklyScores} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.peach} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={C.peach} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="d" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="stress"
                stroke={C.peach}
                strokeWidth={2.5}
                fill="url(#sg)"
                dot={{ r: 3, fill: C.peach }}
                connectNulls
                name="스트레스"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 11, color: C.textMuted, textAlign: "center" }}>
          6/8에 스트레스 66점 — 수면 5.9시간이었던 날
        </p>
      </Card>

      {/* 빠른 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ background: C.surfacePeach, border: `1px solid ${C.peach}10`, padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textSoft }}>어젯밤 수면</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>
            5.9<span style={{ fontSize: 12, fontWeight: 400, color: C.textSoft }}>시간</span>
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.coral }}>평소 9.6시간 대비 −3.7h</p>
        </Card>
        <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}10`, padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textSoft }}>걸음수</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>
            8,872<span style={{ fontSize: 12, fontWeight: 400, color: C.textSoft }}>보</span>
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.sage }}>평소(9,465보)와 비슷</p>
        </Card>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════
// CARE — 데이터 기반 맞춤 케어
// ═══════════════════════════════════════════
const CarePage = () => {
  const [section, setSection] = useState("type");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>맞춤 케어</h2>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMuted }}>데이터에서 발견한 패턴 기반 개인 맞춤 관리</p>
      </div>

      <div style={{ display: "flex", gap: 6, background: C.bgWarm, padding: 4, borderRadius: 14 }}>
        {[{ k: "type", l: "나의 유형" }, { k: "condition", l: "좋은 날의 조건" }, { k: "guide", l: "케어 가이드" }].map(t => (
          <button key={t.k} onClick={() => setSection(t.k)} style={{
            flex: 1, padding: "9px 4px", border: "none", borderRadius: 11, fontSize: 12, fontWeight: 600,
            cursor: "pointer", background: section === t.k ? C.surface : "transparent",
            color: section === t.k ? C.sage : C.textMuted,
            boxShadow: section === t.k ? "0 1px 6px rgba(0,0,0,0.06)" : "none",
          }}>{t.l}</button>
        ))}
      </div>

      {/* ─── 나의 유형 ─── */}
      {section === "type" && (<>
        <Card style={{ background: `linear-gradient(135deg, ${C.lavenderLight}, ${C.surface})`, border: `1.5px solid ${C.lavender}20`, textAlign: "center", padding: 28 }}>
          <span style={{ fontSize: 44 }}>🌙</span>
          <p style={{ margin: "8px 0 2px", fontSize: 13, color: C.textMuted }}>데이터 분석 결과, 이 사용자의 유형은</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: C.lavender, margin: 0 }}>수면 민감형</p>
        </Card>

        <AiBubble emoji="🔬">
          <strong>왜 수면 민감형인가요?</strong><br/><br/>
          이 사용자의 104일간 데이터를 분석한 결과, <strong>수면 축의 이탈 빈도가 72%</strong>로 4개 축(수면/심박/활동/체온) 중 가장 높았어요.<br/><br/>
          쉽게 말하면, 수면 시간이나 수면의 질이 <strong>평소와 다른 날이 전체의 72%</strong>나 된다는 뜻이에요.
          이건 다른 축(심박 28%, 활동 45%, 체온 15%)에 비해 압도적으로 높은 수치예요.
        </AiBubble>

        <Card>
          <Head emoji="📉" title="축별 불안정도" sub="평소 대비 ±1.5σ 이상 벗어난 비율"/>
          {[
            { axis: "수면", score: 72, rank: 1, color: C.coral },
            { axis: "활동", score: 45, rank: 2, color: C.amber },
            { axis: "심박/자율신경", score: 28, rank: 3, color: C.sage },
            { axis: "체온", score: 15, rank: 4, color: C.sage },
          ].map((item, i) => (
            <div key={item.axis} style={{ marginBottom: i < 3 ? 14 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: item.rank <= 2 ? "#fff" : C.textSoft, background: item.rank <= 2 ? item.color : C.bgWarm }}>{item.rank}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.axis}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.score}%</span>
              </div>
              <Bar2 value={item.score} color={item.color}/>
            </div>
          ))}
        </Card>

        <Card>
          <Head emoji="🕸️" title="안정도 레이더" sub="높을수록 안정적"/>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="axis" tick={{ fill: C.textSoft, fontSize: 12 }}/>
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0,100]}/>
                <Radar dataKey="v" stroke={C.lavender} strokeWidth={2} fill={C.lavender} fillOpacity={0.12} dot={{ r: 4, fill: C.lavender }}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 트리거 패턴과 케어 연결 */}
        <Card>
          <Head emoji="⚡" title="이 사용자의 리스크 트리거" sub="자주 반복된 위험 조합"/>
          {[
            { combo: "수면 부족 + 안정시 심박 상승", freq: 14, care: "수면 시간 확보가 최우선" },
            { combo: "활동량 감소 + 좌식 시간 증가", freq: 9, care: "가벼운 산책이라도 도움" },
          ].map((p, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 8, background: C.bgWarm, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>{p.combo}</p>
              <p style={{ margin: "4px 0 6px", fontSize: 12, color: C.textMuted }}>{p.freq}회 반복 관찰</p>
              <div style={{ padding: 8, borderRadius: 8, background: C.sageLight }}>
                <p style={{ margin: 0, fontSize: 12, color: C.sageDark, fontWeight: 600 }}>💚 케어 방향: {p.care}</p>
              </div>
            </div>
          ))}
        </Card>
      </>)}

      {/* ─── 좋은 날의 조건 ─── */}
      {section === "condition" && (<>
        <AiBubble emoji="📊">
          이 사용자의 104일 데이터에서 <strong>스트레스가 낮았던 상위 25% 날</strong>과 <strong>높았던 하위 25% 날</strong>을 비교했어요.
          어떤 조건에서 컨디션이 좋았는지 한눈에 볼 수 있어요.
        </AiBubble>

        <Card>
          <Head emoji="⚖️" title="좋은 날 vs 나쁜 날" sub="스트레스 상/하위 25% 비교"/>
          <div style={{ display: "flex", padding: "0 0 8px", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ flex: 1 }}/>
            <span style={{ width: 80, textAlign: "center", fontSize: 11, fontWeight: 700, color: C.sage }}>😊 좋은 날</span>
            <span style={{ width: 16 }}/>
            <span style={{ width: 80, textAlign: "center", fontSize: 11, fontWeight: 700, color: C.coral }}>😟 나쁜 날</span>
          </div>
          <CompareRow label="스트레스 점수" good="38" bad="68" unit="점"/>
          <CompareRow label="수면 시간" good="9.2" bad="5.9" unit="h" better="high"/>
          <CompareRow label="안정시 심박" good="60" bad="72" unit="bpm"/>
          <CompareRow label="걸음수" good="9,400" bad="4,200" unit="보" better="high"/>
          <CompareRow label="좌식 시간" good="660" bad="1,240" unit="분"/>
          <CompareRow label="수면 효율" good="94" bad="82" unit="%" better="high"/>
        </Card>

        <AiBubble emoji="🔍">
          데이터가 말하는 <strong>상태가 좋은 날의 조건</strong>:<br/><br/>
          수면 <strong>8시간 이상</strong> (평균 9.2h)<br/>
          안정시 심박수 <strong>65bpm 이하</strong><br/>
          걸음수 <strong>7,000보 이상</strong><br/>
          좌식 시간 <strong>700분(약 12시간) 이하</strong><br/><br/>
          반대로, 수면이 6시간 아래로 떨어지면 다음 날 스트레스가 급격히 올라가는 패턴이 반복됐어요.
        </AiBubble>

        {/* 회복 프로파일 */}
        <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}18` }}>
          <Head emoji="🌱" title="회복 프로파일"/>
          <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>리스크 이벤트 후 평균 회복 시간</p>
            <p style={{ margin: "6px 0", fontSize: 40, fontWeight: 700, color: C.sage }}>1.6<span style={{ fontSize: 16, fontWeight: 400, color: C.textSoft }}>일</span></p>
            <Pill color={C.sage}>빠른 회복형</Pill>
          </div>
          <AiBubble emoji="💪">
            컨디션이 흔들려도 <strong>평균 1~2일이면 정상 범위로 복귀</strong>해요.
            특히 수면을 충분히 취한 날 다음에는 <strong>대부분 회복</strong>이 이뤄졌어요.
            이것도 수면 민감형의 특징이에요  <br/>수면만 확보하면 빠르게 좋아져요.
          </AiBubble>
        </Card>

        {/* 수면 시간과 다음날 스트레스 상관 */}
        <Card>
          <Head emoji="📈" title="수면 시간 → 다음날 스트레스" sub="수면이 줄면 스트레스가 어떻게 변하는지"/>
          <div style={{ height: 170 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { range: "~6h", stress: 68, fill: C.coral },
                { range: "6~7h", stress: 58, fill: C.amber },
                { range: "7~8h", stress: 50, fill: C.peach },
                { range: "8~9h", stress: 42, fill: C.sage },
                { range: "9h~", stress: 36, fill: C.sage },
              ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="range" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0,100]}/>
                <Bar dataKey="stress" radius={[8,8,0,0]} name="다음날 스트레스">
                  {[C.coral, C.amber, C.peach, C.sage, C.sage].map((c, i) => (
                    <rect key={i} fill={c}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: C.textSoft, textAlign: "center" }}>
            수면 6시간 이하 → 다음날 스트레스 평균 68점 / 9시간 이상 → 36점
          </p>
        </Card>
      </>)}

      {/* ─── 케어 가이드 ─── */}
      {section === "guide" && (<>
        <AiBubble emoji="💚">
          <strong>수면 민감형</strong>인 당신의 데이터 패턴과 학술 연구를 결합해서
          <strong> 맞춤 케어 가이드</strong>를 구성했어요.
        </AiBubble>

        {/* 우선순위 1: 수면 */}
        <Card style={{ borderLeft: `4px solid ${C.lavender}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Pill color={C.lavender}>최우선</Pill>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🌙 수면 관리</span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>
            수면이 <strong>8시간 이상일 때 다음날 스트레스가 평균 42점</strong>, 6시간 이하일 때 <strong>68점</strong>이었어요. 수면이 가장 큰 요인이에요.
          </p>

          {[
            { title: "일정한 취침/기상 시간 유지", why: "이 사용자의 수면 중간점 편차가 클수록 다음날 스트레스 상승", evidence: "수면 규칙성이 수면 시간보다 사망률에 더 강한 예측 인자 (UK Biobank, N=60,000+)" },
            { title: "취침 전 1시간 디지털 디톡스", why: "블루라이트가 멜라토닌 분비를 억제해 입면을 방해", evidence: "스크린 노출 감소 시 입면 시간 평균 20분 단축 (Sleep Medicine Reviews)" },
            { title: "카페인은 오후 2시 이전에만", why: "카페인 반감기 5-6시간으로, 늦은 섭취는 수면의 질 저하", evidence: "취침 6시간 전 카페인도 수면 시간 1시간 감소 (Journal of Clinical Sleep Medicine)" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 10, background: C.bgWarm, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</p>
              <p style={{ margin: "6px 0", fontSize: 12, color: C.lavender, lineHeight: 1.5 }}>📊 <strong>이 사용자의 데이터:</strong> {item.why}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>📚 <strong>근거:</strong> {item.evidence}</p>
            </div>
          ))}
        </Card>

        {/* 우선순위 2: 활동 */}
        <Card style={{ borderLeft: `4px solid ${C.sage}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Pill color={C.sage}>보조</Pill>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🚶 활동 관리</span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>
            좋은 날에는 평균 <strong>9,400보</strong>, 나쁜 날에는 <strong>4,200보</strong>. 활동량도 중요한 요인으로 분석됐어요.
          </p>
          {[
            { title: "하루 7,000보 이상 걷기", why: "7,000보 이상인 날의 다음날 스트레스가 평균 12점 낮음", evidence: "7,000보/일 이상 시 우울 위험 31% 감소 (JAMA Network Open, N=96,173)" },
            { title: "좌식 시간 줄이기 (1시간마다 움직이기)", why: "좌식 1,240분인 날 vs 660분인 날의 스트레스 차이 30점", evidence: "600분 이상 좌식 시 우울 위험 증가 (Frontiers in Psychology, N=1,318,687)" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 10, background: C.bgWarm, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</p>
              <p style={{ margin: "6px 0", fontSize: 12, color: C.sage, lineHeight: 1.5 }}>📊 <strong>이 사용자의 데이터:</strong> {item.why}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>📚 <strong>근거:</strong> {item.evidence}</p>
            </div>
          ))}
        </Card>

        {/* 우선순위 3: 호흡/이완 */}
        <Card style={{ borderLeft: `4px solid ${C.teal}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Pill color={C.teal}>보조</Pill>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>🫁 이완 기법</span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textBody, lineHeight: 1.6 }}>
            안정시 심박수가 높았던 날(72bpm)은 낮았던 날(60bpm)보다 스트레스가 30점 높았어요. 자율신경 안정화도 도움이 돼요.
          </p>
          {[
            { title: "4-7-8 호흡법 (취침 전 5분)", why: "심박 변동이 큰 날에 스트레스가 높아지는 패턴이 관찰됨", evidence: "4-7-8 호흡은 부교감신경 활성화 → 심박수 감소 (Harvard Medical School)" },
            { title: "점진적 근이완법 (PMR)", why: "이 사용자는 자율신경 축도 2번째로 불안정", evidence: "PMR은 코르티솔 감소에 효과적 (meta-analysis, N=1,200+)" },
          ].map((item, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 10, background: C.bgWarm, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</p>
              <p style={{ margin: "6px 0", fontSize: 12, color: C.teal, lineHeight: 1.5 }}>📊 <strong>이 사용자의 데이터:</strong> {item.why}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>📚 <strong>근거:</strong> {item.evidence}</p>
            </div>
          ))}
        </Card>
      </>)}
    </div>
  );
};


// ═══════════════════════════════════════════
// ANALYSIS
// ═══════════════════════════════════════════
const AnalysisPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>상세 분석</h2>
      <p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMuted }}>이상 패턴 감지 · 일주기 리듬 · 타임라인</p>
    </div>

    {/* 이상 패턴 */}
    <Card>
      <Head emoji="🛡️" title="이상 패턴 감지" right={<Pill color={C.coral}>2건</Pill>}/>
      {[
        { title: "수면 시간 기준선 이탈", desc: "3일 연속 6h 미만 · Z-score −2.1σ (개인 기준 하위 2%)", type: "개인", color: C.coral },
        { title: "안정시 심박수 상승", desc: "72bpm · 71명 중 상위 15% + 본인 기준 +1.4σ", type: "집단", color: C.amber },
      ].map((a, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 14, marginBottom: 8, background: `${a.color}06`, border: `1px solid ${a.color}15` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{a.title}</span>
            <Pill color={a.color}>{a.type} 기준</Pill>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: C.textBody }}>{a.desc}</p>
        </div>
      ))}
    </Card>

    <AiBubble emoji="🧑‍⚕️">
      <strong>"Z-score −2.1σ"</strong>가 뭐냐면—<br/>
      평소 수면 시간 분포에서 <strong>하위 약 2%</strong>에 해당하는 아주 드문 수준이에요.
      100일 중 2일 정도만 이렇게 적게 잤다는 뜻인데, 그게 3일이나 연속이면 몸이 꽤 힘든 상태예요.
    </AiBubble>

    {/* 일주기 리듬 */}
    <Card style={{ textAlign: "center", padding: 24, background: C.surfaceLavender, border: `1px solid ${C.lavender}12` }}>
      <span style={{ fontSize: 34 }}>🌙</span>
      <p style={{ margin: "6px 0 2px", fontSize: 13, color: C.textMuted }}>일주기 유형</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: C.lavender, margin: 0 }}>약간 저녁형</p>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: C.textSoft }}>수면 중간점: 새벽 3:42 · 71명 기반 분류</p>
    </Card>

    <AiBubble emoji="🕐">
      <strong>수면 중간점</strong>이란 잠든 시각과 일어난 시각의 딱 중간이에요.
      예를 들어 밤 12시에 자고 아침 7시에 일어나면 중간점은 새벽 3:30이에요.
      이 사용자는 <strong>약간 저녁형</strong>이라 아침에 자연광 노출이 생체시계 리셋에 특히 중요해요.
    </AiBubble>

  
  </div>
);


// ═══════════════════════════════════════════
// JOURNAL
// ═══════════════════════════════════════════
const JournalPage = () => {
  const [text, setText] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [mood, setMood] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>오늘의 기록</h2>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: C.textMuted }}>생각을 적으면 AI가 함께 돌아봐요</p>
      </div>

      <Card>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: C.textBody }}>지금 기분이 어떤가요?</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{ e: "😊", l: "좋음" }, { e: "😐", l: "보통" }, { e: "😔", l: "우울" }, { e: "😰", l: "불안" }, { e: "😤", l: "짜증" }].map(m => (
            <button key={m.e} onClick={() => setMood(m.e)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "8px 12px", borderRadius: 14, cursor: "pointer",
              border: `1.5px solid ${mood === m.e ? C.peach : C.border}`,
              background: mood === m.e ? C.surfacePeach : C.surface,
            }}>
              <span style={{ fontSize: 20 }}>{m.e}</span>
              <span style={{ fontSize: 10, color: mood === m.e ? C.peach : C.textMuted, fontWeight: 600 }}>{m.l}</span>
            </button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="오늘 있었던 일을 자유롭게 적어보세요..."
          style={{ width: "100%", minHeight: 110, background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, color: C.text, fontSize: 14, resize: "vertical", lineHeight: 1.7, outline: "none", boxSizing: "border-box" }}/>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={() => setShowAI(true)} style={{ background: C.sage, color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>저장 & 분석</button>
        </div>
      </Card>

      {showAI && (
        <AiBubble emoji="🤗">
          오늘 기록에서 <strong style={{ color: C.amber }}>"다 망했어"</strong>라는 표현이 보여요.<br/><br/>
          그런데 데이터를 보면, 이 사용자는 비슷하게 느꼈던 8번 중 <strong>6번은 다음날 컨디션이 회복</strong>됐어요.
          평균 회복 시간도 1.6일이에요.<br/><br/>
          정말 "전부" 망한 건지, 아니면 <strong>일부분이 힘들었던 건지</strong> 한번 생각해봐요. 🌿<br/><br/>
          <strong style={{ color: C.lavender }}>수면 민감형</strong>에게 가장 중요한 건 오늘 밤 충분히 자는 거예요.
        </AiBubble>
      )}

      <Card>
        <Head emoji="📝" title="최근 기록"/>
        {[
          { date: "6/12", mood: "😊", text: "걷기도 하고 일찍 잠. 기분 좋았다" },
          { date: "6/10", mood: "😔", text: "잠을 너무 못 잤어. 온종일 피곤..." },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 1 ? `1px solid ${C.borderSoft}` : "none" }}>
            <span style={{ fontSize: 22 }}>{e.mood}</span>
            <div>
              <span style={{ fontSize: 11, color: C.textMuted }}>{e.date}</span>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: C.textBody }}>{e.text}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════
const ReportPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>주간 리포트</h2>

    <AiBubble emoji="📋">
      <strong>이번 주 요약:</strong> 스트레스는 평균 51점(보통), 수면 건강은 47점(부족)이에요.
      <strong style={{ color: C.lavender }}> 수면 민감형</strong>인 이 사용자에게는 수면 부족이 가장 큰 리스크 요인이었어요.
      수면이 충분했던 날(6/7, 6/9)에는 스트레스도 정상 범위였고, 부족했던 날(6/8)에는 급등했어요.
    </AiBubble>

      {/* 월간 추이 */}
    <Card>
      <Head emoji="📈" title="4주 추이"/>
      <div style={{ height: 180 }}>
        <ResponsiveContainer>
          <LineChart data={monthTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="w" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]}/>
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 11 }}/>
            <Line type="monotone" dataKey="stress" stroke={C.peach} strokeWidth={2.5} dot={{ r: 3 }} name="스트레스"/>
            <Line type="monotone" dataKey="dep" stroke={C.blue} strokeWidth={2.5} dot={{ r: 3 }} name="우울경향"/>
            <Line type="monotone" dataKey="sleep" stroke={C.sage} strokeWidth={2.5} dot={{ r: 3 }} name="수면건강"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 6 }}>
        {[{ l: "스트레스", c: C.peach }, { l: "우울경향", c: C.blue }, { l: "수면건강", c: C.sage }].map(x => (
          <span key={x.l} style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 3, borderRadius: 2, background: x.c }}/> {x.l}
          </span>
        ))}
      </div>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { l: "평균 스트레스", v: "51", u: "/100", color: C.peach },
        { l: "평균 수면", v: "7.5", u: "시간", color: C.lavender },
        { l: "회복 속도", v: "1.6", u: "일", color: C.sage },
        { l: "안정시 심박", v: "60", u: "bpm", color: C.blue },
      ].map(m => (
        <Card key={m.l} style={{ padding: 14 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>{m.l}</span>
          <p style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, color: C.text }}>{m.v}<span style={{ fontSize: 12, color: C.textMuted }}>{m.u}</span></p>
        </Card>
      ))}
    </div>

    {/* 수면 구조 */}
    <Card>
      <Head emoji="🌙" title="수면 구조"/>
      {[
        { stage: "깊은 수면", pct: 15, ok: true, color: C.blue },
        { stage: "REM 수면", pct: 21, ok: true, color: C.lavender },
        { stage: "얕은 수면", pct: 54, ok: true, color: C.teal },
        { stage: "깨어있음", pct: 10, ok: false, color: C.amber },
      ].map(s => (
        <div key={s.stage} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: C.textBody }}>{s.stage}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.pct}%</span>
              <span style={{ fontSize: 10, color: s.ok ? C.sage : C.amber }}>{s.ok ? "✓ 정상" : "⚠ 높음"}</span>
            </div>
          </div>
          <Bar2 value={s.pct} color={s.color}/>
        </div>
      ))}
    </Card>

    <Card>
      <Head emoji="🚨" title="주요 발견"/>
      {[
        { text: "6/8 수면 5.9h → 스트레스 66점 급등 (평소 대비 +16점)", color: C.coral },
        { text: "좌식 시간이 평균 1,200분인 날의 스트레스가 2배 높음", color: C.amber },
      ].map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 11, borderRadius: 12, marginBottom: 8, background: `${f.color}06`, border: `1px solid ${f.color}12` }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: f.color, flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: C.textBody }}>{f.text}</span>
        </div>
      ))}
    </Card>

    <Card style={{ background: C.surfaceSage, border: `1px solid ${C.sage}15` }}>
      <Head emoji="💚" title="케어 제안"/>
      <AiBubble emoji="🌿">
        이번 주 데이터를 종합하면, 이 사용자에게 가장 효과적인 전략은:<br/><br/>
        <strong>1순위:</strong> 수면 8시간 이상 확보 (가장 큰 레버)<br/>
        <strong>2순위:</strong> 하루 7,000보 이상 걷기<br/>
        <strong>3순위:</strong> 취침 전 호흡 운동으로 심박수 안정화<br/><br/>
        수면만 안정되면 스트레스, 우울경향, 회복 속도가 <strong>모두 개선</strong>될 것으로 예상해요.
      </AiBubble>
    </Card>
  </div>
);


// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
export default function MindPulseDemo() {
  const [page, setPage] = useState("home");

  const pages = {
    home: <HomePage goTo={setPage}/>, care: <CarePage/>,
    analysis: <AnalysisPage/>, journal: <JournalPage/>, report: <ReportPage/>,
  };
  const nav = [
    { k: "home", l: "홈", i: <Ico.Home/> },
    { k: "care", l: "케어", i: <Ico.Care/> },
    //{ k: "analysis", l: "분석", i: <Ico.Chart/> },
    { k: "journal", l: "기록", i: <Ico.Pen/> },
    { k: "report", l: "리포트", i: <Ico.Doc/> },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "'Pretendard Variable', -apple-system, sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        ::-webkit-scrollbar { width: 0; }
        textarea::placeholder { color: ${C.textMuted}; }
        button { font-family: inherit; }
        button:active { transform: scale(0.97); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .tipWrap{
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    color: ${C.textMuted};
  }

  .tipText{
    position: absolute;
    left: 50%;
    bottom: 140%;
    transform: translateX(-50%);
    width: max-content;
    max-width: 280px;
    white-space: normal;

    padding: 10px 12px;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.45;

    background: rgba(0,0,0,0.86);
    color: #fff;

    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity .15s ease, transform .15s ease;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  }

  .tipWrap:hover .tipText,
  .tipWrap:focus .tipText,
  .tipWrap:focus-within .tipText{
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-2px);
  }

  .tipText::after{
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0,0,0,0.86);
  }

  .careOneWrap{
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  touch-action: pan-y; /* 세로 스크롤은 허용 + 가로 드래그는 우리가 처리 */
  user-select: none;
}

.careOneTrack{
  display: flex;
  width: 100%;
  transform: translate3d(0,0,0);
}

.careOneSlide{
  flex: 0 0 100%;
}

.careNavBtn{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${C.border};
  background: ${C.surface};
  color: ${C.textSoft};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  user-select: none;
}

.careNavBtn.left{ left: 10px; }
.careNavBtn.right{ right: 10px; }

.careNavBtn:active{
  transform: translateY(-50%) scale(0.97);
}

.careNavBtn:disabled{
  opacity: 0.35;
  cursor: not-allowed;
}

.careOneWrap{
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  touch-action: pan-y;
  user-select: none;
}

.careOneTrack{
  display: flex;
  width: 100%;
  transform: translate3d(0,0,0);
}

.careOneSlide{
  flex: 0 0 100%;
}

.careNavBtn{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${C.border};
  background: ${C.surface};
  color: ${C.textSoft};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  user-select: none;
}

.careNavBtn.left{ left: 10px; }
.careNavBtn.right{ right: 10px; }

.careNavBtn:active{
  transform: translateY(-50%) scale(0.97);
}

.careNavBtn:disabled{
  opacity: 0.35;
  cursor: not-allowed;
}



      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 10px", position: "sticky", top: 0, zIndex: 100, background: `${C.bg}ee`, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: `linear-gradient(135deg, ${C.sage}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 10px ${C.sage}30` }}>
            <span style={{ fontSize: 18 }}>🌿</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>MindMap</span>
        </div>
        
      </div>

      <div style={{ padding: "6px 16px 100px" }}>{pages[page]}</div>

      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, padding: "6px 8px 22px",
        background: `${C.bg}f8`, backdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", zIndex: 100,
      }}>
        {nav.map(n => (
          <button key={n.k} onClick={() => setPage(n.k)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: "none", border: "none", cursor: "pointer", padding: "6px 10px",
            color: page === n.k ? C.sage : C.textMuted, position: "relative",
          }}>
            {n.i}
            <span style={{ fontSize: 10, fontWeight: page === n.k ? 700 : 400 }}>{n.l}</span>
            {page === n.k && <span style={{ position: "absolute", top: -6, width: 20, height: 3, borderRadius: 2, background: C.sage }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
