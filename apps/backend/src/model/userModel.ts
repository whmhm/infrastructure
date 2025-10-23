import { User } from "../types/users";

// import { DB_CONFIG } from '../config' // 暂时注释，未使用

import { UserCreateRequest } from '../types/users';
// 模拟数据库存储
let users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export class UserModel {
    async createUser(user: UserCreateRequest) {
        const newUser: User = {
            id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            name: user.name,
            email: user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        users.push(newUser);
        return newUser;
        // return await DB_CONFIG.knex('users').insert(user);
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