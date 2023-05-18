class ApiDaerah {
    #option
    elProvinsi
    elKecamatan
    elKabupaten

    // Berikan Aku Sebuah ID, Kan Ku Buat Select Mu Berfungsi
    constructor(config = {}) {
        this.#option = {
            baseUrl: config.baseUrl || window.location.origin,
            event: config.event === false ? false : true,
            placeholder: config.placeholder === false ? false : true,
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
            enabled: {
                kabupaten: config.enabled?.kabupaten === false ? false : true,
                kecamatan: config.enabled?.kecamatan === false ? false : true,
            }
        }
        if (typeof this.#option.enabled.kabupaten != 'boolean') {
            this.#option.enabled.kabupaten = config.idKabupaten !== false
        }
        if (typeof this.#option.enabled.kecamatan != 'boolean') {
            this.#option.enabled.kecamatan = config.idKecamatan !== false
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

    async renderProvinsi(selected = null) {
        const listProvinsi = await this.getProvinsi()
        const elSelect = this.getSelectProvinsiElement()

        this.#renderSelect(
            elSelect, 
            listProvinsi, 
            this.#option.provinsi.text, 
            this.#option.provinsi.value, 
            selected
        )
    }

    async renderKabupaten(provinsiID = null, selected = null) {
        // ambil langsung nilai provinsi jika null
        provinsiID = provinsiID || this.getSelectedProvinsiID()
        const listKabupaten = await this.getKabupaten(provinsiID)
        const elSelect = this.getSelectKabupatenElement()

        this.#renderSelect(
            elSelect, 
            listKabupaten, 
            this.#option.kabupaten.text,
            this.#option.kabupaten.value, 
            selected
        )
    }

    async renderKecamatan(kabupatenID = null, selected = null) {
        // ambil langsung nilai kabupaten jika null
        kabupatenID = kabupatenID || this.getSelectedKabupatenID()
        const listKecamatan = await this.getKecamatan(kabupatenID)
        const elSelect = this.getSelectKecamatanElement()

        this.#renderSelect(
            elSelect, 
            listKecamatan, 
            this.#option.kecamatan.text,
            this.#option.kecamatan.value, 
            selected
        )
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
        try {
            if (this[`el${elementName}`] === null) throw Error(`${elementName} Select with id="${this[`el${elementName}`]}" not found`)
        } catch (error) {
            // lanjutkan throw jika element dienable
            if(this.#option.enabled[elementName]) throw error

            throw Error(`Cannot get element because element ${elementName} off/disabled`)
        }
        return this[`el${elementName}`]
    }

    #renderSelect(elSelect, dataList, text = 'name', useValue = 'id', selected = null) {
        elSelect.innerHTML = ''
        this.makePlaceholder(elSelect)
        
        dataList.forEach(data => {
            const opt = this.#createOption(data, data[text], useValue)
            elSelect.appendChild(opt)
        })
        if (selected !== null) {
            elSelect.value = selected
        }
    }

    makePlaceholder(elSelect, customText = null, disabled = true) {
        if (this.#option.placeholder) {
            elSelect.innerHTML = ''
            const opt = document.createElement('option')
            opt.innerText = customText || elSelect.getAttribute('placeholder') || 'Pilih Lokasi'
            opt.value = customText
            opt.disabled = disabled
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

    async renderAllSelect(withDefaultValue = false) {
        if (this.#option.enabled.kabupaten) {
            this.makePlaceholder(
                this.getSelectKabupatenElement(),
                withDefaultValue ? this.#option.kabupaten.selected : null,
                (typeof this.#option.kabupaten.selected != 'string')
            )
        }
        if (this.#option.enabled.kecamatan) {
            this.makePlaceholder(
                this.getSelectKecamatanElement(),
                withDefaultValue ? this.#option.kecamatan.selected : null,
                (typeof this.#option.kecamatan.selected != 'string')
            )
        }

        await this.renderProvinsi(withDefaultValue ? this.#option.provinsi.selected : null)
        if (this.#option.enabled.kabupaten && withDefaultValue && this.#option.kabupaten.selected) {
            await this.renderKabupaten(null, this.#option.kabupaten.selected)
        }
        if (this.#option.enabled.kecamatan && withDefaultValue && this.#option.kecamatan.selected) {
            await this.renderKecamatan(null, this.#option.kecamatan.selected)
        }
    }

    async #runEventSelect() {
        // create Event dan membuat placeholder awal
        const apiDaerah = this
        this.makePlaceholder(
            this.getSelectProvinsiElement(),
            this.#option.provinsi.selected
        )

        if (this.#option.enabled.kabupaten) {
            const isEnabledKecamatan = this.#option.enabled.kecamatan
            function loadKabupaten() {
                apiDaerah.makePlaceholder(apiDaerah.elKabupaten, 'Memuat Kabupaten')
                apiDaerah.renderKabupaten()
                if (isEnabledKecamatan) {
                    apiDaerah.makePlaceholder(apiDaerah.elKecamatan)
                }
            }

            if ($) $(this.elProvinsi).on('change', loadKabupaten)
            else this.elProvinsi.addEventListener('change', loadKabupaten)

            this.makePlaceholder(
                this.getSelectKabupatenElement(),
                this.#option.kabupaten.selected
            )
        }

        if (this.#option.enabled.kecamatan) {
            function loadKecamatan() {
                apiDaerah.makePlaceholder(apiDaerah.elKecamatan, 'Memuat Kecamatan')
                apiDaerah.renderKecamatan()    
            }
            
            if ($) $(this.elKabupaten).on('change', loadKecamatan)
            else this.elKabupaten.addEventListener('change', loadKecamatan)

            this.makePlaceholder(
                this.getSelectKecamatanElement(),
                this.#option.kecamatan.selected
            )
        }

        this.renderAllSelect(true)
    }
}