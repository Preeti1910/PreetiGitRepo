/**
 * Logger helper class.
 */
export declare class LoggerHelper {
    private appInsights;
    private applicationName;
    constructor(applicationName: string, appInsightsConnectionString: string);
    trackEvent: (eventName: any, objectToSave?: any) => void;
    trackException: (exception: any, objectToSave?: any) => void;
    trackTrace: (message: any, objectToSave?: any) => void;
}
//# sourceMappingURL=LoggerHelper.d.ts.map