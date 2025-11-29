import { TypeRoom } from "../../../entity/room/enums/type-room.enum"

export interface Contact {
  id: number,
  avatar: string,
  name: string,
  time: Date | string,
  content: string
  type: TypeRoom
}
