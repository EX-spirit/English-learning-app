(window.CURRICULUM = window.CURRICULUM || []).push(

  {
    id: 'w4u1', week: 4, title: '酒店入住', scene: '酒店前台',
    goal: '报预订、问早餐和 Wi-Fi、要求延迟退房',
    tip: 'I have a reservation under the name… 是入住万能句。under the name 后面接姓，不用加 Mr。',
    chunks: [
      ['I have a reservation under the name Li.', '我有一个用李这个名字订的房间。'],
      ['I\'d like to check in, please.', '我想办理入住。'],
      ['Here\'s my ID and credit card.', '这是我的身份证件和信用卡。'],
      ['What time is breakfast served?', '早餐几点开始？'],
      ['Is there Wi-Fi? What\'s the password?', '有 Wi-Fi 吗？密码是什么？'],
      ['Could I have a room with a view?', '能给我一间有景观的房间吗？'],
      ['Is late check-out possible?', '可以延迟退房吗？'],
      ['Could you keep my luggage after check-out?', '退房后能帮我寄存行李吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Good evening. Welcome to the Park Hotel.', '晚上好，欢迎来到公园酒店。'],
      ['B', 'Hi. I have a reservation under the name Li.', '你好，我有一个用李这个名字订的房间。'],
      ['A', 'Let me check. Yes, a double room for three nights.', '我查一下。是的，双人房三晚。'],
      ['B', 'That\'s right. What time is breakfast served?', '对。早餐几点开始？'],
      ['A', 'From seven to ten. Here\'s your key card. Room 508.', '七点到十点。这是您的房卡，508 房。'],
      ['B', 'Is there Wi-Fi in the room?', '房间里有 Wi-Fi 吗？'],
      ['A', 'Yes, the password is on the card.', '有，密码在卡上。'],
      ['B', 'Great. Could I have a late check-out on Sunday?', '好的。周日可以延迟退房吗？']
    ]}
  },

  {
    id: 'w4u2', week: 4, title: '房间出问题', scene: '房间内打电话到前台',
    goal: '说清故障、要求维修、必要时换房',
    tip: '报修万能结构：The ___ isn\'t working.（空调/热水/电视/门锁）。再加一句 Could you send someone up? 就完整了。',
    chunks: [
      ['The air conditioning isn\'t working.', '空调坏了。'],
      ['There\'s no hot water in my room.', '我房间没有热水。'],
      ['Could you send someone up to fix it?', '能派人上来修一下吗？'],
      ['The room is a bit noisy.', '房间有点吵。'],
      ['Could I change to another room?', '我能换一间房吗？'],
      ['I\'d like to check out now.', '我现在想退房。'],
      ['Could I have the bill, please?', '请给我账单。'],
      ['I think there\'s a mistake on the bill.', '我觉得账单上有一处错误。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Front desk, how can I help?', '前台，有什么可以帮您？'],
      ['B', 'Hi, this is room 508. The air conditioning isn\'t working.', '你好，我是 508 房。空调坏了。'],
      ['A', 'I\'m sorry about that. Is the room too warm?', '非常抱歉。房间太热了吗？'],
      ['B', 'Yes, and there\'s no hot water either.', '是的，而且也没有热水。'],
      ['A', 'I\'ll send someone up in ten minutes.', '我十分钟内派人上去。'],
      ['B', 'Thank you. Could I change to another room if it can\'t be fixed?', '谢谢。如果修不好，我可以换房吗？'],
      ['A', 'Of course. I\'ll call you back shortly.', '当然。我很快给您回电话。'],
      ['B', 'Thanks. I appreciate it.', '谢谢，非常感谢。']
    ]}
  },

  {
    id: 'w5u1', week: 5, title: '订位与点餐', scene: '餐厅门口 / 餐桌',
    goal: '没预订也能坐下、问推荐、提忌口、点饮料',
    tip: '点菜说 I\'ll have… 或 Could I get…，不要说 I want。忌口句式：without onions / no spicy / I\'m vegetarian.',
    chunks: [
      ['A table for two, please.', '两位，谢谢。'],
      ['We don\'t have a reservation. Is that okay?', '我们没有预订，可以吗？'],
      ['Could we see the menu, please?', '能给我们看下菜单吗？'],
      ['What do you recommend?', '你推荐什么？'],
      ['I\'ll have this one, please.', '我要这个。'],
      ['Could I get it without onions?', '可以不加洋葱吗？'],
      ['Is this dish spicy?', '这道菜辣吗？'],
      ['Could we have some water, please?', '能给我们一些水吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Good evening. How many people?', '晚上好，几位？'],
      ['B', 'Two, please. We don\'t have a reservation.', '两位。我们没有预订。'],
      ['A', 'No problem. This way, please. Here are the menus.', '没问题，这边请。这是菜单。'],
      ['B', 'Thank you. What do you recommend?', '谢谢。你推荐什么？'],
      ['A', 'The grilled salmon is very popular tonight.', '今晚的烤三文鱼很受欢迎。'],
      ['B', 'Sounds good. Could I get it without onions?', '听起来不错。可以不加洋葱吗？'],
      ['A', 'Of course. Anything to drink?', '当然。喝点什么？'],
      ['B', 'Just some water, please. And could we get some bread?', '就一些水。再给我们一些面包好吗？']
    ]}
  },

  {
    id: 'w5u2', week: 5, title: '用餐中与结账', scene: '餐桌上 / 收银台',
    goal: '叫服务员、要餐具、分开结账、打包',
    tip: '在美国说 the check，在英国说 the bill，两种都通用。分开付：separately / split the bill。',
    chunks: [
      ['This is delicious!', '这太好吃了！'],
      ['Could I get another fork?', '能再给我一把叉子吗？'],
      ['Excuse me, we\'re ready to order.', '打扰一下，我们可以点菜了。'],
      ['Could we get the check, please?', '请帮我们结账。'],
      ['Can we pay separately?', '我们可以分开付吗？'],
      ['Do you accept credit cards?', '可以刷信用卡吗？'],
      ['Keep the change.', '不用找零了。'],
      ['Could I get this to go?', '这个可以打包吗？']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'How is everything?', '一切都还好吗？'],
      ['B', 'Delicious, thank you. Could we get the check, please?', '很好吃，谢谢。请帮我们结账。'],
      ['A', 'Sure. Together or separate?', '好的。一起付还是分开？'],
      ['B', 'Separate, please. Can I pay by card?', '分开付。可以刷卡吗？'],
      ['A', 'Yes, we accept all major cards.', '可以，主要卡种都收。'],
      ['B', 'Great. And could I get the rest to go?', '好的。剩下的可以打包吗？'],
      ['A', 'Of course. I\'ll bring a box.', '当然，我拿个盒子来。'],
      ['B', 'Thanks. Keep the change.', '谢谢，不用找零了。']
    ]}
  },

  {
    id: 'w6u1', week: 6, title: '试穿与尺码', scene: '服装店',
    goal: '问价、试穿、要尺码、换颜色，最后干脆买下',
    tip: '太紧 too tight / 太松 too loose / 刚刚好 fits perfectly。问尺码：Do you have this in a larger size?',
    chunks: [
      ['How much is this?', '这个多少钱？'],
      ['Can I try this on?', '我可以试穿吗？'],
      ['Do you have this in a larger size?', '这个有大一号的吗？'],
      ['Where\'s the fitting room?', '试衣间在哪里？'],
      ['It\'s a bit too tight.', '有点太紧了。'],
      ['Do you have this in another color?', '这个有别的颜色吗？'],
      ['I\'m just looking, thanks.', '我只是看看，谢谢。'],
      ['I\'ll take it.', '我买了。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Hi, can I help you find anything?', '你好，需要我帮你找什么吗？'],
      ['B', 'I\'m just looking, thanks. Actually, how much is this jacket?', '我只是看看，谢谢。不过，这件夹克多少钱？'],
      ['A', 'It\'s sixty dollars, and it\'s on sale today.', '六十美元，今天打折。'],
      ['B', 'Can I try it on?', '我可以试穿吗？'],
      ['A', 'Sure. The fitting room is over there.', '当然，试衣间在那边。'],
      ['B', 'Do you have this in a larger size? This one is a bit tight.', '这个有大一号的吗？这件有点紧。'],
      ['A', 'Let me check. Here\'s a medium.', '我查一下。这是中号。'],
      ['B', 'Perfect, I\'ll take it.', '正好，我买了。']
    ]}
  },

  {
    id: 'w6u2', week: 6, title: '付款与退换', scene: '收银台 / 售后柜台',
    goal: '要收据、退换坏货、问退款到账时间',
    tip: '退货先说明事实：It doesn\'t work. + I bought it yesterday. 再提要求：Could I get a refund? 语气平和最容易成功。',
    chunks: [
      ['Can I pay by card?', '可以刷卡吗？'],
      ['Is there a discount?', '有折扣吗？'],
      ['Could I have a receipt?', '能给我一张收据吗？'],
      ['Can I return it if it doesn\'t fit?', '如果不合身可以退吗？'],
      ['It\'s broken. Could I get a refund?', '它坏了，我可以退款吗？'],
      ['Do you ship overseas?', '你们能寄到国外吗？'],
      ['Could you wrap it as a gift?', '能把它包成礼物吗？'],
      ['That\'s a bit more than I expected.', '这比我预期的贵了一点。']
    ],
    dialogue: { user: 'B', lines: [
      ['A', 'Hi, how can I help?', '你好，有什么可以帮你？'],
      ['B', 'I bought this charger yesterday, but it doesn\'t work.', '我昨天买了这个充电器，但它不能用。'],
      ['A', 'Do you have the receipt?', '你有收据吗？'],
      ['B', 'Yes, here it is. Could I get a refund?', '有，在这儿。我可以退款吗？'],
      ['A', 'Of course. Would you like cash or back on your card?', '当然。你要现金还是退到卡里？'],
      ['B', 'Back on my card, please.', '退到卡里，谢谢。'],
      ['A', 'No problem. It\'ll take three to five days.', '没问题，需要三到五天。'],
      ['B', 'That\'s fine. Thank you.', '好的，谢谢。']
    ]}
  }
);
