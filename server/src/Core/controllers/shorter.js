const { ResponseDTO } = require("../../DTO/ResponseDTO");
const { createUrl } = require("../../Repository/services/shorterServices")

exports.create = async (req, res) => {

    const result = (await createUrl(req.body)).get();

    if (!result.success) {
        return res.status(result.statusCode).json(result);
    }

    try {

        return res.status(result.statusCode).json(
            new ResponseDTO(
                result.success,
                result.statusCode,
                result.message,
                null,
                {
                    url: result.data.long_url,
                    link: result.data.link,
                }
            ).get()
        );

    } catch (error) {
        console.log('create link error : ', error);
        res.status(500).json({ error: error });
    };
}