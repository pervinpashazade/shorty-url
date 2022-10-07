class LinkDTO {

    #url;
    #link

    constructor(_url, _link) {
        this.#url = _url;
        this.#link = _link;
    }

    get() {
        return {
            url: this.#url,
            link: this.#link,
        }
    }

    set(url, link) {
        this.#url = url;
        this.#link = link;
    }
}

module.exports = {
    LinkDTO: LinkDTO
}