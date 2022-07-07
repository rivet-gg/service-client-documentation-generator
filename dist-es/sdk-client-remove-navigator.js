import { __decorate, __extends } from "tslib";
import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { RendererEvent } from "typedoc/dist/lib/output/events";
var SdkClientRemoveNavigatorPlugin = (function (_super) {
    __extends(SdkClientRemoveNavigatorPlugin, _super);
    function SdkClientRemoveNavigatorPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientRemoveNavigatorPlugin.prototype.initialize = function () {
        var _a;
        this.navigationPlugin = this.owner.application.renderer.getComponent("navigation");
        this.listenTo(this.owner, (_a = {},
            _a[RendererEvent.BEGIN] = this.onRenderedBegin,
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
        Component({ name: "SdkClientRemoveNavigator" })
    ], SdkClientRemoveNavigatorPlugin);
    return SdkClientRemoveNavigatorPlugin;
}(RendererComponent));
export { SdkClientRemoveNavigatorPlugin };
