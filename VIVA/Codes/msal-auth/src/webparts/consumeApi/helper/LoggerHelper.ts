import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { Constants } from './Constants';
/**
 * Logger helper class.
 */
export class LoggerHelper {

    private appInsights: ApplicationInsights;
    private applicationName: string;

    constructor(applicationName: string, appInsightsConnectionString: string) {
        this.applicationName = applicationName;
        var reactPlugin = new ReactPlugin();
        if (appInsightsConnectionString) {
            this.appInsights = new ApplicationInsights({
                config: {
                    connectionString: appInsightsConnectionString,
                    enableAutoRouteTracking: true,
                    extensions: [reactPlugin]
                }
            });

            this.appInsights.loadAppInsights();
        }
    }

    public trackEvent = (eventName:any, objectToSave?:any) => {
        if (this.appInsights) {
            objectToSave = objectToSave ? objectToSave : {};
            objectToSave['ApplicationName'] = this.applicationName ? this.applicationName : Constants.ApplicationName;
            this.appInsights.trackEvent({ name: eventName }, objectToSave);
        }
    }

    public trackException = (exception:any, objectToSave?:any) => {
        if (this.appInsights) {
            objectToSave = objectToSave ? objectToSave : {};
            objectToSave['ApplicationName'] = this.applicationName ? this.applicationName : Constants.ApplicationName;
            this.appInsights.trackException({ exception: exception }, objectToSave);
        }
    }

    public trackTrace = (message:any, objectToSave?:any) => {
        if (this.appInsights) {
            objectToSave = objectToSave ? objectToSave : {};
            objectToSave['ApplicationName'] = this.applicationName ? this.applicationName : Constants.ApplicationName;
            this.appInsights.trackTrace({ message: message }, objectToSave);
        }
    }

}