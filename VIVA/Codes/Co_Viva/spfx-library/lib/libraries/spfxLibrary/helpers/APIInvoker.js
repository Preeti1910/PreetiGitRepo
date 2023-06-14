var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { LoggerHelper } from "./LoggerHelper";
var APIInvoker = /** @class */ (function () {
    function APIInvoker(configuration) {
        var _this = this;
        /**
        * Method to retrieve search results for external.
        * @param requestPayload the request payload.
        * @returns the search results.
        */
        this.callAPI = function (requestPayload) { return __awaiter(_this, void 0, void 0, function () {
            var apiURL, requestObj, payload, myHeaders;
            var _this = this;
            return __generator(this, function (_a) {
                this.loggerHelper.trackTrace('callAPI() has been invoked : , Method:' + requestPayload.APImethod);
                apiURL = requestPayload.apiURL.trim();
                requestObj = requestPayload.requestObj;
                payload = requestObj ? requestObj : '';
                myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                if (requestPayload.accessToken) {
                    myHeaders.append("Authorization", "Bearer " + requestPayload.accessToken);
                }
                if (requestPayload.OcpApimTrace) {
                    myHeaders.append("Ocp-Apim-Trace", requestPayload.OcpApimTrace);
                }
                if (requestPayload.OcpApimSubscriptionKey) {
                    myHeaders.append("Ocp-Apim-Subscription-Key", requestPayload.OcpApimSubscriptionKey);
                }
                if (requestPayload.APImethod.toLowerCase() === "get") {
                    return [2 /*return*/, fetch(apiURL, {
                            method: "GET",
                            headers: myHeaders
                        }).then(function (response) { return response.json(); })
                            .then(function (result) {
                            _this.loggerHelper.trackTrace('Success callAPI get:', result);
                            return result;
                        })
                            .catch(function (error) {
                            _this.loggerHelper.trackException(error, { message: 'Error callAPI get:' });
                        })];
                }
                else if (requestPayload.APImethod.toLowerCase() === "post") {
                    return [2 /*return*/, fetch(apiURL, {
                            method: "POST",
                            headers: myHeaders,
                            body: payload
                        }).then(function (data) { return data.text(); })
                            .then(function (body) {
                            _this.loggerHelper.trackTrace('callAPI post result:' + body);
                            return body;
                        }).catch(function (error) {
                            _this.loggerHelper.trackException(error, { message: 'callAPI post error:' });
                            return error;
                        })];
                }
                return [2 /*return*/];
            });
        }); };
        this.retrieveServiceAcountAccessTokenJson = function (configuration) { return __awaiter(_this, void 0, void 0, function () {
            var requestObj, apiURL, payload;
            var _this = this;
            return __generator(this, function (_a) {
                this.loggerHelper.trackTrace('retrieveServiceAcountAccessTokenJson has been invoked : ');
                requestObj = {
                    client_id: configuration.clientId,
                    client_secret: configuration.clientSecret,
                    grant_type: configuration.grantType,
                    scope: configuration.scope,
                };
                apiURL = "https://login.microsoftonline.com/" + configuration.tenantId + "/oauth2/v2.0/token";
                payload = requestObj ? JSON.stringify(requestObj) : '';
                return [2 /*return*/, fetch(apiURL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: payload
                    }).then(function (response) { return response.json(); })
                        .then(function (result) {
                        _this.loggerHelper.trackTrace('Success retrieveServiceAcountAccessTokenJson :', result);
                        return result;
                    })
                        .catch(function (error) {
                        _this.loggerHelper.trackException(error, { message: 'Error retrieveServiceAcountAccessTokenJson' });
                    })];
            });
        }); };
        this.loggerHelper = new LoggerHelper(configuration.applicationName, configuration.appInsightsConnectionString);
    }
    APIInvoker.prototype.retrieveAccessTokenForexternal = function (configuration) {
        var _this = this;
        this.loggerHelper.trackTrace('retrieveAccessTokenForexternal() has been invoked : ');
        var apiURL = configuration.externalTokenURL;
        return fetch(apiURL, {
            method: "POST"
        }).then(function (response) { return response.text(); })
            .then(function (result) {
            _this.loggerHelper.trackTrace('Success from retrieveAccessTokenForexternal:', result);
            return result;
        })
            .catch(function (error) {
            _this.loggerHelper.trackException(error, { message: 'Error from retrieveAccessTokenForexternal:' });
        });
        return null;
    };
    APIInvoker.prototype.retrieveServiceAcountAccessToken = function (configuration) {
        var _this = this;
        this.loggerHelper.trackTrace('retrieveServiceAcountAccessToken() has been invoked.');
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var formdata = new FormData();
        formdata.append("client_id", configuration.clientId);
        formdata.append("client_secret", configuration.clientSecret);
        //formdata.append("resource", "api://399557e2-0984-4a3a-868c-d9093e395506");
        formdata.append("scope", configuration.scope);
        formdata.append("grant_type", "client_credentials");
        // var url = "https://login.microsoftonline.com/189de737-c93a-4f5a-8b68-6f4ca9941912/oauth2/token";
        var url = "https://login.microsoftonline.com/" + configuration.tenantId + "/oauth2/v2.0/token";
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
            // mode: 'no-cors'
            // redirect: 'follow'
        };
        fetch(url, requestOptions)
            .then(function (response) { return response.text(); })
            .then(function (result) {
            _this.loggerHelper.trackTrace('Success for ServiceAcountAccessToken:', result);
            return result;
        }).catch(function (error) {
            _this.loggerHelper.trackException(error, { message: 'Error for ServiceAcountAccessToken' });
        });
        return null;
    };
    return APIInvoker;
}());
export { APIInvoker };
//# sourceMappingURL=APIInvoker.js.map