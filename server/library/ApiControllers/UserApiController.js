module.exports = class UserApiController {

    constructor(user) {
        console.log('UserApiController constructor called');
        this.user = user;
    }

    getUserInfo() {
        return this.user;
    }
};