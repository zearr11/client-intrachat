export class UserMapper {

  static userToFirstNameAndLastname(names: string, lastnames: string): string {
    const firstName = names?.trim().split(/\s+/)[0] || '';
    const firstLastname = lastnames?.trim().split(/\s+/)[0] || '';
    return `${firstName} ${firstLastname}`.trim();
  }

}
