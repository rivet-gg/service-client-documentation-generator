"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SdkClientRenameProjectPlugin = void 0;
var fs_1 = require("fs");
var components_1 = require("typedoc/dist/lib/output/components");
var events_1 = require("typedoc/dist/lib/output/events");
var utils_1 = require("./utils");
/**
 * Correct the package name in the navigator.
 */
var SdkClientRenameProjectPlugin = /** @class */ (function (_super) {
    __extends(SdkClientRenameProjectPlugin, _super);
    function SdkClientRenameProjectPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.projectName = undefined;
        return _this;
    }
    SdkClientRenameProjectPlugin.prototype.initialize = function () {
        var _a;
        this.listenTo(this.owner, (_a = {},
            _a[events_1.RendererEvent.BEGIN] = this.onRenderedBegin,
            _a));
    };
    SdkClientRenameProjectPlugin.prototype.onRenderedBegin = function (event) {
        var _a, _b, _c, _d, _e;
        if (!this.projectName) {
            var clientDirectory = (0, utils_1.getCurrentClientDirectory)(event);
            var metadataDir = (_b = (_a = clientDirectory.files.filter(function (sourceFile) {
                return sourceFile.fileName.endsWith("/package.json");
            })) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fullFileName;
            var name = (metadataDir ? JSON.parse((0, fs_1.readFileSync)(metadataDir).toString()) : {}).name;
            var serviceIdReflection = (_e = (_d = (_c = clientDirectory.directories.src.files) === null || _c === void 0 ? void 0 : _c.filter(function (sourceFile) { return sourceFile.fileName.endsWith("/runtimeConfig.shared.ts"); })) === null || _d === void 0 ? void 0 : _d[0].reflections.filter(function (reflection) { return reflection.name === "serviceId"; })) === null || _e === void 0 ? void 0 : _e[0];
            this.projectName = serviceIdReflection /* serviceIdReflection.defaultValue looks like '"S3"' */
                ? "".concat(serviceIdReflection.defaultValue.match(/"(.*)"/)[1], " Client - AWS SDK for JavaScript v3")
                : name;
        }
        event.project.name = this.projectName;
    };
    SdkClientRenameProjectPlugin = __decorate([
        (0, components_1.Component)({ name: "SdkClientRenameProject" })
    ], SdkClientRenameProjectPlugin);
    return SdkClientRenameProjectPlugin;
}(components_1.RendererComponent));
exports.SdkClientRenameProjectPlugin = SdkClientRenameProjectPlugin;
