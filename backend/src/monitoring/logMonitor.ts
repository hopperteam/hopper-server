import {ServerWritableStream} from "grpc";
import {LogEntry} from "../../dependencies/hopper-monitoring-protocol/protocol_pb";
import {setMonitoringLogger} from "../log";

export class LogMonitor {
    streamLogs(call: ServerWritableStream<LogEntry>) {
        setMonitoringLogger(((logLevel, module, message, timestamp) => {
            call.write({
                Severity: logLevel,
                Component: module,
                Timestamp: timestamp,
                Message: message
            });
        }));
    }
}
