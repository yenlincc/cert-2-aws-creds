import * as process from 'process'

import * as core from '@actions/core';
import IoT from 'aws-sdk/clients/iot'

import {conditionallyCreateRoleAlias} from './createRoleAlias'
import {downloadAmazonCA} from './downloadCA';
import {extractValue} from './inputValidation';
import {getTempCreds} from './getTempCreds';

async function run() {
  try {
    // obtain all necessary inputs
    const certificate = core.getInput('certificate', {required: true});
    const private_key = core.getInput('private_key', {required: true});
    const role_arn = core.getInput('aws_role_arn', {required: true});
    const iot_endpoint = core.getInput('iot_endpoint', {required: true});
    const aws_region = core.getInput('aws_region');
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables#default-environment-variables
    const repository = extractValue(process.env['GITHUB_REPOSITORY']);
    console.log(`Using certificate: ${certificate}`)
    console.log(`Using role ARN: ${role_arn}`)

    let iot = new IoT({
      region: aws_region,
    })

    await conditionallyCreateRoleAlias(iot, repository, role_arn);
    let ca = await downloadAmazonCA();
    let tempCreds = await getTempCreds(
      iot_endpoint, ca, certificate, private_key,
    );

    core.setOutput('aws_access_key_id', tempCreds.accessKeyId);
    core.setOutput('aws_secret_access_key', tempCreds.secretAccessKey);
    core.setOutput('aws_session_token', tempCreds.sessionToken);
    core.setOutput('aws_region', aws_region);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
