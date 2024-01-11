const validate = require('validate.js');
const config = require('../config');
const MongoDb = require('../helpers/databases/mongodb/db');
const mongoDb = new MongoDb(config.get('/mongoDbUrl'));
const wrapper = require('../helpers/utils/wrapper');
const { NotFoundError, ConflictError, BadRequestError } = require('../helpers/error');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const generateToken = async (id) => {
    const token = jwt.sign({ id }, config.get('/authentication'));
    return token;
};

module.exports.loginUser = async (username, email, password) => {
    mongoDb.setCollection('user');
    let query = {};

    if (username) {
        query.username = username;
    } else if (email) {
        query.email = email;
    } else {
        query.username = null;
        query.email = null;
    }

    if(password) {
        query.password = md5(password);
    } else {
        throw new BadRequestError('Please fill the password');
    }
    
    const recordSet = await mongoDb.findOne(query);
    if (recordSet.err) {
        // return wrapper.error(new NotFoundError('Can not find User'));
        throw new NotFoundError('Wrong Username / Password');
    }
    
    const userData = {...recordSet.data, password: '****'};
    const result = {
        userData,
        token : await generateToken(recordSet.data._id)
    }
    return result;
}

module.exports.loginShop = async (username, email, password) => {
    mongoDb.setCollection('shop');
    let query = {};

    if (username) {
        query.username = username;
    } else if (email) {
        query.email = email;
    } else {
        query.username = null;
        query.email = null;
    }

    if(password) {
        query.password = md5(password);
    } else {
        throw new BadRequestError('Please fill the password');
    }
    
    const recordSet = await mongoDb.findOne(query);
    if (recordSet.err) {
        // return wrapper.error(new NotFoundError('Can not find User'));
        throw new NotFoundError('Wrong Username / Password');
    }
    
    const shopData = {...recordSet.data, password: '****'};
    const result = {
        shopData,
        token : await generateToken(recordSet.data._id)
    }
    return result;
}

module.exports.registerUser = async (userData) => {
    mongoDb.setCollection('user');
    const username = userData.username;
    const recordSet = await mongoDb.findOne({ username });
    if (!validate.isEmpty(recordSet.data)) {
        console.log('Username already exist');
        throw new ConflictError('Username already exist');
    }

    const result = await mongoDb.insertOne(userData);

    const maskedResult = {...result.data, password: '****'};
    return wrapper.data(maskedResult);
}

module.exports.registerShop = async (shopData) => {
    mongoDb.setCollection('shop');
    const username = shopData.username;
    const recordSet = await mongoDb.findOne({ username });
    if (!validate.isEmpty(recordSet.data)) {
        console.log('Username already exist');
        throw new ConflictError('Username already exist');
    }

    const result = await mongoDb.insertOne(shopData);

    const maskedResult = {...result.data, password: '****'};
    return wrapper.data(maskedResult);
}
