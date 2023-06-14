export interface weatherforecastdetails {
    date: string;
    summary: string;
    temperatureC: string;
    temperatureF: string;
}
export declare class AADServiceProvider {
    private wpcontext;
    private loggerHelper;
    constructor(aadServiceProviderObj: any);
    getResponse: (paramObj: any) => Promise<any>;
}
//# sourceMappingURL=AADServiceProvider.d.ts.map