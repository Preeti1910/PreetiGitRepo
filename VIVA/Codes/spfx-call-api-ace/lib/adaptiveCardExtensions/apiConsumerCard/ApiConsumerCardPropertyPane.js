import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'ApiConsumerCardAdaptiveCardExtensionStrings';
var ApiConsumerCardPropertyPane = /** @class */ (function () {
    function ApiConsumerCardPropertyPane() {
    }
    ApiConsumerCardPropertyPane.prototype.getPropertyPaneConfiguration = function () {
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
                                }),
                                PropertyPaneTextField('primaryTextCustom', {
                                    label: strings.PrimaryTextCustomFieldLabel
                                })
                            ]
                        },
                        {
                            groupName: strings.APIGroupName,
                            groupFields: [
                                PropertyPaneTextField('apiURL', {
                                    label: strings.APIURLFieldLabel
                                }),
                                PropertyPaneTextField('aadAplicationResource', {
                                    label: strings.AADAplicationResourceFieldLabel
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
                        }
                    ]
                }
            ]
        };
    };
    return ApiConsumerCardPropertyPane;
}());
export { ApiConsumerCardPropertyPane };
//# sourceMappingURL=ApiConsumerCardPropertyPane.js.map