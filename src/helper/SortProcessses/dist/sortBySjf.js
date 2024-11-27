"use strict";
exports.__esModule = true;
exports.sortBySjf = void 0;
var enums_1 = require("@/enums");
exports.sortBySjf = function (processes) {
    var tempProcesses = processes.filter(function (process) { return process.hasArrived && process.state !== enums_1.ProcessState.Finished && process.isActive; });
    tempProcesses.sort(function (objA, objB) { return Number(objA.runningTime) - Number(objB.runningTime); });
    return tempProcesses;
};
