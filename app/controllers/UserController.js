const UserController = module.exports;

const Ajv = require('ajv');

const UserService = require('../services/UserService');
const CreateNewUserSchema = require('../validators/CreateNewUserSchema');
const UpdateUserSchema = require('../validators/UpdateUserSchema');
const AuthUserSchema = require('../validators/AuthUserSchema');
const TwoFactorSchema = require('../validators/TwoFactorSchema');

const ajv = new Ajv();

const Users = {};

/**
 * @api {get} /api/ssip/user/ Get the information of all users
 * @apiName GetUsers
 * @apiDescription Get the information of all users.
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.getUsers = async (req, res) => {
  const data = await UserService.getUsers();

  return res.send(data);
};

/**
 * @api {get} /api/ssip/user/:userId Get the information of a user
 * @apiName GetUser
 * @apiDescription Get the information of a user.
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (404) {Object} User not found.
 * @apiError (500) {Object} System error.
 */
UserController.getUserById = async (req, res) => {
  const { params: { userId } } = req;

  const data = await UserService.getUserById(userId);
  if (!data) {
    return res.status(404).send('User not found');
  }

  return res.send(data);
};

/**
 * @api {post} /api/ssip/user/new Create a new user
 * @apiName PostNewUser
 * @apiDescription Create a new user
 *
 * @apiParam (body) {string} name: user's name
 * @apiParam (body) {string} last_name: user's last name
 * @apiParam (body) {string} country: country where the user lives
 * @apiParam (body) {string} department: department where the user works
 * @apiParam (body) {string} work_position: user's current position
 * @apiParam (body) {string} username: username that the user will use to login
 * @apiParam (body) {string} password: user's password
 * @apiParam (body) {string} role_id: user's role id
 * @apiParam (body) {string} email: user's email
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.createNewUser = async (req, res) => {
  const isValid = ajv.validate(CreateNewUserSchema, req.body);
  if (!isValid) {
    res.status(400).send('Invalid body');
  }

  const data = await UserService.createNewUser(req.body);
  if (data.error) {
    res.status(400).send(data);
  }

  return res.status(201).send(data);
};

/**
 * @api {put} /api/ssip/user/:userId Update the information of a user
 * @apiName PutUser
 * @apiDescription Update the information of a user.
 *
 * @apiParam (body) {string} name: user's name
 * @apiParam (body) {string} last_name: user's last name
 * @apiParam (body) {string} country: country where the user lives
 * @apiParam (body) {string} department: department where the user works
 * @apiParam (body) {string} work_position: user's current position
 * @apiParam (body) {string} username: username that the user will use to login
 * @apiParam (body) {string} password: user's password
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.updateUserById = async (req, res) => {
  const { params: { userId } } = req;

  const isValid = ajv.validate(UpdateUserSchema, req.body);
  if (!isValid) {
    res.status(400).send('Invalid body');
  }

  const data = await UserService.updateUserById(userId, req.body);

  return res.send(data);
};

/**
 * @api {delete} /api/ssip/user/:id Delete the information of a user
 * @apiName DeleteUser
 * @apiDescription Delete the information of a user.
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.deleteUser = async (req, res) => {
  const { params: { userId } } = req;

  const data = await UserService.deleteUserById(userId);

  return res.send(data);
};

/**
 * @api {post} /api/ssip/user/login Login the user
 * @apiName LoginUser
 * @apiDescription Set active the user.
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.auth = async (req, res) => {
  const { username } = req.body;

  const isValid = ajv.validate(AuthUserSchema, req.body);
  if (!isValid) {
    return res.status(400).send({ message: 'Invalid body' });
  }

  const result = await UserService.auth(req.body);
  if (result.error) {
    return res.status(401).send(result);
  }

  Users[username] = {
    loggedin: false,
    token: result.token,
  };

  req.session.loggedin = false;
  req.session.username = username;
  req.session.token = result.token;

  return res.status(204).send();
};

UserController.twoFactorAuth = async (req, res) => {
  const isValid = ajv.validate(TwoFactorSchema, req.body);
  if (!isValid) {
    return res.status(400).send({ message: 'Invalid body' });
  }

  const { body: { token }, headers: { 'auth-user': username } } = req;

  if (token.toUpperCase() !== (Users[username] || {}).token) {
    return res.status(401).send({ message: 'wrong token' });
  }

  const userData = await UserService.getUserByUsername(username);

  Users[username] = {
    loggedin: true,
    token: null,
  };
  req.session.loggedin = true;
  req.session.token = null;

  return res.status(200).send(userData);
};

/**
 * @api {post} /api/ssip/user/logout Logout the user
 * @apiName LoginUser
 * @apiDescription Set inactive the user.
 *
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 *
 * @apiError (500) {Object} System error.
 */
UserController.logout = async (req, res) => {
  if (req.session.username == null) {
    res.send({ message: 'User currently logged out' });
  }

  req.session.loggedin = false;
  req.session.username = null;

  res.send({ message: 'User log out' });
  return res.end();
};
