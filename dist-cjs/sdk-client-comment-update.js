"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkClientCommentUpdatePlugin = void 0;
const tslib_1 = require("tslib");
const converter_1 = require("typedoc/dist/lib/converter");
const components_1 = require("typedoc/dist/lib/converter/components");
const comment_1 = require("typedoc/dist/lib/converter/factories/comment");
let SdkClientCommentUpdatePlugin = class SdkClientCommentUpdatePlugin extends components_1.ConverterComponent {
    initialize() {
        this.listenTo(this.owner, {
            [converter_1.Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
        });
    }
    onDeclaration(context, reflection, node) {
        if (!node)
            return;
        const rawComment = (0, comment_1.getRawComment)(node);
        if (!rawComment)
            return;
        const comment = (0, comment_1.parseComment)(this.cleanEmptyCommentLines(rawComment));
        reflection.comment = comment;
    }
    cleanEmptyCommentLines(comment) {
        return comment.startsWith("/*") && comment.endsWith("*/")
            ? comment
                .split("\n")
                .filter((line) => line.slice(line.indexOf("*") + 1).trim().length !== 0)
                .join("\n")
            : comment;
    }
};
SdkClientCommentUpdatePlugin = tslib_1.__decorate([
    (0, components_1.Component)({ name: "SdkClientCommentUpdatePlugin" })
], SdkClientCommentUpdatePlugin);
exports.SdkClientCommentUpdatePlugin = SdkClientCommentUpdatePlugin;
