import Router from 'koa-router';
import { UserCreateRequest } from '../types/users';
import { UserController } from '../controllers/users';

const router = new Router();
const userController = new UserController();

// 获取所有用户
router.get('/all', async (ctx) => {
  try {
    console.log('get all users');
    const users = await userController.getAllUsers();
    console.log(users);
    
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch users' };
  }
});



// 获取单个用户
router.get('/:id', async (ctx) => {
  try {
    const userId = Number(ctx.params.id);
    const user = await userController.getUserById(userId);
    if (user !== undefined) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch user' };
  }
});

// 创建用户
router.post('/', async (ctx) => {
  try {
    const userData = ctx.request.body as UserCreateRequest;
    const newUser = await userController.createUser(userData);
    ctx.status = 201;
    ctx.body = newUser;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: 'Failed to create user' };
  }
});

// 更新用户
router.put('/:id', async (ctx) => {
  try {
    const userId = Number(ctx.params.id);
    const userData = ctx.request.body as Partial<UserCreateRequest>;
    const updatedUser = await userController.updateUser(userId, userData);
    if (updatedUser !== undefined) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    }
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: 'Failed to update user' };
  }
});

// 删除用户
router.delete('/:id', async (ctx) => {
  try {
    const userId = Number(ctx.params.id);
    const success = await userController.deleteUser(userId);
    if (success) {
      ctx.status = 204;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to delete user' };
  }
});

export default router;