const model = require("../../DAL/models");
const { Op } = require("sequelize");
// const db = require("../../DAL/models");
const { ResponseDTO } = require("../../DTO/ResponseDTO");
const { normalizeObj } = require("../helpers/normalizeObj");
const axios = require("axios");
const config = require("../../../config");

const { Link, Sequelize, sequelize } = model;

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
    // // url regex required
    if (!body.url?.trim()) {
        validationErrors.url.push("This field is required");
    };
    // // check here provider type only string allowed
    // if (body.provider?.trim()) {
    //     validationErrors.provider.push("Surname field is required");
    // };

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
        let existData = await getByLongName(body.url);

        if (existData) {
            result.set(true, 200, "Success", null, existData)
            return result;
        }

        let selected_provider = config.providers.bitly;

        if (body.provider && config.providers[body.provider]) selected_provider = config.providers[body.provider];

        const response_data = await axios({
            method: "POST",
            url: selected_provider.url,
            withCredentials: true,
            contentType: "application/json",
            headers: {
                'Authorization': `Bearer ${selected_provider.access_token}`
            },
            data: {
                group_guid: selected_provider.group_guid,
                domain: selected_provider.domain,
                long_url: body.url
            },
        }).then(res => {
            console.log('RES ===>', res);
            return res.data
        }).catch(async err => {
            console.log('ERR ===>', err.response.data);
            result.set(false, 400, err.response?.data.description ?? "URL not created", err.response.data)
        })

        if (!response_data) {
            return result
        }

        const transaction = await sequelize.transaction({
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        const newData = await Link.create({
            long_url: response_data.long_url,
            link: response_data.link,
            bit_id: response_data.id,
        }, {
            transaction: transaction
        }).then(response => {
            return response.get({ plain: true })
        }).catch(err => {
            console.log('link create db_insert_error', err);
            result.set(false, 400, "URL not created. Insert error", err)
        });

        if (!newData) {
            await transaction.rollback();
            return result;
        }

        await transaction.commit();

        result.set(true, 201, "URL created successfully", null, {
            long_url: newData.long_url,
            link: newData.link
        })

    } catch (error) {
        console.log('link create error', error);
        result.set(false, 500, "Something went wrong!", error)
    }

    return result;
};

const getByLongName = async url => {
    if (!url) return null;
    try {
        const data = await Link.findOne({ where: { [Op.or]: [{ long_url: url }] }, raw: true });
        if (!data) return null;
        return data
    } catch (error) {
        console.log('getByLongName service catch', error);
    }
}

module.exports = {
    createUrl: createUrl,
}