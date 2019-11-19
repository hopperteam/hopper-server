
enum LogLevel {
    INFO = "INFO ",
    WARN = "WARN ",
    ERROR = "ERROR"
}

function persist(entry: string) {
    // persist log entry in database or log files
}

function getTimestamp() {
    let date = new Date();
    let year: number = date.getUTCFullYear();
    let month: number = date.getUTCMonth() + 1;
    let day: number = date.getUTCDate();
    let hour: number = date.getUTCHours();
    let min: number = date.getUTCMinutes();
    let sec: number = date.getUTCSeconds();

    return `${year}/${(month < 10) ? '0' + month : month}/${(day < 10) ? '0' + day : day}|${(hour < 10) ? '0' + hour : hour}:${(min < 10) ? '0' + min : min}:${(sec < 10) ? '0' + sec : sec}UTC`;
}

function log(logLevel: LogLevel, module: string, message: string) {
    let entry = `(${getTimestamp()}) [${logLevel}] ${module}: ${message}`;
    persist(entry);
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
        log(LogLevel.INFO, this.module, message);
    }

    public warn(message: string) {
        log(LogLevel.WARN, this.module, message);
    }

    public error(message: string) {
        log(LogLevel.ERROR, this.module, message);
    }
}
