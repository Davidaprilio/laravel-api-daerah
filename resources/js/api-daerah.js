class ApiDaerah {
    #option
    elProvinsi
    elKecamatan
    elKabupaten
    elDesa

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
            idDesa: config.idDesa || 'desa-select', // sama dengan desa.id

            // config advanced nya
            provinsi: {
                id: config.provinsi?.id || null,
                dataID: config.provinsi?.dataID || null, // use custom identifier in attribute option "data-id=dataID" default follow value option ("id")
                value: config.provinsi?.value || 'id',
                text: config.provinsi?.text || 'name',
                selected: config.provinsi?.selected || null,
                endpoint: config.provinsi?.endpoint || '/api/provinsi',
            },
            kabupaten: {
                id: config.kabupaten?.id || null,
                dataID: config.kabupaten?.dataID || null,
                value: config.kabupaten?.value || 'id',
                text: config.kabupaten?.text || 'name',
                selected: config.kabupaten?.selected || null,
                endpoint: config.kabupaten?.endpoint || '/api/kabupaten/:provinsiID',
            },
            kecamatan: {
                id: config.kecamatan?.id || null,
                dataID: config.kecamatan?.dataID || null,
                value: config.kecamatan?.value || 'id',
                text: config.kecamatan?.text || 'name',
                selected: config.kecamatan?.selected || null,
                endpoint: config.kecamatan?.endpoint || '/api/kecamatan/:kabupatenID',
            },
            desa: {
                id: config.desa?.id || null,
                dataID: config.desa?.dataID || null,
                value: config.desa?.value || 'id',
                text: config.desa?.text || 'name',
                selected: config.desa?.selected || null,
                endpoint: config.desa?.endpoint || '/api/desa/:kecamatanID',
            },
            enabled: {
                kabupaten: config.enabled?.kabupaten === false ? false : true,
                kecamatan: config.enabled?.kecamatan === false ? false : true,
                desa: config.enabled?.desa || false,
            },
            useJquery: false
        }
        if (typeof this.#option.enabled.kabupaten != 'boolean') {
            this.#option.enabled.kabupaten = config.idKabupaten !== false
        }
        if (typeof this.#option.enabled.kecamatan != 'boolean') {
            this.#option.enabled.kecamatan = config.idKecamatan !== false
        }
        if (typeof this.#option.enabled.desa != 'boolean') {
            this.#option.enabled.desa = config.idDesa !== false
        }

        this.elProvinsi = document.getElementById(this.#option.provinsi.id || this.#option.idProvinsi);
        this.elKecamatan = document.getElementById(this.#option.kecamatan.id || this.#option.idKecamatan);
        this.elKabupaten = document.getElementById(this.#option.kabupaten.id || this.#option.idKabupaten);       
        this.elDesa = document.getElementById(this.#option.desa.id || this.#option.idDesa);
        
        if (this.#option.supportSelectValue) {
            this.#option.provinsi.selected = this.#option.provinsi.selected || this.elProvinsi?.getAttribute('value') || null;
            this.#option.kecamatan.selected = this.#option.kecamatan.selected || this.elKecamatan?.getAttribute('value') || null;
            this.#option.kabupaten.selected = this.#option.kabupaten.selected || this.elKabupaten?.getAttribute('value') || null;
            this.#option.desa.selected = this.#option.desa.selected || this.elDesa?.getAttribute('value') || null;
        }
        
        try {
            if ($) this.#option.useJquery = true
        } catch (error) {
            this.#option.useJquery = false
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
        const listKabupaten = await this.#call(this.#option.kabupaten.endpoint, {provinsiID})
        return listKabupaten
    }

    async getKecamatan(kabupatenID) {
        const listKecamatan = await this.#call(this.#option.kecamatan.endpoint, {kabupatenID})
        return listKecamatan
    }

    async getDesa(kecamatanID) {
        const listDesa = await this.#call(this.#option.desa.endpoint, {kecamatanID})
        return listDesa
    }

    async renderProvinsi(selected = null) {
        const listProvinsi = await this.getProvinsi()
        const elSelect = this.getSelectProvinsiElement()

        this.#renderSelect(
            elSelect, 
            listProvinsi, 
            this.#option.provinsi.text, 
            this.#option.provinsi.value, 
            this.#option.provinsi.dataID, 
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
            this.#option.kabupaten.dataID, 
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
            this.#option.kecamatan.dataID, 
            selected
        )
    }

    async renderDesa(kecamatanID = null, selected = null) {
        // ambil langsung nilai kabupaten jika null
        kecamatanID = kecamatanID || this.getSelectedKecamatanID()
        const listDesa = await this.getDesa(kecamatanID)
        const elSelect = this.getSelectDesaElement()

        this.#renderSelect(
            elSelect, 
            listDesa, 
            this.#option.desa.text,
            this.#option.desa.value, 
            this.#option.desa.dataID, 
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

    getSelectDesaElement() {
        return this.#checkExistElement('Desa')
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

    getSelectedDesaID() {
        return this.getSelectDesaElement().childNodes[this.elDesa.selectedIndex].dataset.id
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

    getSelectedID() {
        return {
            provinsiID: this.getSelectedProvinsiID(),
            kabupatenID: this.#option.enabled.kabupaten ? this.getSelectedKabupatenID() : null,
            kecamatanID: this.#option.enabled.kecamatan ? this.getSelectedKecamatanID() : null,
            desaID: this.#option.enabled.desa ? this.getSelectedDesaID() : null 
        }
    }

    #renderSelect(elSelect, dataList, text = 'name', useValue = 'id', useDataID = null, selected = null) {
        elSelect.innerHTML = ''
        this.makePlaceholder(elSelect)
        
        dataList.forEach(data => {
            const opt = this.#createOption(data, text, useValue, useDataID)
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

    #createOption(data, useText = 'name', useValue = 'id', useDataID = null) {
        const opt = document.createElement('option')
        opt.innerText = this.#objectGetValue(data, useText)
        opt.dataset.id = this.#objectGetValue(data, useDataID || useValue)
        opt.value = this.#objectGetValue(data, useValue)
        return opt
    }

    #objectGetValue(data, path) {
        try {
            return path.split('.').reduce((prev, curr) => prev[curr], data)
        } catch (error) {
            console.error(`Invalid key path '${path}'`, data)
        }
    }

    async #call(path, params = {}) {
        params = {...this.getSelectedID(), ...params}
        // replace param in path with value from params
        path = Object.entries(params).reduce((str, [k,v]) => str.replaceAll(`:${k}`, v), path)

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
    
    #eventChange(element, callback) {
        if (this.#option.useJquery) $(element).on('change', callback)
        else element.addEventListener('change', callback)
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

            this.#eventChange(this.elProvinsi, () => {
                apiDaerah.makePlaceholder(apiDaerah.elKabupaten, 'Memuat Kabupaten')
                apiDaerah.renderKabupaten()
                if (isEnabledKecamatan) {
                    apiDaerah.makePlaceholder(apiDaerah.elKecamatan)
                    if (apiDaerah.#option.enabled.desa) {
                        apiDaerah.makePlaceholder(apiDaerah.elDesa)
                    }
                }
            })

            this.makePlaceholder(
                this.getSelectKabupatenElement(),
                this.#option.kabupaten.selected
            )
        }

        if (this.#option.enabled.kecamatan) {
            this.#eventChange(this.elKabupaten, () => {
                apiDaerah.makePlaceholder(apiDaerah.elKecamatan, 'Memuat Kecamatan')
                apiDaerah.renderKecamatan()    
                if (apiDaerah.#option.enabled.desa) {
                    apiDaerah.makePlaceholder(apiDaerah.elDesa)
                }
            })

            this.makePlaceholder(
                this.getSelectKecamatanElement(),
                this.#option.kecamatan.selected
            )
        }

        if (this.#option.enabled.desa) {
            this.#eventChange(this.elKecamatan, () => {
                apiDaerah.makePlaceholder(apiDaerah.elDesa, 'Memuat Desa')
                apiDaerah.renderDesa()
            })

            this.makePlaceholder(
                this.getSelectDesaElement(),
                this.#option.desa.selected
            )
        }

        this.renderAllSelect(true)
    }
}