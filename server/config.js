require('dotenv').config();

module.exports = {
    PORT: 5000,
    providers: {
        bitly: {
            domain: "bit.ly",
            access_token: process.env.BITLY_TOKEN,
            group_guid: process.env.BITLY_GROUP_GUID,
            url: 'https://api-ssl.bitly.com/v4/shorten'
        },
        tinyurl: {
            domain: "tinyurl.com",
            access_token: process.env.TINY_URL_TOKEN,
            url: "https://api.tinyurl.com/create"
        }

    },
}