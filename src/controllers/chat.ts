import MoonshotAIChatbot from '../services/getAi'

const chatController = {
  chat: async function (req: any, res: any, next: any) {
    // res.setHeader('Content-Type', 'text/event-stream')
    try {
      const question = req.body.question
      const isVisitor = req.body.isVisitor
      const history = req.body.history
      const isSingleChat = req.body.isSingleChat
      const systemPrompt = req.body.systemPrompt
      if (isSingleChat) {
        const completion: any = await MoonshotAIChatbot.chat(question, systemPrompt)
        res.json({
          code: 200,
          message: '操作成功',
          data: { result: completion },
        })
      } else {
        if (question) {
          const completion: any = await MoonshotAIChatbot.streamChat(question, isVisitor, history)
          // 流式数据
          for await (const model of completion) {
                const choices = model.choices[0];
                if (choices.finish_reason === 'stop') {
                  res.end()
                  break
                } else {
                  res.write(JSON.stringify(choices || ""))
                  res.write(';-;')
                }
              }
        } else {
          res.json({
            code: 200,
            message: '操作成功',
            data: { result: '请输入问题' },
          })
        }
      }
      
    } catch (error: any) {
      res.write(`requireError/%/${error.status}/%/${error.message}`)
      res.end()
    }
  },

}

export default chatController
