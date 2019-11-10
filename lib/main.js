"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const downloadCA_1 = require("./downloadCA");
const getTempCreds_1 = require("./getTempCreds");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // obtain all necessary inputs
            const certificate = core.getInput('certificate', { required: true });
            const private_key = core.getInput('private_key', { required: true });
            const iot_endpoint = core.getInput('iot_endpoint', { required: true });
            const role_alias = core.getInput('aws_iot_role_alias', { required: true });
            core.debug(`Using certificate: ${certificate}`);
            core.debug(`Using endpoint: ${iot_endpoint}`);
            core.debug(`Using role_alias: ${role_alias}`);
            let ca = yield downloadCA_1.downloadAmazonCA();
            let tempCreds = yield getTempCreds_1.getTempCreds(iot_endpoint, role_alias, ca, certificate, private_key);
            core.setOutput('aws_access_key_id', tempCreds.accessKeyId);
            core.setOutput('aws_secret_access_key', tempCreds.secretAccessKey);
            core.setOutput('aws_session_token', tempCreds.sessionToken);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
