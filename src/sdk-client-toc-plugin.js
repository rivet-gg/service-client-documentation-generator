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
exports.SdkClientTocPlugin = void 0;
var path_1 = require("path");
var reflections_1 = require("typedoc/dist/lib/models/reflections");
var components_1 = require("typedoc/dist/lib/output/components");
var events_1 = require("typedoc/dist/lib/output/events");
var NavigationItem_1 = require("typedoc/dist/lib/output/models/NavigationItem");
var utils_1 = require("./utils");
/**
 * Group the ToC for easier observability.
 */
var SdkClientTocPlugin = /** @class */ (function (_super) {
    __extends(SdkClientTocPlugin, _super);
    function SdkClientTocPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientTocPlugin.prototype.initialize = function () {
        var _a;
        // disable existing toc plugin
        var tocPlugin = this.owner.application.renderer.getComponent("toc");
        this.owner.off(events_1.PageEvent.BEGIN, tocPlugin.onRendererBeginPage);
        this.listenTo(this.owner, (_a = {},
            _a[events_1.PageEvent.BEGIN] = this.onRendererBeginPage,
            _a));
    };
    /**
     * Generates a table of contents for a page.
     * @param page Contains project details and contextual data about the page being rendered.
     */
    SdkClientTocPlugin.prototype.onRendererBeginPage = function (page) {
        var model = page.model;
        if (!model.constructor.name.endsWith("Reflection")) {
            return;
        }
        var trail = [];
        while (model.constructor.name !== "ProjectReflection" && !model.kindOf(reflections_1.ReflectionKind.SomeModule)) {
            trail.unshift(model);
            model = model.parent;
        }
        var tocRestriction = this.owner.toc;
        page.toc = new NavigationItem_1.NavigationItem(model.name);
        if (!model.parent && !trail.length) {
            this.clientsNavigationItem = new NavigationItem_1.NavigationItem("Clients", void 0, page.toc);
            this.commandsNavigationItem = new NavigationItem_1.NavigationItem("Commands", void 0, page.toc);
            this.paginatorsNavigationItem = new NavigationItem_1.NavigationItem("Paginators", void 0, page.toc);
            this.waitersNavigationItem = new NavigationItem_1.NavigationItem("Waiters", void 0, page.toc);
        }
        this.buildToc(model, trail, page.toc, tocRestriction);
    };
    // Confirm declaration comes from the same folder as the client class
    SdkClientTocPlugin.prototype.belongsToClientPackage = function (model) {
        var _a, _b;
        return this.clientDir && ((_b = (_a = model.sources) === null || _a === void 0 ? void 0 : _a[0].file) === null || _b === void 0 ? void 0 : _b.fullFileName.indexOf(this.clientDir)) === 0;
    };
    SdkClientTocPlugin.prototype.isClient = function (model) {
        var _a = model.extendedTypes, extendedTypes = _a === void 0 ? [] : _a;
        return (model.kindOf(reflections_1.ReflectionKind.Class) &&
            model.getFullName() !== "Client" && // Exclude the Smithy Client class.
            (model.name.endsWith("Client") /* Modular client like S3Client */ ||
                extendedTypes.filter(function (reference) { return reference.name === "".concat(model.name, "Client"); }).length > 0) &&
            /* Filter out other client classes that not sourced from the same directory as current client. e.g. STS, SSO */
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isCommand = function (model) {
        return (model.kindOf(reflections_1.ReflectionKind.Class) &&
            model.name.endsWith("Command") &&
            // model.children?.some((child) => child.name === "resolveMiddleware") &&
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isPaginator = function (model) {
        return (model.name.startsWith("paginate") && model.kindOf(reflections_1.ReflectionKind.Function) && this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isInputOrOutput = function (model) {
        return (model.kindOf(reflections_1.ReflectionKind.Interface) &&
            (model.name.endsWith("CommandInput") || model.name.endsWith("CommandOutput")) &&
            this.belongsToClientPackage(model));
    };
    SdkClientTocPlugin.prototype.isWaiter = function (model) {
        return (model.name.startsWith("waitFor") && model.kindOf(reflections_1.ReflectionKind.Function) && this.belongsToClientPackage(model));
    };
    /**
     * Create a toc navigation item structure.
     *
     * @param model   The models whose children should be written to the toc.
     * @param trail   Defines the active trail of expanded toc entries.
     * @param parent  The parent [[NavigationItem]] the toc should be appended to.
     * @param restriction  The restricted table of contents.
     */
    SdkClientTocPlugin.prototype.buildToc = function (model, trail, parent, restriction) {
        var _this = this;
        var _a;
        var index = trail.indexOf(model);
        var children = model["children"] || [];
        if (!this.clientDir)
            this.clientDir = this.loadClientDir(model);
        if (index < trail.length - 1 && children.length > 40) {
            var child = trail[index + 1];
            var item = NavigationItem_1.NavigationItem.create(child, parent, true);
            item.isInPath = true;
            item.isCurrent = false;
            this.buildToc(child, trail, item);
        }
        else {
            children.forEach(function (child) {
                if (restriction && restriction.length > 0 && !restriction.includes(child.name)) {
                    return;
                }
                if (child.kindOf(reflections_1.ReflectionKind.SomeModule)) {
                    return;
                }
                if (_this.isClient(child)) {
                    NavigationItem_1.NavigationItem.create(child, _this.clientsNavigationItem, true);
                }
                else if (_this.isCommand(child)) {
                    NavigationItem_1.NavigationItem.create(child, _this.commandsNavigationItem, true);
                }
                else if (_this.isPaginator(child)) {
                    NavigationItem_1.NavigationItem.create(child, _this.paginatorsNavigationItem, true);
                }
                else if (_this.isInputOrOutput(child)) {
                    NavigationItem_1.NavigationItem.create(child, _this.commandsNavigationItem, true);
                }
                else if (_this.isWaiter(child)) {
                    NavigationItem_1.NavigationItem.create(child, _this.waitersNavigationItem, true);
                }
                else {
                    var item = NavigationItem_1.NavigationItem.create(child, parent, true);
                    if (trail.includes(child)) {
                        item.isInPath = true;
                        item.isCurrent = trail[trail.length - 1] === child;
                        _this.buildToc(child, trail, item);
                    }
                }
            });
            // Group commands and input/output interface of each command.
            (_a = this.commandsNavigationItem) === null || _a === void 0 ? void 0 : _a.children.sort(function (childA, childB) { return childA.title.localeCompare(childB.title); });
        }
    };
    SdkClientTocPlugin.prototype.loadClientDir = function (model) {
        var projectModel = model;
        while (projectModel.constructor.name !== "ProjectReflection" && !projectModel.kindOf(reflections_1.ReflectionKind.SomeModule)) {
            projectModel = projectModel.parent;
        }
        var clientsDirectory = (0, utils_1.getCurrentClientDirectory)({ project: projectModel });
        return (0, path_1.dirname)((0, path_1.dirname)(clientsDirectory === null || clientsDirectory === void 0 ? void 0 : clientsDirectory.directories.src.files.find(function (file) { return file.name.endsWith("Client.ts"); }).fullFileName));
    };
    SdkClientTocPlugin = __decorate([
        (0, components_1.Component)({ name: "SdkClientTocPlugin" })
    ], SdkClientTocPlugin);
    return SdkClientTocPlugin;
}(components_1.RendererComponent));
exports.SdkClientTocPlugin = SdkClientTocPlugin;
