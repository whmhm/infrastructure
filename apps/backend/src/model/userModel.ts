import { User } from "../types/users";
import { UserCreateRequest, LoginRequest } from '../types/users';

// 模拟数据库存储
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // 实际应用中应该使用哈希密码
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456', // 实际应用中应该使用哈希密码
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 简单的密码验证函数
const validatePassword = (user: User, password: string): boolean => {
  // 实际应用中应该使用bcrypt等库进行密码哈希验证
  return user.password === password;
};
export class UserModel {
    async createUser(user: UserCreateRequest) {
        const newUser: User = {
            id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            name: user.name,
            email: user.email,
            password: user.password, // 实际应用中应该先进行密码哈希
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        users.push(newUser);
        // 返回时不包含密码
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    
    // 登录验证方法
    async login(credentials: LoginRequest): Promise<User | null> {
        // 尝试通过用户名查找用户
        let user = users.find(u => u.name === credentials.username);
        
        // 如果没找到，尝试通过邮箱查找
        if (!user) {
            user = users.find(u => u.email === credentials.username);
        }
        
        // 验证用户和密码
        if (!user || !validatePassword(user, credentials.password)) {
            return null;
        }
        
        // 返回时不包含密码
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getAllUsers() {
        return users;
    }
    async getUserById(id: number): Promise<User | undefined> {
        return users.find(user => user.id === id);
    }
    async updateUser(id: number, userData: Partial<UserCreateRequest>) {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            return undefined;
        }
        users[index] = {
            ...users[index],
            ...userData,
            updatedAt: new Date(),
        };
        return users[index];
    }
    async deleteUser(id: number) {
        const initialLength = users.length;
        users = users.filter((user) => user.id !== id);
        return users.length !== initialLength;
    }
}