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
/** getTempCreds retrieves the temporary credentials.
 */
function getTempCreds(endpoint, role_alias, ca, certificate, privateKey) {
    return new Promise((resolve, reject) => {
        let request = https.get('https://' + endpoint + '/role-aliases/' + role_alias + '/credentials', {
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
                response.body = response.body + chunk;
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
                    }
                    catch (error) {
                        core.error('failed to parse the response as JSON: ' + error.message);
                        reject(error);
                    }
                }
            });
        });
        request.on('error', error => {
            core.error('failed to retrieve temporary credentials: ' + error.message);
            reject(error);
        });
    });
}
exports.getTempCreds = getTempCreds;
