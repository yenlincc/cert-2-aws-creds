"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
const core = __importStar(require("@actions/core"));
/** downloadAmazonCA retrieves the AmazonRootCA1.pem
 */
function downloadAmazonCA() {
    // https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times
    // https://stackoverflow.com/questions/27573365/how-to-use-typescript-with-native-es6-promises
    return new Promise((resolve, reject) => {
        let request = https.get('https://www.amazontrust.com/repository/AmazonRootCA1.pem', incomingMessage => {
            // Response object.
            let response = {
                statusCode: incomingMessage.statusCode,
                headers: incomingMessage.headers,
                body: '',
            };
            // Collect response body data.
            incomingMessage.on('data', chunk => {
                response.body = response.body + chunk;
            });
            // Resolve on end.
            incomingMessage.on('end', () => {
                resolve(response.body);
            });
        });
        request.on('error', error => {
            core.error('failed to download Amazon CA: ' + error.message);
            reject(error);
        });
    });
}
exports.downloadAmazonCA = downloadAmazonCA;
