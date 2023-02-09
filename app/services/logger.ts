import { AzureSASCredential, TableClient } from '@azure/data-tables';

const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    transports: [],
});

// Console Transport
logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    )
}
));

logger.add(new winston.transports.File({ filename: 'events.log' }));

const AZURE_ACCOUNT = process.env.AZURE_ACCOUNT
const AZURE_SAS = process.env.AZURE_SAS
const AZURE_TABLENAME = process.env.AZURE_TABLENAME
let clientWithSAS: any

if (AZURE_SAS != undefined && AZURE_TABLENAME != undefined) {

    clientWithSAS = new TableClient(
        `https://${AZURE_ACCOUNT}.table.core.windows.net`,
        AZURE_TABLENAME,
        new AzureSASCredential(AZURE_SAS)
    );
}

export default function logInfo(message: string) {
    console.log(message)

    if (clientWithSAS != undefined) {
        clientWithSAS.createEntity({
            partitionKey: 'parititonkey',
            rowKey: `insert_${Date.now()}`,
            data: message
        })
    }
}

export function logError(message: string) {
    console.log(message)
    if (clientWithSAS != undefined) {
        clientWithSAS.createEntity({
            partitionKey: 'parititonkey',
            rowKey: `error_${Date.now()}`,
            data: message
        })
    }
}
