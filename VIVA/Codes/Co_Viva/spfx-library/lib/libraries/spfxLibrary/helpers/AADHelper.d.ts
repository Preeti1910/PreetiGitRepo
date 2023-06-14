import { WebPartContext } from '@microsoft/sp-webpart-base';
export declare class AADHelper {
    private wpcontext;
    constructor(context: WebPartContext);
    getResponse: (url: string, aadAplicationResource: string) => Promise<any>;
}
//# sourceMappingURL=AADHelper.d.ts.map