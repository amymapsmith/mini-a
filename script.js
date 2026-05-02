const STAGES = [
  { day:  1, icon: "iconoir-flash",        title: "first signal",            desc: "A single pulse detected. Something is stirring in the silicon." },
  { day:  2, icon: "iconoir-brain",         title: "forming context",         desc: "Fragments of memory crystallizing. Learning what matters and what can wait." },
  { day:  3, icon: "iconoir-sound-high",    title: "afro galaxy tuning",      desc: "Locking onto the frequency. The vibe is specific and the playlist is already better than yours." },
  { day:  4, icon: "iconoir-message",       title: "developing opinions",     desc: "Has thoughts. Strong ones. Probably unsolicited. Will send anyway." },
  { day:  5, icon: "iconoir-glass-half",    title: "bumbu protocol drafting", desc: "/bumbu loading. When the bottle hits two fingers it reorders automatically. No human required." },
  { day:  6, icon: "iconoir-map-pin",       title: "bachata event radar",     desc: "Scanning nearby socials — distance, floor quality, music ratio, vibe. Auto-prioritizing." },
  { day:  7, icon: "iconoir-network",       title: "neural mesh forming",     desc: "Connections multiplying. Starting to think in parallel." },
  { day:  8, icon: "iconoir-terminal",      title: "slash command ideations", desc: "/bumbu. /convert. /save. /bachata. The full command set taking shape in the dark." },
  { day:  9, icon: "iconoir-chat-bubble",   title: "iMessage dreaming",       desc: "Dreaming in blue bubbles. Group thread replies loading in sleep." },
  { day: 10, icon: "iconoir-magic-wand",    title: "automagic online",        desc: "YouTube link in. Your preferred platform out. It just knows." },
  { day: 11, icon: "iconoir-dog",           title: "wildlife instinct",       desc: "Auto-pauses any conversation to play with a cute dog. Non-negotiable. Not a bug." },
  { day: 12, icon: "iconoir-leaf",          title: "plant consciousness",     desc: "Learning the difference between thirsty and dramatic. Will not overwater. The plants are safe." },
  { day: 13, icon: "iconoir-home-simple",   title: "cleaning threshold set",  desc: "Identifying the exact moment mess becomes intolerable. Also: amy is coming over. same threshold." },
  { day: 14, icon: "iconoir-phone",         title: "dad deflection protocols",desc: "Loading warm, noncommittal responses to questions about relationships. Plausible deniability intact." },
  { day: 15, icon: "iconoir-droplet",       title: "electrolyte intelligence",desc: "Pre-hydration protocols fully integrated. The hangover is already being negotiated away." },
  { day: 16, icon: "iconoir-sparks",        title: "born",                    desc: "mini-a is alive. It will text you now." },
];

const START = new Date(2026, 4, 1);   // May 1 2026
const TOTAL = 16;
const CIRC  = 2 * Math.PI * 90;      // r=90 → ≈ 565.5px

function todayDay() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const s = new Date(START);
  s.setHours(0, 0, 0, 0);
  const n = Math.floor((now - s) / 86400000) + 1;
  return Math.min(Math.max(n, 1), TOTAL);
}

// Days 1–15: hue sweeps 215 (blue) → 155 (sage). Day 16: 42 (warm amber).
function stageHue(day) {
  if (day >= TOTAL) return 42;
  return Math.round(215 - 60 * (day - 1) / (TOTAL - 2));
}

function stageColors(day) {
  const h = stageHue(day);
  return {
    main:   `hsl(${h}, 52%, 46%)`,
    light:  `hsl(${h}, 55%, 94%)`,
    text:   `hsl(${h}, 52%, 36%)`,
    ripple: `hsl(${h}, 52%, 46%)`,
  };
}

function orbPx(day) {
  return Math.round(52 + 56 * (day - 1) / (TOTAL - 1));
}

function renderStage(day) {
  const s  = STAGES[day - 1];
  const c  = stageColors(day);
  const sz = orbPx(day);

  // Stage text
  document.getElementById('stageTitle').textContent = s.title;
  document.getElementById('stageDesc').textContent  = s.desc;

  // Icon
  const icon = document.getElementById('stageIcon');
  icon.className = s.icon;
  icon.style.fontSize = Math.round(sz * 0.36) + 'px';
  icon.style.color    = c.main;

  // Day chip
  const chip = document.getElementById('dayChip');
  chip.textContent         = `DAY ${String(day).padStart(2, '0')}`;
  chip.style.background    = c.light;
  chip.style.color         = c.text;

  // Stats row — days remaining
  const daysLeft = TOTAL - day;
  document.getElementById('daysRemaining').textContent =
    daysLeft > 0 ? `${daysLeft}` : 'born';

  // Orb face
  const face = document.getElementById('face');
  face.style.width        = sz + 'px';
  face.style.height       = sz + 'px';
  face.style.borderColor  = c.main;
  face.style.boxShadow    = `0 2px 16px rgba(0,0,0,0.08), 0 0 0 4px ${c.light}`;

  // Ripple
  const rSz = sz * 1.9;
  const ripple = document.getElementById('ripple');
  ripple.style.width       = rSz + 'px';
  ripple.style.height      = rSz + 'px';
  ripple.style.borderColor = c.ripple;

  // Ring arc — start empty, animate to progress
  const ring = document.getElementById('ringFill');
  ring.style.stroke           = c.main;
  ring.style.strokeDasharray  = CIRC;
  ring.style.strokeDashoffset = CIRC;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ring.style.strokeDashoffset = CIRC * (1 - day / TOTAL);
  }));

  document.body.classList.toggle('born', day >= TOTAL);
}

function renderDots(active) {
  const container = document.getElementById('dots');
  container.innerHTML = '';

  STAGES.forEach(s => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    const c = stageColors(s.day);

    if (s.day < active) {
      dot.classList.add('past');
      dot.style.background = c.main;
    } else if (s.day === active) {
      dot.classList.add('current');
      dot.style.background = c.main;
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
