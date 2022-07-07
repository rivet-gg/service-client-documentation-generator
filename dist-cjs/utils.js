"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentClientDirectory = void 0;
const getCurrentClientDirectory = (event) => {
    const clientsDirectory = event.project.directory.directories["clients"].directories;
    return Object.values(clientsDirectory).filter((directory) => { var _a; return (_a = directory === null || directory === void 0 ? void 0 : directory.directories) === null || _a === void 0 ? void 0 : _a.src; })[0];
};
exports.getCurrentClientDirectory = getCurrentClientDirectory;
