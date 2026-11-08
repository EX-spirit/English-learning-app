/* Node 侧内容与算法自检： node tests/node-check.cjs */
global.window = global;
require('../data/curriculum-1.js');
require('../data/curriculum-2.js');
require('../data/curriculum-3.js');
require('../data/curriculum-4.js');
require('../data/curriculum-5.js');
require('../data/phrasebook.js');
const E = require('../js/core.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; }
  else { fail++; console.log('FAIL', name, extra === undefined ? '' : extra); }
};

const idx = E.index();
ok('units 32', idx.units.length === 32, idx.units.length);
ok('chunks 256', idx.chunks.length === 256, idx.chunks.length);
ok('phrases 96', idx.phrases.length === 96, idx.phrases.length);
ok('ids unique', new Set(idx.items.map(i => i.id)).size === idx.items.length);
ok('all zh', idx.items.every(i => i.zh && i.zh.length > 1));
ok('chunks per unit 8', idx.units.every(u => u.chunks.length === 8));
ok('dialogue >= 6', idx.units.every(u => u.dialogue.lines.length >= 6));
ok('weeks 16', window.CURRICULUM_WEEKS.length === 16);
ok('units per week 2', Object.values(E.unitsByWeek()).every(a => a.length === 2));
ok('advanced tier 8', idx.units.filter(u => u.tier === 'adv').length === 8);

ok('sim exact', E.similarity('Hello there', 'hello there!') === 1);
ok('sim contraction', E.similarity('I am fine', "I'm fine") > 0.99, E.similarity('I am fine', "I'm fine"));
ok('sim missing', E.similarity('Could you help me please', 'could you help me') < 0.9);
ok('sim empty', E.similarity('Hello', '') === 0);

const now = Date.now();
const r0 = E.review(E.newRec(now), 0, now);
ok('again 10min', r0.reps === 0 && Math.abs(r0.due - now - 600000) < 1500);
const r1 = E.review(E.newRec(now), 2, now);
ok('first good 1d', r1.reps === 1 && r1.i === 1);
const r2 = E.review(r1, 2, now);
ok('second good 3d', r2.i === 3);
const r3 = E.review(r2, 3, now);
ok('easy grows', r3.i > 3);

const s = E.defaultState();
s.profile = { name: 'T', minutes: 30 };
const p = E.plan(s);
ok('plan starts w1u1', p.nextUnit.id === 'w1u1');
ok('plan new phrases 4', p.newPhrases.length === 4);

// 分级 / 跳级 / 太简单
ok('spot 0 → W1', E.placement(0, 12).week === 1 && E.placement(0, 12).unitId === 'w1u1');
ok('spot 7 → W5', E.placement(7, 12).week === 5 && E.placement(7, 12).unitId === 'w5u1');
ok('spot 12 → W13', E.placement(12, 12).week === 13 && E.placement(12, 12).unitId === 'w13u1');

const s2 = E.defaultState();
s2.profile = { name: 'T', minutes: 30 };
E.skipToUnit(s2, 'w9u1');
ok('skip marks earlier units', Object.keys(s2.lessons).length === 16, Object.keys(s2.lessons).length);
ok('next after skip is w9u1', E.nextLesson(s2).id === 'w9u1');
E.skipToUnit(s2, 'w1u1');
ok('skip back restores units', E.nextLesson(s2).id === 'w1u1');
E.markUnitKnown(s2, 'w1u1');
ok('too easy adds 8 cards', Object.keys(s2.srs).length === 8, Object.keys(s2.srs).length);
ok('too easy marks known', s2.lessons['w1u1'].known === true && s2.lessons['w1u1'].done === true);
ok('next after too easy', E.nextLesson(s2).id === 'w1u2');

// 完整复习：学完后由 SRS 记录
E.addToSrs(s, 'c:w1u1:0');
ok('srs add', !!s.srs['c:w1u1:0']);
E.recordCard(s, 'c:w1u1:0', 2);
ok('record card due future', s.srs['c:w1u1:0'].due > now);
ok('today cards 1', E.dayStats(s).cards === 1);

const est = E.estimate(s);
ok('estimate runs', est.total === 256 && est.readiness >= 0 && est.readiness <= 100);
ok('streak touched', s.streak.count === 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
