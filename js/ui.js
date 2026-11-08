/* SpeakTrip UI —— 外壳、路由、今天 / 课程 / 手册 / 我的 / 引导 */
(function () {
  'use strict';
  var E = window.ENG;
  var SP = window.SP = window.SP || {};
  var s = SP.state = E.load();

  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.4 12 3.6l8.5 6.8"/><path d="M5.6 9.2V20a.8.8 0 0 0 .8.8h11.2a.8.8 0 0 0 .8-.8V9.2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.8A1.8 1.8 0 0 1 5.8 3H19v15.5H5.8A1.8 1.8 0 0 0 4 20.3V4.8Z"/><path d="M4 18.5V21h15"/><path d="M8 7.5h7"/></svg>',
    review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.4 5.6"/><path d="M20 4.5V11h-6.5"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4.2L6 21V4.5Z"/></svg>',
    me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.7"/><path d="M4.8 20.5c.6-3.6 3.6-5.8 7.2-5.8s6.6 2.2 7.2 5.8"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4v-5Z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 10l5.9-.9L12 3.8Z"/></svg>',
    starFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 10l5.9-.9L12 3.8Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>'
  };
  SP.ICONS = ICONS;

  /* ---------------- 工具 ---------------- */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  SP.esc = esc;

  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  SP.save = function () { E.save(s); };
  SP.unitById = function (id) {
    var u = E.index().units;
    for (var i = 0; i < u.length; i++) if (u[i].id === id) return u[i];
    return null;
  };

  var toastTimer = null;
  SP.toast = function (msg, ms) {
    var t = $('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 1900);
  };

  function isStandalone() {
    return window.matchMedia && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
  }
  SP.isStandalone = isStandalone;

  SP.speak = function (text, opts) {
    opts = opts || {};
    opts.rate = opts.rate || s.settings.rate;
    opts.voiceURI = s.settings.voiceURI;
    return window.Voice.speak(text, opts);
  };
  SP.sayItem = function (id, opts) {
    var it = E.item(id);
    if (it) SP.speak(it.en, opts);
  };

  /* ---------------- 路由 ---------------- */
  SP.go = function (path) {
    path = String(path || 'today').replace(/^#?\/?/, '');
    if (location.hash === '#/' + path) { SP.render(); }
    else location.hash = '#/' + path;
  };

  function routeParts() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    return p.length ? p : ['today'];
  }
  SP.routeParts = routeParts;

  /* ---------------- 外壳 ---------------- */
  function topbar() {
    var st = E.streakDays(s);
    var sub = s.profile ? '第 ' + (Math.max(1, Math.floor((Date.now() - new Date(s.profile.startDate).getTime()) / E.DAY) + 1)) + ' 天' : '';
    return '<header class="topbar">' +
      '<div class="brand"><div class="logo">A</div><div><div class="title">开口说</div><div class="sub">SpeakTrip · ' + esc(sub) + '</div></div></div>' +
      '<div class="streak"><span class="flame">🔥</span>' + st + ' 天</div>' +
      '</header>';
  }

  function tabbar(active) {
    var items = [
      ['today', '今天', ICONS.home],
      ['course', '课程', ICONS.book],
      ['review', '复习', ICONS.review],
      ['book', '手册', ICONS.bookmark],
      ['me', '我的', ICONS.me]
    ];
    return '<nav class="tabbar">' + items.map(function (it) {
      return '<button class="tab' + (active === it[0] ? ' active' : '') + '" data-nav="' + it[0] + '">' + it[2] + '<span>' + it[1] + '</span></button>';
    }).join('') + '</nav>';
  }

  SP.shell = function (inner, opts) {
    opts = opts || {};
    var app = $('app');
    var head = opts.top !== undefined ? opts.top : (opts.tabs === false ? '' : topbar());
    app.innerHTML = head +
      '<main class="view' + (opts.tabs === false ? ' no-tabs' : '') + '" id="view">' + inner + '</main>' +
      (opts.tabs === false ? '' : tabbar(opts.tab || ''));
    window.scrollTo(0, 0);
  };

  SP.view = function (html) {
    var v = $('view');
    if (v) v.innerHTML = html;
  };

  /* ---------------- 弹层 ---------------- */
  SP.closeSheet = function () {
    var b = document.querySelector('.sheet-back'), sh = document.querySelector('.sheet');
    if (b) b.remove();
    if (sh) sh.remove();
  };
  SP.sheet = function (html) {
    SP.closeSheet();
    var back = document.createElement('div');
    back.className = 'sheet-back';
    back.setAttribute('data-act', 'closeSheet');
    var sh = document.createElement('div');
    sh.className = 'sheet';
    sh.innerHTML = '<div class="grab"></div>' + html;
    document.body.appendChild(back);
    document.body.appendChild(sh);
  };

  /* ---------------- 今天 ---------------- */
  function ring(pct, big, small, size) {
    size = size || 74;
    var stroke = 5;
    var r = size / 2 - stroke - 2;
    var c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, pct)));
    var mid = size / 2;
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle class="track" cx="' + mid + '" cy="' + mid + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"/>' +
      '<circle class="val" cx="' + mid + '" cy="' + mid + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg><div class="num">' + big + '<span>' + small + '</span></div></div>';
  }

  function planRow(icon, title, desc, attrs, done) {
    return '<button class="plan-item" ' + attrs + '>' +
      '<span class="dot' + (done ? ' done' : '') + '">' + (done ? ICONS.check : icon) + '</span>' +
      '<span class="grow"><span class="t">' + title + '</span><span class="d">' + desc + '</span></span>' +
      '<span class="go">' + ICONS.chevron + '</span></button>';
  }

  function screenToday() {
    var p = E.plan(s);
    var est = E.estimate(s);
    var goal = p.goalMinutes || 30;
    var pct = Math.min(1, p.minutesToday / goal);
    var h = new Date().getHours();
    var greet = h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
    var name = (s.profile && s.profile.name) || '同学';
    var d = new Date();
    var dateLine = (d.getMonth() + 1) + '月' + d.getDate() + '日 · 周' + E.weekdayCN(d);
    var weekMeta = E.index().weeks.filter(function (w) { return w.n === (p.nextUnit ? p.nextUnit.week : 12); })[0];

    var rows = '';
    rows += planRow(ICONS.review, p.dueCount ? '复习 ' + p.dueCount + ' 张卡' : '今天没有到期卡片',
      p.dueCount ? '按遗忘曲线安排，先复习再学新句' : '很好，记忆曲线还在休息',
      'data-nav="review"', p.dueCount === 0);

    if (p.nextUnit) {
      rows += planRow(ICONS.book, '第 ' + p.nextUnit.week + ' 周 · ' + p.nextUnit.title,
        p.nextUnit.scene + ' · 8 句', 'data-nav="lesson/' + p.nextUnit.id + '"', false);
    } else {
      rows += planRow(ICONS.book, '主线 24 单元已学完', '进入循环巩固：复习 + 跟读 + 情景重演', 'data-nav="review"', true);
    }

    rows += planRow(ICONS.spark, p.newPhrases.length ? '扩展 ' + p.newPhrases.length + ' 句手册' : '今天的手册扩展已完成',
      p.newPhrases.length ? '每天从 96 句高频短语里补一点' : '想加练就去手册里挑几句',
      p.newPhrases.length ? 'data-nav="review"' : 'data-nav="book"', p.newPhrases.length === 0);

    rows += planRow(ICONS.mic, '开口跟读 5 句', '对着手机说，系统给出发音匹配度', 'data-act="speakDrill"', false);

    var strip = E.last7(s).map(function (day) {
      var isToday = day.date === E.dayStr();
      var active = day.cards > 0 || day.min > 0;
      var cls = 'd' + (active ? ' on' : '') + (isToday ? ' today' : '');
      var dd = parseInt(day.date.slice(8, 10), 10);
      return '<div class="' + cls + '"><b>' + E.weekdayCN(day.date + 'T00:00:00') + '</b><i>' + dd + '</i></div>';
    }).join('');

    var installTip = '';
    if (!isStandalone()) {
      installTip = '<div class="card tight mt12 row between" style="background:var(--brand-soft);border-color:transparent">' +
        '<div><div class="h3" style="color:var(--brand)">装到手机桌面</div><div class="small muted">像 App 一样打开，断网也能用</div></div>' +
        '<button class="btn btn-sm btn-brand" data-act="install">安装</button></div>';
    }

    var placeBanner = '';
    if (s.profile && s.profile.level !== 'zero' && !s.profile.placed) {
      placeBanner = '<div class="card tight mt12 row between" style="background:var(--accent-soft);border-color:transparent">' +
        '<div><div class="h3">先花 5 分钟定位</div><div class="small muted">跳过太简单的单元，从你卡住的地方开始</div></div>' +
        '<button class="btn btn-sm btn-primary" data-nav="level">测评</button></div>';
    }

    return '<div class="screen">' +
      '<section class="hero"><div class="greet">' + greet + '，' + esc(name) + '</div>' +
      '<div class="line"><div><div class="day">今天，开口说 10 句</div><div class="small muted mt8">' + dateLine + ' · 目标 ' + goal + ' 分钟</div></div>' +
      ring(pct, Math.round(pct * 100) + '%', '今日', 64) + '</div></section>' +
      placeBanner +

      '<div class="card mt16"><div class="row between"><div class="h3">今日计划</div><span class="pill' + (p.dayDone ? ' good' : '') + '">' + (p.dayDone ? '已完成' : p.dueCount + ' 张到期') + '</span></div>' +
      '<div class="mt8">' + rows + '</div></div>' +

      '<div class="card mt12"><div class="row between"><div><div class="h3">本周：' + esc(weekMeta ? weekMeta.title : '巩固周') + '</div><div class="small muted mt8">' + esc(weekMeta ? weekMeta.focus : '复习与真实对话') + '</div></div>' +
      '<span class="pill brand">第 ' + (weekMeta ? weekMeta.n : 12) + ' 周</span></div>' +
      '<div class="weekstrip mt16">' + strip + '</div>' +
      '<div class="small faint mt12">阶段目标：' + esc(weekMeta ? weekMeta.milestone : '把学过的句子真正说出来') + '</div></div>' +

      '<div class="mt20"><div class="row between"><div class="h3">随手用</div><span class="small faint">离线可用</span></div>' +
      '<div class="quick mt12">' +
      '<button data-nav="quick"><span class="emo">🆘</span><span class="t">应急卡</span></button>' +
      '<button data-nav="book"><span class="emo">📖</span><span class="t">手册</span></button>' +
      '<button data-act="random"><span class="emo">🎲</span><span class="t">随机一句</span></button>' +
      '<button data-nav="ai"><span class="emo">🤖</span><span class="t">AI 加练</span></button>' +
      '</div></div>' +

      installTip +

      '<div class="card mt20 flat" style="background:transparent;border-style:dashed"><div class="row between"><div class="small muted">当前估算</div><div class="pill">' + est.level + '</div></div>' +
      '<div class="small muted mt8">' + esc(est.levelDesc) + ' · 已掌握 ' + est.mature + ' 句</div></div>' +
      '</div>';
  }

  /* ---------------- 课程 ---------------- */
  function screenCourse() {
    var byWeek = E.unitsByWeek();
    var weeks = E.index().weeks;
    var est = E.estimate(s);
    var total = est.total;
    var learned = est.learned;
    var pct = total ? Math.round(learned / total * 100) : 0;
    var startWeek = 1;
    if (s.profile && s.profile.startUnit) {
      var su = SP.unitById(s.profile.startUnit);
      if (su) startWeek = su.week;
    }

    var chips = weeks.map(function (w) {
      return '<button class="chip" data-act="scrollTo" data-target="week-' + w.n + '">W' + w.n + ' ' + esc(w.title) + '</button>';
    }).join('');

    var body = weeks.map(function (w) {
      var wp = E.weekProgress(s, w.n);
      var list = byWeek[w.n] || [];
      return '<section id="week-' + w.n + '">' +
        '<div class="week-head"><div class="n">W' + w.n + '</div><div><div class="t">' + esc(w.title) + '</div><div class="s">' + esc(w.focus) + '</div></div><div class="pct">' + wp.pct + '%</div></div>' +
        list.map(function (u) {
          var up = E.unitProgress(s, u);
          var badge = up.known ? '<span class="pill good">已掌握</span>'
            : up.skipped ? '<span class="pill">已跳过</span>'
            : up.done ? '<span class="pill good">已学</span>'
            : up.learned ? '<span class="pill accent">继续</span>'
            : '<span class="pill">未开始</span>';
          return '<button class="unit-card' + (up.done ? ' done' : '') + '" data-nav="lesson/' + u.id + '">' +
            '<div class="top"><span class="grow"><span class="title">' + esc(u.title) +
            (u.tier === 'adv' ? ' <span class="pill brand" style="font-size:9px;padding:2px 7px;vertical-align:2px">进阶</span>' : '') +
            '</span><span class="scene">' + esc(u.scene) + '</span></span>' + badge + '</div>' +
            '<div class="meta"><span class="bar thin"><i style="width:' + up.pct + '%"></i></span><span class="n">' + up.learned + '/' + up.total + ' 句</span></div>' +
            '</button>';
        }).join('') + '</section>';
    }).join('');

    return '<div class="screen">' +
      '<div class="mt12"><div class="h1">16 周 · 32 单元</div><div class="small muted mt8">W1–12 生存与日常，W13–16 进阶（B1–B2）。每天 1 个单元，' + total + ' 句核心表达。</div></div>' +
      '<div class="card mt16 tight"><div class="row between"><div class="small muted">总体进度</div><div class="small" style="font-weight:700">' + learned + ' / ' + total + '</div></div>' +
      '<div class="bar mt8"><i style="width:' + pct + '%"></i></div>' +
      '<div class="row between mt12"><div class="small faint">起点：第 ' + startWeek + ' 周</div><button class="btn btn-sm btn-ghost" data-act="startPoint">调整起点</button></div></div>' +
      '<div class="chips mt16">' + chips + '</div>' +
      '<div class="mt8">' + body + '</div>' +
      '</div>';
  }

  /* ---------------- 手册 ---------------- */
  function phraseRow(it) {
    var fav = s.favorites.indexOf(it.id) >= 0;
    return '<div class="phrase" data-id="' + it.id + '">' +
      '<div class="grow"><div class="en">' + esc(it.en) + '</div><div class="zh">' + esc(it.zh) + '</div></div>' +
      '<div class="acts">' +
      '<button data-act="say" data-id="' + it.id + '" aria-label="朗读">' + ICONS.volume + '</button>' +
      '<button data-act="fav" data-id="' + it.id + '" class="' + (fav ? 'on' : '') + '" aria-label="收藏">' + (fav ? ICONS.starFill : ICONS.star) + '</button>' +
      '</div></div>';
  }

  function screenBook() {
    var favs = s.favorites.map(function (id) { return E.item(id); }).filter(Boolean);
    var cats = window.PHRASEBOOK || [];
    return '<div class="screen">' +
      '<div class="mt12"><div class="h1">口袋手册</div><div class="small muted mt8">8 个场景 · 96 句。搜索英文或中文，点小喇叭就能读。</div></div>' +
      '<div class="search mt16">' + ICONS.search + '<input id="q" type="search" placeholder="搜英文 / 中文，如 酒店、check in" autocomplete="off"></div>' +
      '<div id="bookBody" class="mt16">' + bookBody(favs, cats) + '</div>' +
      '</div>';
  }

  function bookBody(favs, cats) {
    return '<div class="cat-grid">' + cats.map(function (c) {
      return '<button class="cat" data-nav="book/' + c.id + '"><span class="emo">' + c.icon + '</span><span class="n">' + esc(c.name) + '</span><span class="c">' + c.items.length + ' 句</span></button>';
    }).join('') + '</div>' +
      (favs.length ? '<div class="mt20"><div class="row between"><div class="h3">收藏</div><span class="small faint">' + favs.length + ' 句</span></div><div class="card mt8">' + favs.map(phraseRow).join('') + '</div></div>' : '');
  }

  function screenBookCat(catId) {
    var cat = (window.PHRASEBOOK || []).filter(function (c) { return c.id === catId; })[0];
    if (!cat) return screenBook();
    var items = cat.items.map(function (p, i) { return { id: 'p:' + cat.id + ':' + i, en: p[0], zh: p[1] }; });
    return '<div class="screen">' +
      '<div class="row between mt12"><button class="icon-btn bare" data-nav="book" aria-label="返回">' + ICONS.back + '</button><div class="h2">' + cat.icon + ' ' + esc(cat.name) + '</div><div style="width:42px"></div></div>' +
      '<div class="card mt16">' + items.map(phraseRow).join('') + '</div>' +
      '</div>';
  }

  function searchResults(q) {
    q = q.trim().toLowerCase();
    if (!q) return null;
    var out = [];
    var items = E.index().items;
    for (var i = 0; i < items.length && out.length < 40; i++) {
      var it = items[i];
      if (it.en.toLowerCase().indexOf(q) >= 0 || it.zh.indexOf(q) >= 0) out.push(it);
    }
    if (!out.length) return '<div class="card center" style="padding:32px 16px"><div class="h3">没找到</div><div class="small muted mt8">换个关键词，比如「机场」「coffee」</div></div>';
    return '<div class="small faint">找到 ' + out.length + ' 句</div><div class="card mt8">' + out.map(phraseRow).join('') + '</div>';
  }

  /* ---------------- 应急卡 ---------------- */
  function screenQuick() {
    var cat = (window.PHRASEBOOK || []).filter(function (c) { return c.id === 'survival'; })[0];
    var items = cat.items.map(function (p, i) { return { id: 'p:survival:' + i, en: p[0], zh: p[1] }; });
    return '<div class="screen">' +
      '<div class="row between mt12"><button class="icon-btn bare" data-nav="today" aria-label="返回">' + ICONS.back + '</button><div class="h2">应急卡</div><div style="width:42px"></div></div>' +
      '<div class="small muted mt8">手机没网也能打开（首次加载后离线缓存）。给对方看屏幕也行。</div>' +
      '<div class="stack mt16">' + items.map(function (it) {
        return '<button class="card" style="text-align:left" data-act="say" data-id="' + it.id + '">' +
          '<div class="en" style="font-family:var(--serif);font-size:22px;line-height:1.3">' + esc(it.en) + '</div>' +
          '<div class="small muted mt8">' + esc(it.zh) + '</div></button>';
      }).join('') + '</div></div>';
  }

  /* ---------------- 我的 ---------------- */
  function seg(id, opts, cur) {
    return '<div class="seg" id="' + id + '">' + opts.map(function (o) {
      return '<button data-act="set" data-key="' + id + '" data-val="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  function screenMe() {
    var est = E.estimate(s);
    var st = E.countByStatus(s);
    var totalMin = 0, days = 0;
    Object.keys(s.stats).forEach(function (k) { totalMin += s.stats[k].min || 0; if ((s.stats[k].cards || 0) > 0) days += 1; });
    var heat = heatmap();
    var voices = window.Voice.allVoices().filter(function (v) { return /^en/i.test(v.lang); });
    var voiceOpts = '<option value="">自动选择（推荐）</option>' + voices.map(function (v) {
      return '<option value="' + esc(v.voiceURI) + '"' + (s.settings.voiceURI === v.voiceURI ? ' selected' : '') + '>' + esc(v.name) + ' · ' + esc(v.lang) + '</option>';
    }).join('');

    var startWeek = 1;
    if (s.profile && s.profile.startUnit) {
      var su = SP.unitById(s.profile.startUnit);
      if (su) startWeek = su.week;
    }
    var cs = window.ContentSync ? ContentSync.stats() : { version: 0, updatedAt: '', lastCheck: 0 };
    var lastTxt = cs.lastCheck
      ? new Date(cs.lastCheck).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '还没检查过';

    return '<div class="screen">' +
      '<div class="mt12 profile"><div class="avatar-lg">' + esc(((s.profile && s.profile.name) || '同').slice(0, 1)) + '</div>' +
      '<div class="grow"><div class="h2">' + esc((s.profile && s.profile.name) || '同学') + '</div>' +
      '<div class="small muted">第 ' + (s.profile ? Math.floor((Date.now() - new Date(s.profile.startDate).getTime()) / E.DAY) + 1 : 1) + ' 天 · 连续 ' + E.streakDays(s) + ' 天</div></div>' +
      '<span class="pill brand">' + est.level + '</span></div>' +

      '<div class="card mt16"><div class="row between"><div class="h3">出国交流准备度</div><div class="meter"><span class="v">' + est.readiness + '</span><span class="u">/ 100</span></div></div>' +
      '<div class="bar mt8"><i style="width:' + est.readiness + '%"></i></div>' +
      '<div class="small muted mt12">' + esc(est.levelDesc) + '。这是基于已掌握句子与跟读准确率的估算，不是考试成绩。</div></div>' +

      '<div class="stat-grid mt12">' +
      '<div class="stat"><div class="v">' + est.mature + '</div><div class="l">已掌握句子</div></div>' +
      '<div class="stat"><div class="v">' + st.learning + '</div><div class="l">正在记忆</div></div>' +
      '<div class="stat"><div class="v">' + Math.round(totalMin) + '</div><div class="l">累计分钟</div></div>' +
      '<div class="stat"><div class="v">' + est.speakAccuracy + '%</div><div class="l">跟读平均匹配</div></div>' +
      '</div>' +

      '<div class="card mt12"><div class="row between"><div class="h3">最近 12 周</div><span class="small faint">' + days + ' 天有学习</span></div>' +
      '<div class="heat mt12">' + heat + '</div>' +
      '<div class="row between mt8"><span class="tiny faint">12 周前</span><span class="tiny faint">今天</span></div></div>' +

      '<div class="card mt16"><div class="h3">学习设置</div>' +
      '<div class="setting"><div><div class="l">分级与起点</div><div class="h">从第 ' + startWeek + ' 周开始' +
      (s.profile && s.profile.placementScore != null ? ' · 测评 ' + s.profile.placementScore + '/12' : ' · 未测评') + '</div></div>' +
      '<button class="btn btn-sm btn-ghost" data-nav="level">重新测评</button></div>' +
      '<div class="setting"><div><div class="l">AI 加练</div><div class="h">用自己的 API Key 现生成句子</div></div>' +
      '<button class="btn btn-sm btn-ghost" data-nav="ai">打开</button></div>' +
      '<div class="setting"><div><div class="l">朗读语速</div><div class="h">慢一点更容易跟读</div></div>' + seg('rate', [[0.7, '慢'], [0.9, '正常'], [1.1, '快']], s.settings.rate) + '</div>' +
      '<div class="setting"><div><div class="l">每日扩展句</div><div class="h">从手册补充的句子数</div></div>' + seg('newPhrases', [[0, '0'], [4, '4'], [8, '8']], s.settings.newPhrases) + '</div>' +
      '<div class="setting"><div><div class="l">自动朗读</div><div class="h">卡片出现时自动发音</div></div><button class="switch' + (s.settings.autoPlay ? ' on' : '') + '" data-act="toggle" data-key="autoPlay" aria-label="自动朗读"></button></div>' +
      '<div class="setting"><div><div class="l">显示中文</div><div class="h">学习卡默认显示翻译</div></div><button class="switch' + (s.settings.showZh ? ' on' : '') + '" data-act="toggle" data-key="showZh" aria-label="显示中文"></button></div>' +
      '<div class="setting"><div><div class="l">反馈音</div><div class="h">答对答错的轻提示</div></div><button class="switch' + (s.settings.sound !== false ? ' on' : '') + '" data-act="toggle" data-key="sound" aria-label="反馈音"></button></div>' +
      '<div class="setting"><div><div class="l">深色模式</div><div class="h">默认跟随系统</div></div>' + seg('theme', [['auto', '自动'], ['light', '浅色'], ['dark', '深色']], s.settings.theme) + '</div>' +
      '<div class="setting"><div><div class="l">发音人</div><div class="h">系统英文语音，可试听</div></div><button class="btn btn-sm btn-ghost" data-act="testVoice">试听</button></div>' +
      '<select id="voiceSel" style="width:100%;margin-top:10px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:14px">' + voiceOpts + '</select>' +
      '</div>' +

      '<div class="card mt16"><div class="h3">内容更新</div>' +
      '<div class="setting" style="border-bottom:0"><div><div class="l">课程包</div><div class="h">v' + cs.version +
      (cs.updatedAt ? ' · ' + esc(cs.updatedAt) : ' · 内置') + ' · 上次检查 ' + esc(lastTxt) + '</div></div>' +
      '<button class="btn btn-sm btn-ghost" data-act="checkContent">检查更新</button></div>' +
      '<div class="small muted mt8">内容地址</div>' +
      '<input id="contentUrl" value="' + esc(s.settings.contentUrl || 'content/manifest.json') + '" spellcheck="false" style="width:100%;margin-top:6px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:14px">' +
      '<button class="btn btn-sm btn-ghost mt8" data-act="saveContentUrl">保存地址</button>' +
      '<div class="small faint mt8" style="line-height:1.6">指向任意 HTTPS 上的 manifest.json。有新版本会在打开应用时静默合并，断网继续读缓存；不会动你的学习记录。</div></div>' +

      '<div class="card mt16"><div class="h3">数据与安装</div>' +
      '<div class="setting"><div><div class="l">备份学习记录</div><div class="h">导出 JSON，换手机不丢进度</div></div><button class="btn btn-sm btn-ghost" data-act="export">导出</button></div>' +
      '<div class="setting"><div><div class="l">恢复备份</div><div class="h">选择之前导出的 JSON</div></div><button class="btn btn-sm btn-ghost" data-act="import">导入</button></div>' +
      '<div class="setting"><div><div class="l">添加到主屏幕</div><div class="h">' + (isStandalone() ? '已安装，正在以 App 方式运行' : 'iPhone 用 Safari 分享 → 添加到主屏幕') + '</div></div>' +
      '<button class="btn btn-sm btn-brand" data-act="install"' + (isStandalone() ? ' disabled' : '') + '>' + (isStandalone() ? '已安装' : '安装') + '</button></div>' +
      '<div class="setting"><div><div class="l">清空全部数据</div><div class="h">不可恢复，建议先导出</div></div><button class="btn btn-sm" style="color:var(--bad)" data-act="reset">清空</button></div>' +
      '</div>' +

      '<div class="card mt16"><div class="h3">方法说明</div><div class="small muted mt8" style="line-height:1.7">' +
      '课程按「场景 → 句子 → 跟读 → 复习」组织：每个单元 8 句高频表达，配 1 段 8 轮情景对话；句子进入 SM-2 间隔重复队列，在快忘记时出现；跟读用浏览器语音识别做匹配度打分。' +
      '</div><button class="btn btn-sm btn-ghost mt12" data-act="about">查看 12 周学习方案</button></div>' +

      '<input type="file" id="importFile" accept="application/json,.json" hidden>' +
      '<div class="center small faint mt20" style="padding-bottom:20px">开口说 SpeakTrip · 本地优先，数据只存在这台设备上</div>' +
      '</div>';
  }

  function heatmap() {
    var cells = [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var start = new Date(today.getTime() - 83 * E.DAY);
    for (var i = 0; i < 84; i++) {
      var d = new Date(start.getTime() + i * E.DAY);
      var st = s.stats[E.dayStr(d)];
      var min = st ? (st.min || 0) : 0;
      var lvl = min >= 20 ? 'l3' : min >= 8 ? 'l2' : min > 0 ? 'l1' : '';
      cells.push('<i class="' + lvl + '" title="' + E.dayStr(d) + '"></i>');
    }
    return cells.join('');
  }

  /* ---------------- 引导 ---------------- */
  var draft = { name: '', level: 'zero', minutes: 30, goal: 'travel' };

  function screenOnboard(step) {
    step = step || 1;
    if (step === 1) {
      return '<div class="onboard screen">' +
        '<div class="logo-xl">A</div>' +
        '<div class="h1 mt20">开口说<br>把「不敢说」变成「说得出来」</div>' +
        '<div class="small muted mt12" style="line-height:1.7">16 周、32 个出国场景、256 句高频表达。<br>每天 20-30 分钟：学 8 句 → 听 → 说 → 复习。</div>' +
        '<div class="card mt20"><div class="h3">先告诉我怎么称呼你</div>' +
        '<input id="nameInput" value="' + esc(draft.name) + '" placeholder="你的名字（可跳过）" maxlength="12" style="width:100%;margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:16px;outline:none">' +
        '<div class="small faint mt8">只存在本机，用于页面问候。</div></div>' +
        '<button class="btn btn-primary btn-block btn-lg mt20" data-act="obNext">继续</button>' +
        '</div>';
    }
    if (step === 2) {
      var levels = [['zero', '几乎零基础', '认识单词，但开不了口'], ['basic', '能说简单句', '点餐、问路靠单词拼'], ['talk', '能聊几句', '想说更自然、更长的句子']];
      var mins = [['15', '15 分钟', '轻量'], ['30', '30 分钟', '标准'], ['45', '45 分钟', '加速'], ['60', '60 分钟', '冲刺']];
      return '<div class="onboard screen">' +
        '<div class="small faint">第 2 / 3 步</div>' +
        '<div class="h1 mt8">你现在的口语</div>' +
        '<div class="pick mt16">' + levels.map(function (l) {
          return '<button data-act="obLevel" data-val="' + l[0] + '" class="' + (draft.level === l[0] ? 'on' : '') + '"><span class="em">' + (l[0] === 'zero' ? '🌱' : l[0] === 'basic' ? '🌿' : '🌳') + '</span><span>' + l[1] + '<span class="sub">' + l[2] + '</span></span></button>';
        }).join('') + '</div>' +
        '<div class="h1 mt20" style="font-size:20px">每天能投入</div>' +
        '<div class="pick mt12">' + mins.map(function (m) {
          return '<button data-act="obMin" data-val="' + m[0] + '" class="' + (String(draft.minutes) === m[0] ? 'on' : '') + '"><span>' + m[1] + '<span class="sub">' + m[2] + '</span></span></button>';
        }).join('') + '</div>' +
        '<button class="btn btn-primary btn-block btn-lg mt20" data-act="obNext">继续</button>' +
        '</div>';
    }
    var days = Math.round(192 / Math.max(1, Math.floor(draft.minutes / 30) * 8)) * 8;
    return '<div class="onboard screen">' +
      '<div class="small faint">第 3 / 3 步</div>' +
      '<div class="h1 mt8">你的 12 周路线</div>' +
      '<div class="card mt16"><div class="row between"><div class="small muted">每天</div><div class="h3">' + draft.minutes + ' 分钟</div></div>' +
      '<div class="divider"></div>' +
      '<div class="row between"><div class="small muted">主线</div><div class="h3">32 单元 / 256 句</div></div>' +
      '<div class="divider"></div>' +
      '<div class="row between"><div class="small muted">节奏</div><div class="h3">每天 1 单元 + 复习</div></div>' +
      '<div class="divider"></div>' +
      '<div class="row between"><div class="small muted">最快走完</div><div class="h3">约 5 周</div></div>' +
      '</div>' +
      '<div class="card mt12" style="background:var(--brand-soft);border-color:transparent"><div class="h3" style="color:var(--brand)">之后 8 周做什么</div>' +
      '<div class="small mt8" style="line-height:1.7">主线学完后，应用自动切换到「巩固模式」：间隔重复 + 96 句手册扩展 + 情景重演 + 每周一次真实对话任务。这才是能出国的关键。</div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="obDone">开始第 1 天</button>' +
      '<div class="center small faint mt12">建议固定一个时间：早起后或睡前 30 分钟</div>' +
      '</div>';
  }

  /* ---------------- 动作 ---------------- */
  SP.actions = {};

  SP.actions.closeSheet = function () { SP.closeSheet(); };
  SP.actions.scrollTo = function (el, d) {
    var t = $(d.target);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  SP.actions.say = function (el, d) {
    var it = E.item(d.id);
    if (!it) return;
    SP.speak(it.en);
    el.animate ? el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 260 }) : null;
  };
  SP.actions.fav = function (el, d) {
    var on = E.toggleFavorite(s, d.id);
    SP.save();
    if (on) { el.classList.add('on'); el.innerHTML = ICONS.starFill; } else { el.classList.remove('on'); el.innerHTML = ICONS.star; }
    SP.toast(on ? '已收藏' : '已取消收藏');
  };
  SP.actions.random = function () {
    var all = E.index().chunks;
    var it = all[Math.floor(Math.random() * all.length)];
    if (!it) return;
    SP.sheet('<div class="center" style="padding:8px 0 4px"><div class="small faint">随手一句</div>' +
      '<div style="font-family:var(--serif);font-size:24px;line-height:1.35;margin-top:12px">' + esc(it.en) + '</div>' +
      '<div class="small muted mt12">' + esc(it.zh) + '</div>' +
      '<div class="row mt20" style="gap:10px"><button class="btn btn-ghost grow" data-act="sayItem" data-id="' + it.id + '">🔊 再听一遍</button>' +
      '<button class="btn btn-primary grow" data-act="closeSheet">好的</button></div></div>');
    SP.speak(it.en);
  };
  SP.actions.sayItem = function (el, d) { SP.sayItem(d.id); };
  SP.actions.speakDrill = function () { SP.startDrill && SP.startDrill(); };

  SP.actions.startPoint = function () {
    var curWeek = 1;
    if (s.profile && s.profile.startUnit) {
      var su = SP.unitById(s.profile.startUnit);
      if (su) curWeek = su.week;
    }
    var weeks = E.index().weeks;
    SP.sheet('<div class="h2">调整起点</div>' +
      '<div class="small muted mt8">选一周开始，之前的单元会标记为「已跳过」；选更早的周会把跳过的单元恢复。</div>' +
      '<div class="stack mt16">' + weeks.map(function (w) {
        return '<button class="unit-card" data-act="setStart" data-week="' + w.n + '">' +
          '<div class="row between"><span class="h3">第 ' + w.n + ' 周 · ' + esc(w.title) + '</span>' +
          (w.n === curWeek ? '<span class="pill brand">当前</span>' : '') + '</div>' +
          '<div class="small muted" style="margin-top:2px">' + esc(w.focus) + '</div></button>';
      }).join('') + '</div>');
  };

  SP.actions.setStart = function (el, d) {
    var wk = parseInt(d.week, 10);
    var list = E.index().units.filter(function (u) { return u.week === wk; });
    if (!list.length) return;
    E.skipToUnit(s, list[0].id);
    s.profile.placed = true;
    SP.save();
    SP.closeSheet();
    SP.toast('起点已设为第 ' + wk + ' 周');
    SP.render();
  };
  SP.actions.install = function () {
    if (isStandalone()) { SP.toast('已经在 App 模式运行'); return; }
    if (SP.deferredPrompt) {
      SP.deferredPrompt.prompt();
      SP.deferredPrompt.userChoice.then(function () { SP.deferredPrompt = null; });
    } else {
      var ua = navigator.userAgent;
      if (/iPhone|iPad|iPod/.test(ua)) SP.toast('Safari 底部「分享」→「添加到主屏幕」');
      else SP.toast('浏览器菜单 →「安装应用 / 添加到主屏幕」');
    }
  };
  SP.actions.checkContent = function () {
    if (!window.ContentSync) return;
    SP.toast('正在检查…');
    ContentSync.check(true).then(function (r) {
      if (r.updated) { SP.toast('已更新到 v' + r.version); SP.render(); }
      else SP.toast('已是最新 v' + r.version);
    }).catch(function (e) {
      SP.toast('检查失败：' + (e.message || '网络不可用'));
    });
  };

  SP.actions.saveContentUrl = function () {
    var el = $('contentUrl');
    s.settings.contentUrl = ((el && el.value) || '').trim();
    SP.save();
    SP.toast('已保存，下次检查生效');
  };

  SP.actions.about = function () {
    SP.sheet('<div class="h2">16 周学习方案</div>' +
      '<div class="small mt12" style="line-height:1.8">' +
      '<b>第 1–4 周 · 建骨架（W1–12）</b><br>每天 1 个单元：先听 8 句、跟读、再演一遍对话。目标是「听到能反应、需要时能说出」。<br><br>' +
      '<b>第 5–8 周 · 变熟练</b><br>主线学完，进入间隔重复。每天复习 + 跟读 + 手册；开始用英语自言自语描述你今天做的事。<br><br>' +
      '<b>第 9–12 周 · 上真实场景</b><br>每周至少 2 次真人对话（语言交换 App、青旅、咖啡馆）。重演对话时不再看提示，录下来回听。<br><br>' +
      '<b>第 13–16 周 · 进阶篇（W13–16）</b><br>8 个更难场景：追问、叙事、礼貌反驳、投诉协商、租房、就医、面试、群聊。句子更长，练的是「接得住」。<br><br>' +
      '<b>每天的最短闭环（20 分钟）</b><br>① 复习到期卡 8 分钟 ② 学 1 单元 10 分钟 ③ 跟读 5 句 5 分钟。<br><br>' +
      '<b>实话</b><br>32 个单元能让你在旅行、住宿、点餐、闲聊、简单协商里不再害怕开口；真正的「自由交流」还需要 200 小时以上的真实对话。这个应用负责把前 100 小时变得高效、不痛苦。' +
      '</div><button class="btn btn-primary btn-block mt16" data-act="closeSheet">知道了</button>');
  };

  SP.actions.set = function (el, d) {
    var key = d.key, val = d.val;
    if (key === 'rate') s.settings.rate = parseFloat(val);
    else if (key === 'newPhrases') s.settings.newPhrases = parseInt(val, 10);
    else if (key === 'theme') { s.settings.theme = val; SP.applyTheme(); }
    SP.save();
    var group = el.parentNode;
    if (group) Array.prototype.forEach.call(group.children, function (b) { b.classList.remove('on'); });
    el.classList.add('on');
  };

  SP.actions.toggle = function (el, d) {
    s.settings[d.key] = !s.settings[d.key];
    el.classList.toggle('on', !!s.settings[d.key]);
    SP.save();
  };

  SP.actions.testVoice = function () {
    SP.speak('Hi, this is how I sound. Ready to practice?', { rate: s.settings.rate });
  };

  SP.actions.export = function () {
    try {
      var blob = new Blob([E.exportData(s)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'speaktrip-' + E.dayStr() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1200);
      SP.toast('已导出备份文件');
    } catch (e) { SP.toast('导出失败，请换浏览器试试'); }
  };

  SP.actions.import = function () { var f = $('importFile'); if (f) f.click(); };
  SP.actions.reset = function () {
    if (!confirm('确定清空全部学习记录？此操作不可恢复，建议先导出备份。')) return;
    if (!confirm('再确认一次：清空后进度、连续天数都会归零。')) return;
    s = SP.state = E.reset();
    SP.save();
    SP.applyTheme();
    SP.go('today');
    SP.toast('已清空');
  };

  SP.actions.obNext = function () {
    if (draft.step === 2) { SP.go('welcome/3'); return; }
    var inp = $('nameInput');
    if (inp) draft.name = inp.value.trim();
    draft.step = 2;
    SP.go('welcome/2');
  };
  SP.actions.obLevel = function (el, d) {
    draft.level = d.val;
    el.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    el.classList.add('on');
  };
  SP.actions.obMin = function (el, d) {
    draft.minutes = parseInt(d.val, 10);
    el.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    el.classList.add('on');
  };
  SP.actions.obDone = function () {
    s.profile = {
      name: draft.name || '同学',
      level: draft.level,
      minutes: draft.minutes,
      goal: draft.goal,
      startDate: new Date().toISOString()
    };
    SP.save();
    if (draft.level !== 'zero') {
      SP.toast('先做 5 分钟测评，定个起点');
      SP.go('level');
    } else {
      SP.toast('开始吧，今天先学 8 句');
      SP.go('today');
    }
  };

  SP.applyTheme = function () {
    var t = s.settings.theme;
    document.documentElement.setAttribute('data-theme', t === 'auto' ? '' : t);
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  };

  /* ---------------- 渲染 ---------------- */
  SP.render = function () {
    s = SP.state;
    var parts = routeParts();
    var root = parts[0];
    var app = $('app');
    app.hidden = false;

    if (!s.profile && root !== 'welcome') { location.hash = '#/welcome/1'; return; }
    if (root === 'welcome') {
      var step = parseInt(parts[1] || '1', 10);
      if (s.profile && !draft.force) { SP.go('today'); return; }
      draft.step = step;
      SP.shell(screenOnboard(step), { tabs: false });
      return;
    }

    // 离开学习/复习时清理
    if (SP.session && root !== 'lesson' && root !== 'review' && root !== 'drill') {
      SP.endSession && SP.endSession();
    }
    window.Voice.stop();
    if (window.Listen) window.Listen.abort();

    if (root === 'level') {
      if (SP.renderLevel) SP.renderLevel();
      return;
    }
    if (root === 'ai') {
      if (SP.renderAI) SP.renderAI();
      return;
    }
    if (root === 'lesson') {
      if (SP.renderLesson) SP.renderLesson(parts[1]);
      return;
    }
    if (root === 'review') {
      if (SP.renderReview) SP.renderReview();
      return;
    }
    if (root === 'drill') {
      if (SP.renderDrill) SP.renderDrill();
      return;
    }

    var tab = root;
    var inner = '';
    if (root === 'today') inner = screenToday();
    else if (root === 'course') inner = screenCourse();
    else if (root === 'book') inner = parts[1] ? screenBookCat(parts[1]) : screenBook();
    else if (root === 'me') inner = screenMe();
    else if (root === 'quick') { inner = screenQuick(); tab = 'today'; }
    else { inner = screenToday(); tab = 'today'; }

    SP.shell(inner, { tab: tab });
  };

  /* ---------------- 事件 ---------------- */
  function bind() {
    var app = $('app');

    app.addEventListener('click', function (e) {
      s = SP.state;
      var el = e.target.closest('[data-nav],[data-act]');
      if (!el) return;
      if (el.hasAttribute('data-nav')) { SP.go(el.getAttribute('data-nav')); return; }
      var act = el.getAttribute('data-act');
      if (!act) return;
      if (SP.actions[act]) { SP.actions[act](el, el.dataset); }
    });

    app.addEventListener('input', function (e) {
      if (e.target.id === 'q') {
        var body = $('bookBody');
        if (!body) return;
        var q = e.target.value;
        var res = searchResults(q);
        if (res === null) {
          var favs = s.favorites.map(function (id) { return E.item(id); }).filter(Boolean);
          body.innerHTML = bookBody(favs, window.PHRASEBOOK || []);
        } else {
          body.innerHTML = res;
        }
      }
    });

    app.addEventListener('change', function (e) {
      if (e.target.id === 'voiceSel') {
        s.settings.voiceURI = e.target.value || '';
        SP.save();
        SP.speak('This is my new voice. How does it sound?');
      }
      if (e.target.id === 'importFile') {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var next = E.importData(String(reader.result));
            next.settings = Object.assign({}, s.settings, next.settings || {});
            SP.state = s = next;
            SP.save();
            SP.applyTheme();
            SP.go('today');
            SP.toast('备份已恢复');
          } catch (err) { SP.toast('文件无法识别：' + err.message); }
        };
        reader.readAsText(f);
        e.target.value = '';
      }
    });

    window.addEventListener('hashchange', function () { SP.render(); });

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      SP.deferredPrompt = e;
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { window.Voice.stop(); if (window.Listen) window.Listen.abort(); SP.save(); }
    });

    setInterval(function () {
      if (document.visibilityState === 'visible' && s.profile) {
        E.addMinutes(s, 1);
        SP.save();
      }
    }, 60000);
  }

  /* ---------------- 启动 ---------------- */
  SP.init = function () {
    SP.applyTheme();
    SP.state = s = E.load();
    if (window.ContentSync) ContentSync.init();
    bind();
    if (!location.hash) location.hash = s.profile ? '#/today' : '#/welcome/1';
    SP.render();
    var boot = $('boot');
    if (boot) boot.remove();

    // 静默检查课程包（6 小时一次），失败不影响使用
    if (window.ContentSync) {
      setTimeout(function () {
        if (navigator.onLine === false) return;
        if (Date.now() - (ContentSync.lastCheck() || 0) < 6 * 3600 * 1000) return;
        ContentSync.check(false).then(function (r) {
          if (!r.updated) return;
          SP.toast('课程包已更新到 v' + r.version);
          var root = SP.routeParts()[0];
          if (['today', 'course', 'book', 'me'].indexOf(root) >= 0) SP.render();
        }).catch(function () {});
      }, 2500);
    }

    // 自检模式：?selftest=1
    if (/[?&]selftest=1/.test(location.search) && window.SELFTEST) {
      try { window.SELFTEST.run(); } catch (e) { document.title = 'SELFTEST ERROR ' + e.message; }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', SP.init);
  else SP.init();
})();
