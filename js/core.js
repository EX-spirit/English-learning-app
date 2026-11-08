/* SpeakTrip core —— 纯逻辑层，无 DOM 依赖，可在 Node 中测试。
 * 暴露 window.ENG（浏览器）或 module.exports（Node）。
 */
(function (factory) {
  var root = typeof globalThis !== 'undefined' ? globalThis : this;
  if (typeof module === 'object' && module.exports) { module.exports = factory(root); }
  else { root.ENG = factory(root); }
})(function (root) {
  'use strict';

  var DAY = 86400000;
  var MIN = 60000;
  var STORE_KEY = 'speaktrip.v1';

  /* ---------------- 日期 ---------------- */
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function dayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function addDays(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function startOfDay(d) {
    var x = new Date(d.getTime());
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }

  /* ---------------- 默认状态 ---------------- */
  function defaultState() {
    return {
      v: 1,
      createdAt: Date.now(),
      profile: null,
      srs: {},
      lessons: {},
      stats: {},
      totals: { speak: 0, speakScore: 0, listen: 0, listenOk: 0 },
      streak: { count: 0, last: '' },
      favorites: [],
      settings: {
        rate: 0.9,
        newPhrases: 4,
        autoPlay: true,
        showZh: true,
        theme: 'auto',
        sound: true,
        asr: true
      }
    };
  }

  function normalizeState(raw) {
    var d = defaultState();
    if (!raw || typeof raw !== 'object') return d;
    var s = raw;
    s.v = 1;
    s.profile = s.profile || null;
    s.srs = s.srs && typeof s.srs === 'object' ? s.srs : {};
    s.lessons = s.lessons && typeof s.lessons === 'object' ? s.lessons : {};
    s.stats = s.stats && typeof s.stats === 'object' ? s.stats : {};
    s.totals = Object.assign({ speak: 0, speakScore: 0, listen: 0, listenOk: 0 }, s.totals || {});
    s.streak = Object.assign({ count: 0, last: '' }, s.streak || {});
    s.favorites = Array.isArray(s.favorites) ? s.favorites : [];
    s.settings = Object.assign(d.settings, s.settings || {});
    s.createdAt = s.createdAt || Date.now();
    return s;
  }

  function load() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      return normalizeState(JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    try {
      if (root.localStorage) root.localStorage.setItem(STORE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function reset() {
    try { if (root.localStorage) root.localStorage.removeItem(STORE_KEY); } catch (e) {}
    return defaultState();
  }

  function exportData(state) {
    return JSON.stringify({ app: 'speaktrip', exportedAt: new Date().toISOString(), state: state }, null, 2);
  }

  function importData(text) {
    var obj = JSON.parse(text);
    var s = obj && obj.state ? obj.state : obj;
    if (!s || typeof s !== 'object' || !s.srs) throw new Error('备份文件格式不正确');
    return normalizeState(s);
  }

  /* ---------------- 内容索引 ---------------- */
  var cache = null;

  function buildIndex() {
    var units = (root.CURRICULUM || []).slice();
    var items = [];
    var byId = {};
    var byUnit = {};
    var unitOrder = {};

    units.forEach(function (u, ui) {
      unitOrder[u.id] = ui;
      var list = [];
      (u.chunks || []).forEach(function (c, i) {
        var it = {
          id: 'c:' + u.id + ':' + i, en: c[0], zh: c[1], note: c[2] || '',
          unit: u.id, week: u.week, type: 'chunk', idx: i
        };
        items.push(it); list.push(it); byId[it.id] = it;
      });
      (u.dialogue && u.dialogue.lines || []).forEach(function (l, i) {
        var it = {
          id: 'd:' + u.id + ':' + i, en: l[1], zh: l[2], note: '',
          unit: u.id, week: u.week, type: 'line', idx: i, speaker: l[0]
        };
        items.push(it); list.push(it); byId[it.id] = it;
      });
      byUnit[u.id] = { unit: u, items: list };
    });

    var phraseItems = [];
    (root.PHRASEBOOK || []).forEach(function (cat) {
      (cat.items || []).forEach(function (p, i) {
        var it = {
          id: 'p:' + cat.id + ':' + i, en: p[0], zh: p[1], note: '',
          type: 'phrase', cat: cat.id, catName: cat.name, idx: i
        };
        items.push(it); phraseItems.push(it); byId[it.id] = it;
      });
    });

    cache = {
      units: units,
      weeks: root.CURRICULUM_WEEKS || [],
      items: items,
      chunks: items.filter(function (i) { return i.type === 'chunk'; }),
      phrases: phraseItems,
      byId: byId,
      byUnit: byUnit,
      unitOrder: unitOrder
    };
    return cache;
  }

  function index() { return cache || buildIndex(); }
  function resetIndex() { cache = null; }
  function item(id) { return index().byId[id] || null; }
  function unitItems(unitId) { var b = index().byUnit[unitId]; return b ? b.items : []; }

  function unitsByWeek() {
    var out = {};
    index().units.forEach(function (u) {
      (out[u.week] = out[u.week] || []).push(u);
    });
    return out;
  }

  /* ---------------- 间隔重复（SM-2 简化版） ---------------- */
  var AGAIN = 0, HARD = 1, GOOD = 2, EASY = 3;

  function newRec(now) {
    return { e: 2.5, i: 0, due: now, reps: 0, lapses: 0, last: 0, g: -1 };
  }

  function cloneRec(r) {
    return { e: r.e, i: r.i, due: r.due, reps: r.reps, lapses: r.lapses, last: r.last, g: r.g };
  }

  /**
   * 评分并返回新的记忆记录。
   * grade: 0 忘记 / 1 困难 / 2 记得 / 3 太简单
   */
  function review(rec, grade, now) {
    now = now || Date.now();
    var r = cloneRec(rec || newRec(now));
    if (grade <= AGAIN) {
      r.lapses += 1;
      r.reps = 0;
      r.e = Math.max(1.3, r.e - 0.2);
      r.i = 0;
      r.due = now + 10 * MIN;
    } else {
      var base;
      if (r.reps === 0) { base = grade === HARD ? 0.4 : grade === GOOD ? 1 : 1.6; }
      else if (r.reps === 1) { base = grade === HARD ? 1 : grade === GOOD ? 3 : 4.5; }
      else { base = r.i * (grade === HARD ? 0.6 : grade === GOOD ? r.e : r.e * 1.35); }
      r.i = Math.max(0.3, Math.min(base, 365));
      r.e = Math.max(1.3, Math.min(3.2, r.e + (grade === EASY ? 0.08 : grade === HARD ? -0.12 : 0)));
      r.due = now + Math.round(r.i * DAY);
      r.reps += 1;
    }
    r.last = now;
    r.g = grade;
    return r;
  }

  function statusOf(rec) {
    if (!rec) return 'new';
    if (rec.reps >= 3 && rec.i >= 21) return 'mastered';
    if (rec.due <= Date.now()) return 'due';
    return 'learning';
  }

  function isDue(rec, now) { return !!rec && rec.due <= (now || Date.now()); }

  /* ---------------- 学习记录 ---------------- */
  function dayStats(state, now) {
    var k = dayStr(new Date(now || Date.now()));
    if (!state.stats[k]) state.stats[k] = { min: 0, cards: 0, newCards: 0, speak: 0, listen: 0, xp: 0, ext: 0 };
    if (state.stats[k].ext == null) state.stats[k].ext = 0;
    return state.stats[k];
  }

  function touchDay(state, now) {
    var t = dayStr(new Date(now || Date.now()));
    if (state.streak.last === t) return;
    var y = dayStr(addDays(new Date(now || Date.now()), -1));
    state.streak.count = state.streak.last === y ? (state.streak.count || 0) + 1 : 1;
    state.streak.last = t;
  }

  function addMinutes(state, minutes, now) {
    if (!minutes || minutes <= 0) return;
    dayStats(state, now).min = Math.round((dayStats(state, now).min + minutes) * 10) / 10;
  }

  function recordCard(state, id, grade, now) {
    now = now || Date.now();
    var prev = state.srs[id];
    var rec = review(prev, grade, now);
    state.srs[id] = rec;
    var st = dayStats(state, now);
    st.cards += 1;
    if (!prev) {
      st.newCards += 1;
      var it = item(id);
      if (it && it.type === 'phrase') st.ext = (st.ext || 0) + 1;
    }
    st.xp += grade === AGAIN ? 1 : 2;
    touchDay(state, now);
    return rec;
  }

  function addToSrs(state, id, now, opts) {
    now = now || Date.now();
    if (state.srs[id]) return state.srs[id];
    opts = opts || {};
    var rec = newRec(now);
    rec.reps = opts.reps == null ? 1 : opts.reps;
    rec.i = opts.days || 0;
    rec.due = now + (opts.days || 0) * DAY;
    state.srs[id] = rec;
    var st = dayStats(state, now);
    st.newCards += 1;
    var it = item(id);
    if (it && it.type === 'phrase') st.ext = (st.ext || 0) + 1;
    return rec;
  }

  function recordSpeak(state, score, now) {
    var st = dayStats(state, now);
    var ok = score >= 0.75;
    st.speak += 1;
    st.xp += ok ? 4 : 2;
    state.totals.speak += 1;
    state.totals.speakScore += Math.max(0, Math.min(1, score));
    touchDay(state, now);
    return ok;
  }

  function recordListen(state, correct, now) {
    var st = dayStats(state, now);
    st.listen += 1;
    if (correct) { st.xp += 3; state.totals.listenOk += 1; }
    state.totals.listen += 1;
    touchDay(state, now);
  }

  function completeLesson(state, unitId, score, now) {
    now = now || Date.now();
    var prev = state.lessons[unitId];
    state.lessons[unitId] = {
      done: true,
      at: now,
      listen: Math.max(prev && prev.listen || 0, score && score.listen || 0),
      speak: Math.max(prev && prev.speak || 0, score && score.speak || 0)
    };
    var st = dayStats(state, now);
    if (!prev) st.xp += 20;
    touchDay(state, now);
  }

  function toggleFavorite(state, id) {
    var i = state.favorites.indexOf(id);
    if (i >= 0) state.favorites.splice(i, 1);
    else state.favorites.unshift(id);
    return i < 0;
  }

  /* ---------------- 今日计划 ---------------- */
  function isDone(state, unitId) {
    var l = state.lessons[unitId];
    return !!(l && l.done);
  }

  function startIndex(state) {
    var p = state.profile;
    if (!p || !p.startUnit) return 0;
    var pos = index().unitOrder[p.startUnit];
    return pos == null ? 0 : pos;
  }

  function nextLesson(state) {
    var units = index().units;
    var begin = startIndex(state);
    for (var i = begin; i < units.length; i++) {
      if (!isDone(state, units[i].id)) return units[i];
    }
    for (var j = 0; j < begin; j++) {
      if (!isDone(state, units[j].id)) return units[j];
    }
    return null;
  }

  /** 把起点之前的单元标记为「已跳过」（不进入复习队列） */
  function skipToUnit(state, unitId, now) {
    var idx = index();
    var pos = idx.unitOrder[unitId];
    if (pos == null) return false;
    var t = now || Date.now();
    // 起点调到更早的周时，恢复原本被跳过的单元
    for (var j = pos; j < idx.units.length; j++) {
      var l = state.lessons[idx.units[j].id];
      if (l && l.skipped && !l.known) delete state.lessons[idx.units[j].id];
    }
    for (var i = 0; i < pos; i++) {
      if (!state.lessons[idx.units[i].id]) {
        state.lessons[idx.units[i].id] = { done: true, skipped: true, at: t };
      }
    }
    state.profile = state.profile || {};
    state.profile.startUnit = unitId;
    return true;
  }

  /** 「太简单」：本单元句子直接记为已掌握，进入长间隔复习 */
  function markUnitKnown(state, unitId, now) {
    var t = now || Date.now();
    unitItems(unitId).forEach(function (it) {
      if (it.type !== 'chunk') return;
      state.srs[it.id] = { e: 2.7, i: 45, reps: 4, lapses: 0, due: t + 45 * DAY, last: t, g: 3 };
    });
    completeLesson(state, unitId, { listen: 1, speak: 1 }, t);
    if (state.lessons[unitId]) state.lessons[unitId].known = true;
    dayStats(state, t).xp += 5;
    return true;
  }

  /** 分级测评：答对题数 → 建议起点 */
  function placement(correct, total) {
    var c = Math.max(0, Math.min(total || 12, correct));
    var week = c <= 2 ? 1 : c <= 5 ? 3 : c <= 8 ? 5 : c <= 10 ? 9 : 13;
    var list = index().units.filter(function (u) { return u.week === week; });
    return {
      correct: c, total: total || 12, week: week,
      unitId: list.length ? list[0].id : 'w1u1'
    };
  }

  function nextLessons(state, n) {
    var out = [];
    var units = index().units;
    var begin = startIndex(state);
    var order = units.slice(begin).concat(units.slice(0, begin));
    for (var i = 0; i < order.length && out.length < n; i++) {
      if (!isDone(state, order[i].id)) out.push(order[i]);
    }
    return out;
  }

  function dueItems(state, now) {
    var nowt = now || Date.now();
    var out = [];
    var items = index().items;
    for (var i = 0; i < items.length; i++) {
      var r = state.srs[items[i].id];
      if (r && r.due <= nowt) out.push(items[i]);
    }
    out.sort(function (a, b) { return state.srs[a.id].due - state.srs[b.id].due; });
    return out;
  }

  function freshPhrases(state, n) {
    if (!n) return [];
    var all = index().phrases;
    var pool = [];
    for (var i = 0; i < all.length; i++) { if (!state.srs[all[i].id]) pool.push(all[i]); }
    if (!pool.length) return [];
    // 每天从不同位置开始，避免总是同一批
    var offset = Math.floor(Date.now() / DAY) % pool.length;
    var out = [];
    for (var k = 0; k < pool.length && out.length < n; k++) {
      out.push(pool[(offset + k) % pool.length]);
    }
    return out;
  }

  function plan(state, now) {
    var nowt = now || Date.now();
    var due = dueItems(state, nowt);
    var st = dayStats(state, nowt);
    var quota = Math.max(0, (state.settings.newPhrases || 0) - (st.ext || 0));
    var phrases = freshPhrases(state, quota);
    var next = nextLesson(state);
    var goalMin = state.profile ? state.profile.minutes : 30;
    return {
      due: due,
      dueCount: due.length,
      newPhrases: phrases,
      reviewTotal: due.length + phrases.length,
      nextUnit: next,
      minutesToday: st.min,
      cardsToday: st.cards,
      speakToday: st.speak,
      goalMinutes: goalMin,
      dayDone: st.min >= goalMin && due.length === 0
    };
  }

  /* ---------------- 统计 / 能力估算 ---------------- */
  function countByStatus(state) {
    var out = { total: 0, new: 0, learning: 0, mastered: 0, due: 0 };
    var now = Date.now();
    index().items.forEach(function (it) {
      var r = state.srs[it.id];
      if (it.type === 'chunk') out.total += 1;
      if (!r) { out.new += 1; return; }
      if (r.reps >= 3 && r.i >= 21) out.mastered += 1;
      else out.learning += 1;
      if (r.due <= now) out.due += 1;
    });
    return out;
  }

  function unitProgress(state, unit) {
    var items = unitItems(unit.id).filter(function (i) { return i.type === 'chunk'; });
    var learned = 0, mature = 0;
    items.forEach(function (it) {
      var r = state.srs[it.id];
      if (r) { learned += 1; if (r.reps >= 3 && r.i >= 21) mature += 1; }
    });
    var l = state.lessons[unit.id];
    return {
      total: items.length,
      learned: learned,
      mature: mature,
      done: !!(l && l.done),
      skipped: !!(l && l.skipped),
      known: !!(l && l.known),
      pct: items.length ? Math.round(learned / items.length * 100) : 0
    };
  }

  function weekProgress(state, week) {
    var list = index().units.filter(function (u) { return u.week === week; });
    var done = 0, total = 0;
    list.forEach(function (u) {
      var p = unitProgress(state, u);
      total += p.total;
      done += p.learned;
    });
    var finished = list.filter(function (u) { return state.lessons[u.id] && state.lessons[u.id].done; }).length;
    return { units: list.length, unitsDone: finished, learned: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  }

  function streakDays(state, now) {
    return state.streak.last ? state.streak.count : 0;
  }

  function last7(state, now) {
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = addDays(new Date(now || Date.now()), -i);
      var k = dayStr(d);
      var s = state.stats[k];
      out.push({ date: k, min: s ? s.min : 0, cards: s ? s.cards : 0, active: !!(s && (s.cards > 0 || s.min > 0)) });
    }
    return out;
  }

  function estimate(state) {
    var mature = 0, learned = 0, total = 0;
    index().chunks.forEach(function (it) {
      total += 1;
      var r = state.srs[it.id];
      if (r) { learned += 1; if (r.reps >= 3 && r.i >= 21) mature += 1; }
    });
    var acc = state.totals.speak ? state.totals.speakScore / state.totals.speak : 0;
    var listenAcc = state.totals.listen ? state.totals.listenOk / state.totals.listen : 0;
    var readiness = Math.round(100 * (
      0.60 * Math.min(1, mature / 140) +
      0.20 * Math.min(1, learned / Math.max(1, total)) +
      0.12 * Math.min(1, acc / 0.85) +
      0.08 * Math.min(1, listenAcc / 0.9)
    ));
    var level, levelDesc;
    if (mature < 20) { level = 'A1'; levelDesc = '能应对问候与最简单需求'; }
    else if (mature < 60) { level = 'A1+'; levelDesc = '能完成值机、点餐等固定流程'; }
    else if (mature < 100) { level = 'A2'; levelDesc = '能应付大部分旅行场景'; }
    else if (mature < 140) { level = 'B1'; levelDesc = '能就熟悉话题持续对话'; }
    else if (mature < 175) { level = 'B1+'; levelDesc = '能较自如地聊天、讲经历'; }
    else { level = 'B2'; levelDesc = '能讨论抽象话题、表达观点'; }
    return {
      mature: mature, learned: learned, total: total,
      speakAccuracy: Math.round(acc * 100),
      listenAccuracy: Math.round(listenAcc * 100),
      readiness: Math.max(0, Math.min(100, readiness)),
      level: level, levelDesc: levelDesc
    };
  }

  /* ---------------- 文本对比（口语评分） ---------------- */
  var CONTRACTION = [
    [/\bi['’]m\b/g, 'i am'], [/\byou['’]re\b/g, 'you are'], [/\bwe['’]re\b/g, 'we are'],
    [/\bthey['’]re\b/g, 'they are'], [/\bhe['’]s\b/g, 'he is'], [/\bshe['’]s\b/g, 'she is'],
    [/\bit['’]s\b/g, 'it is'], [/\bthat['’]s\b/g, 'that is'], [/\bthere['’]s\b/g, 'there is'],
    [/\bwhat['’]s\b/g, 'what is'], [/\blet['’]s\b/g, 'let us'],
    [/\bi['’]ve\b/g, 'i have'], [/\bwe['’]ve\b/g, 'we have'], [/\byou['’]ve\b/g, 'you have'],
    [/\bthey['’]ve\b/g, 'they have'], [/\bi['’]d\b/g, 'i would'], [/\bi['’]ll\b/g, 'i will'],
    [/\byou['’]ll\b/g, 'you will'], [/\bwe['’]ll\b/g, 'we will'],
    [/\bcan['’]t\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon['’]t\b/g, 'will not'],
    [/\bdon['’]t\b/g, 'do not'], [/\bdoesn['’]t\b/g, 'does not'], [/\bdidn['’]t\b/g, 'did not'],
    [/\bisn['’]t\b/g, 'is not'], [/\baren['’]t\b/g, 'are not'], [/\bwasn['’]t\b/g, 'was not'],
    [/\bweren['’]t\b/g, 'were not'], [/\bhaven['’]t\b/g, 'have not'], [/\bhasn['’]t\b/g, 'has not'],
    [/\bwouldn['’]t\b/g, 'would not'], [/\bcouldn['’]t\b/g, 'could not'], [/\bshouldn['’]t\b/g, 'should not']
  ];

  function normalize(s) {
    var t = String(s || '').toLowerCase().replace(/[’]/g, "'");
    for (var i = 0; i < CONTRACTION.length; i++) t = t.replace(CONTRACTION[i][0], CONTRACTION[i][1]);
    t = t.replace(/[^a-z0-9' ]+/g, ' ').replace(/'/g, ' ');
    return t.replace(/\s+/g, ' ').trim();
  }

  function tokens(s) {
    var n = normalize(s);
    return n ? n.split(' ') : [];
  }

  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var prev = new Array(b.length + 1);
    var cur = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (var k = 1; k <= b.length; k++) {
        var cost = a[i - 1] === b[k - 1] ? 0 : 1;
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + cost);
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[b.length];
  }

  function similarity(target, said) {
    var A = tokens(target), B = tokens(said);
    if (!A.length || !B.length) return 0;
    var d = levenshtein(A, B);
    var score = 1 - d / Math.max(A.length, B.length);
    return Math.max(0, Math.min(1, score));
  }

  function bestSimilarity(target, alternatives) {
    var best = 0;
    (alternatives || []).forEach(function (alt) {
      var s = similarity(target, alt);
      if (s > best) best = s;
    });
    return best;
  }

  function wordDiff(target, said) {
    var A = tokens(target), B = tokens(said);
    var used = new Array(B.length).fill(false);
    var out = [];
    A.forEach(function (w) {
      var hit = -1;
      for (var i = 0; i < B.length; i++) {
        if (!used[i] && B[i] === w) { hit = i; break; }
      }
      if (hit >= 0) { used[hit] = true; out.push({ w: w, ok: true }); }
      else { out.push({ w: w, ok: false }); }
    });
    return out;
  }

  function gradeLabel(score) {
    if (score >= 0.92) return { text: '完美', tone: 'good' };
    if (score >= 0.75) return { text: '很接近', tone: 'good' };
    if (score >= 0.55) return { text: '再清楚一点', tone: 'warn' };
    return { text: '再试一次', tone: 'bad' };
  }

  /* ---------------- 杂项 ---------------- */
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function fmtDuration(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    if (s < 60) return s + ' 秒';
    var m = Math.round(s / 60);
    if (m < 60) return m + ' 分钟';
    var h = Math.floor(m / 60);
    return h + ' 小时 ' + (m % 60) + ' 分';
  }

  function fmtDue(rec, now) {
    if (!rec) return '未学';
    var diff = rec.due - (now || Date.now());
    if (diff <= 0) return '现在复习';
    if (diff < 3600000) return Math.max(1, Math.round(diff / MIN)) + ' 分钟后';
    if (diff < DAY) return Math.round(diff / 3600000) + ' 小时后';
    return Math.round(diff / DAY) + ' 天后';
  }

  function weekdayCN(d) {
    return ['日', '一', '二', '三', '四', '五', '六'][new Date(d).getDay()];
  }

  return {
    DAY: DAY, MIN: MIN, STORE_KEY: STORE_KEY,
    AGAIN: AGAIN, HARD: HARD, GOOD: GOOD, EASY: EASY,
    dayStr: dayStr, addDays: addDays, startOfDay: startOfDay, weekdayCN: weekdayCN,
    defaultState: defaultState, normalizeState: normalizeState,
    load: load, save: save, reset: reset, exportData: exportData, importData: importData,
    index: index, resetIndex: resetIndex, item: item, unitItems: unitItems, unitsByWeek: unitsByWeek,
    newRec: newRec, review: review, statusOf: statusOf, isDue: isDue,
    dayStats: dayStats, touchDay: touchDay, addMinutes: addMinutes,
    recordCard: recordCard, addToSrs: addToSrs, recordSpeak: recordSpeak, recordListen: recordListen,
    completeLesson: completeLesson, toggleFavorite: toggleFavorite,
    isDone: isDone, startIndex: startIndex, skipToUnit: skipToUnit, markUnitKnown: markUnitKnown, placement: placement,
    nextLesson: nextLesson, nextLessons: nextLessons, dueItems: dueItems, freshPhrases: freshPhrases, plan: plan,
    countByStatus: countByStatus, unitProgress: unitProgress, weekProgress: weekProgress,
    streakDays: streakDays, last7: last7, estimate: estimate,
    normalize: normalize, tokens: tokens, similarity: similarity, bestSimilarity: bestSimilarity,
    wordDiff: wordDiff, gradeLabel: gradeLabel, clamp: clamp,
    fmtDuration: fmtDuration, fmtDue: fmtDue
  };
});
