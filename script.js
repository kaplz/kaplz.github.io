let highestZ = 30;
const wsOrder = ['all', 'system', 'projects', 'music'];
let currentWsIdx = 0;
let lastScatterTime = 0;
let currentTheme = 'light';

const SCATTER_COOLDOWN_MS = Math.E * 100;

// 1. АРТ ДЛЯ ТЕРМИНАЛА
const animeGirlFrames = [
`  . ˚  ✧  . ˚
   /\\_ /\\
  ( ◕ ‿ ◕ )
   > 🌸 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  ✧  . ˚
   /\\_ /\\
  ( ◕ ▽ ◕ )
   > 🌸 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  ✧  . ˚
   /\\_ /\\
  ( ˶ᵔᵕᵔ˶ )
   > 🌸 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  ✧  . ˚
   /\\_ /\\
  ( - ‿ - )
   > 🌸 <
  /   / \\  \\
 (_____)___)`
];

const slugcatDarkFrames = [
`  . ˚  🌧️  . ˚
   /\\__ /\\
  ( • _ • )
   > 🫐 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  🌧️  . ˚
   /\\__ /\\
  ( • o • )
   > 🫐 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  🌧️  . ˚
   \\/__ \\/
  ( - _ - )
   > 💙 <
  /   / \\  \\
 (_____)___)`,

`  . ˚  🌧️  . ˚
   /\\__ /\\
  ( • _ • )
   >    <
  /   / \\  \\
 (_____)___)`
];

let frameIdx = 0;
function updateAsciiArt() {
  const el = document.getElementById('animated-ascii');
  if (!el) return;
  const frames = currentTheme === 'light' ? animeGirlFrames : slugcatDarkFrames;
  el.textContent = frames[frameIdx % frames.length];
  frameIdx++;
}
updateAsciiArt();
setInterval(updateAsciiArt, 550);

// 2. ОБОИ
const lightWallpapers = [
  "assets/images/white_1.jpg",
  "assets/images/white_2.jpg",
  "assets/images/white_3.jpg"
];

const darkWallpapers = [
  "assets/images/dark_1.png",
  "assets/images/dark_2.png",
  "assets/images/dark_3.png"
];

let wpLightIdx = 0;
let wpDarkIdx = 0;

function applyWallpaper() {
  const bg = document.getElementById('wallpaper-bg');
  const label = document.getElementById('wp-counter-label');

  if (currentTheme === 'light') {
    const idx = wpLightIdx % lightWallpapers.length;
    const url = lightWallpapers[idx];
    bg.style.backgroundImage = `
      linear-gradient(135deg, rgba(255, 244, 248, 0.22) 0%, rgba(252, 232, 240, 0.32) 100%),
      url("${encodeURI(url)}")
    `;
    if (label) label.textContent = `Обои: ${idx + 1} / ${lightWallpapers.length}`;
  } else {
    const idx = wpDarkIdx % darkWallpapers.length;
    const url = darkWallpapers[idx];
    bg.style.backgroundImage = `
      linear-gradient(180deg, rgba(7, 13, 15, 0.28) 0%, rgba(7, 13, 15, 0.48) 100%),
      url("${encodeURI(url)}")
    `;
    if (label) label.textContent = `Обои: ${idx + 1} / ${darkWallpapers.length}`;
  }
}

function setThemeMode(mode) {
  currentTheme = mode;
  document.body.className = mode === 'light' ? 'theme-light' : 'theme-dark';

  document.getElementById('opt-light').classList.toggle('active', mode === 'light');
  document.getElementById('opt-dark').classList.toggle('active', mode === 'dark');

  const quickBtn = document.getElementById('quick-theme-btn');
  if (quickBtn) {
    quickBtn.textContent = mode === 'light' ? 'тема: светлая' : 'тема: темная';
  }

  applyWallpaper();
  updateAsciiArt();
}

function toggleThemeMode() {
  setThemeMode(currentTheme === 'light' ? 'dark' : 'light');
}

function cycleWallpaper() {
  if (currentTheme === 'light') wpLightIdx++;
  else wpDarkIdx++;
  applyWallpaper();
}

// 3. ПОГОДНЫЙ CANVAS
const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
let petals = [], rainDrops = [], amberSpores = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 28; i++) {
  petals.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: 3.5 + Math.random() * 4, vx: 0.35 + Math.random() * 0.6, vy: 0.55 + Math.random() * 0.8,
    angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.02
  });
}
for (let i = 0; i < 95; i++) {
  rainDrops.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    len: 15 + Math.random() * 18, vy: 12 + Math.random() * 7, vx: -1.0
  });
}
for (let i = 0; i < 16; i++) {
  amberSpores.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: 1.5 + Math.random() * 2, vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.35
  });
}

function animateWeather() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentTheme === 'light') {
    ctx.fillStyle = 'rgba(232, 122, 159, 0.38)';
    petals.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
      if (p.x > canvas.width + 10) { p.x = -10; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  } else {
    ctx.strokeStyle = 'rgba(140, 185, 178, 0.14)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    rainDrops.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.y > canvas.height) { d.y = -25; d.x = Math.random() * canvas.width; }
      if (d.x < 0) d.x = canvas.width;
      ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.vx * 1.4, d.y + d.len);
    });
    ctx.stroke();

    ctx.fillStyle = 'rgba(217, 160, 91, 0.32)';
    amberSpores.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      if (s.y < -10) { s.y = canvas.height + 10; s.x = Math.random() * canvas.width; }
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  requestAnimationFrame(animateWeather);
}
animateWeather();

// 4. ПЕРЕТАСКИВАНИЕ ОКОН И РАЗБРОС
document.querySelectorAll('.window').forEach(win => {
  const header = win.querySelector('.win-header');
  win.addEventListener('mousedown', () => bringToFront(win));

  header.addEventListener('mousedown', e => {
    if (window.innerWidth <= 850 || e.target.classList.contains('win-btn')) return;
    bringToFront(win);
    
    if (win.dataset.isMaximized === 'true') {
      maximizeWin(win.id);
      return;
    }
    
    win.classList.remove('smooth-move');

    const startX = e.clientX - win.offsetLeft;
    const startY = e.clientY - win.offsetTop;

    function onMove(ev) {
      win.style.left = (ev.clientX - startX) + 'px';
      win.style.top = (ev.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
});

function scatterWindows(force = false) {
  if (window.innerWidth <= 850) return;

  const now = Date.now();
  if (!force && now - lastScatterTime < SCATTER_COOLDOWN_MS) return;
  lastScatterTime = now;

  const btn = document.getElementById('scatter-btn');
  if (btn) {
    btn.classList.add('cooldown');
    setTimeout(() => btn.classList.remove('cooldown'), SCATTER_COOLDOWN_MS);
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight - 80;
  const wins = Array.from(document.querySelectorAll('.window:not(.closed)'));
  const placed = [];

  wins.sort(() => Math.random() - 0.5);

  wins.forEach((win, idx) => {
    if (win.dataset.isMaximized === 'true') {
      win.dataset.isMaximized = 'false';
      if (win.dataset.savedW) win.style.width = win.dataset.savedW + 'px';
      win.style.height = 'auto';
    }

    win.classList.remove('minimized', 'maximized', 'ws-hidden');
    win.classList.add('smooth-move');

    const w = win.offsetWidth || 400;
    const h = win.offsetHeight || 280;
    const maxX = Math.max(24, vw - w - 24);
    const maxY = Math.max(60, vh - h - 20);

    let bestX = 24, bestY = 60, bestDist = -1;

    for (let i = 0; i < 20; i++) {
      const rx = Math.floor(18 + Math.random() * (maxX - 18));
      const ry = Math.floor(58 + Math.random() * (maxY - 58));
      const cx = rx + w / 2, cy = ry + h / 2;

      let minDist = Infinity;
      for (const c of placed) {
        const d = Math.hypot(cx - c.x, cy - c.y);
        if (d < minDist) minDist = d;
      }
      if (placed.length === 0 || minDist > bestDist) {
        bestDist = minDist; bestX = rx; bestY = ry;
      }
    }

    placed.push({ x: bestX + w / 2, y: bestY + h / 2 });
    win.style.left = bestX + 'px';
    win.style.top = bestY + 'px';
    win.style.zIndex = 20 + idx;

    setTimeout(() => win.classList.remove('smooth-move'), SCATTER_COOLDOWN_MS);
  });

  highestZ = 30 + wins.length;
  switchWorkspace('all', true);
}

// 5. УПРАВЛЕНИЕ ОКНАМИ (с остановкой музыки при закрытии win-5!)
function bringToFront(win) {
  if (win.classList.contains('closed')) return;
  highestZ++;
  win.style.zIndex = highestZ;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active-win'));
  win.classList.add('active-win');
  updateDockIndicators();
}

function minimizeWin(id) {
  const win = document.getElementById(id);
  win.classList.add('smooth-move', 'minimized');
  win.classList.remove('active-win');
  updateDockIndicators();
}

function closeWin(id) {
  const win = document.getElementById(id);
  win.classList.add('smooth-move', 'closed');
  win.classList.remove('active-win');

  // Если закрыли плеер — глушим музыку и останавливаем эквалайзер
  if (id === 'win-5' && isPlaying) {
    toggleMusic();
  }

  updateDockIndicators();
}

function reopenWin(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.add('smooth-move');
  win.classList.remove('closed', 'minimized', 'ws-hidden');
  bringToFront(win);
  document.getElementById('app-launcher').classList.add('hidden');
  setTimeout(() => win.classList.remove('smooth-move'), 320);
}

function reopenAll() {
  ['win-1', 'win-2', 'win-3', 'win-4', 'win-5', 'win-6'].forEach(reopenWin);
}

function toggleLauncher() {
  document.getElementById('app-launcher').classList.toggle('hidden');
}

function maximizeWin(id) {
  const win = document.getElementById(id);
  win.classList.remove('minimized', 'ws-hidden');
  bringToFront(win);

  const isMax = win.dataset.isMaximized === 'true';

  if (!isMax) {
    win.dataset.savedX = win.offsetLeft;
    win.dataset.savedY = win.offsetTop;
    win.dataset.savedW = win.offsetWidth;
    win.dataset.savedH = win.offsetHeight;

    win.style.width = win.offsetWidth + 'px';
    win.style.height = win.offsetHeight + 'px';
    win.offsetHeight;

    win.classList.add('smooth-move');
    win.dataset.isMaximized = 'true';

    win.style.left = '18px';
    win.style.top = '58px';
    win.style.width = (window.innerWidth - 36) + 'px';
    win.style.height = (window.innerHeight - 130) + 'px';

    setTimeout(() => win.classList.remove('smooth-move'), 340);
  } else {
    win.classList.add('smooth-move');
    win.dataset.isMaximized = 'false';

    win.style.left = win.dataset.savedX + 'px';
    win.style.top = win.dataset.savedY + 'px';
    win.style.width = win.dataset.savedW + 'px';
    win.style.height = win.dataset.savedH + 'px';

    setTimeout(() => {
      win.classList.remove('smooth-move');
      win.style.height = 'auto';
    }, 340);
  }
}

function dockClick(id) {
  const win = document.getElementById(id);
  if (!win || win.classList.contains('closed')) return;

  if (window.innerWidth <= 850) {
    win.classList.remove('ws-hidden');
    win.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const isHidden = win.classList.contains('minimized') || win.classList.contains('ws-hidden');
  const isFocused = win.classList.contains('active-win');

  if (isHidden) {
    win.classList.add('smooth-move');
    win.classList.remove('minimized', 'ws-hidden');
    bringToFront(win);
    setTimeout(() => win.classList.remove('smooth-move'), 320);
  } else if (isFocused) {
    minimizeWin(id);
  } else {
    bringToFront(win);
  }
}

function switchWorkspace(ws, skipFocus = false) {
  currentWsIdx = wsOrder.indexOf(ws);
  document.querySelectorAll('#ws-switcher span').forEach(s => {
    s.classList.toggle('active', s.dataset.ws === ws);
  });

  let topWin = null, topZ = -1;

  document.querySelectorAll('.window:not(.closed)').forEach(win => {
    win.classList.add('smooth-move');
    if (ws === 'all' || win.dataset.ws === ws) {
      win.classList.remove('ws-hidden', 'minimized');
      const z = parseInt(win.style.zIndex || 1, 10);
      if (z > topZ) { topZ = z; topWin = win; }
    } else {
      win.classList.add('ws-hidden');
    }
    setTimeout(() => win.classList.remove('smooth-move'), 320);
  });

  if (topWin && !skipFocus) bringToFront(topWin);
  updateDockIndicators();
}

function updateDockIndicators() {
  document.querySelectorAll('.dock-item').forEach(item => {
    const win = document.getElementById(item.dataset.target);
    const isClosed = win.classList.contains('closed');
    const isVisible = !isClosed && !win.classList.contains('minimized') && !win.classList.contains('ws-hidden');
    const isFocused = isVisible && win.classList.contains('active-win');

    item.classList.toggle('dock-closed', isClosed);
    item.classList.toggle('is-open', isVisible);
    item.classList.toggle('is-focused', isFocused);
  });
}

window.addEventListener('keydown', e => {
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

  if (e.key === '0') {
    e.preventDefault();
    toggleLauncher();
  } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
    e.preventDefault();
    const win = document.getElementById(`win-${e.key}`);
    if (win && !win.classList.contains('closed')) dockClick(`win-${e.key}`);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    currentWsIdx = (currentWsIdx + 1) % wsOrder.length;
    switchWorkspace(wsOrder[currentWsIdx]);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    currentWsIdx = (currentWsIdx - 1 + wsOrder.length) % wsOrder.length;
    switchWorkspace(wsOrder[currentWsIdx]);
  }
});

// 6. ГАЛЕРЕЯ ДЕВАЙСОВ
const devicesData = [
  {
    title: 'ASUS ExpertBook B3 Flip',
    img: 'assets/images/asus expertbook.png',
    specs: '<strong>CPU:</strong> Intel Core i7-1255U (1.70 GHz)<br><strong>GPU:</strong> Intel Iris Xe Graphics<br><strong>RAM:</strong> 16 GB (3200 MT/s) • <strong>Disk:</strong> 477 GB<br><strong>ОС:</strong> Windows / Linux'
  },
  {
    title: 'FlashForge Adventurer 5M',
    img: 'assets/images/flashforge_adventurer_5m.png',
    specs: '<strong>Принтер:</strong> FlashForge Adventurer 5M (CoreXY)<br><strong>Модификации:</strong> Кастомный закрытый корпус<br><strong>Скорость:</strong> макс. 600 мм/с, уск. 20000 мм/с²'
  },
  {
    title: 'Nothing Phone (1)',
    img: 'assets/images/nothing_phone.png',
    specs: '<strong>Смартфон:</strong> Nothing Phone (1)<br><strong>Память:</strong> 16 GB RAM / 256 GB ROM<br><strong>ОС:</strong> Nothing OS 3.2'
  }
];

function switchDevice(idx) {
  document.querySelectorAll('#dev-tabs .tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
  const d = devicesData[idx];
  document.getElementById('dev-img').src = encodeURI(d.img);
  document.getElementById('dev-specs').innerHTML = d.specs;
}

// 7. КАРУСЕЛЬ ПРОЕКТОВ (С твоими ссылками на Filament Studio!)
const projectsList = [
  {
    slug: 'filament-studio',
    name: 'Filament Studio',
    desc: 'Веб-сервис для анализа G-code, учета катушек пластика и точного расчета себестоимости 3D-печати.',
    hasCalculator: true,
    tags: ['Python', 'Flask', 'JS', 'SQL'],
    link: 'https://filament-studio.vercel.app/',
    repo: 'https://github.com/kaplz/filament-studio'
  },
  {
    slug: 'telegram-bots',
    name: 'Telegram Bots',
    desc: 'Асинхронные боты в Telegram для автоматизации различных задач, администрирования и интеграций.',
    hasCalculator: false,
    tags: ['Python', 'Aiogram', 'Telebot'],
    link: 'https://github.com/kaplz',
    repo: 'https://github.com/kaplz'
  },
  {
    slug: 'in-development',
    name: 'В разработке...',
    desc: 'Этот проект пока находится в активной разработке. Загляните сюда чуть позже!',
    hasCalculator: false,
    tags: ['Top Secret'],
    link: 'https://github.com/kaplz',
    repo: 'https://github.com/kaplz'
  }
];

let curProjIdx = 0;

function renderProject() {
  const p = projectsList[curProjIdx];
  document.getElementById('proj-win-title').textContent = `projects — ${p.slug}`;
  document.getElementById('proj-name').textContent = p.name;
  document.getElementById('proj-counter').textContent = `${curProjIdx + 1} / ${projectsList.length}`;
  document.getElementById('proj-desc').textContent = p.desc;

  document.getElementById('filament-calc-widget').style.display = p.hasCalculator ? 'block' : 'none';

  document.getElementById('proj-tags').innerHTML = p.tags
    .map(t => `<span class="soft-tag">${t}</span>`)
    .join('');

  document.getElementById('proj-link').href = p.link;
  document.getElementById('proj-repo').href = p.repo;
}

function nextProject() {
  curProjIdx = (curProjIdx + 1) % projectsList.length;
  renderProject();
}

function prevProject() {
  curProjIdx = (curProjIdx - 1 + projectsList.length) % projectsList.length;
  renderProject();
}

// 8. ПЛЕЕР НА 50 ТРЕКОВ
const tracks = [
  { title: '01. Шарлот — Щека На Щеку', dur: 'MP3', src: 'assets/music/Шарлот Щека На Щеку.mp3' },
  { title: '02. Шарлот — Я не один', dur: 'MP3', src: 'assets/music/Шарлот - Я не один.mp3' },
  { title: '03. Френдзона — Бойчик', dur: 'MP3', src: 'assets/music/Френдзона - Бойчик.mp3' },
  { title: '04. Таня Терешина — Обломки Чувств', dur: 'MP3', src: 'assets/music/Таня Терешина - Обломки Чувств.mp3' },
  { title: '05. Раковая Выхухоль — Сайт', dur: 'MP3', src: 'assets/music/Раковая Выхухоль Сайт.mp3' },
  { title: '06. Пошлая Молли — Все хотят меня поцеловать', dur: 'MP3', src: 'assets/music/Пошлая Молли - Все хотят меня поцеловать.mp3' },
  { title: '07. Полка — Знаю', dur: 'MP3', src: 'assets/music/Полка Знаю.mp3' },
  { title: '08. Нексюша — На Твиче', dur: 'MP3', src: 'assets/music/Нексюша - На Твиче.mp3' },
  { title: '09. Мот — Случайности Не Случайны', dur: 'MP3', src: 'assets/music/Мот - Случайности Не Случайны.mp3' },
  { title: '10. Монеточка — Селфхарм', dur: 'MP3', src: 'assets/music/Монеточка - Селфхарм.mp3' },
  { title: '11. Космонавтов Нет — Мятой (Remix 2010)', dur: 'MP3', src: 'assets/music/Космонавтов Нет - Мятой (Remix 2010).mp3' },
  { title: '12. Дайте Танк (!) — Маленький', dur: 'MP3', src: 'assets/music/Дайте Танк (!) - Маленький.mp3' },
  { title: '13. Аскорбинка — Мальчики и Девочки', dur: 'MP3', src: 'assets/music/Аскорбинка - Мальчики и Девочки.mp3' },
  { title: '14. Алёна Швец — Вино и Сигареты', dur: 'MP3', src: 'assets/music/Алёна Швец - Вино и Сигареты.mp3' },
  { title: '15. Zhanulka — Портреты (Acoustic)', dur: 'MP3', src: 'assets/music/Zhanulka - Портреты (Acoustic).mp3' },
  { title: '16. XXXTENTACION — Sad!', dur: 'MP3', src: 'assets/music/Xxxtentacion Sad!.mp3' },
  { title: '17. XXXTENTACION — I Don\'T Let Go', dur: 'MP3', src: 'assets/music/Xxxtentacion I Don\'T Let Go.mp3' },
  { title: '18. XXXTENTACION — NUMB', dur: 'MP3', src: 'assets/music/XXXTENTACION - NUMB.mp3' },
  { title: '19. Wale — Shape of You (Ed Sheeran Remix)', dur: 'MP3', src: 'assets/music/Wale - Shape of You (Ed Sheeran Remix).mp3' },
  { title: '20. Voskresenskii — Еду по Москве', dur: 'MP3', src: 'assets/music/Voskresenskii - Еду по Москве.mp3' },
  { title: '21. Volhey — Мило материшься', dur: 'MP3', src: 'assets/music/Volhey - Мило материшься.mp3' },
  { title: '22. Uniqe — Афтерпати (Feat. Xxxmanera)', dur: 'MP3', src: 'assets/music/Uniqe Афтерпати (Feat. Xxxmanera) (feat. Nkeeei & Artem Shilovets).mp3' },
  { title: '23. The Neighbourhood — Sweater Weather', dur: 'MP3', src: 'assets/music/The Neighbourhood - Sweater Weather.mp3' },
  { title: '24. Soft Blade — Yugoslavskiy Groove', dur: 'MP3', src: 'assets/music/Soft Blade Yugoslavskiy Groove.mp3' },
  { title: '25. Quest Pistols — Ты Так Красива', dur: 'MP3', src: 'assets/music/Quest Pistols Ты Так Красива.mp3' },
  { title: '26. Pepel Nahudi — Заново Завоевать', dur: 'MP3', src: 'assets/music/Pepel Nahudi Заново Завоевать.mp3' },
  { title: '27. Ooes — Зима', dur: 'MP3', src: 'assets/music/Ooes - Зима.mp3' },
  { title: '28. MORGENSHTERN — Уфф Деньги', dur: 'MP3', src: 'assets/music/MORGENSHTERN - Уфф Деньги.mp3' },
  { title: '29. Morgenshtern — Повод', dur: 'MP3', src: 'assets/music/Morgenshtern - Повод.mp3' },
  { title: '30. Maroon 5 — Animals', dur: 'MP3', src: 'assets/music/Maroon 5 - Animals.mp3' },
  { title: '31. Maksim — Nauchus` Letat`', dur: 'MP3', src: 'assets/music/Maksim Nauchus` Letat`.mp3' },
  { title: '32. Madk1D — Цена (feat. Паранойя)', dur: 'MP3', src: 'assets/music/Madk1D Цена (feat. Паранойя).mp3' },
  { title: '33. Locked23 — Татухи', dur: 'MP3', src: 'assets/music/Locked23 Татухи.mp3' },
  { title: '34. Lil Wayne — Sucker For Pain', dur: 'MP3', src: 'assets/music/Lil Wayne Sucker For Pain (Feat. Logic, Ty Dolla $Ign & X Ambassadors) (feat. Wiz Khalifa & Imagine Dragons).mp3' },
  { title: '35. Lida — Ради Бога', dur: 'MP3', src: 'assets/music/Lida - Ради Бога.mp3' },
  { title: '36. Licarbx — Sweet City', dur: 'MP3', src: 'assets/music/Licarbx Sweet City.mp3' },
  { title: '37. Kush Lovers — 20К', dur: 'MP3', src: 'assets/music/Kush Lovers 20К.mp3' },
  { title: '38. Kanye West — Runaway (feat. Pusha T)', dur: 'MP3', src: 'assets/music/Kanye West feat. Pusha T - Runaway.mp3' },
  { title: '39. Kaleo — Way Down We Go', dur: 'MP3', src: 'assets/music/Kaleo - Way Down We Go.mp3' },
  { title: '40. Imase — Night Dancer', dur: 'MP3', src: 'assets/music/Imase Night Dancer.mp3' },
  { title: '41. Imagine Dragons — Take Me To The Beach (feat. Ado)', dur: 'MP3', src: 'assets/music/Imagine Dragons feat. Ado - Take Me To The Beach.mp3' },
  { title: '42. Gone.Fludd — Как Делишки', dur: 'MP3', src: 'assets/music/Gone.Fludd Как Делишки.mp3' },
  { title: '43. Gone.Fludd — Boys Don\'T Cry', dur: 'MP3', src: 'assets/music/Gone.Fludd Boys Don\'T Cry.mp3' },
  { title: '44. Face — Лиза', dur: 'MP3', src: 'assets/music/Face Лиза.mp3' },
  { title: '45. Elyotto — Sugarcrash!', dur: 'MP3', src: 'assets/music/Elyotto Sugarcrash!.mp3' },
  { title: '46. Dominic Fike — Babydoll', dur: 'MP3', src: 'assets/music/Dominic Fike - Babydoll.mp3' },
  { title: '47. Ado — Unravel', dur: 'MP3', src: 'assets/music/Ado Unravel.mp3' },
  { title: '48. Ado — Usseewa', dur: 'MP3', src: 'assets/music/Ado - Usseewa.mp3' },
  { title: '49. Adecvat_Production — За Цвет Голубых Очей (Remix)', dur: 'MP3', src: 'assets/music/Adecvat_Production За Цвет Голубых Очей (Remix).mp3' },
  { title: '50. Morgenshtern — Дом (Лондон, Прага, Ницца)', dur: 'MP3', src: 'assets/music/Morgenshtern Дом (Лондон, Прага, Ницца).mp3' }
];

let curTrack = 0;
let isPlaying = false;
const audioEl = document.getElementById('audio-player');
let audioCtx = null, masterGain = null, synthTimer = null, stepIdx = 0;

function renderPlaylist() {
  const list = document.getElementById('track-list');
  list.innerHTML = tracks.map((t, i) => `
    <div class="track-item ${i === curTrack ? 'active' : ''}" onclick="selectTrack(${i})">
      <span>${t.title}</span>
      <span>${t.dur}</span>
    </div>
  `).join('');
}

function initFallbackSynth() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.14;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playFallbackNote(freq, dur) {
  if (!audioCtx || !isPlaying) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(0.001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.04);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur / 1000);
  osc.connect(g);
  g.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + dur / 1000 + 0.04);
}

function playCurrent() {
  clearInterval(synthTimer);
  audioEl.pause();
  const tr = tracks[curTrack];
  audioEl.src = encodeURI(tr.src);

  audioEl.play().catch(() => {
    initFallbackSynth();
    synthTimer = setInterval(() => {
      if (!isPlaying) return;
      playFallbackNote(260 + (curTrack % 7) * 45, 320);
      stepIdx++;
    }, 380);
  });
}

function toggleMusic() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('play-btn');
  const eq = document.getElementById('eq-vis');

  if (isPlaying) {
    btn.textContent = 'Pause';
    eq.classList.add('playing');
    playCurrent();
  } else {
    btn.textContent = 'Play';
    eq.classList.remove('playing');
    clearInterval(synthTimer);
    audioEl.pause();
  }
}

function selectTrack(idx) {
  curTrack = idx;
  stepIdx = 0;
  document.getElementById('now-playing-title').textContent = tracks[idx].title;
  renderPlaylist();
  isPlaying = true;
  document.getElementById('play-btn').textContent = 'Pause';
  document.getElementById('eq-vis').classList.add('playing');
  playCurrent();
}

function nextTrack() { selectTrack((curTrack + 1) % tracks.length); }
function prevTrack() { selectTrack((curTrack - 1 + tracks.length) % tracks.length); }
function changeVolume(val) {
  audioEl.volume = val / 100;
  if (masterGain) masterGain.gain.value = (val / 100) * 0.35;
}

// 9. КАЛЬКУЛЯТОР FILAMENT STUDIO
let matTemp = 240, matRate = 1.8, matTitle = 'PETG';

function selectMat(btn, mat, nozzle, rate) {
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  matTitle = mat; matTemp = nozzle; matRate = rate;
  calcFilament();
}

function calcFilament() {
  const w = document.getElementById('w-slider').value;
  document.getElementById('w-val').textContent = w;
  document.getElementById('mat-out').textContent = `${matTitle} (${matTemp}°C) • Выйдет ~${Math.round(w * matRate)} ₽`;
}

// 10. КОНСОЛЬ
const termIn = document.getElementById('term-in');
const termLog = document.getElementById('term-log');

function execCmd(cmd) {
  const c = cmd.trim().toLowerCase();
  if (c === 'clear') { termLog.innerHTML = ''; return; }

  let out = '';
  if (c === 'help') out = 'Команды: theme, open all, readme, devices, projects, music, scatter, clear';
  else if (c === 'theme') { toggleThemeMode(); out = `Переключен режим.`; }
  else if (c === 'open all') { reopenAll(); out = 'Все окна открыты.'; }
  else if (c === 'readme' || c === 'about') { reopenWin('win-2'); out = 'Открыто окно README.md'; }
  else if (c === 'devices') { reopenWin('win-3'); out = 'Открыто окно devices.gallery'; }
  else if (c === 'projects') { reopenWin('win-4'); out = 'Открыто окно projects'; }
  else if (c === 'music') { reopenWin('win-5'); out = 'Открыто окно music.playlist'; }
  else if (c === 'scatter') { scatterWindows(true); out = 'Окна разбросаны.'; }
  else out = `fish: команда не найдена: ${c}`;

  termLog.innerHTML += `<div style="margin-top:4px;"><span style="color:var(--mint)">~</span> <span style="color:var(--accent)">❯</span> ${c}<br>${out}</div>`;
  termLog.scrollTop = termLog.scrollHeight;
}

termIn.addEventListener('keydown', e => {
  if (e.key === 'Enter' && termIn.value) {
    execCmd(termIn.value);
    termIn.value = '';
  }
});

// СТАРТ
setThemeMode('light');
switchDevice(0);
renderProject();
renderPlaylist();
setTimeout(() => scatterWindows(true), 120);

setInterval(() => {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('ru-RU', { hour12: false }) + ' MSK';
}, 1000);