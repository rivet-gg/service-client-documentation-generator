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
exports.SdkClientCommentUpdatePlugin = void 0;
var converter_1 = require("typedoc/dist/lib/converter");
var components_1 = require("typedoc/dist/lib/converter/components");
var comment_1 = require("typedoc/dist/lib/converter/factories/comment");
/**
 * Best effort make the service docs markdown looks better.
 */
var SdkClientCommentUpdatePlugin = /** @class */ (function (_super) {
    __extends(SdkClientCommentUpdatePlugin, _super);
    function SdkClientCommentUpdatePlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientCommentUpdatePlugin.prototype.initialize = function () {
        var _a;
        this.listenTo(this.owner, (_a = {},
            _a[converter_1.Converter.EVENT_CREATE_DECLARATION] = this.onDeclaration,
            _a));
    };
    SdkClientCommentUpdatePlugin.prototype.onDeclaration = function (context, reflection, node) {
        if (!node)
            return;
        var rawComment = (0, comment_1.getRawComment)(node);
        if (!rawComment)
            return;
        var comment = (0, comment_1.parseComment)(this.cleanEmptyCommentLines(rawComment));
        reflection.comment = comment;
    };
    /**
     * Update documentation block to exclude empty lines.
     */
    SdkClientCommentUpdatePlugin.prototype.cleanEmptyCommentLines = function (comment) {
        return comment.startsWith("/*") && comment.endsWith("*/")
            ? comment
                .split("\n")
                .filter(function (line) { return line.slice(line.indexOf("*") + 1).trim().length !== 0; })
                .join("\n")
            : comment;
    };
    SdkClientCommentUpdatePlugin = __decorate([
        (0, components_1.Component)({ name: "SdkClientCommentUpdatePlugin" })
    ], SdkClientCommentUpdatePlugin);
    return SdkClientCommentUpdatePlugin;
}(components_1.ConverterComponent));
exports.SdkClientCommentUpdatePlugin = SdkClientCommentUpdatePlugin;
