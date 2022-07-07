"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkClientRemoveNavigatorPlugin = void 0;
const tslib_1 = require("tslib");
const components_1 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
let SdkClientRemoveNavigatorPlugin = class SdkClientRemoveNavigatorPlugin extends components_1.RendererComponent {
    initialize() {
        this.navigationPlugin = this.owner.application.renderer.getComponent("navigation");
        this.listenTo(this.owner, {
            [events_1.RendererEvent.BEGIN]: this.onRenderedBegin,
        });
    }
    onRenderedBegin(event) {
        const navigationItem = this.navigationPlugin.navigation;
        if (!navigationItem) {
            return;
        }
        navigationItem.children = [];
    }
};
SdkClientRemoveNavigatorPlugin = tslib_1.__decorate([
    components_1.Component({ name: "SdkClientRemoveNavigator" })
], SdkClientRemoveNavigatorPlugin);
exports.SdkClientRemoveNavigatorPlugin = SdkClientRemoveNavigatorPlugin;
