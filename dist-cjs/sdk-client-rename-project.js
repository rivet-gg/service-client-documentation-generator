import { __decorate, __extends } from "tslib";
import { readFileSync } from "fs";
import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { RendererEvent } from "typedoc/dist/lib/output/events";
import { getCurrentClientDirectory } from "./utils";
var SdkClientRenameProjectPlugin = (function (_super) {
    __extends(SdkClientRenameProjectPlugin, _super);
    function SdkClientRenameProjectPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.projectName = undefined;
        return _this;
    }
    SdkClientRenameProjectPlugin.prototype.initialize = function () {
        var _a;
        this.listenTo(this.owner, (_a = {},
            _a[RendererEvent.BEGIN] = this.onRenderedBegin,
            _a));
    };
    SdkClientRenameProjectPlugin.prototype.onRenderedBegin = function (event) {
        var _a, _b, _c, _d, _e;
        if (!this.projectName) {
            var clientDirectory = getCurrentClientDirectory(event);
            var metadataDir = (_b = (_a = clientDirectory.files.filter(function (sourceFile) {
                return sourceFile.fileName.endsWith("/package.json");
            })) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fullFileName;
            var name_1 = (metadataDir ? JSON.parse(readFileSync(metadataDir).toString()) : undefined).name;
            var serviceIdReflection = (_e = (_d = (_c = clientDirectory.directories.src.files) === null || _c === void 0 ? void 0 : _c.filter(function (sourceFile) { return sourceFile.fileName.endsWith("/runtimeConfig.shared.ts"); })) === null || _d === void 0 ? void 0 : _d[0].reflections.filter(function (reflection) { return reflection.name === "serviceId"; })) === null || _e === void 0 ? void 0 : _e[0];
            this.projectName = serviceIdReflection
                ? "".concat(serviceIdReflection.defaultValue.match(/"(.*)"/)[1], " Client - AWS SDK for JavaScript v3")
                : name_1;
        }
        event.project.name = this.projectName;
    };
    SdkClientRenameProjectPlugin = __decorate([
        Component({ name: "SdkClientRenameProject" })
    ], SdkClientRenameProjectPlugin);
    return SdkClientRenameProjectPlugin;
}(RendererComponent));
export { SdkClientRenameProjectPlugin };
