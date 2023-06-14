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
var CARD_VIEW_REGISTRY_ID = 'AppSearch_CARD_VIEW';
export var QUICK_VIEW_REGISTRY_ID = 'AppSearch_QUICK_VIEW';
var AppSearchAdaptiveCardExtension = /** @class */ (function (_super) {
    __extends(AppSearchAdaptiveCardExtension, _super);
    function AppSearchAdaptiveCardExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppSearchAdaptiveCardExtension.prototype.onInit = function () {
        this.state = {};
        this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, function () { return new CardView(); });
        this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, function () { return new QuickView(); });
        return Promise.resolve();
    };
    AppSearchAdaptiveCardExtension.prototype.loadPropertyPaneResources = function () {
        var _this = this;
        return import(
        /* webpackChunkName: 'AppSearch-property-pane'*/
        './AppSearchPropertyPane')
            .then(function (component) {
            _this._deferredPropertyPane = new component.AppSearchPropertyPane();
        });
    };
    AppSearchAdaptiveCardExtension.prototype.renderCard = function () {
        return CARD_VIEW_REGISTRY_ID;
    };
    AppSearchAdaptiveCardExtension.prototype.getPropertyPaneConfiguration = function () {
        var _a;
        return (_a = this._deferredPropertyPane) === null || _a === void 0 ? void 0 : _a.getPropertyPaneConfiguration();
    };
    return AppSearchAdaptiveCardExtension;
}(BaseAdaptiveCardExtension));
export default AppSearchAdaptiveCardExtension;
//# sourceMappingURL=AppSearchAdaptiveCardExtension.js.map