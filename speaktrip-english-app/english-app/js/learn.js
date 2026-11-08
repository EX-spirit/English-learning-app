/* SpeakTrip —— 学习会话：单元课、复习、跟读训练 */
(function () {
  'use strict';
  var E = window.ENG;
  var SP = window.SP;
  var I = SP.ICONS;

  function st() { return SP.state; }
  function esc(v) { return SP.esc(v); }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pickN(a, n) { return shuffle(a.slice()).slice(0, n); }

  function topBar(label, pct, counter) {
    return '<header class="topbar" style="gap:10px">' +
      '<button class="icon-btn bare" data-act="exitSession" aria-label="退出">' + I.close + '</button>' +
      '<div class="grow"><div class="lesson-bar" style="margin:0">' +
      '<span class="phase">' + label + '</span>' +
      '<span class="bar thin"><i style="width:' + Math.round(pct * 100) + '%"></i></span>' +
      '<span class="tiny faint">' + counter + '</span>' +
      '</div></div></header>';
  }

  /* ==========================================================
     单元课
     ========================================================== */

  function newLesson(u) {
    var items = E.unitItems(u.id);
    var chunks = items.filter(function (x) { return x.type === 'chunk'; });
    var lines = (u.dialogue && u.dialogue.lines) || [];
    return {
      kind: 'lesson',
      unit: u,
      chunks: chunks,
      lines: lines,
      phase: 'learn',
      i: 0,
      revealed: false,
      spokenFor: -1,
      listenQs: makeQuestions(chunks, 5),
      li: 0,
      liPick: -1,
      liCorrect: 0,
      speakItems: pickN(chunks, 5),
      si: 0,
      res: {},
      dlg: { mode: 'intro', i: 0, playedFor: -1 },
      startedAt: Date.now(),
      scores: []
    };
  }

  function makeQuestions(chunks, n) {
    var all = E.index().chunks;
    var pool = all.filter(function (c) { return chunks.indexOf(c) < 0; })
      .map(function (c) { return c.zh; });
    var picked = pickN(chunks, n);
    return picked.map(function (c) {
      var opts = [c.zh];
      var guard = 0;
      while (opts.length < 4 && guard < 300) {
        guard++;
        var d = pool[Math.floor(Math.random() * pool.length)];
        if (d && opts.indexOf(d) < 0) opts.push(d);
      }
      shuffle(opts);
      return { item: c, options: opts, correct: opts.indexOf(c.zh) };
    });
  }

  SP.renderLesson = function (unitId) {
    var u = SP.unitById(unitId);
    if (!u) { SP.go('course'); return; }
    if (!SP.session || SP.session.kind !== 'lesson' || SP.session.unit.id !== u.id) {
      SP.session = newLesson(u);
    }
    paintLesson();
  };

  function pct() {
    var p = SP.session;
    var total = 8 + 5 + 5 + Math.max(1, p.lines.length);
    var n = 0;
    if (p.phase === 'learn') n = p.i;
    else n = 8;
    if (p.phase === 'listen') n += p.li;
    else if (p.phase !== 'learn') n += 5;
    if (p.phase === 'speak') n += p.si;
    else if (p.phase === 'dialogue' || p.phase === 'done') n += 5;
    if (p.phase === 'dialogue') n += p.dlg.i;
    if (p.phase === 'done') n += p.lines.length;
    return Math.min(1, n / total);
  }

  function paintLesson() {
    var p = SP.session;
    var body = '';
    var label = '', counter = '';

    if (p.phase === 'learn') {
      label = '学新句';
      counter = (p.i + 1) + '/' + p.chunks.length;
      body = viewLearn(p);
    } else if (p.phase === 'listen') {
      label = '听力';
      counter = (p.li + 1) + '/' + p.listenQs.length;
      body = viewListen(p);
    } else if (p.phase === 'speak') {
      label = '跟读';
      counter = (p.si + 1) + '/' + p.speakItems.length;
      body = viewSpeak(p);
    } else if (p.phase === 'dialogue') {
      label = '情景对话';
      counter = p.dlg.mode === 'intro' ? '预览' : (p.dlg.i + 1) + '/' + p.lines.length;
      body = viewDialogue(p);
    } else {
      label = '完成';
      counter = '✓';
      body = viewDone(p);
    }

    SP.shell(body, { tabs: false, top: topBar(label, pct(), counter) });
    setTimeout(function () { autoSpeak(); }, 140);
  }

  function autoSpeak() {
    var p = SP.session;
    if (!p || !st().settings.autoPlay) return;
    if (p.phase === 'learn') {
      if (p.spokenFor === p.i) return;
      p.spokenFor = p.i;
      SP.speak(p.chunks[p.i].en);
    } else if (p.phase === 'dialogue' && p.dlg.mode === 'play') {
      var line = p.lines[p.dlg.i];
      if (!line || line[0] !== 'A') return;
      if (p.dlg.playedFor === p.dlg.i) return;
      p.dlg.playedFor = p.dlg.i;
      SP.speak(line[1], { rate: 0.92 });
    }
  }

  /* ---------- 学新句 ---------- */
  function viewLearn(p) {
    var it = p.chunks[p.i];
    var showZh = p.revealed || (st().settings.showZh && !p.zhOff);
    return '<div class="screen">' +
      (p.i === 0 ? '<div class="hintbox" style="margin-bottom:12px"><b>本单元：</b>' + esc(p.unit.goal) + '</div>' : '') +
      '<div class="flash">' +
      '<button class="icon-btn speaker" data-act="sessSay" data-id="' + it.id + '" aria-label="朗读">' + I.volume + '</button>' +
      '<div class="en">' + esc(it.en) + '</div>' +
      '<div class="zh"' + (showZh ? '' : ' style="filter:blur(6px);user-select:none"') + '>' + esc(it.zh) + '</div>' +
      (it.note ? '<div class="note">' + esc(it.note) + '</div>' : '') +
      '</div>' +
      '<div class="speak-row mt12">' +
      '<button class="btn btn-ghost" data-act="sessPlaySlow">0.7× 慢读</button>' +
      '<button class="btn btn-ghost" data-act="sessReveal">' + (showZh ? '收起中文' : '看中文') + '</button>' +
      '</div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="sessNext">' + (p.i === p.chunks.length - 1 ? '进入听力练习' : '记住了，下一句') + '</button>' +
      '<div class="center mt8"><button class="btn btn-quiet" data-act="sessPrev"' + (p.i === 0 ? ' disabled' : '') + '>上一句</button></div>' +
      '<div class="center mt4"><button class="btn btn-quiet" data-act="sessTooEasy" style="font-size:12px;color:var(--faint)">太简单，跳过本单元</button></div>' +
      '</div>';
  }

  /* ---------- 听力 ---------- */
  function viewListen(p) {
    var q = p.listenQs[p.li];
    var answered = p.liPick >= 0;
    var opts = q.options.map(function (text, idx) {
      var cls = 'option';
      if (answered) {
        if (idx === q.correct) cls += ' correct';
        else if (idx === p.liPick) cls += ' wrong';
        else cls += ' dim';
      }
      return '<button class="' + cls + '" data-act="sessPick" data-idx="' + idx + '"' + (answered ? ' disabled' : '') + '>' +
        '<span class="idx">' + String.fromCharCode(65 + idx) + '</span><span>' + esc(text) + '</span></button>';
    }).join('');

    var fb = '';
    if (answered) {
      var ok = p.liPick === q.correct;
      fb = '<div class="result"><div class="score" style="color:' + (ok ? 'var(--good)' : 'var(--bad)') + '">' + (ok ? '听对了' : '再听一次这句') + '</div>' +
        '<div class="said">' + esc(q.item.en) + '</div>' +
        '<div class="small muted">' + esc(q.item.zh) + '</div></div>' +
        '<button class="btn btn-primary btn-block btn-lg mt16" data-act="sessNextQ">' +
        (p.li === p.listenQs.length - 1 ? '进入跟读' : '下一题') + '</button>';
    }

    return '<div class="screen">' +
      '<div class="qprompt">听发音，选出正确的中文意思</div>' +
      '<button class="card center" style="padding:26px 16px;width:100%" data-act="sessReplay">' +
      '<span class="icon-btn" style="margin:0 auto;background:var(--brand);color:#fff;border:0">' + I.volume + '</span>' +
      '<span class="small muted" style="display:block;margin-top:10px">点一下再听一遍</span></button>' +
      '<div class="options mt16">' + opts + '</div>' + fb +
      '</div>';
  }

  /* ---------- 跟读 ---------- */
  function viewSpeak(p) {
    var it = p.speakItems[p.si];
    var res = p.res[it.id] || { status: 'idle' };
    var supported = window.Listen.supported();

    var head = '<div class="qprompt">用英语说出这句话</div>' +
      '<div class="flash" style="min-height:auto;padding:22px 20px">' +
      '<div class="prompt-zh">' + esc(it.zh) + '</div>' +
      '<div class="small faint mt12" id="enHint">' + (res.hint ? esc(it.en) : '点「看提示」显示英文') + '</div>' +
      '</div>';

    var controls = '';
    if (!supported) {
      controls = '<div class="hintbox mt16">这个浏览器暂不支持跟读评分。可以先用「看提示 → 大声读一遍」的方式练习，装到手机上用 Chrome 效果最好。</div>' +
        '<div class="mt16"><button class="btn btn-ghost btn-block" data-act="sessHint">看提示</button></div>' +
        '<button class="btn btn-primary btn-block btn-lg mt12" data-act="sessNextS">下一句</button>';
    } else if (res.status === 'listening') {
      controls = '<div class="mic-wrap mt16"><button class="mic listening" data-act="sessStopListen">' + I.mic + '</button>' +
        '<div class="mic-label" id="asrPartial">正在听… 请说完整句</div></div>';
    } else if (res.status === 'done') {
      var g = E.gradeLabel(res.score);
      controls = '<div class="result"><div class="row between"><div class="score" style="color:' + (g.tone === 'good' ? 'var(--good)' : g.tone === 'warn' ? 'var(--warn)' : 'var(--bad)') + '">' + g.text + ' · ' + Math.round(res.score * 100) + '</div>' +
        '<button class="icon-btn bare" data-act="sessSay" data-id="' + it.id + '">' + I.volume + '</button></div>' +
        '<div class="said">“' + esc(res.transcript || '—') + '”</div>' +
        '<div class="diff">' + E.wordDiff(it.en, res.transcript || '').map(function (w) {
          return '<span class="w' + (w.ok ? '' : ' bad') + '">' + esc(w.w) + '</span>';
        }).join('') + '</div>' +
        '<div class="small muted mt8">红色是没识别到的词，放慢一点、每个词说清楚。</div></div>' +
        '<div class="row mt12" style="gap:9px"><button class="btn btn-ghost grow" data-act="sessRetry">再说一次</button>' +
        '<button class="btn btn-primary grow" data-act="sessNextS">' + (p.si === p.speakItems.length - 1 ? '进入对话' : '下一句') + '</button></div>';
    } else if (res.status === 'error' || res.status === 'empty') {
      controls = '<div class="hintbox mt16">' + esc(window.Listen.errorText(res.err || (res.status === 'empty' ? 'no-speech' : 'unknown'))) + '</div>' +
        '<div class="row mt12" style="gap:9px"><button class="btn btn-ghost grow" data-act="sessRecord">再试一次</button>' +
        '<button class="btn btn-primary grow" data-act="sessSkip">先跳过</button></div>';
    } else {
      controls = '<div class="mic-wrap mt16"><button class="mic" data-act="sessRecord">' + I.mic + '</button>' +
        '<div class="mic-label">点一下，然后大声说</div></div>' +
        '<div class="center small faint mt8">说完停顿一下，系统会自动评分</div>';
    }

    return '<div class="screen">' + head +
      '<div class="row mt12" style="gap:9px">' +
      '<button class="btn btn-ghost grow" data-act="sessPlaySlow">听慢速</button>' +
      '<button class="btn btn-ghost grow" data-act="sessHint">看提示</button>' +
      '</div>' + controls + '</div>';
  }

  /* ---------- 对话 ---------- */
  function viewDialogue(p) {
    var d = p.dlg;
    if (d.mode === 'intro') {
      var list = p.lines.map(function (l, i) {
        return '<div class="line ' + l[0] + '"><div class="avatar">' + l[0] + '</div>' +
          '<div class="bubble"><span class="en">' + esc(l[1]) + '</span><span class="zh">' + esc(l[2]) + '</span></div></div>';
      }).join('');
      return '<div class="screen">' +
        '<div class="h1" style="font-size:21px">先听一遍整段对话</div>' +
        '<div class="small muted mt8">' + esc(p.unit.scene) + ' · 你演 B（蓝色）</div>' +
        '<div class="card mt16"><div class="dialogue">' + list + '</div></div>' +
        '<button class="btn btn-ghost btn-block mt12" data-act="sessPlayAll">▶ 连续播放</button>' +
        '<button class="btn btn-primary btn-block btn-lg mt16" data-act="sessRoleplay">开始角色扮演</button>' +
        '<div class="hintbox mt12">' + esc(p.unit.tip) + '</div>' +
        '</div>';
    }

    var line = p.lines[d.i];
    var isMine = line[0] === 'B';
    var res = p.res['d' + d.i] || { status: 'idle' };

    var hist = '';
    if (d.i > 0) {
      hist = '<div class="history">' + p.lines.slice(Math.max(0, d.i - 4), d.i).map(function (l, k) {
        return '<div class="line ' + l[0] + '"><div class="avatar">' + l[0] + '</div>' +
          '<div class="bubble"><span class="en">' + esc(l[1]) + '</span><span class="zh">' + esc(l[2]) + '</span></div></div>';
      }).join('') + '</div>';
    }

    var card = '';
    if (!isMine) {
      card = '<div class="turn-card"><div class="who">对方说 · 听</div>' +
        '<div class="en" style="margin-top:10px;font-size:20px">' + esc(line[1]) + '</div>' +
        '<div class="small muted mt8">' + esc(line[2]) + '</div>' +
        '<div class="row mt16" style="gap:9px"><button class="btn btn-ghost grow" data-act="sessPlayLine">再听一遍</button>' +
        '<button class="btn btn-primary grow" data-act="sessDlgNext">继续</button></div></div>';
    } else if (res.status === 'done') {
      var g = E.gradeLabel(res.score);
      card = '<div class="turn-card"><div class="who">轮到你说</div>' +
        '<div class="mb8 mt8" style="font-size:18px;font-weight:650">' + esc(line[2]) + '</div>' +
        '<div class="result"><div class="score" style="color:' + (g.tone === 'good' ? 'var(--good)' : g.tone === 'warn' ? 'var(--warn)' : 'var(--bad)') + '">' + g.text + ' · ' + Math.round(res.score * 100) + '</div>' +
        '<div class="said">“' + esc(res.transcript) + '”</div>' +
        '<div class="small muted mt8">参考：' + esc(line[1]) + '</div></div>' +
        '<div class="row mt12" style="gap:9px"><button class="btn btn-ghost grow" data-act="sessRetryDlg">再说一次</button>' +
        '<button class="btn btn-primary grow" data-act="sessDlgNext">继续</button></div></div>';
    } else if (res.status === 'listening') {
      card = '<div class="turn-card center"><div class="who">轮到你说</div>' +
        '<div class="mt8" style="font-size:18px;font-weight:650">' + esc(line[2]) + '</div>' +
        '<div class="mic-wrap mt16"><button class="mic listening" data-act="sessStopListen">' + I.mic + '</button>' +
        '<div class="mic-label" id="asrPartial">正在听…</div></div></div>';
    } else {
      card = '<div class="turn-card"><div class="who">轮到你说</div>' +
        '<div class="mt8" style="font-size:19px;font-weight:650;line-height:1.4">' + esc(line[2]) + '</div>' +
        '<div class="small faint mt8">' + (res.hint ? esc(line[1]) : '先自己说，卡住了再看提示') + '</div>' +
        '<div class="mic-wrap mt16"><button class="mic" data-act="sessRecordDlg">' + I.mic + '</button>' +
        '<div class="mic-label">点一下，说出你的台词</div></div>' +
        '<div class="row mt12" style="gap:9px"><button class="btn btn-ghost grow" data-act="sessDlgHint">看提示</button>' +
        '<button class="btn btn-ghost grow" data-act="sessDlgSkip">跳过</button></div></div>';
    }

    return '<div class="screen">' + hist + card +
      '<div class="center small faint mt16">角色扮演 · ' + esc(p.unit.scene) + '</div></div>';
  }

  /* ---------- 完成 ---------- */
  function viewDone(p) {
    var listenScore = Math.round(p.liCorrect / Math.max(1, p.listenQs.length) * 100);
    var scores = p.scores.filter(function (x) { return typeof x === 'number'; });
    var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length * 100) : null;
    var next = E.nextLesson(st());

    return '<div class="screen center" style="padding-top:26px">' +
      '<div class="big-emoji">🎉</div>' +
      '<div class="h1 mt12">这一课，学完了</div>' +
      '<div class="small muted mt8">' + esc(p.unit.title) + ' · ' + esc(p.unit.scene) + '</div>' +
      '<div class="stat-grid mt20" style="text-align:left">' +
      '<div class="stat"><div class="v">8</div><div class="l">新学句子</div></div>' +
      '<div class="stat"><div class="v">' + listenScore + '%</div><div class="l">听力正确</div></div>' +
      '<div class="stat"><div class="v">' + (avg == null ? '—' : avg + '%') + '</div><div class="l">跟读匹配</div></div>' +
      '<div class="stat"><div class="v">' + (st().streak.count || 1) + '</div><div class="l">连续天数</div></div>' +
      '</div>' +
      '<div class="card mt16" style="text-align:left"><div class="h3">今天的收获</div>' +
      '<div class="small muted mt8" style="line-height:1.7">' + esc(p.unit.tip) + '</div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="sessHome">回首页</button>' +
      (next ? '<button class="btn btn-ghost btn-block mt12" data-act="sessNextLesson">继续下一课：' + esc(next.title) + '</button>' : '') +
      '<button class="btn btn-quiet btn-block mt8" data-act="sessRestart">再练一遍</button>' +
      '</div>';
  }

  function finishLesson() {
    var p = SP.session;
    var S = st();
    var avg = p.scores.filter(function (x) { return typeof x === 'number'; });
    avg = avg.length ? avg.reduce(function (a, b) { return a + b; }, 0) / avg.length : 0;
    E.completeLesson(S, p.unit.id, {
      listen: p.liCorrect / Math.max(1, p.listenQs.length),
      speak: avg
    });
    SP.save();
    if (S.settings.sound !== false) window.Tone.done();
  }

  /* ---------- 动作：单元课 ---------- */
  SP.actions.exitSession = function () {
    var p = SP.session;
    if (p && p.kind === 'lesson' && p.phase !== 'done') {
      if (!confirm('这一课还没上完，确定退出？已学的句子会保留在复习里。')) return;
    }
    SP.go('today');
  };

  SP.actions.sessSay = function (el, d) { SP.sayItem(d.id); };
  SP.actions.sessPlaySlow = function () {
    var p = SP.session;
    var text = '';
    if (p.phase === 'learn') text = p.chunks[p.i].en;
    else if (p.phase === 'listen') text = p.listenQs[p.li].item.en;
    else if (p.phase === 'speak') text = p.speakItems[p.si].en;
    if (text) SP.speak(text, { rate: 0.68 });
  };
  SP.actions.sessReveal = function () {
    var p = SP.session;
    var showZh = p.revealed || (st().settings.showZh && !p.zhOff);
    if (showZh) { p.revealed = false; p.zhOff = true; }
    else { p.revealed = true; p.zhOff = false; }
    paintLesson();
  };
  SP.actions.sessNext = function () {
    var p = SP.session;
    var it = p.chunks[p.i];
    var S = st();
    if (!S.srs[it.id]) {
      E.addToSrs(S, it.id, Date.now(), { reps: 1, days: 0 });
      S.srs[it.id].due = Date.now() + 10 * 60000;
      SP.save();
    }
    if (p.i >= p.chunks.length - 1) {
      p.phase = 'listen';
      p.li = 0;
      p.liPick = -1;
      p.revealed = false;
    } else {
      p.i += 1;
      p.revealed = false;
      p.spokenFor = -1;
    }
    paintLesson();
  };
  SP.actions.sessPrev = function () {
    var p = SP.session;
    if (p.i > 0) { p.i -= 1; p.revealed = false; p.spokenFor = -1; paintLesson(); }
  };

  SP.actions.sessTooEasy = function () {
    var p = SP.session;
    if (!p || p.kind !== 'lesson') return;
    if (!confirm('把这 8 句标记为已掌握，直接进入下一课？它们会在 45 天后进入复习。')) return;
    E.markUnitKnown(st(), p.unit.id);
    SP.save();
    var next = E.nextLesson(st());
    SP.session = null;
    SP.toast('已标记为掌握');
    if (next) SP.go('lesson/' + next.id);
    else SP.go('today');
  };

  SP.actions.sessReplay = function () {
    var p = SP.session;
    SP.speak(p.listenQs[p.li].item.en);
  };
  SP.actions.sessPick = function (el, d) {
    var p = SP.session;
    if (p.liPick >= 0) return;
    p.liPick = parseInt(d.idx, 10);
    var q = p.listenQs[p.li];
    var ok = p.liPick === q.correct;
    if (ok) p.liCorrect += 1;
    E.recordListen(st(), ok);
    SP.save();
    if (st().settings.sound !== false) { if (ok) window.Tone.ok(); else window.Tone.no(); }
    paintLesson();
  };
  SP.actions.sessNextQ = function () {
    var p = SP.session;
    if (p.li >= p.listenQs.length - 1) {
      p.phase = 'speak';
      p.si = 0;
    } else {
      p.li += 1;
      p.liPick = -1;
    }
    paintLesson();
  };

  /* ---------- 动作：跟读 ---------- */
  SP.actions.sessHint = function () {
    var p = SP.session;
    var it = p.speakItems[p.si];
    var res = p.res[it.id] || (p.res[it.id] = { status: 'idle' });
    res.hint = true;
    paintLesson();
  };
  SP.actions.sessRetry = function () {
    var p = SP.session;
    var it = p.speakItems[p.si];
    delete p.res[it.id];
    paintLesson();
  };
  SP.actions.sessSkip = function () {
    var p = SP.session;
    p.si += 1;
    if (p.si >= p.speakItems.length) { p.phase = 'dialogue'; p.dlg.mode = 'intro'; }
    paintLesson();
  };
  SP.actions.sessNextS = function () {
    var p = SP.session;
    p.si += 1;
    if (p.si >= p.speakItems.length) {
      p.phase = 'dialogue';
      p.dlg.mode = 'intro';
    }
    paintLesson();
  };

  function recordListenFor(item, key, isDlg) {
    var p = SP.session;
    var res = p.res[key] = { status: 'listening', transcript: '', score: 0, hint: false };
    paintLesson();
    var started = window.Listen.start({
      onPartial: function (t) {
        var el = document.getElementById('asrPartial');
        if (el) el.textContent = t ? '“' + t + '”' : '正在听…';
      },
      onResult: function (text, alts) {
        var all = [text].concat(alts || []);
        var score = E.bestSimilarity(item.en, all);
        res.status = 'done';
        res.transcript = text;
        res.score = score;
        p.scores.push(score);
        E.recordSpeak(st(), score);
        var S = st();
        if (!isDlg && score >= 0.62 && item.type === 'chunk' && !S.srs[item.id]) {
          E.addToSrs(S, item.id, Date.now(), { reps: 1, days: 1 });
        }
        SP.save();
        if (S.settings.sound !== false) { if (score >= 0.75) window.Tone.ok(); else window.Tone.tick(); }
        paintLesson();
      },
      onError: function (err) {
        res.status = 'error';
        res.err = err;
        paintLesson();
      },
      onEnd: function () {
        if (res.status === 'listening') { res.status = 'empty'; paintLesson(); }
      }
    });
    if (!started) { /* start 内部已给出错误 */ }
  }

  SP.actions.sessRecord = function () {
    var p = SP.session;
    var it = p.speakItems[p.si];
    recordListenFor(it, it.id, false);
  };
  SP.actions.sessStopListen = function () { window.Listen.stop(); };

  /* ---------- 动作：对话 ---------- */
  SP.actions.sessPlayAll = function () {
    var p = SP.session;
    var i = 0;
    function step() {
      if (i >= p.lines.length || !SP.session || SP.session !== p) return;
      var line = p.lines[i];
      i++;
      SP.speak(line[1], { rate: 0.9 }).then(function () {
        setTimeout(step, 420);
      });
    }
    step();
  };
  SP.actions.sessRoleplay = function () {
    var p = SP.session;
    p.dlg.mode = 'play';
    p.dlg.i = 0;
    p.dlg.playedFor = -1;
    paintLesson();
  };
  SP.actions.sessPlayLine = function () {
    var p = SP.session;
    SP.speak(p.lines[p.dlg.i][1], { rate: 0.9 });
  };
  SP.actions.sessDlgHint = function () {
    var p = SP.session;
    var res = p.res['d' + p.dlg.i] || (p.res['d' + p.dlg.i] = { status: 'idle' });
    res.hint = true;
    paintLesson();
  };
  SP.actions.sessDlgSkip = function () {
    var p = SP.session;
    advanceDlg();
  };
  SP.actions.sessRecordDlg = function () {
    var p = SP.session;
    var line = p.lines[p.dlg.i];
    var fake = { id: 'd' + p.dlg.i, en: line[1], type: 'line' };
    recordListenFor(fake, 'd' + p.dlg.i, true);
  };
  SP.actions.sessRetryDlg = function () {
    var p = SP.session;
    delete p.res['d' + p.dlg.i];
    paintLesson();
  };
  SP.actions.sessDlgNext = function () { advanceDlg(); };

  function advanceDlg() {
    var p = SP.session;
    p.dlg.i += 1;
    p.dlg.playedFor = -1;
    if (p.dlg.i >= p.lines.length) {
      p.phase = 'done';
      finishLesson();
    }
    paintLesson();
  }

  SP.actions.sessHome = function () { SP.go('today'); };
  SP.actions.sessRestart = function () {
    var u = SP.session.unit;
    SP.session = newLesson(u);
    paintLesson();
  };
  SP.actions.sessNextLesson = function () {
    var n = E.nextLesson(st());
    if (!n) { SP.go('review'); return; }
    SP.session = null;
    SP.go('lesson/' + n.id);
  };

  /* ==========================================================
     复习
     ========================================================== */

  SP.renderReview = function () {
    if (SP.session && SP.session.kind === 'review') { paintReview(); return; }
    var S = st();
    var p = E.plan(S);
    var nextDue = null;
    var all = E.index().items;
    for (var i = 0; i < all.length; i++) {
      var r = S.srs[all[i].id];
      if (r && r.due > Date.now() && (nextDue === null || r.due < nextDue)) nextDue = r.due;
    }
    var status = E.countByStatus(S);
    var queueLen = Math.min(p.dueCount, 40) + p.newPhrases.length;

    var body = '<div class="screen">' +
      '<div class="mt12"><div class="h1">复习</div><div class="small muted mt8">按 SM-2 遗忘曲线安排。到期就复习，比一次背十遍有效。</div></div>' +
      '<div class="card mt16"><div class="row between"><div><div class="small muted">现在到期</div><div class="big-num" style="margin-top:4px">' + p.dueCount + '</div></div>' +
      ringed(p.dueCount) + '</div>' +
      '<div class="divider"></div>' +
      '<div class="row between small"><span class="muted">手册新句</span><span style="font-weight:700">' + p.newPhrases.length + '</span></div>' +
      '<div class="row between small mt8"><span class="muted">正在记忆 / 已掌握</span><span style="font-weight:700">' + status.learning + ' / ' + status.mastered + '</span></div>' +
      '</div>' +
      (p.reviewTotal
        ? '<button class="btn btn-primary btn-block btn-lg mt16" data-act="reviewStart">开始复习 · ' + queueLen + ' 张</button>'
        : '<div class="card center mt16" style="padding:26px 16px"><div class="h3">今天的卡都清完了</div><div class="small muted mt8">' +
        (nextDue ? '下一张约 ' + E.fmtDue({ due: nextDue }) + '后到期' : '去学新单元，给队列添点句子') + '</div>' +
        '<button class="btn btn-ghost btn-block mt16" data-nav="course">去学新单元</button></div>') +
      '<div class="card mt16"><div class="h3">怎么复习最有效</div><div class="small muted mt8" style="line-height:1.7">' +
      '看到英文先「心里说一遍中文」，再翻面核对。宁可点「困难」也不要蒙对点「记得」——记忆曲线只认真实感受。' +
      '</div></div>' +
      '</div>';
    SP.shell(body, { tab: 'review' });
  };

  function ringed(n) {
    var r = 30, c = 2 * Math.PI * r;
    var val = Math.min(1, n / 30);
    return '<div class="ring" style="width:70px;height:70px"><svg width="70" height="70" viewBox="0 0 70 70">' +
      '<circle class="track" cx="35" cy="35" r="' + r + '" fill="none" stroke-width="5"/>' +
      '<circle class="val" cx="35" cy="35" r="' + r + '" fill="none" stroke-width="5" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - val)).toFixed(1) + '"/>' +
      '</svg><div class="num">' + n + '<span>张</span></div></div>';
  }

  SP.actions.reviewStart = function () {
    var S = st();
    var p = E.plan(S);
    var queue = p.due.slice(0, 40).concat(p.newPhrases);
    if (!queue.length) { SP.toast('暂时没有要复习的'); return; }
    SP.session = { kind: 'review', queue: queue, i: 0, revealed: false, scores: [], startedAt: Date.now() };
    SP.go('review');
    paintReview();
  };

  function paintReview() {
    var p = SP.session;
    if (!p) return;
    if (p.i >= p.queue.length) return reviewSummary(p);
    var it = p.queue[p.i];
    var S = st();
    var rec = S.srs[it.id];
    var wasNew = !rec;
    var scene = it.unit ? SP.unitById(it.unit) : null;

    var body = '<div class="screen">' +
      '<div class="flash" style="min-height:auto;padding:24px 20px">' +
      '<div class="row between"><span class="pill' + (wasNew ? ' accent' : '') + '">' + (wasNew ? '新句' : (it.type === 'phrase' ? (it.catName || '手册') : (scene ? scene.title : '课程'))) + '</span>' +
      '<button class="icon-btn bare" data-act="rvSay" aria-label="朗读">' + I.volume + '</button></div>' +
      '<div class="en" style="margin-top:14px">' + esc(it.en) + '</div>' +
      (p.revealed ? '<div class="zh">' + esc(it.zh) + '</div>' : '') +
      '</div>' +
      (p.revealed
        ? '<div class="mt16"><div class="small faint center mb8">这句你记得多牢？</div><div class="grades">' +
        '<button class="grade g0" data-act="rvGrade" data-g="0">忘记<small>' + dueText(rec, 0) + '</small></button>' +
        '<button class="grade g1" data-act="rvGrade" data-g="1">困难<small>' + dueText(rec, 1) + '</small></button>' +
        '<button class="grade g2" data-act="rvGrade" data-g="2">记得<small>' + dueText(rec, 2) + '</small></button>' +
        '<button class="grade g3" data-act="rvGrade" data-g="3">简单<small>' + dueText(rec, 3) + '</small></button>' +
        '</div></div>'
        : '<button class="btn btn-primary btn-block btn-lg mt20" data-act="rvReveal">显示中文</button>') +
      '<div class="center mt12"><button class="btn btn-quiet" data-act="rvSpeak">🎤 先说一遍</button></div>' +
      '</div>';

    SP.shell(body, { tabs: false, top: topBar('复习', (p.i) / p.queue.length, (p.i + 1) + '/' + p.queue.length) });
    if (st().settings.autoPlay && !p.revealed) {
      setTimeout(function () { if (SP.session === p && !p.revealed) SP.speak(it.en); }, 160);
    }
  }

  function dueText(rec, g) {
    var base = rec || E.newRec(Date.now());
    var r = E.review(base, g, Date.now());
    var d = r.due - Date.now();
    if (d < 3600000) return Math.max(1, Math.round(d / 60000)) + ' 分钟';
    if (d < 86400000) return Math.round(d / 3600000) + ' 小时';
    return Math.max(1, Math.round(d / 86400000)) + ' 天';
  }

  function reviewSummary(p) {
    var total = p.queue.length;
    var good = p.scores.filter(function (x) { return x >= 2; }).length;
    var rate = total ? Math.round(good / total * 100) : 0;
    var S = st();
    var body = '<div class="screen center" style="padding-top:30px">' +
      '<div class="big-emoji">🧠</div>' +
      '<div class="h1 mt12">复习完成</div>' +
      '<div class="small muted mt8">' + total + ' 张卡 · 记得 ' + good + ' 张</div>' +
      '<div class="stat-grid mt20" style="text-align:left">' +
      '<div class="stat"><div class="v">' + rate + '%</div><div class="l">记忆保持率</div></div>' +
      '<div class="stat"><div class="v">' + (S.streak.count || 1) + '</div><div class="l">连续天数</div></div>' +
      '</div>' +
      '<div class="card mt16" style="text-align:left"><div class="h3">接下来</div>' +
      '<div class="small muted mt8" style="line-height:1.7">忘记的卡 10 分钟后会再出现。现在去学一个新单元，或者用「跟读」把今天学的句子说熟。</div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="rvHome">回首页</button>' +
      '<button class="btn btn-ghost btn-block mt12" data-act="rvAgain">再复习一轮</button>' +
      '</div>';
    SP.shell(body, { tabs: false, top: topBar('复习', 1, '✓') });
  }

  SP.actions.rvReveal = function () {
    SP.session.revealed = true;
    paintReview();
  };
  SP.actions.rvSay = function () {
    var p = SP.session;
    if (p && p.queue[p.i]) SP.speak(p.queue[p.i].en);
  };
  SP.actions.rvSpeak = function () {
    var p = SP.session;
    if (!p || !p.queue[p.i]) return;
    if (!window.Listen.supported()) { SP.toast('这个浏览器不支持跟读评分'); return; }
    var it = p.queue[p.i];
    window.Listen.start({
      onResult: function (text, alts) {
        var score = E.bestSimilarity(it.en, [text].concat(alts || []));
        E.recordSpeak(st(), score);
        SP.save();
        SP.toast(E.gradeLabel(score).text + ' · ' + Math.round(score * 100));
        if (!p.revealed) { p.revealed = true; paintReview(); }
      },
      onError: function (err) { SP.toast(window.Listen.errorText(err)); }
    });
    SP.toast('请说英文…');
  };
  SP.actions.rvGrade = function (el, d) {
    var p = SP.session;
    var it = p.queue[p.i];
    var g = parseInt(d.g, 10);
    E.recordCard(st(), it.id, g);
    p.scores.push(g);
    SP.save();
    if (st().settings.sound !== false) { if (g >= 2) window.Tone.ok(); else window.Tone.no(); }
    p.i += 1;
    p.revealed = false;
    if (p.i >= p.queue.length) reviewSummary(p);
    else paintReview();
  };
  SP.actions.rvHome = function () { SP.go('today'); };
  SP.actions.rvAgain = function () {
    SP.session = null;
    SP.renderReview();
  };

  /* ==========================================================
     跟读训练
     ========================================================== */

  SP.startDrill = function () {
    var S = st();
    var pool = E.index().chunks.filter(function (i) { return S.srs[i.id]; });
    if (!pool.length) pool = E.index().chunks;
    SP.session = { kind: 'drill', queue: pickN(pool, 5), i: 0, res: {}, scores: [] };
    SP.go('drill');
    if (SP.routeParts()[0] === 'drill') paintDrill();
  };

  SP.renderDrill = function () {
    if (!SP.session || SP.session.kind !== 'drill') { SP.go('today'); return; }
    paintDrill();
  };

  function paintDrill() {
    var p = SP.session;
    if (p.i >= p.queue.length) return drillSummary(p);
    var it = p.queue[p.i];
    var res = p.res[it.id] || { status: 'idle' };
    var supported = window.Listen.supported();
    var body = '<div class="screen">' +
      '<div class="qprompt">跟读 · 第 ' + (p.i + 1) + ' / ' + p.queue.length + ' 句</div>' +
      '<div class="flash" style="min-height:auto;padding:22px 20px">' +
      '<div class="prompt-zh">' + esc(it.zh) + '</div>' +
      '<div class="small faint mt12">' + (res.hint ? esc(it.en) : '先自己说，再对答案') + '</div></div>';

    if (!supported) {
      body += '<div class="hintbox mt16">此浏览器不支持跟读评分。建议用 Chrome / Edge，或把网页装到手机桌面后再试。</div>' +
        '<button class="btn btn-ghost btn-block mt12" data-act="drillHint">看提示</button>' +
        '<button class="btn btn-primary btn-block btn-lg mt12" data-act="drillNext">下一句</button>';
    } else if (res.status === 'done') {
      var g = E.gradeLabel(res.score);
      body += '<div class="result"><div class="score" style="color:' + (g.tone === 'good' ? 'var(--good)' : g.tone === 'warn' ? 'var(--warn)' : 'var(--bad)') + '">' + g.text + ' · ' + Math.round(res.score * 100) + '</div>' +
        '<div class="said">“' + esc(res.transcript) + '”</div>' +
        '<div class="diff">' + E.wordDiff(it.en, res.transcript).map(function (w) {
          return '<span class="w' + (w.ok ? '' : ' bad') + '">' + esc(w.w) + '</span>';
        }).join('') + '</div></div>' +
        '<div class="row mt12" style="gap:9px"><button class="btn btn-ghost grow" data-act="drillRetry">再说一次</button>' +
        '<button class="btn btn-primary grow" data-act="drillNext">下一句</button></div>';
    } else if (res.status === 'listening') {
      body += '<div class="mic-wrap mt16"><button class="mic listening" data-act="drillStop">' + I.mic + '</button>' +
        '<div class="mic-label" id="asrPartial">正在听…</div></div>';
    } else {
      body += '<div class="mic-wrap mt16"><button class="mic" data-act="drillRecord">' + I.mic + '</button>' +
        '<div class="mic-label">点一下，大声说</div></div>';
    }
    body += '<div class="center mt16"><button class="btn btn-quiet" data-act="drillEnd">结束练习</button></div></div>';
    SP.shell(body, { tabs: false, top: topBar('跟读', (p.i) / p.queue.length, (p.i + 1) + '/' + p.queue.length) });
  }

  function drillSummary(p) {
    var scores = p.scores;
    var avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length * 100) : 0;
    var body = '<div class="screen center" style="padding-top:30px">' +
      '<div class="big-emoji">🎤</div><div class="h1 mt12">说完了</div>' +
      '<div class="small muted mt8">' + p.queue.length + ' 句 · 平均匹配 ' + avg + '</div>' +
      '<div class="card mt20" style="text-align:left"><div class="h3">口语不是「听懂」，是肌肉记忆</div>' +
      '<div class="small muted mt8" style="line-height:1.7">明天再读同样的句子，你会明显更快。建议把今天的 5 句录下来，通勤时回听一遍。</div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt20" data-act="drillHome">回首页</button>' +
      '<button class="btn btn-ghost btn-block mt12" data-act="drillAgain">再来 5 句</button></div>';
    SP.shell(body, { tabs: false, top: topBar('跟读', 1, '✓') });
  }

  SP.actions.drillRecord = function () {
    var p = SP.session;
    var it = p.queue[p.i];
    if (!window.Listen.supported()) return;
    var res = p.res[it.id] = { status: 'listening', transcript: '' };
    paintDrill();
    window.Listen.start({
      onPartial: function (t) {
        var el = document.getElementById('asrPartial');
        if (el) el.textContent = t ? '“' + t + '”' : '正在听…';
      },
      onResult: function (text, alts) {
        var score = E.bestSimilarity(it.en, [text].concat(alts || []));
        res.status = 'done'; res.transcript = text; res.score = score;
        p.scores.push(score);
        E.recordSpeak(st(), score);
        SP.save();
        if (st().settings.sound !== false) { if (score >= 0.75) window.Tone.ok(); else window.Tone.tick(); }
        paintDrill();
      },
      onError: function (err) { res.status = 'error'; res.err = err; paintDrill(); SP.toast(window.Listen.errorText(err)); }
    });
  };
  SP.actions.drillStop = function () { window.Listen.stop(); };
  SP.actions.drillHint = function () {
    var p = SP.session;
    var it = p.queue[p.i];
    (p.res[it.id] || (p.res[it.id] = { status: 'idle' })).hint = true;
    paintDrill();
  };
  SP.actions.drillRetry = function () {
    var p = SP.session;
    delete p.res[p.queue[p.i].id];
    paintDrill();
  };
  SP.actions.drillNext = function () {
    var p = SP.session;
    p.i += 1;
    paintDrill();
  };
  SP.actions.drillEnd = function () { SP.go('today'); };
  SP.actions.drillHome = function () { SP.go('today'); };
  SP.actions.drillAgain = function () { SP.startDrill(); };

  /* ==========================================================
     会话收尾
     ========================================================== */
  SP.endSession = function () {
    window.Voice.stop();
    if (window.Listen) window.Listen.abort();
    SP.session = null;
  };
})();
