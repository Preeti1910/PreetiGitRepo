import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { Constants } from './Constants';
/**
 * Logger helper class.
 */
var LoggerHelper = /** @class */ (function () {
    function LoggerHelper(applicationName, appInsightsConnectionString) {
        var _this = this;
        this.trackEvent = function (eventName, objectToSave) {
            if (_this.appInsights) {
                objectToSave = objectToSave ? objectToSave : {};
                objectToSave['ApplicationName'] = _this.applicationName ? _this.applicationName : Constants.ApplicationName;
                _this.appInsights.trackEvent({ name: eventName }, objectToSave);
            }
        };
        this.trackException = function (exception, objectToSave) {
            if (_this.appInsights) {
                objectToSave = objectToSave ? objectToSave : {};
                objectToSave['ApplicationName'] = _this.applicationName ? _this.applicationName : Constants.ApplicationName;
                _this.appInsights.trackException({ exception: exception }, objectToSave);
            }
        };
        this.trackTrace = function (message, objectToSave) {
            if (_this.appInsights) {
                objectToSave = objectToSave ? objectToSave : {};
                objectToSave['ApplicationName'] = _this.applicationName ? _this.applicationName : Constants.ApplicationName;
                _this.appInsights.trackTrace({ message: message }, objectToSave);
            }
        };
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
    return LoggerHelper;
}());
export { LoggerHelper };
//# sourceMappingURL=LoggerHelper.js.map