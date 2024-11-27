"use strict";
exports.__esModule = true;
exports.sortByPriority = void 0;
var enums_1 = require("@/enums");
exports.sortByPriority = function (processes) {
    var tempProcesses = processes.filter(function (process) { return process.hasArrived && process.state !== enums_1.ProcessState.Finished && process.isActive; });
    tempProcesses.sort(function (objA, objB) { return Number(objB.priority) - Number(objA.priority); });
    return tempProcesses;
};
