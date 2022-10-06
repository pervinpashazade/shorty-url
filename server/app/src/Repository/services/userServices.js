const model = require("../../DAL/models");
const { Op } = require("sequelize");
const db = require("../../DAL/models");
const CryptoJs = require("crypto-js");

const { User } = model;

const getUserByUsername = async username => {

    if (!username) return null;

    try {

        const user = await User.findOne({ where: { [Op.or]: [{ username }] }, raw: true });

        if (!user) return null;

        return user
    } catch (error) {
        console.log('getUserByUsername catch', error);
    }
}

const checkUsernameExist = async username => {
    if (!username) return null;

    try {

        const user = await User.findOne({
            where: {
                username
            },
            attributes: ['username'],
            raw: true
        });

        if (!user?.username) return false;

        return true

    } catch (error) {
        console.log('getUserByUsername catch', error);
    }
}

const createUser = async body => {

    let result = {
        success: false,
        data: null,
        statusCode: null,
        message: '',
    };
    let validationErrors = {
        fullname: [],
        username: [],
        password: [],
    };

    // 400
    if (!body) {
        result.success = false;
        result.statusCode = 400;
        result.message = "Data is not valid";

        return result
    };

    // 422
    if (!body.fullname?.trim()) {
        validationErrors.fullname.push("Fullname field is required");
    };
    if (!body.username?.trim()) {
        validationErrors.username.push("Username field is required");
    };
    if (!body.password?.trim()) {
        validationErrors.password.push("Password field is required");
    };

    let errorCount = 0;

    for (const value of Object.values(validationErrors)) {
        errorCount = errorCount + value.length;
    };

    // return 422
    if (errorCount > 0) {

        result.success = false;
        result.data = null;
        result.statusCode = 422;
        result.message = "Form is not valid";
        result.validation = validationErrors;

        return result
    };

    try {

        let isExistUsername = await checkUsernameExist(body.username);

        if (isExistUsername) {

            result.success = false;
            result.statusCode = 409;
            result.message = "Username already exist";

            return result;
        }

        const newData = await User.create({
            fullname: body.fullname.trim(),
            username: body.username.trim(),
            password: CryptoJs.AES.encrypt(body.password, process.env.CRYPTO_SECRET).toString().trim(),
        }).then(response => {
            return response.get({ plain: true })
        });

        const { password, created_at, updated_at, ...others } = newData;

        result.success = true;
        result.statusCode = 201;
        result.data = others;
        result.message = "User created successfully";

    } catch (error) {
        console.log('user create error', error);

        result.success = false;
        result.statusCode = 500;
        result.message = "Something went wrong!";
        result.error = error;
    }

    return result;
};

const getUserList = async req => {
    try {
        const { page = 0, per_page = 10 } = req;

        const paginationQuery =
            `SELECT * FROM users WHERE deleted_at IS NULL LIMIT ${per_page} OFFSET ${page > 1 ? (page - 1) * per_page : 0}`;
        const totalCountQuery = `Select COUNT(*) AS total FROM users WHERE deleted_at IS NULL`;

        const listResult = await db.sequelize.query(paginationQuery);

        let totalResult = 0;

        try {
            totalResult = await db.sequelize.query(totalCountQuery).then(res => {
                if (res[0] && res[0][0]?.total) {
                    return res[0][0].total
                }
            });
        } catch (error) {
            console.log('totalResult total count error', error);
        }

        const list = listResult[0].map(item => {
            const { password, created_at, updated_at, deleted_at, ...others } = item;
            return others
        })

        return {
            success: true,
            data: list,
            page: Number(page),
            per_page: Number(per_page),
            total: totalResult
        }

    } catch (error) {
        console.log('getUserList error', error)
        return {
            success: false,
            data: [],
            error: error,
            statusCode: 400
        }
    }
}

const getUserById = async id => {

    let data = {
        success: false,
        data: null,
        message: null,
        error: null,
        statusCode: 400,
    }

    if (!id) {
        data.message = "Id required";
        return data
    };

    try {
        const result = await User.findOne({ where: { id }, raw: true });

        if (!result) {
            data.success = false;
            data.message = 'User not found';
            data.statusCode = 404;

            return data
        }

        const { password, ...others } = result

        data.success = true;
        data.data = others
        data.message = 'User details';
        data.statusCode = 200;

    } catch (error) {
        console.log('getUserById error', error)
        data.success = false;
        data.data = null;
        data.message = 'Server error';
        data.statusCode = 500;
    }

    return data
}

const updateUserById = async (body, userData) => {

    let result = {
        success: false,
        data: null,
        statusCode: null,
        message: '',
    };
    let validationErrors = {
        id: [],
        fullname: [],
        username: [],
    };

    // 400
    if (!body) {
        result.success = false;
        result.statusCode = 400;
        result.message = "Data is not valid";

        return result
    };
    if (!userData?.id) {
        validationErrors.id.push("User data is required");
    };

    // 422
    if (!body.fullname) {
        validationErrors.fullname.push("Fullname field is required");
    };
    if (!body.username) {
        validationErrors.username.push("Username field is required");
    };

    let errorCount = 0;

    for (const value of Object.values(validationErrors)) {
        errorCount = errorCount + value.length;
    };

    // return 422
    if (errorCount > 0) {

        result.success = false;
        result.data = null;
        result.statusCode = 422;
        result.message = "Form is not valid";
        result.validation = validationErrors;

        return result
    };

    try {

        if (body.username !== userData?.username) {
            let isExistUsername = await checkUsernameExist(body.username);

            if (isExistUsername) {
                result.success = false;
                result.statusCode = 409;
                result.message = "Username already exist";

                return result;
            }
        }

        await User.upsert({
            id: userData.id,
            fullname: body.fullname.trim(),
            username: body.username.trim(),
            password: CryptoJs.AES.encrypt(body.password, process.env.CRYPTO_SECRET).toString().trim(),
        }).then(response => {

            const { password, ...others } = response[0].dataValues

            result.success = true;
            result.data = others;
            result.message = 'User updated successfully';
            result.statusCode = 200;

        }).catch(error => {
            console.log('updateUserById error', error);

            result.success = false;
            result.message = 'User not updated';
            result.error = error;
            result.statusCode = 400
        });


        // // final result
        return result

    } catch (error) {
        console.log('user update error', error);

        result.success = false;
        result.statusCode = 500;
        result.message = "Something went wrong!";
        result.error = error;
    }

    return result;
};

const deleteUserById = async id => {

    let result = {
        success: false,
        data: null,
        statusCode: 400,
        message: '',
    };

    // 400
    if (!id) {
        result.success = false;
        result.statusCode = 400;
        result.message = "Data is not valid";

        return result
    };

    try {

        const data = await getUserById(id);

        if (!data.success) {
            result.success = false;
            result.message = data.message;
            result.error = data.error;
            result.statusCode = data.statusCode
        }

        // console.log('data =>', data);

        await User.destroy({
            where: {
                id: data.data.id
            },
        }).then(res => {
            // console.log('delete res', res[0])

            data.data.deleted_at = new Date();

            result.success = true
            result.statusCode = 200
            result.data = data.data
            result.message = "User deleted successfully"
        }).catch(err => {
            console.log('deleteUserById sequelize error', err);
            result.success = false
            result.statusCode = 400
            result.error = err
            result.message = "User not deleted"
        })

        // // final result
        return result

    } catch (error) {
        console.log('user update error', error);

        result.success = false;
        result.statusCode = 500;
        result.message = "Something went wrong!";
        result.error = error;
    }

    return result;
};

module.exports = {
    getUserByUsername: getUserByUsername,
    checkUsernameExist: checkUsernameExist,
    createUser: createUser,
    getUserList: getUserList,
    getUserById: getUserById,
    updateUserById: updateUserById,
    deleteUserById: deleteUserById,
}