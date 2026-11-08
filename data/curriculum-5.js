/* SpeakTrip 进阶篇 · B1–B2（第 13–16 周，8 单元）
 * 句子更长、更接近真实口语：追问、叙事、反驳、协商、租房、就医、面试、群聊。
 */
(window.CURRICULUM_WEEKS = window.CURRICULUM_WEEKS || []).push(
  { n: 13, title: '深度闲聊', focus: '追问、接话、讲故事', milestone: '能把一段闲聊撑到 10 轮以上，还能讲清一件完整的事' },
  { n: 14, title: '立场与协商', focus: '礼貌反对、投诉、让步', milestone: '能不同意对方而不翻脸，能投诉并拿到解决方案' },
  { n: 15, title: '生活实务', focus: '租房、就医、办事', milestone: '能看懂租约关键条款，能把病情和用药说清楚' },
  { n: 16, title: '职场与人群', focus: '面试、群聊、插话', milestone: '能自我介绍并反问，能在一群人里自然地插话和让话' }
);

(window.CURRICULUM = window.CURRICULUM || []).push(

  {
    id: 'w13u1', week: 13, tier: 'adv', title: '把天聊下去', scene: '朋友聚会 / 咖啡馆',
    goal: '用追问把对话从 3 轮撑到 10 轮，不再只会回答',
    tip: '追问三件套：What\'s the story behind that? / How did that happen? / And then what? 对方说完别急着换话题，先挖一层。',
    chunks: [
      ['That\'s interesting — how did you get into it?', '挺有意思的——你是怎么入行的？'],
      ['What\'s the story behind that?', '那背后有什么故事？'],
      ['I\'ve been meaning to ask you about that.', '我一直想问你那件事。'],
      ['Sorry, I didn\'t catch that — you mean the one near the station?', '抱歉没听清——你说的是车站附近那家吗？'],
      ['That reminds me of something similar that happened to me.', '这让我想起我经历过的一件类似的事。'],
      ['So what happened next?', '后来呢？'],
      ['I can\'t say I\'ve ever tried it, but it sounds fun.', '我没试过，不过听起来挺有意思。'],
      ['Anyway, I should let you get on.', '总之，不耽误你了。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'So you\'re the one who cycled here from the coast?', '你就是那个从海边骑过来的？'],
      ['B', 'That\'s me. It took about three weeks.', '是我。骑了大约三周。'],
      ['A', 'Three weeks? What\'s the story behind that?', '三周？这背后有什么故事？'],
      ['B', 'I\'d just quit my job and wanted to clear my head.', '我刚辞职，想理清一下思路。'],
      ['A', 'That\'s brave. How did you afford it?', '挺勇敢的。钱怎么解决？'],
      ['B', 'I stayed with friends and camped most nights.', '住朋友家，大部分晚上露营。'],
      ['A', 'Sounds tough. What was the hardest part?', '听起来挺苦。最难的是什么？'],
      ['B', 'Honestly, the rain. But I\'d do it again.', '说实话是下雨。但我还会再来一次。']
    ]}
  },

  {
    id: 'w13u2', week: 13, tier: 'adv', title: '讲一件完整的事', scene: '青旅 / 餐桌上的聊天',
    goal: '用 5 句话讲清前因后果，而不是流水账',
    tip: '叙事结构：It all started when… → To make a long story short… → The funny thing is… → Looking back… 有开头、转折、感受，就没人走神。',
    chunks: [
      ['It all started when I missed my connecting flight.', '一切从我没赶上转机开始。'],
      ['To make a long story short, we ended up staying an extra night.', '长话短说，我们最后多住了一晚。'],
      ['The funny thing is, it turned out to be the best part of the trip.', '有意思的是，那反而成了旅途里最棒的部分。'],
      ['Looking back, I probably should have checked the time.', '回头看，我大概该先确认一下时间。'],
      ['I was absolutely exhausted by the end of it.', '到最后我真是累垮了。'],
      ['It was one of those days when nothing goes right.', '就是那种事事不顺的日子。'],
      ['You had to be there, honestly.', '说实话，你得在场才能体会。'],
      ['Anyway, that\'s my story — what about you?', '总之这就是我的故事——你呢？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'You look exhausted. Rough trip?', '你看起来很累。路上不顺？'],
      ['B', 'You have no idea. It all started when I missed my connecting flight.', '你根本想不到。一切从我没赶上转机开始。'],
      ['A', 'Oh no. What happened?', '不会吧。然后呢？'],
      ['B', 'To make a long story short, I ended up in the wrong city.', '长话短说，我最后到了错误的城市。'],
      ['A', 'How did you get out of that?', '那你怎么脱困的？'],
      ['B', 'I took a night bus and got in at six in the morning.', '我坐了夜班大巴，早上六点才到。'],
      ['A', 'And your luggage?', '你的行李呢？'],
      ['B', 'Still missing. The funny thing is, I don\'t even miss it.', '还没找到。有意思的是，我一点也不想念它。']
    ]}
  },

  {
    id: 'w14u1', week: 14, tier: 'adv', title: '礼貌地反对', scene: '讨论行程 / 开会',
    goal: '不同意对方但不翻脸，还能给出一个理由',
    tip: '三步走：I see where you\'re coming from → but I\'d look at it differently → because… 先接住，再转弯，最后给理由。',
    chunks: [
      ['I see where you\'re coming from, but I\'d look at it differently.', '我理解你的出发点，不过我会换个角度看。'],
      ['I\'m not convinced that\'s the whole picture.', '我不觉得这就是全部。'],
      ['Correct me if I\'m wrong, but didn\'t they change the policy last year?', '如果我记错了请纠正——他们去年不是改过政策吗？'],
      ['That\'s a fair point, though I still think it\'s worth trying.', '有道理，不过我还是觉得值得一试。'],
      ['I\'d argue the opposite, actually.', '其实我的看法正好相反。'],
      ['We might have to agree to disagree on this one.', '这一点我们恐怕只能各持己见。'],
      ['Can I push back on that a little?', '我能稍微反驳一下吗？'],
      ['Let\'s park it for now and come back to it later.', '先放一放，回头再讨论。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'I think we should just fly — it\'s so much faster.', '我觉得直接飞吧，快多了。'],
      ['B', 'I see where you\'re coming from, but I\'d look at it differently.', '我理解你的出发点，不过我会换个角度看。'],
      ['A', 'How come?', '怎么说？'],
      ['B', 'By the time you get to the airport and through security, it\'s the same.', '等你到机场、过完安检，时间是一样的。'],
      ['A', 'That\'s a fair point, though I still think flights are more reliable.', '有道理，不过我还是觉得飞机更靠谱。'],
      ['B', 'Are they? Yours was delayed four hours last time.', '是吗？你上次延误了四个小时。'],
      ['A', 'Fair enough. Can I push back on one thing?', '好吧。我能反驳一点吗？'],
      ['B', 'Go ahead — I\'m listening.', '说吧，我听着。']
    ]}
  },

  {
    id: 'w14u2', week: 14, tier: 'adv', title: '投诉与让步', scene: '酒店前台 / 客服电话',
    goal: '说清事实、提出方案、拿到补偿，全程不失礼',
    tip: '投诉顺序：事实（I\'m afraid…）→ 需求（I do need…）→ 方案（Is there any way…?）。情绪放一边，条件谈清楚，最后要书面确认。',
    chunks: [
      ['I\'m afraid that\'s not what I was promised.', '恐怕这跟当初承诺的不一样。'],
      ['I\'d like to sort this out before I leave.', '我想在走之前把这事解决。'],
      ['Is there any way you could meet me halfway?', '有没有可能大家各让一步？'],
      ['I understand it\'s not your fault, but I do need a solution.', '我知道这不是你的错，但我确实需要一个方案。'],
      ['Would you be able to waive the fee this time?', '这次能把费用免掉吗？'],
      ['If not, I\'d like to speak to a manager.', '如果不行，我想跟经理谈谈。'],
      ['That works for me — thanks for being reasonable.', '这样可以——谢谢你通情达理。'],
      ['Could you put that in writing?', '能把这个写下来吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'I\'m sorry, but the room you booked isn\'t available tonight.', '抱歉，您订的房间今晚没有了。'],
      ['B', 'I\'m afraid that\'s not what I was promised.', '恐怕这跟当初承诺的不一样。'],
      ['A', 'We can offer you a smaller room at the same price.', '我们可以给您一间小一点的房间，价格不变。'],
      ['B', 'I understand it\'s not your fault, but I do need a solution.', '我知道这不是你的错，但我确实需要一个方案。'],
      ['A', 'Let me see… I could upgrade you to the suite.', '我看看……我可以给您升级到套房。'],
      ['B', 'Would you be able to waive the extra charge?', '能把额外费用免掉吗？'],
      ['A', 'I think I can do that.', '我想可以。'],
      ['B', 'That works for me — thanks for being reasonable.', '这样可以——谢谢你通情达理。']
    ]}
  },

  {
    id: 'w15u1', week: 15, tier: 'adv', title: '租房看房', scene: '看房 / 和中介谈',
    goal: '问清租金、租期、押金、退租通知，不签糊涂约',
    tip: '租房四问：Is it inclusive of utilities? / How long is the minimum lease? / Is the deposit refundable? / How much notice do I give? 每一个都关系到钱。',
    chunks: [
      ['Is the rent inclusive of utilities?', '房租包含水电费吗？'],
      ['How long is the minimum lease?', '最短租期是多久？'],
      ['Would the landlord be open to a six-month contract?', '房东能接受半年合同吗？'],
      ['The place looks a bit run-down — is anything being renovated?', '房子看起来有点旧——有在翻新吗？'],
      ['How much notice do I need to give before moving out?', '搬走要提前多久通知？'],
      ['Is the deposit refundable?', '押金可以退吗？'],
      ['Could I see the place again in the daytime?', '我能白天再来看一次吗？'],
      ['I\'ll need a couple of days to think it over.', '我需要几天时间考虑。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'So this is the living room, and the kitchen is through there.', '这是客厅，厨房在那边。'],
      ['B', 'Is the rent inclusive of utilities?', '房租包含水电费吗？'],
      ['A', 'Water and heating, yes. Electricity is extra.', '水和暖气包含，电费另算。'],
      ['B', 'How long is the minimum lease?', '最短租期多久？'],
      ['A', 'Twelve months, usually.', '一般是十二个月。'],
      ['B', 'Would the landlord be open to a six-month contract?', '房东能接受半年合同吗？'],
      ['A', 'I can ask. Are you in a hurry?', '我可以问。你着急吗？'],
      ['B', 'I\'ll need a couple of days to think it over.', '我需要几天时间考虑。']
    ]}
  },

  {
    id: 'w15u2', week: 15, tier: 'adv', title: '把病情说清楚', scene: '诊所 / 药店',
    goal: '说清症状、时长、用药和过敏，听懂医嘱',
    tip: '症状三件套：It started… / It\'s a sharp pain… / I\'ve been feeling… 再补一句用药与过敏，医生会立刻认真起来。',
    chunks: [
      ['It started about three days ago and hasn\'t let up.', '大约三天前开始的，一直没好转。'],
      ['It\'s a sharp pain just below my ribs.', '肋骨下面一点有刺痛。'],
      ['I\'ve been feeling dizzy whenever I stand up.', '我一站起来就头晕。'],
      ['I\'m currently on blood pressure medication.', '我正在服用降压药。'],
      ['Is it contagious? Should I keep away from people?', '会传染吗？我要不要避免接触别人？'],
      ['How often should I take it, and for how long?', '多久吃一次，要吃多久？'],
      ['What side effects should I watch out for?', '我该注意哪些副作用？'],
      ['Could I get a sick note for my employer?', '能给我开一张病假条吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'What brings you in today?', '今天哪里不舒服？'],
      ['B', 'I\'ve had a sore throat for three days and it hasn\'t let up.', '我嗓子疼了三天，一直没好。'],
      ['A', 'Any fever?', '发烧吗？'],
      ['B', 'A mild one. And I\'ve been feeling dizzy when I stand up.', '有点低烧。而且我站起来会头晕。'],
      ['A', 'Are you on any medication?', '你在吃什么药吗？'],
      ['B', 'Just blood pressure tablets.', '只有降压药。'],
      ['A', 'It looks like a throat infection. I\'ll prescribe something.', '看起来是咽喉感染，我给你开点药。'],
      ['B', 'How often should I take it, and for how long?', '多久吃一次，要吃多久？'],
      ['A', 'Twice a day for a week. Come back if it gets worse.', '一天两次，吃一周。加重了再来。']
    ]}
  },

  {
    id: 'w16u1', week: 16, tier: 'adv', title: '面试与自我推销', scene: '面试 / 咖啡聊天式面谈',
    goal: '讲清经历、说一个真实优势、反问对方两个问题',
    tip: '面试三句：I\'ve spent…（经历）→ What I enjoy most is…（动机）→ I\'m looking for somewhere I can grow.（期待）。反问比回答更加分。',
    chunks: [
      ['I\'ve spent the last three years working on mobile apps.', '过去三年我一直在做移动应用。'],
      ['What I enjoy most is solving problems under pressure.', '我最享受的是在压力下解决问题。'],
      ['Could you tell me more about the team I\'d be working with?', '能多讲讲我将加入的团队吗？'],
      ['I\'d say my biggest strength is staying calm when things go wrong.', '我最大的优势是出问题时能保持冷静。'],
      ['Where do you see this role going in the next couple of years?', '这个岗位未来两年会怎么发展？'],
      ['I\'m looking for somewhere I can grow, not just a job.', '我想找一个能成长的地方，而不只是一份工作。'],
      ['I used to take on too much — I\'m better at saying no now.', '我以前揽太多事——现在比较会说不了。'],
      ['Is there anything else you\'d like me to clarify?', '还有什么需要我说明的吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Thanks for coming in. Tell me a bit about yourself.', '谢谢你来。简单介绍下自己吧。'],
      ['B', 'I\'ve spent the last three years working on mobile apps.', '过去三年我一直在做移动应用。'],
      ['A', 'What do you enjoy most about it?', '你最喜欢它哪一点？'],
      ['B', 'What I enjoy most is solving problems under pressure.', '我最享受的是在压力下解决问题。'],
      ['A', 'And what would you say is your biggest weakness?', '你最大的缺点是什么？'],
      ['B', 'I used to take on too much — I\'m better at saying no now.', '我以前揽太多事——现在比较会说不了。'],
      ['A', 'Why do you want this role?', '你为什么想要这个岗位？'],
      ['B', 'I\'m looking for somewhere I can grow, not just a job.', '我想找一个能成长的地方，而不只是一份工作。'],
      ['A', 'Great. Any questions for us?', '很好。你有什么想问我们的吗？'],
      ['B', 'Could you tell me more about the team I\'d be working with?', '能多讲讲我将加入的团队吗？']
    ]}
  },

  {
    id: 'w16u2', week: 16, tier: 'adv', title: '一群人聊天', scene: '朋友聚餐 / 同事聚会',
    goal: '能插话、能接梗、能自然地把话题让给别人',
    tip: '插话用 Sorry to jump in, but…；接回话题用 Going back to what you said…；让话用 Let\'s hear from someone who hasn\'t spoken yet.',
    chunks: [
      ['Sorry to jump in, but I\'ve got a quick question.', '抱歉插一句，我有个小问题。'],
      ['Going back to what you said earlier...', '回到你刚才说的……'],
      ['I don\'t want to dominate the conversation, but...', '我不想一个人说个不停，不过……'],
      ['That\'s a very British way of putting it.', '这说法很英式。'],
      ['I might be misreading the room here.', '我可能理解错大家的意思了。'],
      ['Let\'s hear from someone who hasn\'t spoken yet.', '听听还没说话的人的意见吧。'],
      ['I\'ll let you two catch up.', '你们俩先聊。'],
      ['It was great to finally put a face to the name.', '终于见到本人了，真好。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'So how does everyone know each other?', '大家是怎么认识的？'],
      ['B', 'Sorry to jump in, but I\'ve got a quick question first — is this seat free?', '抱歉插一句，我先问个问题——这个位子有人吗？'],
      ['A', 'Of course, sit down. We all worked together years ago.', '当然，坐吧。我们多年前是同事。'],
      ['B', 'That\'s nice. Going back to what you said earlier, how did you all end up here?', '真好。回到你刚才说的，你们怎么都到这儿来了？'],
      ['A', 'Long story. Most of us moved for work.', '说来话长。我们大多是为工作搬来的。'],
      ['B', 'It was great to finally put a face to the name.', '终于见到本人了，真好。'],
      ['A', 'Same here. Let me get you a drink.', '我也是。我去给你拿杯喝的。'],
      ['B', 'Thanks — I\'ll let you two catch up in a minute.', '谢谢——我一会儿就不打扰你们俩聊了。']
    ]}
  }
);
