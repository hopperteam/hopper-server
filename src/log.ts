
enum LogLevel {
    INFO = "INFO ",
    WARN = "WARN ",
    ERROR = "ERROR",
}

export function setMonitoringLogger(func: (logLevel: number, module: string, message: string, timestamp: number) => void) {
    monitoringLogger = func;
}

let monitoringLogger: (logLevel: number, module: string, message: string, timestamp: number) => void = function() {};

function getTimestamp(): string {
    let date = new Date();
    let year: number = date.getUTCFullYear();
    let month: number = date.getUTCMonth() + 1;
    let day: number = date.getUTCDate();
    let hour: number = date.getUTCHours();
    let min: number = date.getUTCMinutes();
    let sec: number = date.getUTCSeconds();

    return `${year}/${(month < 10) ? '0' + month : month}/${(day < 10) ? '0' + day : day}|${(hour < 10) ? '0' + hour : hour}:${(min < 10) ? '0' + min : min}:${(sec < 10) ? '0' + sec : sec}UTC`;
}

function log(logLevel: LogLevel, levelNo: number, module: string, message: string) {
    monitoringLogger(levelNo, module.trim(), message, Date.now());
    let entry = `(${getTimestamp()}) [${logLevel}] ${module}: ${message}`;
    console.log(entry);
}

export default class Log {
    private module: string;
    private maxModuleLength: number = 20;

    constructor(module: string) {
        if (module.length <= this.maxModuleLength) {
            this.module = module + (" ".repeat(this.maxModuleLength - module.length));
        } else {
            this.module = module.substr(0, this.maxModuleLength);
        }
    }

    public info(message: string) {
        log(LogLevel.INFO, 0, this.module, message);
    }

    public warn(message: string) {
        log(LogLevel.WARN, 1, this.module, message);
    }

    public error(message: string) {
        log(LogLevel.ERROR, 2, this.module, message);
    }
}
