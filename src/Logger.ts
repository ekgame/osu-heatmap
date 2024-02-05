import pino from "pino";

const logger = pino({
    transport: {
        targets: [
            {
                level: 'info',
                target: 'pino-pretty',
                options: {}
            },
        ],
    },
});

export { logger };