import { __decorate, __extends } from "tslib";
import { dirname } from "path";
import { ReflectionKind, } from "typedoc/dist/lib/models/reflections";
import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { PageEvent } from "typedoc/dist/lib/output/events";
import { NavigationItem } from "typedoc/dist/lib/output/models/NavigationItem";
import { getCurrentClientDirectory } from "./utils";
var SdkClientTocPlugin = (function (_super) {
    __extends(SdkClientTocPlugin, _super);
    function SdkClientTocPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientTocPlugin.prototype.initialize = function () {
        var _a;
        var tocPlugin = this.owner.application.renderer.getComponent("toc");
        this.owner.off(PageEvent.BEGIN, tocPlugin.onRendererBeginPage);
        this.listenTo(this.owner, (_a = {},
            _a[PageEvent.BEGIN] = this.onRendererBeginPage,
            _a));
    };
    SdkClientTocPlugin.prototype.onRendererBeginPage = function (page) {
        var model = page.model;
        if (!model.constructor.name.endsWith("Reflection")) {
            return;
        }
        var trail = [];
        while (model.constructor.name !== "ProjectReflection" && !model.kindOf(ReflectionKind.SomeModule)) {
            trail.unshift(model);
            model = model.parent;
        }
        var tocRestriction = this.owner.toc;
        page.toc = new NavigationItem(model.name);
        if (!model.parent && !trail.length) {
            this.clientsNavigationItem = new NavigationItem("Clients", void 0, page.toc);
            this.commandsNavigationItem = new NavigationItem("Commands", void 0, page.toc);
            this.paginatorsNavigationItem = new NavigationItem("Paginators", void 0, page.toc);
            this.waitersNavigationItem = new NavigationItem("Waiters", void 0, page.toc);
        }
        this.buildToc(model, trail, page.toc, tocRestriction);
    };
    SdkClientTocPlugin.prototype.belongsToClientPackage = function (model) {
        var _a, _b;
        return this.clientDir && ((_b = (_a = model.sources) === null || _a === void 0 ? void 0 : _a[0].file) === null || _b === void 0 ? void 0 : _b.fullFileName.indexOf(this.clientDir)) === 0;
    };
    SdkClientTocPlugin.prototype.isClient = function (model) {
        var _a = model.extendedTypes, extendedTypes = _a === void 0 ? [] : _a;
        return (model.kindOf(ReflectionKind.Class) &&
            model.getFullName() !== "Client" &&
            (model.name.endsWith("Client") ||
                extendedTypes.filter(function (reference) { return reference.name === model.name + "Client"; }).length > 0) &&
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isCommand = function (model) {
        return (model.kindOf(ReflectionKind.Class) &&
            model.name.endsWith("Command") &&
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isPaginator = function (model) {
        return (model.name.startsWith("paginate") && model.kindOf(ReflectionKind.Function) && this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isInputOrOutput = function (model) {
        return (model.kindOf(ReflectionKind.Interface) &&
            (model.name.endsWith("CommandInput") || model.name.endsWith("CommandOutput")) &&
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isWaiter = function (model) {
        return (model.name.startsWith("waitFor") && model.kindOf(ReflectionKind.Function) && this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.buildToc = function (model, trail, parent, restriction) {
        var _this = this;
        var _a;
        var index = trail.indexOf(model);
        var children = model["children"] || [];
        if (!this.clientDir)
            this.clientDir = this.loadClientDir(model);
        if (index < trail.length - 1 && children.length > 40) {
            var child = trail[index + 1];
            var item = NavigationItem.create(child, parent, true);
            item.isInPath = true;
            item.isCurrent = false;
            this.buildToc(child, trail, item);
        }
        else {
            children.forEach(function (child) {
                if (restriction && restriction.length > 0 && !restriction.includes(child.name)) {
                    return;
                }
                if (child.kindOf(ReflectionKind.SomeModule)) {
                    return;
                }
                if (_this.isClient(child)) {
                    NavigationItem.create(child, _this.clientsNavigationItem, true);
                }
                else if (_this.isCommand(child)) {
                    NavigationItem.create(child, _this.commandsNavigationItem, true);
                }
                else if (_this.isPaginator(child)) {
                    NavigationItem.create(child, _this.paginatorsNavigationItem, true);
                }
                else if (_this.isInputOrOutput(child)) {
                    NavigationItem.create(child, _this.commandsNavigationItem, true);
                }
                else if (_this.isWaiter(child)) {
                    NavigationItem.create(child, _this.waitersNavigationItem, true);
                }
                else {
                    var item = NavigationItem.create(child, parent, true);
                    if (trail.includes(child)) {
                        item.isInPath = true;
                        item.isCurrent = trail[trail.length - 1] === child;
                        _this.buildToc(child, trail, item);
                    }
                }
            });
            (_a = this.commandsNavigationItem) === null || _a === void 0 ? void 0 : _a.children.sort(function (childA, childB) { return childA.title.localeCompare(childB.title); });
        }
    };
    SdkClientTocPlugin.prototype.loadClientDir = function (model) {
        var projectModel = model;
        while (projectModel.constructor.name !== "ProjectReflection" && !projectModel.kindOf(ReflectionKind.SomeModule)) {
            projectModel = projectModel.parent;
        }
        var clientsDirectory = getCurrentClientDirectory({ project: projectModel });
        return dirname(dirname(clientsDirectory === null || clientsDirectory === void 0 ? void 0 : clientsDirectory.directories.src.files.find(function (file) { return file.name.endsWith("Client.ts"); }).fullFileName));
    };
    SdkClientTocPlugin = __decorate([
        Component({ name: "SdkClientTocPlugin" })
    ], SdkClientTocPlugin);
    return SdkClientTocPlugin;
}(RendererComponent));
export { SdkClientTocPlugin };
