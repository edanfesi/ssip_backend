const UserService = module.exports;

const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const EmailerUtils = require('../utils/EmailerUtils');

const UserRepository = require('../repositories/UserRepository');
UserService.getUsers = async (options) => {
    const section = 'UserService.getUsers';
    const { logger } = options;

    const usersInfo = await UserRepository.getUsers();
    logger('INFO', `${section}: users info ${JSON.stringify(usersInfo)}`);

    return usersInfo;
}

UserService.getUserById = async (userId, options) => {
    const section = 'UserService.getUserById';
    const { logger } = options;

    const userInfo = await UserRepository.getUserById(userId);
    logger('INFO', `${section}: User with ID ${userId} ${JSON.stringify(userInfo)}`);

    return userInfo;
}

UserService.getUserByUsername = async (username, options) => {
    const section = 'UserService.getUserByUsername';
    const { logger } = options;

    const userInfo = await UserRepository.getUserByUsername(username);
    logger('INFO', `${section}: User with username ${username} ${JSON.stringify(userInfo)}`);

    return userInfo;
}

UserService.createNewUser = async (data, options) => {
    const section = 'UserService.createNewUser';
    const { logger } = options;

    const username = data.username;
    const [userCreated] = await UserRepository.getUserByUsername(username);
    if (userCreated) {
        return { error: `The username ${username} is already taken` };
    }

    const password = await hashPassword(data.password);

    const [newUser] = await UserRepository.insertNewUser({ ...data, password });
    logger('INFO', `${section}: created user ${JSON.stringify(newUser)}`);

    const { password: userPassword, ...savedData } = newUser;

    return savedData;
}

UserService.updateUserById = async (userId, data, options) => {
    const section = 'UserService.updateUser';
    const { logger } = options;

    logger('INFO', `${section}: start updating user with id ${userId} and body ${JSON.stringify(data)})}`);

    const [updatedUser] = await UserRepository.updateUserById(userId, data);
    logger('INFO', `${section}: updated user with id ${userId} ${JSON.stringify(updatedUser)}`);

    const { password: userPassword, ...updatedData } = updatedUser;

    return updatedData;
}

UserService.deleteUserById = async (userId, options) => {
    const section = 'UserService.deleteUserById';
    const { logger } = options;

    const deletedUser = await UserRepository.deleteUser(userId);
    logger('INFO', `${section}: deleted user ${!!deletedUser}`);

    return { deleted: !!deletedUser };
}

UserService.auth = async (data, options) => {
    const section = 'UserService.auth';
    const { logger } = options;
    const { username, password } = data;

    const [userData] = await UserRepository.getUserByUsername(username);
    if (!userData) {
        return { error: "Incorrect Username and/or Password!" }
    }
    logger('INFO', `${section}: user data ${JSON.stringify(userData)}`);

    const isValid = await bcrypt.compare(password, userData.password);
    if (!isValid) {
        return { error: "Incorrect Username and/or Password!" }
    }

    const token = speakeasy.generateSecret({ length: 4 }).base32.substring(0,4);
    const message = `Your code is ${token}`;
    await EmailerUtils.sendEmail(userData.email, message);

    return { token };
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    
    return bcrypt.hash(password, salt)
}