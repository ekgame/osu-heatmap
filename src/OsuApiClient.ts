import { logger } from "~/src/Logger";

interface BearerToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class OsuApiClient {
    private baseUrl = 'https://osu.ppy.sh/api/v2';
    private oauthTokenUrl = 'https://osu.ppy.sh/oauth/token';
    private accessToken: string | null = null;

    constructor(
        private clientId: string,
        private clientSecret: string,
    ) {}

    private async generateAccessToken(): Promise<string> {
        logger.info('Generating new access token...');

        const response = await fetch(this.oauthTokenUrl, {
            method: 'POST',
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials',
                scope: 'public',
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!data.access_token) {
            logger.info('Failed to generate access token.', data);
            throw new Error('Failed to generate access token.');
        }

        return data.access_token as string;
    }

    private async getAccessToken(refresh: boolean = false): Promise<string> {
        if (!this.accessToken || refresh) {
            this.accessToken = await this.generateAccessToken();
        }

        return this.accessToken;
    }

    private async request<T>(
        method: string,
        url: string,
        retries: number = 0,
    ): Promise<T> {
        if (retries > 3) {
            logger.error(`Request "${url}" failed API after ${retries - 1} retries.`);
            throw new Error('Request failed.');
        }
        logger.info(`Sending ${method} request to "${url}"...`);

        const accessToken = await this.getAccessToken();
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        let responseJson = await response.json();
        if (responseJson.authentication === 'basic') {
            logger.warn('Access token expired, refreshing token and retrying request...');
            this.accessToken = null;
            return this.request<T>(method, url, retries + 1);
        }

        return responseJson;
    }

    async getBeatmapSet(beatmapSetId: string): Promise<any> {
        return await this.request('GET', `${this.baseUrl}/beatmapsets/${beatmapSetId}`);
    }
}