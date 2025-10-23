import { HttpService } from './apiClient';
import { LoginRequest, User } from './types';


const userApi = new HttpService({
    baseURL: '/api',
    timeout: 10000,
  });
function login(loginData: LoginRequest) {
    return userApi.request<User>({
        method: "POST",
        url: "/login",
        data: loginData
    });
}

function getUsers(params?: Record<string, unknown>) {
    return userApi.request<User[]>({
        method: "GET",
        url: "/users",
        params: params
    });
}

function getAllUsers() {
    return userApi.request<User[]>({
        method: "GET",
        url: "/users/all",
    });
}

function createUser(userData: Omit<User, 'id'>) {
    return userApi.request<User>({
        method: "POST",
        url: "/users",
        data: userData
    });
}

export { login, getUsers, getAllUsers, createUser };
