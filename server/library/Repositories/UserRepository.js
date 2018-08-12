const User = require('../../models/user.model');

class UserRepository {

    constructor() {}

    /**
     * @param {Object} options
     * @param {int} [options.id]
     * @param {String} [options.email]
     * @returns {Promise}
     */
    static findSingleUser(options) {
        let ormQueryOptions = {};
        if (options.email) {
            ormQueryOptions['local.email'] = options.email;
        }
        if (options.id) {
            ormQueryOptions['_id'] = options.id;
        }
        return User.findOne(ormQueryOptions).exec();
    }

    /**
     * @param {Object} options
     * @param {String} options.email
     * @param {String} options.password
     * @returns {Promise}
     */
    static createNewUser(options) {
        // TODO: complete this function stub
        let newUser = new User();
        newUser.local.email = options.email;
        newUser.local.password = newUser.generateHash(options.password);
        return newUser.save();
    }


}
module.exports = UserRepository;