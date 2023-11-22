// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5qx1jtq7f0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-t3zorfb12s8wdhxw.us.auth0.com',            // Auth0 domain
  clientId: 'b7Si0rZsa0J5HER00t2XZuZKcFGd0u39',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
