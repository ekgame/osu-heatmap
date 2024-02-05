import { OsuApiClient } from "./OsuApiClient";

const client = new OsuApiClient(
    process.env.OSU_CLIENT_ID!!,
    process.env.OSU_CLIENT_SECRET!!,
);

export { client as api };