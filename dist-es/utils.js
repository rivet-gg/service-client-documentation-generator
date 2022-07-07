export var getCurrentClientDirectory = function (event) {
    var clientsDirectory = event.project.directory.directories["clients"].directories;
    return Object.values(clientsDirectory).filter(function (directory) { var _a; return (_a = directory === null || directory === void 0 ? void 0 : directory.directories) === null || _a === void 0 ? void 0 : _a.src; })[0];
};
