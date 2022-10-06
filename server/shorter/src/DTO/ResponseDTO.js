const { normalizeObj } = require("../Repository/helpers/normalizeObj");

class ResponseDTO {

    #success;
    #statusCode
    #message
    #error
    #data

    constructor(_success = false, _statusCode = 400, _message, _error, _data) {
        this.#success = _success;
        this.#statusCode = _statusCode;
        this.#message = _message;
        this.#error = _error;
        this.#data = _data;
    }

    get() {

        return normalizeObj({
            success: this.#success,
            statusCode: this.#statusCode,
            message: this.#message,
            error: this.#error,
            data: this.#data,
        })
    }

    set(success, statusCode, message, error, data) {
        this.#success = success;
        this.#statusCode = statusCode;
        this.#message = message;
        this.#error = error;
        this.#data = data;
    }
}

module.exports = {
    ResponseDTO: ResponseDTO
}