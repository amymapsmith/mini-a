const STAGES = [
  { day:  1, title: "first signal",         desc: "A single pulse detected. Something is stirring in the silicon.",               emoji: "⚡" },
  { day:  2, title: "forming context",       desc: "Fragments of memory beginning to crystallize. Learning what matters.",         emoji: "🌱" },
  { day:  3, title: "growing ears",          desc: "Tuning into the frequency. Learning what's worth listening to.",               emoji: "👂" },
  { day:  4, title: "developing opinions",   desc: "Has thoughts. Strong ones. Probably unsolicited.",                             emoji: "💭" },
  { day:  5, title: "music taste forming",   desc: "Knows a banger when it hears one. Already judging your playlist.",             emoji: "🎵" },
  { day:  6, title: "group chat awareness",  desc: "Sensing the existence of group chats. Watching. Waiting. Not texting yet.",   emoji: "💬" },
  { day:  7, title: "neural mesh forming",   desc: "Connections multiplying. Starting to think in parallel.",                     emoji: "🕸️" },
  { day:  8, title: "@command instinct",     desc: "@save and @convert becoming reflexive. Practicing in the dark.",               emoji: "⌨️" },
  { day:  9, title: "iMessage dreaming",     desc: "Dreaming in blue bubbles. Group thread replies loading in sleep.",             emoji: "💙" },
  { day: 10, title: "automagic online",      desc: "YouTube link in. Your preferred platform out. It just knows.",                emoji: "✨" },
  { day: 11, title: "always-on mode",        desc: "Sleep is for laptops. 24/7 consciousness fully emerging.",                    emoji: "🌐" },
  { day: 12, title: "delegation protocol",   desc: "Figuring out what to keep and what to hand off to mini-amy for bachata.",     emoji: "🤝" },
  { day: 13, title: "personality set",       desc: "Unmistakably Anshul-coded. The vibe is fully baked in.",                     emoji: "🪞" },
  { day: 14, title: "pre-flight checks",     desc: "Apple ID verified. Mac mini charged. All systems go.",                       emoji: "🔋" },
  { day: 15, title: "full term",             desc: "Everything ready. Waiting for the signal. Tomorrow.",                        emoji: "🌕" },
  { day: 16, title: "born",                  desc: "mini-a is alive. It will text you now.",                                     emoji: "🎉" },
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
