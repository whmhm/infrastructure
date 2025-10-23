import { User, UserCreateRequest } from '../types/users';
import { UserModel } from '../model/userModel';

const userModel = new UserModel();

// 用户服务类
export class UserService {
  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return await userModel.getAllUsers();
  }

  // 根据ID获取用户
  async getUserById(id: number): Promise<User | undefined> {
    return await userModel.getUserById(id);
  }



  // 创建用户
  async createUser(userData: UserCreateRequest): Promise<User> {
    const newUser = await userModel.createUser(userData);
    return newUser;
  }

  // 更新用户
  async updateUser(id: number, userData: Partial<UserCreateRequest>): Promise<User | undefined> {
    const updatedUser = await userModel.updateUser(id, userData);
    return updatedUser;
  }

  // 删除用户
  async deleteUser(id: number): Promise<boolean> {
    const deleted = await userModel.deleteUser(id);
    return deleted;
  }
}