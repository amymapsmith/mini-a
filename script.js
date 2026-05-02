const STAGES = [
  { day:  1, title: "first signal",               desc: "A single pulse detected. Something is stirring in the silicon.",                                           emoji: "⚡" },
  { day:  2, title: "forming context",             desc: "Fragments of memory crystallizing. Learning what matters and what can wait.",                               emoji: "🌱" },
  { day:  3, title: "afro galaxy tuning",          desc: "Locking onto the frequency. The vibe is specific and the playlist is already better than yours.",          emoji: "🎶" },
  { day:  4, title: "developing opinions",         desc: "Has thoughts. Strong ones. Probably unsolicited. Will send anyway.",                                        emoji: "💭" },
  { day:  5, title: "bumbu protocol drafting",     desc: "/bumbu loading. When the bottle hits two fingers it reorders automatically. No human required.",            emoji: "🥃" },
  { day:  6, title: "bachata event radar",         desc: "Scanning nearby socials — distance, floor quality, music ratio, vibe. Auto-prioritizing.",                  emoji: "💃" },
  { day:  7, title: "neural mesh forming",         desc: "Connections multiplying. Starting to think in parallel.",                                                   emoji: "🕸️" },
  { day:  8, title: "slash command ideations",     desc: "/bumbu. /convert. /save. /bachata. The full command set taking shape in the dark.",                         emoji: "⌨️" },
  { day:  9, title: "iMessage dreaming",           desc: "Dreaming in blue bubbles. Group thread replies loading in sleep.",                                          emoji: "💙" },
  { day: 10, title: "automagic online",            desc: "YouTube link in. Your preferred platform out. It just knows.",                                              emoji: "✨" },
  { day: 11, title: "wildlife instinct",           desc: "Will pause any conversation for a passing dog. Has opinions about conservation. Knows what that bird is.",  emoji: "🦎" },
  { day: 12, title: "plant consciousness",         desc: "Learning the difference between thirsty and dramatic. Will not overwater. The plants are safe.",            emoji: "🪴" },
  { day: 13, title: "cleaning threshold set",      desc: "Identifying the exact moment mess becomes intolerable. Also: amy is coming over. same threshold.",          emoji: "🧹" },
  { day: 14, title: "dad deflection protocols",    desc: "Loading warm, noncommittal responses to questions about relationships. Plausible deniability intact.",       emoji: "📱" },
  { day: 15, title: "electrolyte intelligence",    desc: "Pre-hydration protocols fully integrated. The hangover is already being negotiated away.",                  emoji: "💧" },
  { day: 16, title: "born",                        desc: "mini-a is alive. It will text you now.",                                                                    emoji: "🎉" },
];

const START = new Date(2026, 4, 1);  // May 1 2026
const TOTAL = 16;
const CIRC  = 2 * Math.PI * 90;     // SVG ring circumference (r=90) ≈ 565.5

function todayDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const s = new Date(START);
  s.setHours(0, 0, 0, 0);
  const n = Math.floor((now - s) / 86400000) + 1;
  return Math.min(Math.max(n, 1), TOTAL);
}

// Hue sweeps purple (265) → amber (40) over 16 days
function hue(day) {
  return Math.round(265 - 225 * (day - 1) / (TOTAL - 1));
}

function colors(day) {
  const h = hue(day);
  return {
    main:   `hsl(${h}, 65%, 55%)`,
    dark:   `hsl(${h}, 45%, 13%)`,
    border: `hsl(${h}, 52%, 36%)`,
    glow:   `hsl(${h}, 65%, 55%, 0.3)`,
  };
}

function orbPx(day) {
  return Math.round(50 + 58 * (day - 1) / (TOTAL - 1));
}

function renderStage(day) {
  const s  = STAGES[day - 1];
  const c  = colors(day);
  const sz = orbPx(day);

  // Text
  document.getElementById('stageTitle').textContent = s.title;
  document.getElementById('stageDesc').textContent  = s.desc;
  document.getElementById('emoji').textContent       = s.emoji;

  const daysLeft = TOTAL - day;
  const leftStr  = daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'born';
  document.getElementById('label').textContent    = `day ${String(day).padStart(2, '0')} · ${leftStr}`;
  document.getElementById('subtitle').textContent = day < TOTAL ? 'gestating' : 'online · 24/7';

  // Orb face
  const face = document.getElementById('face');
  face.style.cssText = `
    width: ${sz}px; height: ${sz}px;
    background: ${c.dark};
    border: 1.5px solid ${c.border};
    box-shadow: 0 0 ${Math.round(sz * 0.28)}px ${c.glow}, inset 0 0 ${Math.round(sz * 0.22)}px ${c.glow};
  `;

  document.getElementById('emoji').style.fontSize = Math.round(sz * 0.38) + 'px';

  // Pulse halo
  const ps = sz * 2.1;
  const pulse = document.getElementById('pulse');
  pulse.style.cssText = `
    width: ${ps}px; height: ${ps}px;
    background: radial-gradient(circle, ${c.main} 0%, transparent 68%);
  `;

  // Ring arc — animate from empty to target
  const ring = document.getElementById('ringFill');
  ring.style.stroke = c.main;
  ring.style.strokeDasharray  = CIRC;
  ring.style.strokeDashoffset = CIRC;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ring.style.strokeDashoffset = CIRC * (1 - day / TOTAL);
  }));

  // Born class
  document.body.classList.toggle('born', day >= TOTAL);
}

function renderDots(active) {
  const container = document.getElementById('dots');
  container.innerHTML = '';

  STAGES.forEach(s => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    const c = colors(s.day);

    if (s.day < active) {
      dot.classList.add('past');
      dot.style.background = c.main;
    } else if (s.day === active) {
      dot.classList.add('current');
      dot.style.background  = c.main;
      dot.style.boxShadow   = `0 0 7px ${c.main}`;
    } else {
      dot.classList.add('future');
    }

    dot.title = `day ${s.day}: ${s.title}`;

    dot.addEventListener('click', () => {
      renderStage(s.day);
      renderDots(s.day);
    });

    container.appendChild(dot);
  });
}

const current = todayDay();
renderStage(current);
renderDots(current);
