var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { LoggerHelper } from 'spfx-library';
import { Constants } from './helpers/Constants';
var CARD_VIEW_REGISTRY_ID = 'RedirectAce_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'RedirectAce_QUICK_VIEW';
var RedirectAceAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(RedirectAceAdaptiveCardExtension, _super);
    function RedirectAceAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RedirectAceAdaptiveCardExtension.prototype.onInit = function () {
        this.state = {};
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        var applicationName = this.properties.applicationName ? this.properties.applicationName : Constants.ApplicationName;
        this.loggerHelper = new LoggerHelper(applicationName, this.properties.appInsightsConnectionString);
        this.loggerHelper.trackTrace('onInit called');
        return Promise.resolve();
    };
    RedirectAceAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'RedirectAce-property-pane'*/
        './RedirectAcePropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.RedirectAcePropertyPane();
        });
    };
    RedirectAceAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    RedirectAceAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return RedirectAceAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default RedirectAceAdaptiveCardExtension;
//# sourceMappingURL=RedirectAceAdaptiveCardExtension.js.map