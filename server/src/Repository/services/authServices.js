const model = require("../../DAL/models");
const CryptoJs = require("crypto-js");

const { User } = model;

exports.login = async (username, userPassword) => {

    if (!username || !userPassword) return null;

    try {

        const user = await User.findOne({ where: { username, deleted_at: null }, raw: true });

        if (!user) return null;

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.CRYPTO_SECRET).toString(CryptoJs.enc.Utf8);

        if (userPassword !== hashedPassword) return null;

        const { password, created_at, updated_at, ...userDetails } = user;

        return userDetails
    } catch (error) {
        console.log('login catch', error);
    }
}