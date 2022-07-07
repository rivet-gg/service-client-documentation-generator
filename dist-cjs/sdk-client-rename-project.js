"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkClientRenameProjectPlugin = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const components_1 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const utils_1 = require("./utils");
let SdkClientRenameProjectPlugin = class SdkClientRenameProjectPlugin extends components_1.RendererComponent {
    constructor() {
        super(...arguments);
        this.projectName = undefined;
    }
    initialize() {
        this.listenTo(this.owner, {
            [events_1.RendererEvent.BEGIN]: this.onRenderedBegin,
        });
    }
    onRenderedBegin(event) {
        var _a, _b, _c, _d, _e;
        if (!this.projectName) {
            const clientDirectory = utils_1.getCurrentClientDirectory(event);
            const metadataDir = (_b = (_a = clientDirectory.files.filter((sourceFile) => sourceFile.fileName.endsWith("/package.json"))) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fullFileName;
            const { name } = metadataDir ? JSON.parse(fs_1.readFileSync(metadataDir).toString()) : undefined;
            const serviceIdReflection = (_e = (_d = (_c = clientDirectory.directories.src.files) === null || _c === void 0 ? void 0 : _c.filter((sourceFile) => sourceFile.fileName.endsWith("/runtimeConfig.shared.ts"))) === null || _d === void 0 ? void 0 : _d[0].reflections.filter((reflection) => reflection.name === "serviceId")) === null || _e === void 0 ? void 0 : _e[0];
            this.projectName = serviceIdReflection
                ? `${serviceIdReflection.defaultValue.match(/"(.*)"/)[1]} Client - AWS SDK for JavaScript v3`
                : name;
        }
        event.project.name = this.projectName;
    }
};
SdkClientRenameProjectPlugin = tslib_1.__decorate([
    components_1.Component({ name: "SdkClientRenameProject" })
], SdkClientRenameProjectPlugin);
exports.SdkClientRenameProjectPlugin = SdkClientRenameProjectPlugin;
