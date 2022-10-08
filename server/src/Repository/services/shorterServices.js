const { ResponseDTO } = require("../../DTO/ResponseDTO");
const { normalizeObj } = require("../helpers/normalizeObj");
const axios = require("axios");
const config = require("../../../config");

const createUrl = async body => {

    let result = new ResponseDTO();

    let validationErrors = {
        url: [],
        provider: [],
    };

    // // 400
    if (!body) {
        result.set(false, 400, "Data is not valid")
        return result
    };

    // 422
    if (!body.url?.trim()) {
        validationErrors.url.push("This field is required");
    };

    let errorCount = 0;

    for (const value of Object.values(validationErrors)) {
        errorCount = errorCount + value.length;
    };

    // // return 422
    if (errorCount > 0) {
        result.set(false, 422, "Form is not valid", normalizeObj(validationErrors))
        return result
    };

    try {
        let selected_provider = config.providers.bitly;

        if (body.provider) {
            for (const key of Object.keys(config.providers)) {
                if (key === body.provider) {
                    selected_provider = config.providers[key]
                }
            }
        }

        let post_body = {
            group_guid: selected_provider.group_guid,
            domain: selected_provider.domain,
            long_url: body.url
        };

        if (selected_provider.domain === "tinyurl.com") {
            post_body = {
                url: body.url,
                provider: selected_provider.domain
            }
        }

        const response_data = await axios({
            method: "POST",
            url: selected_provider.url,
            withCredentials: true,
            contentType: "application/json",
            headers: {
                'Authorization': `Bearer ${selected_provider.access_token}`
            },
            data: post_body,
        }).then(res => {
            console.log('RES ===>', res.data);
            return res.data
        }).catch(async err => {
            console.log('ERR ===>', err.response.data);
            result.set(false, 400, err.response?.data.description ?? "URL not created", err.response.data)
        })

        if (!response_data) {
            return result
        }

        let obj = {};

        if (selected_provider.domain === "bit.ly") {
            obj = {
                long_url: response_data.long_url,
                link: response_data.link,
                provider: selected_provider.domain,
            }
        } else if (selected_provider.domain === "tinyurl.com") {
            obj = {
                long_url: response_data.data.url,
                link: response_data.data.tiny_url,
                provider: response_data.data.domain,
            }
        }

        result.set(true, 201, "URL created successfully", null, {
            long_url: obj.long_url,
            link: obj.link
        })

    } catch (error) {
        console.log('link create error', error);

        if (error.name === "SequelizeConnectionRefusedError") {
            result.set(false, 500, "Could not connect to database!", error)
            return result
        }

        result.set(false, 500, "Something went wrong!", error)
    }

    return result;
};

module.exports = {
    createUrl: createUrl,
}