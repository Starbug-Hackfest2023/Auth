const wrapper = require('../helpers/utils/wrapper');
const authService = require('./authService');
const md5 = require('md5');

module.exports.loginUser = async (req, res) => {
    let username = req.body.username? req.body.username: null;
    let email = req.body.email? req.body.email: null;
    let password = req.body.password;

    authService.loginUser(username, email, password)
        .then(resp => {
            console.log('User has logged in');
            wrapper.response(res, 'success', wrapper.data(resp), 'User has logged in', 201);
        })
        .catch(err => {
            console.log('Error while logging in', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while logging in. Error: ${err}`, 401, 401);
        });
}

module.exports.loginShop = async (req, res) => {
    let username = req.body.username? req.body.username: null;
    let email = req.body.email? req.body.email: null;
    let password = req.body.password;

    authService.loginShop(username, email, password)
        .then(resp => {
            console.log('Shop has logged in');
            wrapper.response(res, 'success', resp, 'Shop has logged in', 201);
        })
        .catch(err => {
            console.log('Error while logging in', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while logging in. Error: ${err}`, 401, 401);
        });
}

module.exports.registerUser = async (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        phoneNumber: req.body.phoneNumber,
        fullname: req.body.fullname,
        address: req.body.address,
        zipCode: req.body.zipCode,
        gender: req.body.gender,
        birthDate: new Date(req.body.birthDate),
    }

    authService.registerUser(userData)
        .then(resp => {
            console.log('User has been created');
            wrapper.response(res, 'success', resp, 'User has been created', 201);
        })
        .catch(err => {
            console.log('User cannot be created', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while creating user. Error: ${err}`, 400);
        });
}

module.exports.registerShop = async (req, res) => {
    const shopData = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        phoneNumber: req.body.phoneNumber,
        shopName: req.body.shopName,
        address: req.body.address,
        zipCode: req.body.zipCode,
    }

    authService.registerShop(shopData)
        .then(resp => {
            console.log('Shop has been created');
            wrapper.response(res, 'success', resp, 'Shop has been created', 201);
        })
        .catch(err => {
            console.log('Shop cannot be created', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while creating Shop. Error: ${err}`, 400);
        });
}