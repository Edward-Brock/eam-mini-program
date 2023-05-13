// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const TimePromptBehavior = require('../../behaviors/timePrompt');

Page({
  behaviors: [TimePromptBehavior],
  data: {
    timePrompt: '',
    motto: 'Hello World',
  },
  onLoad() {
    this.setData({
      timePrompt: (this as any).getTimePromptMethod()
    })
  }
})
