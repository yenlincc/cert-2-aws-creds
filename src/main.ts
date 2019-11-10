import * as process from 'process'

import * as core from '@actions/core';

import {downloadAmazonCA} from './downloadCA';
import {extractValue} from './inputValidation';
import {getTempCreds} from './getTempCreds';

async function run() {
  try {
    // obtain all necessary inputs
    const certificate = core.getInput('certificate', {required: true});
    const private_key = core.getInput('private_key', {required: true});
    const iot_endpoint = core.getInput('iot_endpoint', {required: true});
    const role_alias = core.getInput('aws_iot_role_alias', {required: true});
    core.debug(`Using certificate: ${certificate}`);
    core.debug(`Using endpoint: ${iot_endpoint}`);
    core.debug(`Using role_alias: ${role_alias}`);

    let ca = await downloadAmazonCA();
    let tempCreds = await getTempCreds(
      iot_endpoint, role_alias, ca, certificate, private_key,
    );

    core.setOutput('aws_access_key_id', tempCreds.accessKeyId);
    core.setOutput('aws_secret_access_key', tempCreds.secretAccessKey);
    core.setOutput('aws_session_token', tempCreds.sessionToken);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
