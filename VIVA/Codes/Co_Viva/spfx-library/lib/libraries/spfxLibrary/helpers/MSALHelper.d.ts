/**
 * MSAL Helper.
 */
export declare class MSALHelper {
    private loggerHelper;
    private myMSALObj;
    private userLoginName;
    private ssoRequest;
    constructor(configuration: any);
    retrieveAccessToken: (scopes?: any) => Promise<any>;
    private handleLoggedInUser;
    private loginForAccessTokenByMSAL;
}
//# sourceMappingURL=MSALHelper.d.ts.map