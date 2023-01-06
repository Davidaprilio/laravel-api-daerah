class ApiDaerah {
    #option
    elProvinsi
    elKecamatan
    elKabupaten

    // Berikan Aku Sebuah ID, Kan Ku Buat Select Mu Berfungsi
    constructor(config = {}) {
        this.#option = {
            baseUrl: config.baseUrl || window.location.origin,
            event: config.event || true,
            placeholder: config.placeholder || true,
            supportSelectValue: config.supportSelectValue || false,

            // bisa pakai ini untuk config singkat nya
            idProvinsi: config.idProvinsi || 'provinsi-select', // sama dengan provinsi.id
            idKecamatan: config.idKecamatan || 'kecamatan-select', // sama dengan kecamatan.id
            idKabupaten: config.idKabupaten || 'kabupaten-select', // sama dengan kabupaten.id

            // config advanced nya
            provinsi: {
                id: config.provinsi?.id || null,
                value: config.provinsi?.value || 'id',
                text: config.provinsi?.text || 'name',
                selected: config.provinsi?.selected || null,
                endpoint: config.provinsi?.endpoint || '/api/provinsi',
            },
            kabupaten: {
                id: config.kabupaten?.id || null,
                value: config.kabupaten?.value || 'id',
                text: config.kabupaten?.text || 'name',
                selected: config.kabupaten?.selected || null,
                endpoint: config.kabupaten?.endpoint || '/api/kabupaten/:id',
            },
            kecamatan: {
                id: config.kecamatan?.id || null,
                value: config.kecamatan?.value || 'id',
                text: config.kecamatan?.text || 'name',
                selected: config.kecamatan?.selected || null,
                endpoint: config.kecamatan?.endpoint || '/api/kecamatan/:id',
            },
        }
        
        this.elProvinsi = document.getElementById(this.#option.provinsi.id || this.#option.idProvinsi);
        this.elKecamatan = document.getElementById(this.#option.kecamatan.id || this.#option.idKecamatan);
        this.elKabupaten = document.getElementById(this.#option.kabupaten.id || this.#option.idKabupaten);       
        
        if (this.#option.supportSelectValue) {
            this.#option.provinsi.selected = this.#option.provinsi.selected || this.elProvinsi?.getAttribute('value') || null;
            this.#option.kecamatan.selected = this.#option.kecamatan.selected || this.elKecamatan?.getAttribute('value') || null;
            this.#option.kabupaten.selected = this.#option.kabupaten.selected || this.elKabupaten?.getAttribute('value') || null;
        }

        if (this.#option.event) {
            this.#runEventSelect()
        }
    }

    #getUrl(path) {
        return this.#option.baseUrl + path
    }

    async getProvinsi() {
        const listProvinsi = await this.#call(this.#option.provinsi.endpoint)
        return listProvinsi
    }

    async getKabupaten(provinsiID) {
        const listKabupaten = await this.#call(this.#option.kabupaten.endpoint.replace(':id', provinsiID))
        return listKabupaten
    }

    async getKecamatan(kabupatenID) {
        const listKecamatan = await this.#call(this.#option.kecamatan.endpoint.replace(':id', kabupatenID))
        return listKecamatan
    }

    async renderProvinsi(text = null, useValue = null, selected = null) {
        const listProvinsi = await this.getProvinsi()
        const elSelect = this.getSelectProvinsiElement()

        // mengisi default value dengan config
        selected = selected || this.#option.provinsi.selected;
        useValue = useValue || this.#option.provinsi.value;
        text = text || this.#option.provinsi.text;

        this.#renderSelect(elSelect, listProvinsi, text, useValue, selected)
        if (selected != null) {
            elSelect.value = selected
        }
    }

    async renderKabupaten(provinsiID, text = null, useValue = null, selected = null) {
        const listKabupaten = await this.getKabupaten(provinsiID)
        const elSelect = this.getSelectKabupatenElement()

        // mengisi default value dengan config
        selected = selected || this.#option.kabupaten.selected;
        useValue = useValue || this.#option.kabupaten.value;
        text = text || this.#option.kabupaten.text;

        this.#renderSelect(elSelect, listKabupaten, text, useValue, selected)
        if (selected != null) {
            elSelect.value = selected
        }
    }

    async renderKecamatan(kabupatenID, text = null, useValue = null, selected = null) {
        const listKecamatan = await this.getKecamatan(kabupatenID)
        const elSelect = this.getSelectKecamatanElement()

        // mengisi default value dengan config
        selected = selected || this.#option.kecamatan.selected;
        useValue = useValue || this.#option.kecamatan.value;
        text = text || this.#option.kecamatan.text;

        this.#renderSelect(elSelect, listKecamatan, text, useValue, selected)
        if (selected != null) {
            elSelect.value = selected
        }
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

    #renderSelect(elSelect, dataList, text = 'name', useValue = 'id', selected = null) {
        elSelect.innerHTML = ''
        this.#makePlaceholder(elSelect)
        
        dataList.forEach(data => {
            const opt = this.#createOption(data, data[text], useValue)
            elSelect.appendChild(opt)
        })
        if (selected !== null) {
            elSelect.value = selected
        }
    }

    #makePlaceholder(elSelect, customText = null) {
        if (this.#option.placeholder) {
            elSelect.innerHTML = ''
            const opt = document.createElement('option')
            opt.innerText = customText || elSelect.getAttribute('placeholder') || 'Pilih Lokasi'
            opt.disabled = false
            opt.selected = true
            elSelect.appendChild(opt)
        }
    }

    #createOption(data, text, useValue = 'id') {
        const opt = document.createElement('option')
        opt.innerText = text
        opt.dataset.id = data.id
        opt.value = data[useValue] || null
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