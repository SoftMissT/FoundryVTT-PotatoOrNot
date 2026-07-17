import CONSTANTS from "./constants.js";
import * as lib from "./lib.js";

Hooks.once("init", () => {
    PotatoOrNotHandler.registerSettings();
});

Hooks.once("ready", async () => {
    const api = new PotatoOrNotHandler();
    globalThis.PotatoOrNot = api;
    Hooks.callAll("PotatoOrNotReady", api);
    await api.postSetup();
});

class PotatoOrNotHandler {
    static registerSettings() {
        for (const [key, value] of Object.entries(foundry.utils.deepClone(CONSTANTS.SETTINGS))) {
            game.settings.register(CONSTANTS.MODULE_NAME, key, value);
        }

        game.settings.registerMenu(CONSTANTS.MODULE_NAME, CONSTANTS.MODULE_NAME, {
            name: "PotatoOrNot.Settings.Name",
            hint: "PotatoOrNot.Settings.Hint",
            label: "PotatoOrNot.Settings.Label",
            icon: "fa-solid fa-potato",
            type: PotatoOrNotApplication,
            restricted: false
        });
    }

    constructor() {
        this._settings = foundry.utils.deepClone(CONSTANTS.BASE_SETTINGS);
        this._quality = lib.getSetting(CONSTANTS.SETTING_KEYS.POTATO_LEVEL);
    }

    get currentSettings() {
        return this.settings[this.quality];
    }

    /** @deprecated Use currentSettings. Kept for integrations written before v0.6.0. */
    get current_settings() {
        return this.currentSettings;
    }

    set settings(_settings) {
        throw new Error("You cannot set settings directly; use PotatoOrNot.addSetting or PotatoOrNot.removeSetting.");
    }

    get settings() {
        return this._settings;
    }

    get quality() {
        return this._quality;
    }

    set quality(qualityLevel) {
        this._validateQualityLevel(qualityLevel);
        this._quality = qualityLevel;
        void this.updateSettings();
    }

    get numberOfSettings() {
        return this.settings.map((qualitySettings) => Object.entries(qualitySettings)
            .reduce((total, [moduleId, settings]) => total + Object.keys(settings)
                .filter((setting) => this._isRegisteredSetting(moduleId, setting)).length, 0));
    }

    _isRegisteredSetting(moduleId, setting) {
        return game.settings.settings.has(`${moduleId}.${setting}`);
    }

    _validateQualityLevel(qualityLevel) {
        if (!Number.isInteger(qualityLevel) || this.settings[qualityLevel] === undefined) {
            throw new Error("qualityLevel must be 0, 1, or 2.");
        }
    }

    _validateModule(qualityLevel, moduleId) {
        this._validateQualityLevel(qualityLevel);
        if (this.settings[qualityLevel][moduleId] === undefined) {
            throw new Error(`Module setting "${moduleId}" was not found at quality level ${qualityLevel}.`);
        }
    }

    _validateSetting(qualityLevel, moduleId, setting) {
        this._validateModule(qualityLevel, moduleId);
        if (this.settings[qualityLevel][moduleId][setting] === undefined) {
            throw new Error(`Setting "${setting}" in module "${moduleId}" was not found.`);
        }
    }

    async postSetup() {
        const currentNumberOfSettings = this.numberOfSettings[this.quality];
        const hasBeenPrompted = lib.getSetting(CONSTANTS.SETTING_KEYS.HAS_BEEN_PROMPTED);
        const promptUsers = lib.getSetting(CONSTANTS.SETTING_KEYS.PROMPT_USERS);
        const numberOfSettings = lib.getSetting(CONSTANTS.SETTING_KEYS.NUMBER_OF_SETTINGS);

        if (!hasBeenPrompted && promptUsers) return this.showDialog();
        if (currentNumberOfSettings !== numberOfSettings) await this.updateSettings();
    }

    async updateSettings() {
        const updates = Object.entries(this.currentSettings)
            .flatMap(([moduleId, settings]) => Object.entries(settings)
                .filter(([setting]) => this._isRegisteredSetting(moduleId, setting))
                .map(([setting, value]) => game.settings.set(moduleId, setting, value)));

        await Promise.all(updates);
        await Promise.all([
            lib.setSetting(CONSTANTS.SETTING_KEYS.NUMBER_OF_SETTINGS, this.numberOfSettings[this.quality]),
            lib.setSetting(CONSTANTS.SETTING_KEYS.POTATO_LEVEL, this.quality)
        ]);
    }

    showDialog() {
        return new PotatoOrNotApplication().render({ force: true });
    }

    getSetting(qualityLevel = 1, moduleId = "", setting = "") {
        this._validateSetting(qualityLevel, moduleId, setting);
        return this.settings[qualityLevel][moduleId][setting];
    }

    async addSetting(qualityLevel = 1, moduleId = "", setting = "", value = "", force = false) {
        this._validateQualityLevel(qualityLevel);
        this.settings[qualityLevel][moduleId] ??= {};
        this.settings[qualityLevel][moduleId][setting] = value;

        if (force && this.quality === qualityLevel) {
            if (!this._isRegisteredSetting(moduleId, setting)) return false;
            await game.settings.set(moduleId, setting, value);
        }
        return true;
    }

    removeSetting(qualityLevel = 1, moduleId = "", setting = "") {
        this._validateSetting(qualityLevel, moduleId, setting);
        delete this.settings[qualityLevel][moduleId][setting];
        return true;
    }
}

class PotatoOrNotApplication extends foundry.applications.api.HandlebarsApplicationMixin(
    foundry.applications.api.ApplicationV2
) {
    static DEFAULT_OPTIONS = {
        id: "potato-or-not",
        classes: ["potato-or-not"],
        window: {
            contentClasses: ["standard-form"],
            icon: "fa-solid fa-potato"
        },
        title: "PotatoOrNot.Title",
        tag: "form",
        form: {
            handler: PotatoOrNotApplication.myFormHandler,
            submitOnChange: false,
            closeOnSubmit: true
        }
    };

    static PARTS = {
        form: { template: "modules/potato-or-not/templates/potato-template.hbs" }
    };

    get title() {
        return game.i18n.localize("PotatoOrNot.Title");
    }

    static async myFormHandler(_event, form) {
        const level = form.querySelector(".potato-level-container[aria-checked='true']");
        if (!level) return;
        PotatoOrNot.quality = Number(level.dataset.level);
        await lib.setSetting(CONSTANTS.SETTING_KEYS.HAS_BEEN_PROMPTED, true);
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        for (const element of this.element.querySelectorAll(".potato-level-container")) {
            element.addEventListener("click", this._selectPotatoLevel.bind(this));
            element.addEventListener("keydown", this._onLevelKeydown.bind(this));
        }
        await game.settings.sheet?.close();
    }

    _selectPotatoLevel(event) {
        event.preventDefault();
        for (const element of this.element.querySelectorAll(".potato-level-container")) {
            element.setAttribute("aria-checked", "false");
        }
        event.currentTarget.setAttribute("aria-checked", "true");
    }

    _onLevelKeydown(event) {
        if (!["Enter", " "].includes(event.key)) return;
        this._selectPotatoLevel(event);
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        return { ...context, potatoQuality: PotatoOrNot.quality };
    }
}
