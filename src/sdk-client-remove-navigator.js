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
exports.SdkClientRemoveNavigatorPlugin = void 0;
var components_1 = require("typedoc/dist/lib/output/components");
var events_1 = require("typedoc/dist/lib/output/events");
var SdkClientRemoveNavigatorPlugin = /** @class */ (function (_super) {
    __extends(SdkClientRemoveNavigatorPlugin, _super);
    function SdkClientRemoveNavigatorPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientRemoveNavigatorPlugin.prototype.initialize = function () {
        var _a;
        this.navigationPlugin = this.owner.application.renderer.getComponent("navigation");
        this.listenTo(this.owner, (_a = {},
            _a[events_1.RendererEvent.BEGIN] = this.onRenderedBegin,
            _a));
    };
    SdkClientRemoveNavigatorPlugin.prototype.onRenderedBegin = function (event) {
        var navigationItem = this.navigationPlugin.navigation;
        if (!navigationItem) {
            return;
        }
        navigationItem.children = [];
    };
    SdkClientRemoveNavigatorPlugin = __decorate([
        (0, components_1.Component)({ name: "SdkClientRemoveNavigator" })
    ], SdkClientRemoveNavigatorPlugin);
    return SdkClientRemoveNavigatorPlugin;
}(components_1.RendererComponent));
exports.SdkClientRemoveNavigatorPlugin = SdkClientRemoveNavigatorPlugin;
