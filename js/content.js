/* SpeakTrip —— 课程包同步
 * 启动时应用本地缓存的课程包；联网时静默检查远端 manifest。
 * manifest 结构：{ version, updatedAt, weeks:[], units:[], phrases:[] }
 * 有新版本就合并进课程，断网/失败则继续用缓存，不影响离线学习。
 */
window.ContentSync = (function () {
  'use strict';
  var KEY = 'speaktrip.pack.v1';
  var meta = { version: 0, updatedAt: '', lastCheck: 0, source: '' };

  function readCache() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeCache() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        version: meta.version,
        updatedAt: meta.updatedAt,
        lastCheck: meta.lastCheck,
        source: meta.source
      }));
    } catch (e) {}
  }

  function applyPack(pack) {
    if (!pack || typeof pack.version !== 'number') return false;
    var C = window.CURRICULUM = window.CURRICULUM || [];
    var W = window.CURRICULUM_WEEKS = window.CURRICULUM_WEEKS || [];
    var P = window.PHRASEBOOK = window.PHRASEBOOK || [];
    var seen = {};
    C.forEach(function (u) { seen[u.id] = 1; });

    (pack.weeks || []).forEach(function (w) {
      if (!W.some(function (x) { return x.n === w.n; })) W.push(w);
    });
    var added = 0;
    (pack.units || []).forEach(function (u) {
      if (!u || !u.id || seen[u.id]) return;
      if (!u.chunks || !u.chunks.length) return;
      C.push(u);
      seen[u.id] = 1;
      added += 1;
    });
    (pack.phrases || []).forEach(function (cat) {
      if (!cat || !cat.id || !cat.items) return;
      var hit = null;
      for (var i = 0; i < P.length; i++) if (P[i].id === cat.id) hit = P[i];
      if (hit) hit.items = cat.items;
      else P.push(cat);
    });
    if (window.ENG) window.ENG.resetIndex();
    return added > 0 || (pack.units && pack.units.length === 0);
  }

  function source() {
    var s = window.SP && window.SP.state;
    var url = (s && s.settings && s.settings.contentUrl) || '';
    return url.trim() || 'content/manifest.json';
  }

  function bust(url) {
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
  }

  function init() {
    var cached = readCache();
    if (cached) {
      meta.version = cached.version || 0;
      meta.updatedAt = cached.updatedAt || '';
      meta.lastCheck = cached.lastCheck || 0;
      meta.source = cached.source || '';
    }
    return meta.version;
  }

  async function check(force) {
    var url = source();
    var res = await fetch(bust(url), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var pack = await res.json();
    if (!pack || typeof pack.version !== 'number') throw new Error('课程包格式不正确');
    meta.lastCheck = Date.now();
    meta.source = url;
    if (!force && pack.version <= meta.version) {
      writeCache();
      return { updated: false, version: meta.version };
    }
    if (pack.version <= meta.version) {
      writeCache();
      return { updated: false, version: meta.version };
    }
    applyPack(pack);
    meta.version = pack.version;
    meta.updatedAt = pack.updatedAt || '';
    writeCache();
    return { updated: true, version: meta.version, units: (pack.units || []).length };
  }

  function stats() {
    return {
      version: meta.version,
      updatedAt: meta.updatedAt,
      lastCheck: meta.lastCheck,
      source: source()
    };
  }

  return {
    init: init,
    check: check,
    applyPack: applyPack,
    stats: stats,
    lastCheck: function () { return meta.lastCheck; }
  };
})();
