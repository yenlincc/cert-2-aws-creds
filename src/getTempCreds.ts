import * as https from 'https';

import * as core from '@actions/core';

export interface TemporaryCreds {
    /**
     * AWS access key ID
     */
    accessKeyId: string;

    /**
     * AWS secret access key
     */
    secretAccessKey: string;

    /**
     * AWS STS session token
     */
    sessionToken: string;
}

/** getTempCreds retrieves the temporary credentials.
 */
export function getTempCreds(
    endpoint: string, ca: string,
    certificate: string, privateKey: string): Promise<TemporaryCreds> {

    return new Promise<TemporaryCreds>((resolve, reject) => {
        let request = https.get(endpoint, {
            ca: ca,
            key: privateKey,
            cert: certificate,
        }, incomingMessage => {
            // Response object.
            let response = {
                statusCode: incomingMessage.statusCode,
                headers: incomingMessage.headers,
                body: '',
            };

            // Collect response body data.
            incomingMessage.on('data', chunk => {
                response.body + chunk;
            });

            // Resolve on end.
            incomingMessage.on('end', () => {
                if (response.body.length) {
                    try {
                        let res = JSON.parse(response.body);
                        resolve({
                            accessKeyId: res.credentials.accessKeyId,
                            secretAccessKey: res.credentials.secretAccessKey,
                            sessionToken: res.credentials.sessionToken,
                        });
                    } catch (error) {
                        core.error('failed to parse the response as JSON: ' + error.message);
                        reject(error);
                    }
                }
            });
        });

        request.on('error', error => {
            core.error('failed to retrieve temporary credentials: ' + error.message);
            reject(error);
        })
    });
}