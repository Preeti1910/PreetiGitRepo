import { SPHttpClient } from '@microsoft/sp-http';
export declare class ServiceProvider {
    private sphttpclientObj;
    constructor(spHttpClient: SPHttpClient);
    getTotals: (url: string) => Promise<any>;
}
//# sourceMappingURL=ServiceProvider.d.ts.map