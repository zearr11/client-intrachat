import { TypeRoom } from "../../../entity/room/enums/type-room.enum"

export interface Contact {
  id: number,
  avatar: string,
  name: string,
  time: Date,
  content: string
  unread: number,
  type: TypeRoom
}
