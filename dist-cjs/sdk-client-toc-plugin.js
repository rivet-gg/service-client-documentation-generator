"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkClientTocPlugin = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const reflections_1 = require("typedoc/dist/lib/models/reflections");
const components_1 = require("typedoc/dist/lib/output/components");
const events_1 = require("typedoc/dist/lib/output/events");
const NavigationItem_1 = require("typedoc/dist/lib/output/models/NavigationItem");
const utils_1 = require("./utils");
let SdkClientTocPlugin = class SdkClientTocPlugin extends components_1.RendererComponent {
    initialize() {
        const tocPlugin = this.owner.application.renderer.getComponent("toc");
        this.owner.off(events_1.PageEvent.BEGIN, tocPlugin.onRendererBeginPage);
        this.listenTo(this.owner, {
            [events_1.PageEvent.BEGIN]: this.onRendererBeginPage,
        });
    }
    onRendererBeginPage(page) {
        let model = page.model;
        if (!model.constructor.name.endsWith("Reflection")) {
            return;
        }
        const trail = [];
        while (model.constructor.name !== "ProjectReflection" && !model.kindOf(reflections_1.ReflectionKind.SomeModule)) {
            trail.unshift(model);
            model = model.parent;
        }
        const tocRestriction = this.owner.toc;
        page.toc = new NavigationItem_1.NavigationItem(model.name);
        if (!model.parent && !trail.length) {
            this.clientsNavigationItem = new NavigationItem_1.NavigationItem("Clients", void 0, page.toc);
            this.commandsNavigationItem = new NavigationItem_1.NavigationItem("Commands", void 0, page.toc);
            this.paginatorsNavigationItem = new NavigationItem_1.NavigationItem("Paginators", void 0, page.toc);
            this.waitersNavigationItem = new NavigationItem_1.NavigationItem("Waiters", void 0, page.toc);
        }
        this.buildToc(model, trail, page.toc, tocRestriction);
    }
    belongsToClientPackage(model) {
        var _a, _b;
        return this.clientDir && ((_b = (_a = model.sources) === null || _a === void 0 ? void 0 : _a[0].file) === null || _b === void 0 ? void 0 : _b.fullFileName.indexOf(this.clientDir)) === 0;
    }
    isClient(model) {
        const { extendedTypes = [] } = model;
        return (model.kindOf(reflections_1.ReflectionKind.Class) &&
            model.getFullName() !== "Client" &&
            (model.name.endsWith("Client") ||
                extendedTypes.filter((reference) => reference.name === `${model.name}Client`).length > 0) &&
            this.belongsToClientPackage(model));
    }
    isCommand(model) {
        return (model.kindOf(reflections_1.ReflectionKind.Class) &&
            model.name.endsWith("Command") &&
            this.belongsToClientPackage(model));
    }
    isPaginator(model) {
        return (model.name.startsWith("paginate") && model.kindOf(reflections_1.ReflectionKind.Function) && this.belongsToClientPackage(model));
    }
    isInputOrOutput(model) {
        return (model.kindOf(reflections_1.ReflectionKind.Interface) &&
            (model.name.endsWith("CommandInput") || model.name.endsWith("CommandOutput")) &&
            this.belongsToClientPackage(model));
    }
    isWaiter(model) {
        return (model.name.startsWith("waitFor") && model.kindOf(reflections_1.ReflectionKind.Function) && this.belongsToClientPackage(model));
    }
    buildToc(model, trail, parent, restriction) {
        var _a;
        const index = trail.indexOf(model);
        const children = model["children"] || [];
        if (!this.clientDir)
            this.clientDir = this.loadClientDir(model);
        if (index < trail.length - 1 && children.length > 40) {
            const child = trail[index + 1];
            const item = NavigationItem_1.NavigationItem.create(child, parent, true);
            item.isInPath = true;
            item.isCurrent = false;
            this.buildToc(child, trail, item);
        }
        else {
            children.forEach((child) => {
                if (restriction && restriction.length > 0 && !restriction.includes(child.name)) {
                    return;
                }
                if (child.kindOf(reflections_1.ReflectionKind.SomeModule)) {
                    return;
                }
                if (this.isClient(child)) {
                    NavigationItem_1.NavigationItem.create(child, this.clientsNavigationItem, true);
                }
                else if (this.isCommand(child)) {
                    NavigationItem_1.NavigationItem.create(child, this.commandsNavigationItem, true);
                }
                else if (this.isPaginator(child)) {
                    NavigationItem_1.NavigationItem.create(child, this.paginatorsNavigationItem, true);
                }
                else if (this.isInputOrOutput(child)) {
                    NavigationItem_1.NavigationItem.create(child, this.commandsNavigationItem, true);
                }
                else if (this.isWaiter(child)) {
                    NavigationItem_1.NavigationItem.create(child, this.waitersNavigationItem, true);
                }
                else {
                    const item = NavigationItem_1.NavigationItem.create(child, parent, true);
                    if (trail.includes(child)) {
                        item.isInPath = true;
                        item.isCurrent = trail[trail.length - 1] === child;
                        this.buildToc(child, trail, item);
                    }
                }
            });
            (_a = this.commandsNavigationItem) === null || _a === void 0 ? void 0 : _a.children.sort((childA, childB) => childA.title.localeCompare(childB.title));
        }
    }
    loadClientDir(model) {
        let projectModel = model;
        while (projectModel.constructor.name !== "ProjectReflection" && !projectModel.kindOf(reflections_1.ReflectionKind.SomeModule)) {
            projectModel = projectModel.parent;
        }
        const clientsDirectory = (0, utils_1.getCurrentClientDirectory)({ project: projectModel });
        return (0, path_1.dirname)((0, path_1.dirname)(clientsDirectory === null || clientsDirectory === void 0 ? void 0 : clientsDirectory.directories.src.files.find((file) => file.name.endsWith("Client.ts")).fullFileName));
    }
};
SdkClientTocPlugin = tslib_1.__decorate([
    (0, components_1.Component)({ name: "SdkClientTocPlugin" })
], SdkClientTocPlugin);
exports.SdkClientTocPlugin = SdkClientTocPlugin;
