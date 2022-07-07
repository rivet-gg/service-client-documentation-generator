"use strict";
exports.__esModule = true;
var sdk_client_comment_update_1 = require("./sdk-client-comment-update");
var sdk_client_remove_navigator_1 = require("./sdk-client-remove-navigator");
var sdk_client_rename_project_1 = require("./sdk-client-rename-project");
var sdk_client_toc_plugin_1 = require("./sdk-client-toc-plugin");
module.exports = function load(pluginHost) {
    var application = pluginHost.owner;
    application.converter.addComponent("SdkClientCommentUpdatePlugin", new sdk_client_comment_update_1.SdkClientCommentUpdatePlugin(application.converter));
    application.renderer.addComponent("SdkClientTocPlugin", new sdk_client_toc_plugin_1.SdkClientTocPlugin(application.renderer));
    application.renderer.addComponent("SdkClientRenameProjectPlugin", new sdk_client_rename_project_1.SdkClientRenameProjectPlugin(application.renderer));
    application.renderer.addComponent("SdkClientRemoveNavigatorPlugin", new sdk_client_remove_navigator_1.SdkClientRemoveNavigatorPlugin(application.renderer));
};
