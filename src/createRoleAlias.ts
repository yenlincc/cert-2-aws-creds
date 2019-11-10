import * as core from '@actions/core';
import IoT from 'aws-sdk/clients/iot'

/** Conditionally creates the role alias based on the repository name,
 * which is in the format of user/repository.
 */
export function conditionallyCreateRoleAlias(
    client: IoT, repository: string, roleArn: string): Promise<string> {

    let re = /\//gi;
    // repository has the format: user/repoName
    let aliasName = repository.replace(re, "@");
    return new Promise<string>((resolve, reject) => {
        client.createRoleAlias(
            {
                roleAlias: aliasName,
                roleArn: roleArn
            }, function (err, data) {
                if (err) {
                    if (err.code == "ResourceAlreadyExistsException") {
                        core.debug("skip role alias creation since it already exists")
                        resolve('ok');
                    } else {
                        // an actual error occurred
                        reject(err);
                    }
                } else {
                    // a new role alias was created
                    core.debug("new role alias created: " + aliasName);
                    resolve('ok');
                }
            }
        )
    });
}