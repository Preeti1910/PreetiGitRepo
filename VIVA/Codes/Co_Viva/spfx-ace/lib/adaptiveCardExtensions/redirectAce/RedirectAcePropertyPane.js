import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'RedirectAceAdaptiveCardExtensionStrings';
var RedirectAcePropertyPane = /** @class */ (function () {
    function RedirectAcePropertyPane() {
    }
    RedirectAcePropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
                                })
                            ]
                        },
                        {
                            groupName: strings.AppInsightsGroupName,
                            groupFields: [
                                PropertyPaneTextField('applicationName', {
                                    label: strings.ApplicationNameFieldLabel
                                }),
                                PropertyPaneTextField('appInsightsConnectionString', {
                                    label: strings.AppInsightsConnectionStringFieldLabel
                                })
                            ]
                        },
                        {
                            groupName: strings.ErrorsGroupName,
                            groupFields: [
                                PropertyPaneTextField('errorMsgToDisplay', {
                                    label: strings.ErrorMsgToDisplayFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return RedirectAcePropertyPane;
}());
export { RedirectAcePropertyPane };
//# sourceMappingURL=RedirectAcePropertyPane.js.map