/* SpeakTrip —— AI 加练（自带 API Key，直连 OpenAI 兼容接口） */
(function () {
  'use strict';
  var E = window.ENG, SP = window.SP, I = SP.ICONS;

  var TOPICS = ['旅行', '工作', '点餐', '闲聊', '观点', '抱怨'];

  function st() { return SP.state; }
  function esc(v) { return SP.esc(v); }
  function cfg() {
    var c = st().settings.ai || {};
    return {
      base: (c.base || 'https://api.deepseek.com').trim(),
      model: (c.model || 'deepseek-chat').trim(),
      key: (c.key || '').trim(),
      level: c.level || 'B1'
    };
  }
  function endpoint(base) {
    base = String(base || '').replace(/\/+$/, '');
    if (/\/chat\/completions$/.test(base)) return base;
    return base + '/chat/completions';
  }

  async function chat(messages, maxTokens) {
    var c = cfg();
    if (!c.key) throw new Error('还没有填写 API Key');
    var res;
    try {
      res = await fetch(endpoint(c.base), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key },
        body: JSON.stringify({
          model: c.model,
          messages: messages,
          temperature: 0.85,
          max_tokens: maxTokens || 1000
        })
      });
    } catch (e) {
      throw new Error('连不上接口（也可能是浏览器 CORS 限制）。请检查地址，或换一个支持浏览器直连的服务。');
    }
    if (!res.ok) {
      var detail = '';
      try { detail = (await res.text()).slice(0, 160); } catch (e) {}
      throw new Error('接口返回 ' + res.status + (detail ? '：' + detail : ''));
    }
    var data = await res.json();
    var text = data && data.choices && data.choices[0] &&
      data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('接口没有返回内容');
    return text;
  }

  function parseSentences(text) {
    var t = String(text || '').trim();
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/,'').trim();
    var a = t.indexOf('['), b = t.lastIndexOf(']');
    if (a >= 0 && b > a) t = t.slice(a, b + 1);
    var arr = JSON.parse(t);
    if (!Array.isArray(arr)) throw new Error('返回格式不是数组');
    var out = arr.filter(function (x) { return x && x.en && x.zh; }).slice(0, 8).map(function (x) {
      return { en: String(x.en).trim(), zh: String(x.zh).trim(), tip: x.tip ? String(x.tip).trim() : '' };
    });
    if (!out.length) throw new Error('没有解析出可用句子');
    return out;
  }

  async function generate(topic) {
    var c = cfg();
    var sys = 'You write spoken-English practice cards for Chinese learners of English. ' +
      'Rules: sentences must sound like real conversation, 8-22 words, no textbook clichés, ' +
      'no repeated sentence starters. Reply with ONLY a JSON array, no markdown. ' +
      'Each item: {"en":"English sentence","zh":"中文翻译","tip":"一句中文提示，讲这个表达的使用场景或语调"}.';
    var user = 'CEFR level: ' + c.level + '. Topic: ' + topic + '. ' +
      'Write 6 sentences that a learner could actually use abroad. Vary the functions ' +
      '(asking, reacting, explaining, softening, joking). Return the JSON array only.';
    var text = await chat([{ role: 'system', content: sys }, { role: 'user', content: user }]);
    return parseSentences(text);
  }

  async function test() {
    var text = await chat([{ role: 'user', content: 'Reply with exactly: OK' }], 10);
    return String(text).trim();
  }

  window.AI = { generate: generate, test: test, cfg: cfg, endpoint: endpoint, parseSentences: parseSentences };

  /* ---------------- 界面 ---------------- */
  SP.ai = null;

  function ensure() {
    if (!SP.ai) {
      var c = cfg();
      SP.ai = { items: [], loading: false, error: '', topic: TOPICS[0], level: c.level, results: {}, listening: -1, showConfig: false };
    }
    return SP.ai;
  }

  function alive() { return SP.routeParts()[0] === 'ai'; }

  SP.renderAI = function () {
    ensure();
    paintAI();
  };

  function top() {
    var c = cfg();
    return '<header class="topbar" style="gap:10px">' +
      '<button class="icon-btn bare" data-nav="today" aria-label="返回">' + I.back + '</button>' +
      '<div class="grow"><div class="title">AI 加练</div><div class="sub">按你的水平现写 6 句</div></div>' +
      '<span class="pill brand">' + esc(c.level) + '</span></header>';
  }

  function paintAI() {
    var A = ensure();
    var c = cfg();

    if (!c.key || A.showConfig) {
      SP.shell(setupHTML(c), { tabs: false, top: top() });
      return;
    }

    var body = '<div class="screen">' +
      '<div class="card">' +
      '<div class="row between"><div class="h3">今天想练什么</div><span class="small faint">' + esc(c.model) + '</span></div>' +
      '<div class="chips mt12">' + TOPICS.map(function (t) {
        return '<button class="chip' + (A.topic === t ? ' on' : '') + '" data-act="aiTopic" data-t="' + esc(t) + '">' + esc(t) + '</button>';
      }).join('') + '</div>' +
      '<div class="row between mt12"><div class="small muted">难度</div>' +
      '<div class="seg"><button data-act="aiLevel" data-v="B1" class="' + (A.level === 'B1' ? 'on' : '') + '">B1</button>' +
      '<button data-act="aiLevel" data-v="B2" class="' + (A.level === 'B2' ? 'on' : '') + '">B2</button>' +
      '<button data-act="aiLevel" data-v="C1" class="' + (A.level === 'C1' ? 'on' : '') + '">C1</button></div></div>' +
      '<button class="btn btn-primary btn-block btn-lg mt16" data-act="aiGenerate"' + (A.loading ? ' disabled' : '') + '>' +
      (A.loading ? '正在写…' : (A.items.length ? '换一批' : '生成 6 句')) + '</button>' +
      '</div>';

    if (A.error) {
      body += '<div class="hintbox mt12" style="background:var(--bad-soft);color:var(--bad)">' + esc(A.error) + '</div>';
    }

    if (A.loading && !A.items.length) {
      body += '<div class="card mt12 center" style="padding:32px 16px"><div class="small muted">正在按 ' + esc(A.level) + ' 难度写「' + esc(A.topic) + '」的句子…</div></div>';
    }

    if (A.items.length) {
      body += '<div class="small faint mt20">' + esc(A.level) + ' · ' + esc(A.topic) + ' · ' + A.items.length + ' 句</div>';
      body += A.items.map(function (it, i) {
        var r = A.results[i];
        var listening = A.listening === i;
        return '<div class="card mt10">' +
          '<div class="row between"><span class="pill">' + (i + 1) + '</span>' +
          '<button class="icon-btn bare" data-act="aiSay" data-i="' + i + '" aria-label="朗读">' + I.volume + '</button></div>' +
          '<div style="font-family:var(--serif);font-size:19px;line-height:1.4;margin-top:6px">' + esc(it.en) + '</div>' +
          '<div class="small muted mt8">' + esc(it.zh) + '</div>' +
          (it.tip ? '<div class="tiny faint mt8">' + esc(it.tip) + '</div>' : '') +
          '<div class="row mt12" style="gap:8px">' +
          '<button class="btn btn-sm btn-ghost grow" data-act="aiSpeak" data-i="' + i + '"' + (listening ? ' disabled' : '') + '>' +
          (listening ? '正在听…' : (r ? '再说一次' : '🎤 跟读打分')) + '</button>' +
          '</div>' +
          (r ? '<div class="result" style="margin-top:10px"><div class="score" style="font-size:17px;color:' + (r.score >= 0.75 ? 'var(--good)' : r.score >= 0.55 ? 'var(--warn)' : 'var(--bad)') + '">' +
            E.gradeLabel(r.score).text + ' · ' + Math.round(r.score * 100) + '</div>' +
            '<div class="said">“' + esc(r.text) + '”</div></div>' : '') +
          '</div>';
      }).join('');
      body += '<div class="center small faint mt16">AI 生成的句子直接练，不进入间隔重复队列</div>';
    }

    body += '<div class="card mt16"><div class="row between"><div class="h3">接口与 Key</div>' +
      '<button class="btn btn-sm btn-ghost" data-act="aiConfig">修改</button></div>' +
      '<div class="small muted mt8">Key 只保存在本机，除你填写的接口外不会发送到任何地方。</div></div>';

    body += '</div>';
    SP.shell(body, { tabs: false, top: top() });
  }

  function setupHTML(c) {
    return '<div class="screen">' +
      '<div class="mt12"><div class="h1">按你的水平，现写几句</div>' +
      '<div class="small muted mt8">需要一个 OpenAI 兼容接口的 Key。默认走 DeepSeek，也可以填 OpenAI、硅基流动或本机 Ollama。</div></div>' +
      '<div class="card mt16">' +
      '<div class="small muted">接口地址</div>' +
      '<input id="aiBase" value="' + esc(c.base) + '" placeholder="https://api.deepseek.com" style="width:100%;margin-top:6px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:15px">' +
      '<div class="small muted mt12">模型</div>' +
      '<input id="aiModel" value="' + esc(c.model) + '" placeholder="deepseek-chat" style="width:100%;margin-top:6px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:15px">' +
      '<div class="small muted mt12">API Key</div>' +
      '<input id="aiKey" type="password" value="' + esc(c.key) + '" placeholder="sk-..." autocomplete="off" style="width:100%;margin-top:6px;padding:11px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);font-size:15px">' +
      '<button class="btn btn-primary btn-block mt16" data-act="aiSave">保存并测试</button>' +
      '</div>' +
      '<div class="hintbox mt12">浏览器直连有时会被服务商的 CORS 策略拦住。如果提示「连不上接口」，换用支持浏览器调用的服务，或把 Key 交给自己的小后端转发。</div>' +
      '<div class="small faint mt12">不想用 AI 也没关系：主线 256 句 + 96 句手册已经够你练到 B1。</div>' +
      '</div>';
  }

  SP.actions.aiSave = function () {
    var base = (document.getElementById('aiBase') || {}).value || '';
    var model = (document.getElementById('aiModel') || {}).value || '';
    var key = (document.getElementById('aiKey') || {}).value || '';
    st().settings.ai = { base: base.trim() || 'https://api.deepseek.com', model: model.trim() || 'deepseek-chat', key: key.trim(), level: cfg().level };
    SP.save();
    SP.toast('正在测试连接…');
    window.AI.test().then(function () {
      SP.ai = null;
      SP.toast('连接成功');
      paintAI();
    }).catch(function (e) {
      SP.toast(e.message || '连接失败');
      SP.ai = null;
      if (SP.ai === null) { ensure().showConfig = true; }
      paintAI();
    });
  };

  SP.actions.aiConfig = function () {
    ensure().showConfig = true;
    paintAI();
  };

  SP.actions.aiTopic = function (el, d) {
    SP.ai.topic = d.t;
    SP.ai.items = [];
    SP.ai.results = {};
    paintAI();
  };

  SP.actions.aiLevel = function (el, d) {
    SP.ai.level = d.v;
    st().settings.ai = Object.assign({}, st().settings.ai || {}, { level: d.v });
    SP.save();
    SP.ai.items = [];
    SP.ai.results = {};
    paintAI();
  };

  SP.actions.aiGenerate = function () {
    var A = ensure();
    if (A.loading) return;
    A.loading = true;
    A.error = '';
    A.results = {};
    paintAI();
    window.AI.generate(A.topic).then(function (items) {
      A.items = items;
      A.loading = false;
      if (alive()) paintAI();
    }).catch(function (e) {
      A.loading = false;
      A.error = e.message || '生成失败';
      if (alive()) paintAI();
    });
  };

  SP.actions.aiSay = function (el, d) {
    var it = SP.ai && SP.ai.items[+d.i];
    if (it) SP.speak(it.en);
  };

  SP.actions.aiSpeak = function (el, d) {
    var i = +d.i;
    var it = SP.ai && SP.ai.items[i];
    if (!it) return;
    if (!window.Listen.supported()) { SP.toast('这个浏览器不支持跟读评分'); return; }
    var A = SP.ai;
    A.listening = i;
    paintAI();
    window.Listen.start({
      onResult: function (text, alts) {
        var score = E.bestSimilarity(it.en, [text].concat(alts || []));
        A.results[i] = { score: score, text: text };
        A.listening = -1;
        E.recordSpeak(st(), score);
        SP.save();
        if (alive()) paintAI();
      },
      onError: function (err) {
        A.listening = -1;
        if (alive()) paintAI();
        SP.toast(window.Listen.errorText(err));
      },
      onEnd: function () {
        if (A.listening === i) { A.listening = -1; if (alive()) paintAI(); }
      }
    });
  };
})();
