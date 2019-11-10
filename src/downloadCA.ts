import * as https from 'https';

import * as core from '@actions/core';

/** downloadAmazonCA retrieves the AmazonRootCA1.pem
 */
export function downloadAmazonCA(): Promise<string> {
    // https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times
    // https://stackoverflow.com/questions/27573365/how-to-use-typescript-with-native-es6-promises
    return new Promise<string>((resolve, reject) => {
        let request = https.get('https://www.amazontrust.com/repository/AmazonRootCA1.pem', incomingMessage => {
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
                resolve(response.body);
            });
        });

        request.on('error', error => {
            core.error('failed to download Amazon CA: ' + error.message);
            reject(error);
        })
    });
}