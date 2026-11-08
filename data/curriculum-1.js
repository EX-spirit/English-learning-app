/* SpeakTrip · 12 周出国交流课程
 * 数据格式：[英文, 中文] 或 [英文, 中文, 提示]
 * 对话行：['A'|'B', 英文, 中文]，user 表示用户扮演的角色
 */
window.CURRICULUM_WEEKS = [
  { n: 1,  title: '开口生存', focus: '万能句 + 礼貌请求', milestone: '能完成 30 秒自我介绍，卡住时能用英语自救' },
  { n: 2,  title: '机场入境', focus: '值机、安检、海关、转机', milestone: '能独立完成一次入境问答，听懂登机口信息' },
  { n: 3,  title: '交通出行', focus: '打车、地铁、买票、问路', milestone: '能自己从机场到市区，不靠翻译软件' },
  { n: 4,  title: '酒店住宿', focus: '入住、报修、退房', milestone: '能办理入住并处理一个房间问题' },
  { n: 5,  title: '餐厅点餐', focus: '订位、点菜、忌口、结账', milestone: '能点一桌菜、说明忌口并分开结账' },
  { n: 6,  title: '购物付款', focus: '试穿、尺码、退换、支付', milestone: '能独立完成一次试穿与退换' },
  { n: 7,  title: '社交闲聊', focus: '破冰、约人、告别', milestone: '能和陌生人聊满 5 分钟不冷场' },
  { n: 8,  title: '求助应急', focus: '迷路、丢物、看病、报警', milestone: '能在突发状况下说清问题和需求' },
  { n: 9,  title: '表达观点', focus: '同意、反对、建议、拒绝', milestone: '能礼貌地表达不同意见并给出理由' },
  { n: 10, title: '深入交流', focus: '讲故事、描述、比较', milestone: '能用过去时讲完一段 1 分钟的经历' },
  { n: 11, title: '电话线上', focus: '预约、改签、确认细节', milestone: '能打电话改一次预订，不用面对面' },
  { n: 12, title: '综合实战', focus: '长对话、文化话题、告别', milestone: '能应对 10 轮以上的连续对话' }
];

(window.CURRICULUM = window.CURRICULUM || []).push(

  {
    id: 'w1u1', week: 1, title: '第一次开口', scene: '青旅 / 机场遇到同路人',
    goal: '30 秒自我介绍，并坦白“我英语不好”而不尴尬',
    tip: '开口三件套：Hi, I\'m… / Nice to meet you. / Sorry, my English isn\'t very good. 先说这三句，对方会自动放慢语速。',
    chunks: [
      ['Hi, I\'m Wei. Nice to meet you.', '嗨，我是伟，很高兴认识你。'],
      ['Sorry, my English isn\'t very good.', '抱歉，我英语不太好。'],
      ['Could you say that again, please?', '你能再说一遍吗？'],
      ['Could you speak a little slower?', '你能说慢一点吗？'],
      ['How do you say this in English?', '这个用英语怎么说？'],
      ['I\'m here on holiday.', '我是来度假的。'],
      ['This is my first time abroad.', '这是我第一次出国。'],
      ['Thanks a lot. You\'ve been really helpful.', '太感谢了，你帮了大忙。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Hi! Are you staying here too?', '嗨！你也住这儿吗？'],
      ['B', 'Yes, I just checked in. I\'m Wei.', '是的，我刚办好入住。我叫伟。'],
      ['A', 'Nice to meet you, Wei. I\'m Sam. Where are you from?', '很高兴认识你，伟。我是山姆。你从哪儿来？'],
      ['B', 'I\'m from China. This is my first time in Europe.', '我来自中国。这是我第一次来欧洲。'],
      ['A', 'Cool! How long are you staying?', '真棒！你要待多久？'],
      ['B', 'About two weeks. Sorry, my English isn\'t very good.', '大概两周。抱歉，我英语不太好。'],
      ['A', 'No worries, you\'re doing great. Just ask if you need anything.', '没关系，你说得挺好。需要什么尽管问。'],
      ['B', 'Thanks a lot. That\'s really kind of you.', '太感谢了，你人真好。']
    ]}
  },

  {
    id: 'w1u2', week: 1, title: '礼貌万能句', scene: '街上 / 店里需要帮助时',
    goal: '用 Excuse me / Do you mind… 开口求助，不失礼也不慌张',
    tip: 'Do you mind…? 的同意回答是 No / Not at all（不介意），别说 Yes。想更简单就用 Is it okay if…?',
    chunks: [
      ['Excuse me, could you help me?', '打扰一下，你能帮我吗？'],
      ['Sorry to bother you.', '不好意思打扰你。'],
      ['Do you mind if I sit here?', '我坐这儿你介意吗？'],
      ['Is it okay if I ask you something?', '我可以问你个事吗？'],
      ['I don\'t quite understand.', '我不太明白。'],
      ['What does this word mean?', '这个词是什么意思？'],
      ['Could you write it down for me?', '你能帮我写下来吗？'],
      ['No problem at all, thank you.', '完全没问题，谢谢。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Excuse me, do you need any help?', '打扰一下，你需要帮忙吗？'],
      ['B', 'Yes, please. I think I\'m lost.', '是的，麻烦了。我想我迷路了。'],
      ['A', 'Where are you trying to go?', '你想去哪儿？'],
      ['B', 'The train station. Could you show me on the map?', '火车站。你能在地图上指给我看吗？'],
      ['A', 'Sure. It\'s about ten minutes on foot.', '当然。走路大约十分钟。'],
      ['B', 'Sorry, could you say that again a little slower?', '抱歉，你能再慢一点说一遍吗？'],
      ['A', 'Ten minutes. Go straight and turn left at the bank.', '十分钟。直走，在银行那儿左转。'],
      ['B', 'Got it. Thank you so much.', '明白了。太感谢了。']
    ]}
  },

  {
    id: 'w2u1', week: 2, title: '值机与行李', scene: '机场值机柜台',
    goal: '办完值机、选座、托运，并确认登机口和时间',
    tip: 'I\'d like to… 是最稳的表达意愿句式。问登机口用 Which gate…?，问时间用 Is it on time?',
    chunks: [
      ['I\'d like to check in for my flight to London.', '我想办理去伦敦的航班值机。'],
      ['Here\'s my passport and booking reference.', '这是我的护照和订票号。'],
      ['I have one bag to check in.', '我有一件行李要托运。'],
      ['Can I have an aisle seat, please?', '能给我一个靠过道的座位吗？'],
      ['How much luggage can I take?', '我可以带多少行李？'],
      ['Is my flight on time?', '我的航班准点吗？'],
      ['Where is the security check?', '安检在哪里？'],
      ['Which gate does it leave from?', '从哪个登机口出发？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Good morning. May I see your passport, please?', '早上好，请出示您的护照。'],
      ['B', 'Here you are. I\'d like to check in for the flight to London.', '给您。我想办理去伦敦的航班值机。'],
      ['A', 'Any bags to check in?', '有行李要托运吗？'],
      ['B', 'Just this one. Can I have an aisle seat?', '就这一件。能给我靠过道的座位吗？'],
      ['A', 'Sure. Do you have any liquids in your hand luggage?', '好的。随身行李里有液体吗？'],
      ['B', 'No, I don\'t think so. Is the flight on time?', '应该没有。航班准点吗？'],
      ['A', 'Yes. Boarding starts at 10:20 at gate 14.', '准点。10:20 在 14 号登机口开始登机。'],
      ['B', 'Great. Where is the security check?', '好的。安检在哪里？']
    ]}
  },

  {
    id: 'w2u2', week: 2, title: '海关与转机', scene: '入境边检 / 转机通道',
    goal: '回答目的、住宿、停留时间、现金四个高频问题',
    tip: '海关只问事实，答短句即可：Tourism. / Two weeks. / At a hotel. 不要背长段落，越简洁越可信。',
    chunks: [
      ['I\'m here for tourism for two weeks.', '我是来旅游的，待两周。'],
      ['I\'m staying at a hotel in the city center.', '我住在市中心的一家酒店。'],
      ['I have nothing to declare.', '我没有需要申报的物品。'],
      ['I\'m just transiting to another flight.', '我只是转机去另一个航班。'],
      ['Where do I pick up my luggage?', '我在哪里取行李？'],
      ['My connecting flight is at 3 p.m.', '我的转机航班是下午三点。'],
      ['Is this the right way to gate 22?', '这是去 22 号登机口的方向吗？'],
      ['Sorry, I think I\'m lost.', '抱歉，我想我走错了。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Next, please. What\'s the purpose of your visit?', '下一位。您此行的目的是什么？'],
      ['B', 'I\'m here for tourism, for about two weeks.', '我来旅游，大概两周。'],
      ['A', 'Where will you be staying?', '您住在哪里？'],
      ['B', 'At a hotel in the city center. Here\'s the booking.', '市中心的一家酒店。这是预订信息。'],
      ['A', 'Do you have anything to declare?', '有需要申报的物品吗？'],
      ['B', 'No, nothing to declare.', '没有，不需要申报。'],
      ['A', 'How much cash are you carrying?', '您带了多少现金？'],
      ['B', 'About five hundred dollars.', '大约五百美元。']
    ]}
  },

  {
    id: 'w3u1', week: 3, title: '打车与网约车', scene: '出租车 / 网约车上车点',
    goal: '说清目的地、问价、刷卡、让司机等一会儿',
    tip: 'Could you take me to…? 比 I want to go to… 礼貌得多。问价钱：How much will it cost to…?',
    chunks: [
      ['Could you take me to this address?', '能送我去这个地址吗？'],
      ['How much will it cost to the airport?', '去机场要多少钱？'],
      ['How long does it take?', '要多久？'],
      ['Please stop here.', '请在这儿停。'],
      ['Can I pay by card?', '可以刷卡吗？'],
      ['Could you wait for me for five minutes?', '能等我五分钟吗？'],
      ['I\'m in a bit of a hurry.', '我有点赶时间。'],
      ['Is it far from here?', '离这儿远吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Where to?', '去哪儿？'],
      ['B', 'Could you take me to this address, please?', '能送我去这个地址吗？'],
      ['A', 'Sure. Is that near the river?', '好的。是在河边附近吗？'],
      ['B', 'I think so. How much will it cost?', '应该是。大概多少钱？'],
      ['A', 'About twenty dollars, depending on traffic.', '大约二十美元，看路况。'],
      ['B', 'How long does it take?', '要开多久？'],
      ['A', 'Around fifteen minutes.', '大约十五分钟。'],
      ['B', 'Great. I\'m in a bit of a hurry, please.', '好的。我有点赶时间，麻烦快点。']
    ]}
  },

  {
    id: 'w3u2', week: 3, title: '地铁公交与问路', scene: '地铁站 / 公交车上',
    goal: '买票、换乘、确认方向，问路一次听懂',
    tip: '问路结尾加 Could you show me on the map? 最有效；听不懂就说 Which line, sorry? 让对方只回答一个关键词。',
    chunks: [
      ['Where\'s the nearest subway station?', '最近的地铁站在哪里？'],
      ['Which line goes to the museum?', '哪条线到博物馆？'],
      ['Do I need to change trains?', '我需要换乘吗？'],
      ['How much is a single ticket?', '单程票多少钱？'],
      ['Does this bus go downtown?', '这趟公交去市中心吗？'],
      ['Could you show me on the map?', '你能在地图上指给我看吗？'],
      ['How far is it on foot?', '走路要多久（多远）？'],
      ['Is it within walking distance?', '走路能到吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Hi, do you need help with the ticket machine?', '你好，需要帮忙用售票机吗？'],
      ['B', 'Yes, please. I want to go to the museum. Which line is that?', '是的，谢谢。我想去博物馆，坐哪条线？'],
      ['A', 'Line 2. You\'ll need to change at Central Station.', '2 号线。你要在中央车站换乘。'],
      ['B', 'Do I need to buy a separate ticket?', '需要另外买票吗？'],
      ['A', 'No, one ticket is fine. It\'s four dollars.', '不用，一张票就行，四美元。'],
      ['B', 'How long does it take?', '要多久？'],
      ['A', 'About twenty minutes.', '大约二十分钟。'],
      ['B', 'Great. Thanks for your help.', '太好了，谢谢帮忙。']
    ]}
  }
);
