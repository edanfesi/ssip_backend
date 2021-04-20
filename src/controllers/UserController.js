const UserController = module.exports;

const Ajv = require("ajv");

const UserService = require('../services/UserService');
const CreateNewUserSchema = require('../validators/CreateNewUserSchema');
const UpdateUserSchema = require('../validators/UpdateUserSchema');
const AuthUserSchema = require('../validators/AuthUserSchema');
const { request, response } = require("../..");

const ajv = new Ajv()

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
 UserController.getUsers = async (req, res, next) => {
    const section = 'UserController.getUsers';
    const logger = req.log || console.log;
    
    if (!req.session.loggedin) {
        res.send({ message: "The User has to log in" });
    }

    logger('INFO', `${section}: start getting information of all users`);

    const data = await UserService.getUsers({ logger });
    logger('INFO', `${section}: end getting information of all users ${JSON.stringify(data)}`);

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
 UserController.getUserById = async (req, res, next) => {
    const section = 'UserController.getUser';
    const logger = req.log || console.log;
    const { params: { userId } } = req;

    if (!req.session.loggedin) {
        res.send({ message: "The User has to log in" });
    }

    logger('INFO', `${section}: start getting information of the user with id ${userId}`);

    const data = await UserService.getUserById(userId, { logger });
    if (!data) {
        return res.status(404).send('User not found');
    }
    logger('INFO', `${section}: information of the user with id ${userId} ${JSON.stringify(data)}`)

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
 * 
 * @apiSuccessExample Success Response
 * HTTP/1.1 200
 * 
 * @apiError (500) {Object} System error.
 */
UserController.createNewUser = async (req, res, next) => {
    const section = 'UserController.createNewUser';
    const logger = req.log || console.log;
    
    if (!req.session.loggedin) {
        res.send({ message: "The User has to log in" });
    }

    const isValid = ajv.validate(CreateNewUserSchema, req.body);
    if (!isValid) {
        return res.status(400).send({ "message": "Invalid body" });
    }

    const data = await UserService.createNewUser(req.body, { logger });
    if (data.error) {
        res.status(400).send(data);
    }

    logger('INFO', `${section}: Created user with name ${req.body.name} ${req.body.last_name}`)

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
 UserController.updateUserById = async (req, res, next) => {
    const section = 'UserController.updateUser';
    const logger = req.log || console.log;
    const { params: { userId } } = req;
    
    if (!req.session.loggedin) {
        res.send({ message: "The User has to log in" });
    }

    const isValid = ajv.validate(UpdateUserSchema, req.body)
    if (!isValid) {
        res.status(400).send("Invalid body")
    }

    const data = await UserService.updateUserById(userId, req.body, { logger });
    logger('INFO', `${section}: updated user information with name ${req.body.name} ${req.body.last_name}`)

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
 UserController.deleteUser = async (req, res, next) => {
    const section = 'UserController.deleteUser';
    const logger = req.log || console.log;
    const { params: { userId } } = req;

    if (!req.session.loggedin) {
        res.send({ message: "The User has to log in" });
    }

    const data = await UserService.deleteUserById(userId, { logger });
    logger('INFO', `${section}: updated user information with name ${req.body.name} ${req.body.last_name}`)

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
 UserController.auth = async (req, res, next) => {
    const section = 'UserController.auth';
    const logger = req.log || console.log;

    const { username } = req.body;

    const isValid = ajv.validate(AuthUserSchema, req.body);
    if (!isValid) {
        return res.status(400).send({ "message": "Invalid body" });
    }

    const result = await UserService.auth(req.body, { logger });
    if (result.error) {
        return res.status(401).send(result)
    }

    req.session.loggedin = true;
    req.session.username = username;

    res.send({ message: "User logged" });
    return response.end();
 }

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
  UserController.logout = async (req, res, next) => {
    const section = 'UserController.auth';
    const logger = req.log || console.log;

    if (!req.session.loggedin) {
        res.send({ message: "User currently logged out" });
    }

    req.session.loggedin = false;
    req.session.username = null;

    res.send({ message: "User log out" });
    return response.end();
 }