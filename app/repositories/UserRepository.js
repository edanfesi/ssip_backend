const UserRepository = module.exports;

const { db } = require('../utils/Database');

UserRepository.insertNewUser = (data) => db('user').insert(data).returning('*');

UserRepository.getUserById = (userId) => db('user').where({ id: userId }).first();

UserRepository.getUserByUsername = (username) => db('user').where({ username }).first();

UserRepository.getUsers = () => db('user').select();

UserRepository.updateUserById = (userId, data) => db('user').where({ id: userId }).update(data).returning('*');

UserRepository.deleteUser = (userId) => db('user').where({ id: userId }).del();
