class ApiDaerah {
    #option
    elProvinsi
    elKecamatan
    elKabupaten

    constructor(config = {}) {
        this.#option = {
            baseUrl: config.baseUrl ?? window.location.origin,
            idProvinsi: config.idProvinsi ?? 'provinsi-select',
            idKecamatan: config.idKecamatan ?? 'kecamatan-select',
            idKabupaten: config.idKabupaten ?? 'kabupaten-select',
            event: config.event ?? true,
            placeholder: config.placeholder ?? true,
        }
        this.elProvinsi = document.getElementById(this.#option.idProvinsi);
        this.elKecamatan = document.getElementById(this.#option.idKecamatan);
        this.elKabupaten = document.getElementById(this.#option.idKabupaten);        

        if (this.#option.event) {
            this.#runEventSelect()
        }
    }

    #getUrl(path) {
        return this.#option.baseUrl + path
    }

    async getProvinsi() {
        const listProvinsi = await this.#call('/api/provinsi')
        return listProvinsi
    }

    async getKabupaten(provinsiID) {
        const listKabupaten = await this.#call(`/api/kabupaten/${provinsiID}`)
        return listKabupaten
    }

    async getKecamatan(kabupatenID) {
        const listKecamatan = await this.#call(`/api/kecamatan/${kabupatenID}`)
        return listKecamatan
    }

    async renderProvinsi(text = 'name', useValue = 'id') {
        const listProvinsi = await this.getProvinsi()
        this.#renderSelect(this.getSelectProvinsiElement(), listProvinsi, text, useValue)
    }

    async renderKabupaten(provinsiID, text = 'name', useValue = 'id') {
        const listKabupaten = await this.getKabupaten(provinsiID)
        this.#renderSelect(this.getSelectKabupatenElement(), listKabupaten, text, useValue)
    }

    async renderKecamatan(kabupatenID, text = 'name', useValue = 'id') {
        const listKecamatan = await this.getKecamatan(kabupatenID)
        this.#renderSelect(this.getSelectKecamatanElement(), listKecamatan, text, useValue)
    }

    getSelectProvinsiElement() {
        return this.#checkExistElement('Provinsi')
    }

    getSelectKabupatenElement() {
        return this.#checkExistElement('Kabupaten')
    }

    getSelectKecamatanElement() {
        return this.#checkExistElement('Kecamatan')
    }

    getSelectedProvinsiID() {
        return this.getSelectProvinsiElement().childNodes[this.elProvinsi.selectedIndex].dataset.id
    }

    getSelectedKecamatanID() {
        return this.getSelectKecamatanElement().childNodes[this.elKecamatan.selectedIndex].dataset.id
    }

    getSelectedKabupatenID() {
        return this.getSelectKabupatenElement().childNodes[this.elKabupaten.selectedIndex].dataset.id
    }

    #checkExistElement(elementName) {
        if (this[`el${elementName}`] === null) throw Error(`${elementName} Select with id="${this.#option[`el${elementName}`]}" not found`)
        return this[`el${elementName}`]
    }

    #renderSelect(elSelect, dataList, text = 'name', useValue = 'id') {
        elSelect.innerHTML = ''
        this.#makePlaceholder(elSelect)
        
        dataList.forEach(data => {
            const opt = this.#createOption(data, data[text], useValue)
            elSelect.appendChild(opt)
        })
    }

    #makePlaceholder(elSelect, customText = null) {
        if (this.#option.placeholder) {
            elSelect.innerHTML = ''
            const opt = document.createElement('option')
            opt.innerText = customText ?? elSelect.getAttribute('placeholder') ?? 'Pilih Lokasi'
            opt.disabled = false
            opt.selected = true
            elSelect.appendChild(opt)
        }
    }

    #createOption(data, text, useValue = 'id') {
        const opt = document.createElement('option')
        opt.innerText = text
        opt.dataset.id = data.id
        opt.value = data[useValue] ?? null
        return opt
    }

    async #call(path) {
        const response = await fetch(this.#getUrl(path))
        const json = await response.json()
        return json
    }

    #runEventSelect() {
        this.#makePlaceholder(this.getSelectProvinsiElement())
        this.renderProvinsi()
        this.#makePlaceholder(this.getSelectKabupatenElement())
        this.#makePlaceholder(this.getSelectKecamatanElement())
        const apiDaerah = this
        this.elProvinsi.addEventListener('change', function() {
            const ProvinsiID = apiDaerah.getSelectedProvinsiID()
            apiDaerah.#makePlaceholder(apiDaerah.elKabupaten, 'Memuat Kabupaten')
            apiDaerah.renderKabupaten(ProvinsiID)
            apiDaerah.#makePlaceholder(apiDaerah.elKecamatan)
        })

        this.elKabupaten.addEventListener('change', function() {
            apiDaerah.#makePlaceholder(apiDaerah.elKecamatan, 'Memuat Kecamatan')
            const KabupatenID = apiDaerah.getSelectedKabupatenID()
            apiDaerah.renderKecamatan(KabupatenID)
        })
    }
}