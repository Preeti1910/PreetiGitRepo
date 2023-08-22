import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'ApiConsumerCardAdaptiveCardExtensionStrings';

export class ApiConsumerCardPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
  }
}
