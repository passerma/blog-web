type broadcastChanneldata = {
  type: string
  data?: any
}


class MyBroadcastChannel {

  private broadcastChannel: BroadcastChannel
  private messageListeners: ((data: any) => void)[] = []

  constructor() {
    this.broadcastChannel = new BroadcastChannel('passerma-blog')
    this._init()
  }

  private _init() {
    this.broadcastChannel.onmessage = (event) => {
      // 处理接收到的消息
      const message = event.data as broadcastChanneldata
      this.messageListeners.forEach(element => {
        element(message)
      });
    }
  }

  addMessageListener(callback: (data: broadcastChanneldata) => void) {
    this.messageListeners.push(callback)
  }

  sendMessage(message: broadcastChanneldata) {
    this.broadcastChannel.postMessage(message)
  }

  removeMessageListener(callback: (data: broadcastChanneldata) => void) {
    const index = this.messageListeners.indexOf(callback)
    if (index !== -1) {
      this.messageListeners.splice(index, 1)
    }
  }
}

const broadcastChannel = new MyBroadcastChannel()

export default broadcastChannel