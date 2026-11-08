/* 页面内自检：打开 index.html?selftest=1 运行
 * 结果写入 <pre id="selftest-out"> 和 document.title，便于无头浏览器抓取。
 */
window.SELFTEST = (function () {
  'use strict';
  var E = window.ENG;
  var lines = [], pass = 0, fail = 0;

  function ok(name, cond, extra) {
    if (cond) { pass++; lines.push('PASS  ' + name); }
    else { fail++; lines.push('FAIL  ' + name + (extra !== undefined ? '  → ' + extra : '')); }
  }
  function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 0.001 : tol); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function run() {
    var SP = window.SP;
    var backup = null;
    try { backup = localStorage.getItem(E.STORE_KEY); } catch (e) {}
    var errors = [];
    window.addEventListener('error', function (e) { errors.push(String(e.message)); });

    try {
      SP.state = E.defaultState();
      SP.state.profile = {
        name: 'Tester', level: 'zero', minutes: 30, goal: 'travel',
        startDate: new Date().toISOString()
      };

      /* ---- 内容完整性 ---- */
      var idx = E.index();
      ok('单元数量 = 32', idx.units.length === 32, idx.units.length);
      ok('核心句子 = 256', idx.chunks.length === 256, idx.chunks.length);
      ok('手册句子 = 96', idx.phrases.length === 96, idx.phrases.length);
      var seen = {}, dup = 0;
      idx.items.forEach(function (i) { if (seen[i.id]) dup++; seen[i.id] = 1; });
      ok('条目 ID 唯一', dup === 0, dup + ' 个重复');
      ok('中文释义齐全', idx.items.every(function (i) { return i.zh && i.zh.length > 1; }));
      ok('每单元 8 句', idx.units.every(function (u) { return u.chunks.length === 8; }));
      ok('每单元有 ≥6 轮对话', idx.units.every(function (u) { return u.dialogue && u.dialogue.lines.length >= 6; }));
      ok('对话角色只含 A/B', idx.units.every(function (u) {
        return u.dialogue.lines.every(function (l) { return l[0] === 'A' || l[0] === 'B'; });
      }));
      ok('12 周元数据完整', Array.isArray(window.CURRICULUM_WEEKS) && window.CURRICULUM_WEEKS.length === 16, window.CURRICULUM_WEEKS && window.CURRICULUM_WEEKS.length);

      /* ---- 文本匹配 ---- */
      ok('完全相同 = 1', E.similarity('Hello there', 'hello there!') === 1);
      ok('缩写归一化', E.similarity('I am fine', "I'm fine") > 0.99, E.similarity('I am fine', "I'm fine"));
      ok('缺词会扣分', E.similarity('Could you help me please', 'could you help me') < 0.9);
      ok('空输入 = 0', E.similarity('Hello', '') === 0);
      ok('词差异长度正确', E.wordDiff('a b c', 'a c').length === 3);
      var diff = E.wordDiff('a b c', 'a c');
      ok('缺词被标红', diff.filter(function (d) { return !d.ok; }).length === 1);

      /* ---- 间隔重复 ---- */
      var now = Date.now();
      var r0 = E.review(E.newRec(now), 0, now);
      ok('忘记 → 10 分钟后重来', r0.reps === 0 && near(r0.due - now, 10 * E.MIN, 1500));
      var r1 = E.review(E.newRec(now), 2, now);
      ok('第一次记得 → 1 天', r1.reps === 1 && near(r1.i, 1));
      var r2 = E.review(r1, 2, now);
      ok('第二次记得 → 3 天', near(r2.i, 3));
      var r3 = E.review(r2, 2, now);
      ok('间隔继续增加', r3.i > r2.i, r2.i + ' → ' + r3.i);
      var r4 = E.review(r3, 3, now);
      ok('「简单」间隔更长', r4.i > r3.i);
      ok('难度系数在 1.3–3.2', r0.e >= 1.3 && r4.e <= 3.2);

      /* ---- 今日计划 ---- */
      var p = E.plan(SP.state);
      ok('新用户从 W1U1 开始', p.nextUnit && p.nextUnit.id === 'w1u1');
      ok('新用户无到期卡', p.dueCount === 0);
      ok('每日推送 4 句手册', p.newPhrases.length === 4, p.newPhrases.length);

      /* ---- 分级 / 跳级 / 太简单 ---- */
      ok('测评 0 题 → 第 1 周', E.placement(0, 12).week === 1);
      ok('测评 7 题 → 第 5 周', E.placement(7, 12).week === 5);
      ok('测评 12 题 → 第 13 周', E.placement(12, 12).week === 13);
      var s2 = E.defaultState();
      s2.profile = { name: 'T', minutes: 30 };
      E.skipToUnit(s2, 'w9u1');
      ok('跳级标记前 16 个单元', Object.keys(s2.lessons).length === 16, Object.keys(s2.lessons).length);
      ok('跳级后从 W9 开始', E.nextLesson(s2).id === 'w9u1');
      E.skipToUnit(s2, 'w1u1');
      ok('起点调回后恢复单元', E.nextLesson(s2).id === 'w1u1');
      E.markUnitKnown(s2, 'w1u1');
      ok('太简单 → 8 张卡入队', Object.keys(s2.srs).length === 8, Object.keys(s2.srs).length);
      ok('太简单 → 单元标记掌握', !!s2.lessons['w1u1'].known);
      ok('太简单 → 下一课 w1u2', E.nextLesson(s2).id === 'w1u2');

      /* ---- AI 结果解析 ---- */
      var aiParsed = window.AI ? window.AI.parseSentences('```json\n[{"en":"That works for me.","zh":"这样可以。"}]\n```') : [];
      ok('AI 返回 JSON 可解析', aiParsed.length === 1 && aiParsed[0].en === 'That works for me.', aiParsed.length);

      /* ---- 单元课全流程 ---- */
      SP.renderLesson('w1u1');
      var s = SP.session;
      ok('进入学习卡', s && s.phase === 'learn');
      var enEl = document.querySelector('.flash .en');
      ok('卡片显示第一句英文', enEl && enEl.textContent.trim() === s.chunks[0].en);

      for (var i = 0; i < 8; i++) SP.actions.sessNext();
      ok('8 句学完进入听力', SP.session.phase === 'listen', SP.session.phase);
      ok('8 句已进入复习队列', Object.keys(SP.state.srs).length === 8, Object.keys(SP.state.srs).length);

      for (var j = 0; j < 5; j++) {
        var q = SP.session.listenQs[SP.session.li];
        SP.actions.sessPick(null, { idx: String(q.correct) });
        SP.actions.sessNextQ();
      }
      ok('听力 5 题完成', SP.session.phase === 'speak', SP.session.phase);
      ok('听力统计正确', SP.state.totals.listenOk === 5 && SP.state.totals.listen === 5);

      for (var k = 0; k < 5; k++) SP.actions.sessNextS();
      ok('进入情景对话', SP.session.phase === 'dialogue', SP.session.phase);
      ok('对话预览显示 8 轮', document.querySelectorAll('.dialogue .line').length === 8,
        document.querySelectorAll('.dialogue .line').length);

      SP.actions.sessRoleplay();
      var L0 = SP.session.lines[0];
      var turnEn = document.querySelector('.turn-card .en');
      ok('角色扮演显示对方台词', !!turnEn && turnEn.textContent.trim() === L0[1], turnEn && turnEn.textContent);
      SP.actions.sessDlgNext();
      var L1 = SP.session.lines[1];
      ok('轮到我方时英文被隐藏', L1[0] === 'B' && !document.querySelector('.turn-card .en'), L1[0]);

      var guard = 0;
      while (SP.session.phase === 'dialogue' && guard++ < 40) {
        var line = SP.session.lines[SP.session.dlg.i];
        if (!line) break;
        if (line[0] === 'A') SP.actions.sessDlgNext();
        else SP.actions.sessDlgSkip();
      }
      ok('对话演完', SP.session.phase === 'done', SP.session.phase);
      ok('单元标记完成', !!(SP.state.lessons['w1u1'] && SP.state.lessons['w1u1'].done));
      ok('完成页渲染', /这一课，学完了/.test(document.getElementById('view').innerHTML));

      /* ---- 复习流程 ---- */
      SP.actions.reviewStart();
      ok('复习队列含 4 张新词卡', SP.session && SP.session.kind === 'review' && SP.session.queue.length === 4, SP.session && SP.session.queue.length);
      for (var g = 0; g < 4; g++) SP.actions.rvGrade(null, { g: '2' });
      ok('复习完成页渲染', /复习完成/.test(document.getElementById('view').innerHTML));
      ok('复习后总卡数 = 12', Object.keys(SP.state.srs).length === 12, Object.keys(SP.state.srs).length);
      ok('今日手册配额用完后不再推送', E.plan(SP.state).newPhrases.length === 0, E.plan(SP.state).newPhrases.length);

      /* ---- 持久化 ---- */
      E.save(SP.state);
      var loaded = E.load();
      ok('本地存储往返一致', Object.keys(loaded.srs).length === Object.keys(SP.state.srs).length);
      ok('连续天数已记录', loaded.streak.count >= 1, loaded.streak.count);

      /* ---- 路由渲染 ---- */
      async function visit(hash) {
        location.hash = hash;
        await wait(60);
        var v = document.getElementById('view');
        return v ? v.innerHTML : '';
      }
      var html = await visit('#/today');
      ok('今天页渲染', /今日计划/.test(html));
      html = await visit('#/course');
      ok('课程页渲染', /16 周 · 32 单元/.test(html));
      html = await visit('#/level');
      ok('分级测评页渲染', /先定位，再学习/.test(html));
      html = await visit('#/ai');
      ok('AI 加练页渲染', /按你的水平/.test(html));
      html = await visit('#/book');
      ok('手册页渲染', /口袋手册/.test(html));
      html = await visit('#/me');
      ok('我的页渲染', /出国交流准备度/.test(html));
      html = await visit('#/quick');
      ok('应急卡渲染', /Help!/.test(html));
      html = await visit('#/book/food');
      ok('手册分类页渲染', /餐厅/.test(html));

      /* ---- 确认起点后回到今天 ---- */
      SP.level = { phase: 'result', week: 9, correct: 9, finished: false, qs: new Array(12) };
      SP.actions.levelConfirm();
      await wait(80);
      var todayHtml = document.getElementById('view') ? document.getElementById('view').innerHTML : '';
      ok('确认起点后首页从第 9 周继续', /第 9 周/.test(todayHtml), todayHtml.slice(0, 120));

      /* ---- 远程课程包合并 ---- */
      try {
        var packRes = await fetch('tests/test-pack.json?t=' + Date.now(), { cache: 'no-store' });
        var pack = await packRes.json();
        var before = E.index().units.length;
        window.ContentSync.applyPack(pack);
        ok('课程包合并（+1 单元）', E.index().units.length === before + 1, E.index().units.length);
        ok('课程包单元可读取', E.unitItems('testu1').length === 4, E.unitItems('testu1').length);
      } catch (e) {
        ok('课程包合并（+1 单元）', false, e && e.message);
      }

      ok('无运行时错误', errors.length === 0, errors.join(' | '));
    } catch (e) {
      ok('测试执行未抛异常', false, e && (e.stack || e.message));
    } finally {
      try {
        if (backup === null) localStorage.removeItem(E.STORE_KEY);
        else localStorage.setItem(E.STORE_KEY, backup);
      } catch (e) {}
      try { SP.state = E.load(); } catch (e) {}

      var pre = document.createElement('pre');
      pre.id = 'selftest-out';
      pre.style.cssText = 'position:relative;z-index:9999;background:#fff;color:#111;font:12px/1.5 ui-monospace,monospace;padding:12px;white-space:pre-wrap;margin:0';
      pre.textContent = lines.join('\n');
      document.body.appendChild(pre);
      document.title = (fail ? 'SELFTEST FAIL ' : 'SELFTEST PASS ') + pass + '/' + (pass + fail);
      if (window.console) console.log('[selftest]', pass, 'passed,', fail, 'failed');
    }
  }

  return { run: run };
})();
