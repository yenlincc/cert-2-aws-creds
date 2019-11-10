import * as process from 'process'

import * as core from '@actions/core';
import IoT from 'aws-sdk/clients/iot'

import {downloadAmazonCA} from './downloadCA';
import {extractValue} from './inputValidation';
import {getTempCreds} from './getTempCreds';

async function run() {
  try {
    // obtain all necessary inputs
    const certificate = core.getInput('certificate', {required: true});
    const private_key = core.getInput('private_key', {required: true});
    const iot_endpoint = core.getInput('iot_endpoint', {required: true});
    console.log(`Using certificate: ${certificate}`)
    console.log(`Using endpoint: ${iot_endpoint}`)

    let ca = await downloadAmazonCA();
    let tempCreds = await getTempCreds(
      iot_endpoint, ca, certificate, private_key,
    );

    core.setOutput('aws_access_key_id', tempCreds.accessKeyId);
    core.setOutput('aws_secret_access_key', tempCreds.secretAccessKey);
    core.setOutput('aws_session_token', tempCreds.sessionToken);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
