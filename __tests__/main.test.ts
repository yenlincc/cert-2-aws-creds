import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

import * as core from '@actions/core';
import STS from 'aws-sdk/clients/sts';
import { AWSError } from 'aws-sdk/lib/error';

import {extractValue} from '../src/inputValidation';
import {downloadAmazonCA} from '../src/downloadCA';
import {getTempCreds} from '../src/getTempCreds';

test('extract defined value', async() => {
    let ok = 'ok';
    expect(extractValue(ok)).toBe(ok);
});

test('extract undefined value', async() => {
    var und;
    expect(() => {extractValue(und)}).toThrow(
        "failed to extract value because it's undefined");
});

test('download CA', async() => {
    const expectedCA = `-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----
`
    let actual = await downloadAmazonCA();
    expect(actual).toBe(expectedCA);
});

test('retrieve temporary credentials', async() => {
    const certificate = core.getInput('certificate', {required: true});
    const private_key = core.getInput('private_key', {required: true});
    const iot_endpoint = core.getInput('iot_endpoint', {required: true});
    const role_alias = core.getInput('aws_iot_role_alias', {required: true});
    const ca = await downloadAmazonCA();
    const tmpCreds = await getTempCreds(
        iot_endpoint, role_alias, ca, certificate, private_key,
    )
    expect(tmpCreds.accessKeyId).toBeTruthy();
    expect(tmpCreds.secretAccessKey).toBeTruthy();
    expect(tmpCreds.sessionToken).toBeTruthy();

    let sts = new STS({
        accessKeyId: tmpCreds.accessKeyId,
        secretAccessKey: tmpCreds.secretAccessKey,
        sessionToken: tmpCreds.sessionToken,
    })

    sts.getCallerIdentity((err: AWSError, data:STS.GetCallerIdentityResponse) => {
        expect(err).toBeFalsy();
    });
});