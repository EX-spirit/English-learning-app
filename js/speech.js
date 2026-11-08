/* SpeakTrip —— 语音层：朗读（TTS）、跟读识别（ASR）、反馈音 */
window.Voice = (function () {
  'use strict';
  var synth = window.speechSynthesis || null;
  var voices = [];
  var ready = false;
  var rate = 0.9;
  var current = null;
  var cancelToken = 0;

  function loadVoices() {
    if (!synth) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    if (voices.length) ready = true;
  }

  if (synth) {
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    setTimeout(loadVoices, 300);
    setTimeout(loadVoices, 1200);
  }

  function list() {
    var en = voices.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    return en.length ? en : voices;
  }

  function pick(uri) {
    var en = list();
    if (!en.length) return null;
    if (uri) {
      for (var i = 0; i < en.length; i++) if (en[i].voiceURI === uri) return en[i];
    }
    // 优先：带 Natural / Google / Siri 的高质量女声，其次 en-US，最后任意英文
    var prefer = [/natural/i, /google us english/i, /samantha/i, /aria/i, /jenny/i, /female/i];
    for (var p = 0; p < prefer.length; p++) {
      for (var j = 0; j < en.length; j++) {
        if (prefer[p].test(en[j].name) && /^en[-_]US/i.test(en[j].lang)) return en[j];
      }
    }
    for (var k = 0; k < en.length; k++) if (/^en[-_]US/i.test(en[k].lang)) return en[k];
    for (var m = 0; m < en.length; m++) if (/^en[-_]GB/i.test(en[m].lang)) return en[m];
    return en[0];
  }

  function speak(text, opts) {
    opts = opts || {};
    var token = ++cancelToken;
    return new Promise(function (resolve) {
      if (!synth || !text) { resolve(false); return; }
      try { synth.cancel(); } catch (e) {}
      var u = new SpeechSynthesisUtterance(String(text));
      var v = pick(opts.voiceURI);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
      u.rate = Math.max(0.5, Math.min(1.5, opts.rate || rate));
      u.pitch = opts.pitch || 1;
      u.volume = 1;
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        current = null;
        resolve(ok);
      }
      u.onend = function () { finish(true); };
      u.onerror = function () { finish(false); };
      current = u;
      var words = String(text).split(/\s+/).length;
      var est = Math.max(2200, words * 620 / u.rate);
      setTimeout(function () {
        if (token !== cancelToken) { finish(false); return; }
        try {
          synth.speak(u);
          if (synth.paused) synth.resume();
        } catch (e) { finish(false); }
      }, 50);
      setTimeout(function () { finish(false); }, est + 1500);
    });
  }

  function stop() {
    cancelToken++;
    if (synth) { try { synth.cancel(); } catch (e) {} }
    current = null;
  }

  function speaking() { return !!current; }

  function setRate(r) { rate = r; }

  return {
    available: !!synth,
    get voices() { return list(); },
    allVoices: function () { return voices.slice(); },
    pick: pick,
    speak: speak,
    stop: stop,
    speaking: speaking,
    setRate: setRate,
    ready: function () { return ready; }
  };
})();

/* 跟读识别（Chrome / Edge / 部分 Safari 支持；不支持时界面自动降级为自评） */
window.Listen = (function () {
  'use strict';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var rec = null;
  var handlers = {};
  var listening = false;

  function supported() {
    return !!SR && (window.isSecureContext !== false);
  }

  function ensure() {
    if (rec || !SR) return rec;
    rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 5;
    rec.onresult = function (e) {
      var alts = [];
      var finalText = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        for (var j = 0; j < r.length; j++) {
          var t = r[j].transcript;
          if (t && alts.indexOf(t) < 0) alts.push(t);
        }
        if (r.isFinal) finalText += r[0].transcript;
      }
      if (handlers.onPartial && !finalText) handlers.onPartial(alts[0] || '');
      if (finalText && handlers.onResult) handlers.onResult(finalText.trim(), alts);
    };
    rec.onerror = function (e) {
      listening = false;
      if (handlers.onError) handlers.onError(e.error || 'unknown');
    };
    rec.onend = function () {
      listening = false;
      if (handlers.onEnd) handlers.onEnd();
    };
    return rec;
  }

  function start(h) {
    if (!supported()) {
      if (h && h.onError) h.onError('unsupported');
      return false;
    }
    ensure();
    handlers = h || {};
    if (listening) { try { rec.stop(); } catch (e) {} }
    try {
      rec.start();
      listening = true;
      return true;
    } catch (e) {
      listening = false;
      // 上一次尚未结束，稍后重试一次
      setTimeout(function () {
        try { rec.start(); listening = true; } catch (e2) { if (h && h.onError) h.onError('busy'); }
      }, 250);
      return false;
    }
  }

  function stop() {
    if (rec && listening) { try { rec.stop(); } catch (e) {} }
    listening = false;
  }

  function abort() {
    if (rec) { try { rec.abort(); } catch (e) {} }
    listening = false;
  }

  function errorText(code) {
    var map = {
      'not-allowed': '麦克风被禁止。请在浏览器设置里允许本站使用麦克风。',
      'service-not-allowed': '浏览器拒绝了语音识别服务。',
      'no-speech': '没有听到声音，靠近麦克风再说一次。',
      'audio-capture': '找不到麦克风。',
      'network': '语音识别需要联网（或浏览器服务不可用），可以先自评。',
      'unsupported': '这个浏览器不支持跟读评分，请用 Chrome / Edge，或先自评。',
      'busy': '识别还没准备好，再点一次麦克风。',
      'aborted': ''
    };
    return map[code] || ('识别出错：' + code);
  }

  return {
    supported: supported,
    start: start,
    stop: stop,
    abort: abort,
    listening: function () { return listening; },
    errorText: errorText
  };
})();

/* 轻量反馈音（WebAudio，无外部资源） */
window.Tone = (function () {
  'use strict';
  var ctx = null;
  function ac() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function beep(freq, dur, when, gain) {
    var c = ac();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    var t = c.currentTime + (when || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain || 0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  }
  return {
    ok: function () { beep(660, 0.09, 0, 0.04); beep(880, 0.12, 0.08, 0.04); },
    no: function () { beep(300, 0.12, 0, 0.04); },
    done: function () { beep(523, 0.1, 0); beep(659, 0.1, 0.1); beep(784, 0.18, 0.2); },
    tick: function () { beep(1200, 0.03, 0, 0.02); }
  };
})();
