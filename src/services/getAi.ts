import OpenAI from 'openai'
import config from '../../config'
import { Readable } from 'stream'

interface Message {
  role: string
  content: string
}

class MoonshotAIChatbot {
  private client: OpenAI
  private history: Message[]

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.moonshot.cn/v1',
    })

    this.history = [
      {
        role: 'system',
        content:
          '你是 meng，由 mengjie 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。meng 为专有名词，不可翻译成其他语言。',
      },
    ]
  }

  async chat(prompt: string): Promise<string | null> {
    this.history.push({ role: 'user', content: prompt })
    const completion = await this.client.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: this.history,
    } as any)
    console.log(completion.choices[0].message, 'completion')
    this.history.push(completion.choices[0].message as Message)
    return completion.choices[0].message.content
  }

  async streamChat(
    prompt: string,
    isVisitor?: boolean,
    clientHistory?: any
  ): Promise<Readable> {
    // this.history.push({ role: 'user', content: prompt })
    // console.log(this.history, prompt, Array.isArray(clientHistory), 'history')
    // const messages = [...this.history , { role: 'user', content: prompt }]
    let messages
    if (isVisitor && clientHistory?.length) {
      messages = [...this.history, ...clientHistory]
    } else {
      messages = [...this.history, { role: 'user', content: prompt }]
    }
    const completion: any = await this.client.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages,
      stream: true,
    } as any)
    return completion
  }
}

export default new MoonshotAIChatbot(config.aiToken)
