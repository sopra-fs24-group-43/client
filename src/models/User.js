/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.XP = null;
    this.level = null;
    this.rank = null;
    Object.assign(this, data);
  }
}

export default User;
