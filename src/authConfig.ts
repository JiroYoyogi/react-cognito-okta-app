export const cognitoDomain= "";
export const oktaDomain = "";
export const appDomain = "";

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
