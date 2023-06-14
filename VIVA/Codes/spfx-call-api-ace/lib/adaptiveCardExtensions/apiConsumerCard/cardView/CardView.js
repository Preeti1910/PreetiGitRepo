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
import { BaseBasicCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ApiConsumerCardAdaptiveCardExtensionStrings';
import { QUICK_VIEW_REGISTRY_ID } from '../ApiConsumerCardAdaptiveCardExtension';
var ICardViewProps = /** @class */ (function () {
    function ICardViewProps() {
    }
    return ICardViewProps;
}());
export { ICardViewProps };
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //private cardViewProps: ICardViewProps;
        _this.cardViewProps = new ICardViewProps();
        return _this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
        get: function () {
            return [
                {
                    title: strings.QuickViewButton,
                    action: {
                        type: 'QuickView',
                        parameters: {
                            view: QUICK_VIEW_REGISTRY_ID
                        }
                    }
                }
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            if (this.properties.primaryTextCustom) {
                var temp = this.state.itemCount + " " + this.properties.primaryTextCustom;
                this.cardViewProps.primaryText = temp;
            }
            else {
                this.cardViewProps.primaryText = strings.PrimaryText;
            }
            if (this.properties.title)
                this.cardViewProps.title = this.properties.title;
            return this.cardViewProps;
            /*
           return {
             primaryText: strings.PrimaryText,
             title: this.properties.title
           };
           */
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: 'https://www.bing.com'
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(BaseBasicCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map