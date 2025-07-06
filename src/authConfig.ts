// https://ap-northeast-1abcd.auth.ap-northeast-1.amazoncognito.com
export const cognitoDomain= "";
// https://trial-12345.okta.com
export const oktaDomain = "";
export const appDomain = "http://localhost:5173";

export const cognitoLogoutUri = `${appDomain}/callback-logout/`;
export const cognitoClientId = "";
const cognitoUserPoolId = "";

export const cognitoConfig = {
  authority: `https://cognito-idp.ap-northeast-1.amazonaws.com/${cognitoUserPoolId}`,
  client_id: cognitoClientId,
  redirect_uri: `${appDomain}/callback-login/`,
  response_type: "code",
  scope: "email openid phone",
};
