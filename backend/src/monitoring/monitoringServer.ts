import * as grpc from "grpc";
import {GrpcObject} from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import {LogMonitor} from "./logMonitor";
import Log from "../log";

const log: Log = new Log("MonitoringServer");

export class MonitoringServer {
    private protoDef: GrpcObject;

    constructor() {
        const packageDefinition = protoLoader.loadSync(
            __dirname + '/../dependencies/hopper-monitoring-protocol/protocol.proto',
            {keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });

        this.protoDef = grpc.loadPackageDefinition(packageDefinition);
    }

    startServer() {
        const logMonitor = new LogMonitor();

        const server = new grpc.Server();
        // @ts-ignore
        server.addService(this.protoDef.Monitoring.service, {
            StreamLogs: logMonitor.streamLogs.bind(logMonitor)
        });

        server.bind('0.0.0.0:32093', grpc.ServerCredentials.createInsecure());
        server.start();
        log.info("Monitoring Server running on :32093");
    }
}
