"use strict";
exports.__esModule = true;
exports.sortByFifo = void 0;
var enums_1 = require("@/enums");
exports.sortByFifo = function (processes) {
    var tempProcesses = processes.filter(function (process) { return process.hasArrived && process.state !== enums_1.ProcessState.Finished && process.isActive; });
    tempProcesses.sort(function (objA, objB) { return Number(objA.arrivalDate) - Number(objB.arrivalDate); });
    return tempProcesses;
};
