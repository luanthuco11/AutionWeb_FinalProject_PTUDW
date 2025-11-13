import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  private static instance: UserService;
  private users = [
    { id: 1, name: "Minh Tri" },
    { id: 2, name: "Nguyen Van A" },
  ];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  getUserById(id: number) {
    this.log(`Fetching user ${id}`);
    return this.users.find(u => u.id === id);
  }

  getAllUsers() {
    this.log(`Fetching all users`);
    return this.users;
  }
}
