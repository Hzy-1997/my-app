// subpackages/intelligentService/intelligentService.js

import {
  serviceSuggestionsApi
} from "../../api/index"


Page({
  data: {
    inputValue: '',
    scrollToId: '',
    scrollTop: 0,
    messages: [{
      role: 'agent',
      type: 'text',
      content: '您好，很高兴为您服务！请问有什么可以帮您？',
      timestamp: Date.now(),
      timeStr: ''
    }]
  },

  isReplying: false,
  typingTimer: null,

  onLoad(options) {
    const msgs = this.data.messages.map(m => {
      if (!m.timeStr) m.timeStr = this.formatTime(m.timestamp)
      return m
    })
    this.setData({
      messages: msgs
    })
  },

  onUnload() {
    this.clearTypingTimer()
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail
    })
  },

  formatTime(timestamp) {
    const date = new Date(timestamp)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  },

  async sendMessage() {
    const text = this.data.inputValue.trim()
    if (!text || this.isReplying) return

    this.isReplying = true
    const now = Date.now()

    const userMsg = {
      role: 'user',
      type: 'text',
      content: text,
      timestamp: now,
      timeStr: this.formatTime(now)
    }

    const waitingMsg = {
      role: 'agent',
      type: 'text',
      content: '收到您的问题，客服正在为您处理，请稍候...',
      timestamp: now,
      timeStr: this.formatTime(now)
    }

    const messages = this.data.messages.concat(userMsg, waitingMsg)
    const waitingIndex = messages.length - 1

    this.setData({
      messages,
      inputValue: ''
    }, () => this.scrollToBottom())


    let res = await serviceSuggestionsApi.questionsAnswersDetail({
      question: text
    })


    if (res.code == 200) {

      let data = res.data
      // ---- 空数组兜底 ----
      if (Array.isArray(data) && data.length === 0) {
        this.setData({
          [`messages[${waitingIndex}].content`]: '暂时没有找到相关答案，换个说法再问问？'
        }, () => this.scrollToBottom())
        this.isReplying = false
        return
      }

      // ---- 数组：多条问答卡片，不走打字机 ----
      if (Array.isArray(data)) {
        this.setData({
          [`messages[${waitingIndex}].type`]: 'list',
          [`messages[${waitingIndex}].content`]: '',
          [`messages[${waitingIndex}].list`]: data.map(d => ({
            question: d.question || '',
            answer: d.answer || ''
          }))
        }, () => {
          this.scrollToBottom()
          this.isReplying = false
        })
        return
      }

      // ---- 字符串：单条，走打字机 ----
      const replyText = data || '暂无回复'

      this.setData({
        [`messages[${waitingIndex}].content`]: ''
      }, () => {
        this.typewriter(waitingIndex, replyText)
      })


    } else {
      this.setData({
        [`messages[${waitingIndex}].content`]: '抱歉，网络开小差了，请稍后再试～'
      }, () => this.scrollToBottom())
      this.isReplying = false
      console.error('AI 回复失败', err)
    }
  },

  // typewriter(index, fullText) {
  //   this.clearTypingTimer()
  //   let i = 0
  //   const speed = 30

  //   const step = () => {
  //     i++
  //     const partial = fullText.slice(0, i)

  //     // 更新文字
  //     this.setData({
  //       [`messages[${index}].content`]: partial
  //     }, () => {
  //       // ★ 这里的回调函数是在视图更新完成后执行的
  //       this.scrollToBottom()
  //     })

  //     if (i < fullText.length) {
  //       this.typingTimer = setTimeout(step, speed)
  //     } else {
  //       this.typingTimer = null
  //       this.isReplying = false
  //     }
  //   }

  //   step()
  // },


  // 1. 改快打字机速度
  typewriter(index, fullText) {
    this.clearTypingTimer()
    let i = 0
    // ★ 速度从 30 改成 15（毫秒），想更快可以改成 10
    const speed = 15

    const step = () => {
      // ★ 优化：如果文字很长，每次多打几个字，大幅缩短时间
      // 每次增加 2 个字符（你可以按需调整）
      i += 2
      const partial = fullText.slice(0, i)

      this.setData({
        [`messages[${index}].content`]: partial
      }, () => {
        this.scrollToBottom()
      })

      if (i < fullText.length) {
        this.typingTimer = setTimeout(step, speed)
      } else {
        this.typingTimer = null
        this.isReplying = false
        setTimeout(() => this.scrollToBottom(), 100) // 兜底滚一次
      }
    }
    step()
  },

  // 2. 滚动到底部（去掉随机数，直接用最大值）
  scrollToBottom() {
    this.setData({
      // 固定一个大数值，不需要再加随机数了
      scrollTop: 1000000
    })
  },

  clearTypingTimer() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
      this.typingTimer = null
    }
  },

  // 强制滚到底部的方法
  scrollToBottom() {
    // 用一个极大的数字，确保无论多长都能滚到底
    // 加 Math.random() 是为了防止数值相同小程序不触发滚动
    this.setData({
      scrollTop: 999999 + Math.random()
    })
  },

  // 打字机方法
  typewriter(index, fullText) {
    this.clearTypingTimer()
    let i = 0
    const speed = 30

    const step = () => {
      i++
      const partial = fullText.slice(0, i)

      this.setData({
        [`messages[${index}].content`]: partial
      }, () => {
        // 每次渲染完，强制触发滚动
        this.scrollToBottom()
      })

      if (i < fullText.length) {
        this.typingTimer = setTimeout(step, speed)
      } else {
        this.typingTimer = null
        this.isReplying = false
        // 打完后，再兜底滚一次
        setTimeout(() => this.scrollToBottom(), 100)
      }
    }
    step()
  },

})