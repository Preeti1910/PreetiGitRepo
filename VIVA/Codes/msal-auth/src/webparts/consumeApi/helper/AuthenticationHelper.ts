import { AccountInfo, InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { Constants } from "./Constants";


/**
 * Authentication Helper.
 */
export class AuthenticationHelper {



    private myMSALObj: PublicClientApplication;
    private userLoginName: string;
    private ssoRequest: any;


    constructor(configuration: any) {
        try {

            this.userLoginName = configuration.loginName;
            const msalConfig = {
                auth: {
                    authority: Constants.AutorityUrl.replace(Constants.TenantIdPlaceHolder, configuration.tenantId),
                    clientId: configuration.clientId,
                    redirectUri: configuration.redirectUrl
                },
                cache: {
                    cacheLocation: "localStorage", // set your cache location to local storage
                }
            };

            this.ssoRequest = {
                scopes: configuration.scope,
                loginHint: this.userLoginName,
                account: null
            };

            console.log('Initializing MSAL object');
            this.myMSALObj = new PublicClientApplication(msalConfig);
            console.log('Initialized MSAL object');
        } catch (ex) {
            console.log(ex);
        }
    }

    public retrieveAccessToken = async (scopes?: any): Promise<any> => {
        console.log('retrieveAccessToken() has been invoked.');

        if (scopes && scopes.length > 0) {
            this.ssoRequest.scopes = scopes;
        }

        const accounts = this.myMSALObj.getAllAccounts();
        if (accounts !== null && accounts.length > 0) {
            return this.handleLoggedInUser(accounts);
        }
        else {
            return this.loginForAccessTokenByMSAL()
                .then((token) => {
                    console.log('Retrieved the graph token successfully.');
                    console.log(token);
                    return token;
                }).catch(error => {
                    console.log(error, { message: 'Error occured in the retrieving graph token.' });
                    return 'error'
                });;
        }
    }

  

    private handleLoggedInUser = async (currentAccounts: AccountInfo[]): Promise<any> => {
        let accountObj = null;
        if (currentAccounts === null) {
            return 'No user signed in';
        } else if (currentAccounts.length > 1) {
            // More than one user is authenticated, get current one 
            accountObj = this.myMSALObj.getAccountByUsername(this.userLoginName);
        } else {
            accountObj = currentAccounts[0];
        }

        if (accountObj !== null) {
            this.ssoRequest.account = accountObj;
            return this.myMSALObj.acquireTokenSilent(this.ssoRequest)
                .then((accessToken) => {
                    return accessToken.accessToken;
                });
        }
    }

    private loginForAccessTokenByMSAL = async (): Promise<string> => {
        return this.myMSALObj.ssoSilent(this.ssoRequest).then((response) => {
            return response.accessToken;
        }).catch((error) => {
            if (error instanceof InteractionRequiredAuthError) {
                return this.myMSALObj.loginPopup(this.ssoRequest)
                    .then((response) => {
                        return response.accessToken;
                    })
                    .catch(error => {
                        return error
                    });
            } else {
                return null;
            }
        });
    }
}
