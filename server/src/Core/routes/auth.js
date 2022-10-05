

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { login } = require("../../Repository/services/authServices.js");
const { createUser } = require("../../Repository/services/userServices.js");

router.post("/login", async (req, res) => {

    let result = {
        success: false,
        data: null,
        statusCode: null,
        message: '',
    };
    let validationErrors = {
        username: [],
        password: [],
    };

    // 400
    if (!req.body) {
        result.success = false;
        result.statusCode = 400;
        result.message = "Data is not valid";

        return result
    };

    // 422
    if (!req.body.username) {
        validationErrors.username.push("İstifadəçi adı daxil edilməyib");
    };
    if (!req.body.password) {
        validationErrors.password.push("Şifrə daxil edilməyib");
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
    } else {
        result.success = true;
        result.data = {
            username: req.body.username,
            password: req.body.password
        }
    }

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
            error: result.error,
            validation: result.validation,
        });
    }

    try {

        const user = await login(result.data.username, result.data.password);

        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const accessToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        return res.status(200).json({
            success: true,
            token: accessToken,
            data: user,
        });

    } catch (err) {
        console.log('login error ', err);
        return res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
});

router.post("/register", async (req, res) => {

    const result = await createUser(req.body);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message,
            error: result.error,
            validation: result.validation,
        });
    }

    try {

        return res.status(201).json({
            success: true,
            message: 'User Created',
            data: result.data
        });

    } catch (error) {
        console.log('create user error : ', error);
        res.status(500).json({ error: error });
    };
});

module.exports = router