/* SpeakTrip —— 5 分钟分级测评：听 12 句，定位起点 */
(function () {
  'use strict';
  var E = window.ENG, SP = window.SP, I = SP.ICONS;

  var QIDS = [
    ['c:w1u1:0', 1], ['c:w2u1:0', 1], ['c:w3u1:1', 1],
    ['c:w5u1:2', 2], ['c:w6u2:3', 2], ['c:w7u1:4', 2],
    ['c:w9u1:2', 3], ['c:w10u1:3', 3], ['c:w11u1:2', 3],
    ['c:w13u1:1', 4], ['c:w14u1:0', 4], ['c:w15u2:4', 4]
  ];

  function st() { return SP.state; }
  function esc(v) { return SP.esc(v); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildQuestions() {
    var all = E.index().chunks;
    var out = [];
    QIDS.forEach(function (q) {
      var it = E.item(q[0]);
      if (!it) return;
      var pool = all.filter(function (c) {
        return c.id !== it.id && Math.abs(c.week - it.week) >= 3;
      }).map(function (c) { return c.zh; });
      var opts = [it.zh];
      var guard = 0;
      while (opts.length < 4 && guard++ < 300) {
        var d = pool[Math.floor(Math.random() * pool.length)];
        if (d && opts.indexOf(d) < 0) opts.push(d);
      }
      shuffle(opts);
      out.push({ item: it, options: opts, correct: opts.indexOf(it.zh), tier: q[1] });
    });
    return out;
  }

  function unitForWeek(week) {
    var list = E.index().units.filter(function (u) { return u.week === week; });
    return list.length ? list[0].id : 'w1u1';
  }
  function weekTitle(week) {
    var w = E.index().weeks.filter(function (x) { return x.n === week; })[0];
    return w ? w.title : ('第 ' + week + ' 周');
  }

  function top(pct, counter) {
    return '<header class="topbar" style="gap:10px">' +
      '<button class="icon-btn bare" data-act="levelClose" aria-label="关闭">' + I.close + '</button>' +
      '<div class="grow"><div class="lesson-bar" style="margin:0">' +
      '<span class="phase">分级测评</span>' +
      '<span class="bar thin"><i style="width:' + Math.round(pct * 100) + '%"></i></span>' +
      '<span class="tiny faint">' + counter + '</span>' +
      '</div></div></header>';
  }

  SP.renderLevel = function () {
    if (!SP.level || SP.level.finished || SP.level.phase === 'done') {
      SP.level = { phase: 'intro', i: 0, pick: -1, correct: 0, qs: null, week: null, finished: false, spokenFor: -1 };
    }
    paintLevel();
  };

  function paintLevel() {
    var L = SP.level;
    if (L.phase === 'intro') return paintIntro(L);
    if (L.phase === 'quiz') return paintQuiz(L);
    return paintResult(L);
  }

  function paintIntro(L) {
    var body = '<div class="screen">' +
      '<div class="mt12"><div class="h1">先定位，再学习</div>' +
      '<div class="small muted mt8">12 道听力题，约 5 分钟。答完会建议一个起点周，之前太简单的单元自动标记为「已跳过」——之后想补随时能回来。</div></div>' +
      '<div class="card mt16">' +
      '<div class="row between"><div class="small muted">题量</div><div class="h3">12 句</div></div><div class="divider"></div>' +
      '<div class="row between"><div class="small muted">形式</div><div class="h3">听英文，选中文意思</div></div><div class="divider"></div>' +
      '<div class="row between"><div class="small muted">难度</div><div class="h3">W1 → W15 递进</div></div>' +
      '</div>' +
      '<div class="card mt12" style="background:var(--brand-soft);border-color:transparent">' +
      '<div class="small" style="color:var(--brand);line-height:1.7">听不清就点「再听一遍」，别猜。这个结果只影响起点，不影响成绩。</div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="levelStart">开始测评</button>' +
      '<div class="center mt8"><button class="btn btn-quiet" data-act="levelClose">先不测，从头学</button></div>' +
      '</div>';
    SP.shell(body, { tabs: false, top: top(0, '12 题') });
  }

  function paintQuiz(L) {
    var q = L.qs[L.i];
    var answered = L.pick >= 0;
    var opts = q.options.map(function (text, idx) {
      var cls = 'option';
      if (answered) {
        if (idx === q.correct) cls += ' correct';
        else if (idx === L.pick) cls += ' wrong';
        else cls += ' dim';
      }
      return '<button class="' + cls + '" data-act="levelPick" data-idx="' + idx + '"' + (answered ? ' disabled' : '') + '>' +
        '<span class="idx">' + String.fromCharCode(65 + idx) + '</span><span>' + esc(text) + '</span></button>';
    }).join('');

    var fb = '';
    if (answered) {
      var ok = L.pick === q.correct;
      fb = '<div class="result"><div class="score" style="color:' + (ok ? 'var(--good)' : 'var(--bad)') + '">' + (ok ? '答对了' : '没关系') + '</div>' +
        '<div class="said">' + esc(q.item.en) + '</div>' +
        '<div class="small muted">' + esc(q.item.zh) + '</div></div>' +
        '<button class="btn btn-primary btn-block btn-lg mt16" data-act="levelNext">' +
        (L.i === L.qs.length - 1 ? '看结果' : '下一题') + '</button>';
    }

    var body = '<div class="screen">' +
      '<div class="qprompt">点喇叭听句子，选出最接近的中文</div>' +
      '<button class="card center" style="padding:26px 16px;width:100%" data-act="levelPlay">' +
      '<span class="icon-btn" style="margin:0 auto;background:var(--brand);color:#fff;border:0">' + I.volume + '</span>' +
      '<span class="small muted" style="display:block;margin-top:10px">' + (answered ? '再听一遍' : '点一下播放') + '</span></button>' +
      '<div class="options mt16">' + opts + '</div>' + fb +
      '</div>';
    SP.shell(body, { tabs: false, top: top(L.i / L.qs.length, (L.i + 1) + '/' + L.qs.length) });
    if (!answered && st().settings.autoPlay && L.spokenFor !== L.i) {
      L.spokenFor = L.i;
      setTimeout(function () {
        if (SP.level === L && L.phase === 'quiz' && L.i === q.index) SP.speak(q.item.en);
      }, 160);
    }
  }

  function paintResult(L) {
    var p = E.placement(L.correct, L.qs.length);
    if (L.week == null) L.week = p.week;
    var wk = L.week;
    var skippedUnits = E.index().units.filter(function (u) { return u.week < wk; }).length;
    var first = E.index().units.filter(function (u) { return u.week === wk; });
    var preview = first.map(function (u) { return u.title; }).join(' · ');

    var body = '<div class="screen center" style="padding-top:22px">' +
      '<div class="big-emoji">🎯</div>' +
      '<div class="h1 mt12">你的起点：第 ' + wk + ' 周</div>' +
      '<div class="small muted mt8">答对 ' + L.correct + ' / ' + L.qs.length + ' · ' + esc(weekTitle(wk)) + '</div>' +
      '<div class="card mt20" style="text-align:left">' +
      '<div class="row between"><div class="small muted">从这一周开始</div>' +
      '<div class="seg"><button data-act="levelAdj" data-d="-1" aria-label="往前一周">−</button>' +
      '<span style="padding:6px 6px;font-size:12.5px;font-weight:700">第 ' + wk + ' 周</span>' +
      '<button data-act="levelAdj" data-d="1" aria-label="往后一周">＋</button></div></div>' +
      '<div class="h3 mt8">' + esc(preview) + '</div>' +
      '<div class="small muted mt8">' + (skippedUnits ? '前 ' + (wk - 1) + ' 周共 ' + skippedUnits + ' 个单元会标记为已跳过，不进入复习队列。' : '从第一周开始，最稳。') + '</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="levelConfirm">就从第 ' + wk + ' 周开始</button>' +
      '<button class="btn btn-ghost btn-block mt12" data-act="levelRestart">再测一次</button>' +
      '<div class="center small faint mt12">起点之后也能在「课程 → 调整起点」里改</div>' +
      '</div>';
    SP.shell(body, { tabs: false, top: top(1, '完成') });
  }

  SP.actions.levelStart = function () {
    var L = SP.level;
    L.qs = buildQuestions();
    L.qs.forEach(function (q, i) { q.index = i; });
    L.phase = 'quiz';
    L.i = 0;
    L.pick = -1;
    L.correct = 0;
    L.spokenFor = -1;
    paintLevel();
  };

  SP.actions.levelPlay = function () {
    var L = SP.level;
    if (!L || L.phase !== 'quiz') return;
    SP.speak(L.qs[L.i].item.en);
  };

  SP.actions.levelPick = function (el, d) {
    var L = SP.level;
    if (!L || L.phase !== 'quiz' || L.pick >= 0) return;
    L.pick = parseInt(d.idx, 10);
    var ok = L.pick === L.qs[L.i].correct;
    if (ok) L.correct += 1;
    if (st().settings.sound !== false) { if (ok) window.Tone.ok(); else window.Tone.no(); }
    paintLevel();
  };

  SP.actions.levelNext = function () {
    var L = SP.level;
    if (L.i >= L.qs.length - 1) {
      L.phase = 'result';
      L.week = null;
    } else {
      L.i += 1;
      L.pick = -1;
      L.spokenFor = -1;
    }
    paintLevel();
  };

  SP.actions.levelAdj = function (el, d) {
    var L = SP.level;
    var step = parseInt(d.d, 10);
    L.week = Math.max(1, Math.min(16, (L.week || 1) + step));
    paintLevel();
  };

  SP.actions.levelRestart = function () {
    SP.level = { phase: 'intro', i: 0, pick: -1, correct: 0, qs: null, week: null, finished: false, spokenFor: -1 };
    paintLevel();
  };

  SP.actions.levelConfirm = function () {
    var L = SP.level;
    var S = st();
    if (!S.profile) {
      S.profile = { name: '同学', level: 'basic', minutes: 30, goal: 'travel', startDate: new Date().toISOString() };
    }
    E.skipToUnit(S, unitForWeek(L.week));
    S.profile.placed = true;
    S.profile.placementScore = L.correct;
    SP.save();
    L.finished = true;
    SP.toast('起点已设为第 ' + L.week + ' 周');
    SP.go('today');
  };

  SP.actions.levelClose = function () {
    if (SP.level) SP.level.finished = true;
    SP.go('today');
  };
})();
