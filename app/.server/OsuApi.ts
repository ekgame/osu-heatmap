import { OsuApiClient } from "./OsuApiClient";

let client: OsuApiClient|null = null;

function getClient(): OsuApiClient {
    if (!client) {
        if (!process.env.OSU_CLIENT_ID || !process.env.OSU_CLIENT_SECRET) {
            throw new Error('OSU_CLIENT_ID and OSU_CLIENT_SECRET environment variables are not set.');
        }
        client = new OsuApiClient(
            process.env.OSU_CLIENT_ID,
            process.env.OSU_CLIENT_SECRET,
        );
    }
    return client;
}

export { getClient as api };
