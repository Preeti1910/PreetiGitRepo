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
import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { Constants } from "./Constants";
import { LoggerHelper } from "./LoggerHelper";
/**
 * MSAL Helper.
 */
var MSALHelper = /** @class */ (function () {
    function MSALHelper(configuration) {
        var _this = this;
        this.retrieveAccessToken = function (scopes) { return __awaiter(_this, void 0, void 0, function () {
            var accounts;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('retrieveAccessToken() has been invoked.');
                this.loggerHelper.trackTrace('retrieveAccessToken() has been invoked.');
                if (scopes && scopes.length > 0) {
                    this.ssoRequest.scopes = scopes;
                }
                accounts = this.myMSALObj.getAllAccounts();
                if (accounts !== null && accounts.length > 0) {
                    return [2 /*return*/, this.handleLoggedInUser(accounts)];
                }
                else {
                    return [2 /*return*/, this.loginForAccessTokenByMSAL()
                            .then(function (token) {
                            console.log('Retrieved the graph token successfully.');
                            _this.loggerHelper.trackTrace('Retrieved the graph token successfully.');
                            console.log(token);
                            return token;
                        }).catch(function (error) {
                            console.log(error, { message: 'Error occured in the retrieving graph token.' });
                            _this.loggerHelper.trackException(error, { message: 'Error occured in the retrieving graph token.' });
                            return 'error';
                        })];
                    ;
                }
                return [2 /*return*/];
            });
        }); };
        this.handleLoggedInUser = function (currentAccounts) { return __awaiter(_this, void 0, void 0, function () {
            var accountObj;
            return __generator(this, function (_a) {
                accountObj = null;
                if (currentAccounts === null) {
                    return [2 /*return*/, 'No user signed in'];
                }
                else if (currentAccounts.length > 1) {
                    // More than one user is authenticated, get current one 
                    accountObj = this.myMSALObj.getAccountByUsername(this.userLoginName);
                }
                else {
                    accountObj = currentAccounts[0];
                }
                if (accountObj !== null) {
                    this.ssoRequest.account = accountObj;
                    return [2 /*return*/, this.myMSALObj.acquireTokenSilent(this.ssoRequest)
                            .then(function (accessToken) {
                            return accessToken.accessToken;
                        })];
                }
                return [2 /*return*/];
            });
        }); };
        this.loginForAccessTokenByMSAL = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.myMSALObj.ssoSilent(this.ssoRequest).then(function (response) {
                        return response.accessToken;
                    }).catch(function (error) {
                        if (error instanceof InteractionRequiredAuthError) {
                            return _this.myMSALObj.loginPopup(_this.ssoRequest)
                                .then(function (response) {
                                return response.accessToken;
                            })
                                .catch(function (error) {
                                return error;
                            });
                        }
                        else {
                            return null;
                        }
                    })];
            });
        }); };
        try {
            this.loggerHelper = new LoggerHelper(configuration.applicationName, configuration.appInsightsConnectionString);
            this.userLoginName = configuration.loginName;
            var msalConfig = {
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
            this.loggerHelper.trackTrace('Initializing MSAL object');
            this.myMSALObj = new PublicClientApplication(msalConfig);
            console.log('Initialized MSAL object');
            this.loggerHelper.trackTrace('Initialized MSAL object');
        }
        catch (ex) {
            console.log(ex);
            this.loggerHelper.trackException(ex);
        }
    }
    return MSALHelper;
}());
export { MSALHelper };
//# sourceMappingURL=MSALHelper.js.map