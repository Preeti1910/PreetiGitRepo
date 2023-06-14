import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'AppSearchAdaptiveCardExtensionStrings';
var AppSearchPropertyPane = /** @class */ (function () {
    function AppSearchPropertyPane() {
    }
    AppSearchPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AppSearchPropertyPane;
}());
export { AppSearchPropertyPane };
//# sourceMappingURL=AppSearchPropertyPane.js.map