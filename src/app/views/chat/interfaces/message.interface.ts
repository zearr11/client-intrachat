import { MessageFile } from "./messages-types/message-file.interface"
import { MessageImage } from "./messages-types/message-image.interface"
import { MessageText } from "./messages-types/message-text.interface"
import { TypeMessage } from "./type-message.interface"

export interface Message {
  avatar: string,
  name: string,
  time: Date,
  type: TypeMessage
  data: MessageFile | MessageImage | MessageText
}
