export declare class APIInvoker {
    private loggerHelper;
    constructor(configuration: any);
    retrieveAccessTokenForexternal(configuration: any): string | PromiseLike<any>;
    /**
    * Method to retrieve search results for external.
    * @param requestPayload the request payload.
    * @returns the search results.
    */
    callAPI: (requestPayload: any) => Promise<any>;
    retrieveServiceAcountAccessTokenJson: (configuration: any) => Promise<any>;
    retrieveServiceAcountAccessToken(configuration: any): string | PromiseLike<any>;
}
//# sourceMappingURL=APIInvoker.d.ts.map