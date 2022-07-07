import { __decorate, __extends } from "tslib";
import { Converter } from "typedoc/dist/lib/converter";
import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components";
import { getRawComment, parseComment } from "typedoc/dist/lib/converter/factories/comment";
var SdkClientCommentUpdatePlugin = (function (_super) {
    __extends(SdkClientCommentUpdatePlugin, _super);
    function SdkClientCommentUpdatePlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SdkClientCommentUpdatePlugin.prototype.initialize = function () {
        var _a;
        this.listenTo(this.owner, (_a = {},
            _a[Converter.EVENT_CREATE_DECLARATION] = this.onDeclaration,
            _a));
    };
    SdkClientCommentUpdatePlugin.prototype.onDeclaration = function (context, reflection, node) {
        if (!node)
            return;
        var rawComment = getRawComment(node);
        if (!rawComment)
            return;
        var comment = parseComment(this.cleanEmptyCommentLines(rawComment));
        reflection.comment = comment;
    };
    SdkClientCommentUpdatePlugin.prototype.cleanEmptyCommentLines = function (comment) {
        return comment.startsWith("/*") && comment.endsWith("*/")
            ? comment
                .split("\n")
                .filter(function (line) { return line.slice(line.indexOf("*") + 1).trim().length !== 0; })
                .join("\n")
            : comment;
    };
    SdkClientCommentUpdatePlugin = __decorate([
        Component({ name: "SdkClientCommentUpdatePlugin" })
    ], SdkClientCommentUpdatePlugin);
    return SdkClientCommentUpdatePlugin;
}(ConverterComponent));
export { SdkClientCommentUpdatePlugin };
