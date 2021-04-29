const UserService = module.exports;

const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

const EmailerUtils = require('../utils/EmailerUtils');

const UserRepository = require('../repositories/UserRepository');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
}

UserService.getUsers = async () => {
  const usersInfo = await UserRepository.getUsers();

  return usersInfo;
};

UserService.getUserById = async (userId) => {
  const userInfo = await UserRepository.getUserById(userId);

  return userInfo;
};

UserService.getUserByUsername = async (username) => {
  const userInfo = await UserRepository.getUserByUsername(username);

  return userInfo;
};

UserService.createNewUser = async (data) => {
  const { username } = data;

  const userCreated = await UserRepository.getUserByUsername(username);
  if (userCreated) {
    return { error: `The username ${username} is already taken` };
  }

  const password = await hashPassword(data.password);

  const [newUser] = await UserRepository.insertNewUser({ ...data, password });

  const { password: userPassword, ...savedData } = newUser;

  return savedData;
};

UserService.updateUserById = async (userId, data) => {
  const updatedUser = await UserRepository.updateUserById(userId, data);

  const { password: userPassword, ...updatedData } = updatedUser;

  return updatedData;
};

UserService.deleteUserById = async (userId) => {
  const deletedUser = await UserRepository.deleteUser(userId);

  return { deleted: !!deletedUser };
};

UserService.auth = async (data) => {
  const { username, password } = data;

  const userData = await UserRepository.getUserByUsername(username);
  if (!userData) {
    return { error: 'Incorrect Username and/or Password!' };
  }

  const isValid = await bcrypt.compare(password, userData.password);
  if (!isValid) {
    return { error: 'Incorrect Username and/or Password!' };
  }

  const token = speakeasy.generateSecret({ length: 4 }).base32.substring(0, 4);
  const message = `Your code is ${token}`;
  await EmailerUtils.sendEmail(userData.email, message);

  return { token };
};
