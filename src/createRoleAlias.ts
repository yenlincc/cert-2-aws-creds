import IoT from 'aws-sdk/clients/iot'

/** Conditionally creates the role alias based on the repository name,
 * which is in the format of user/repository.
 */
export function conditionallyCreateRoleAlias(client: IoT, repositoryName: string) {
    if (repositoryName) {   
        client.createRoleAlias({roleAlias:repositoryName}, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data);
                }
            }
        )
    } else {
        throw new Error('aliasName is not set'); 
    }
}