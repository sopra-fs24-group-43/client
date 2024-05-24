/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userId = null;
    this.name = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.status = null;
    this.XP = null;
    this.level = null;
    this.rank = null;
    this.creation_date = null;
    this.birth_date = null;
    Object.assign(this, data);
  }
}

export default User;
