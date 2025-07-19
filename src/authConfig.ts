// e.g. https://ap-northeast-1ga5zacsn4.auth.ap-northeast-1.amazoncognito.com
export const cognitoDomain= "";
// e.g. ap-northeast-1_Ga5ZacSN4
const cognitoUserPoolId = "";
// e.g. 2hoqf7stavskccjltmtpm93hsq
export const cognitoClientId = "";
// e.g. "https://trial-12345.okta.com"
export const oktaDomain = "";

export const appDomain = "http://localhost:5173";

export const cognitoConfig = {
  authority: `https://cognito-idp.ap-northeast-1.amazonaws.com/${cognitoUserPoolId}`,
  client_id: cognitoClientId,
  redirect_uri: `${appDomain}/`,
  response_type: "code",
  scope: "email openid phone",
};
