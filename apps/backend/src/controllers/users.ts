import { User, UserCreateRequest } from '../types/users';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // 获取单个用户
  async getUserById(id: number): Promise<User | undefined> {
    return this.userService.getUserById(id);
  }

  // 创建用户
  async createUser(userData: UserCreateRequest): Promise<User> {
    return this.userService.createUser(userData);
  }

  // 更新用户
  async updateUser(id: number, userData: Partial<UserCreateRequest>): Promise<User | undefined> {
    return this.userService.updateUser(id, userData);
  }

  // 删除用户
  async deleteUser(id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}