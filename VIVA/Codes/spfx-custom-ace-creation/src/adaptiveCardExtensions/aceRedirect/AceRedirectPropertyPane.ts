import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'AceRedirectAdaptiveCardExtensionStrings';

export class AceRedirectPropertyPane {
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
                })
              ]
            },
            {
              groupName: strings.RedirectionDetailsGroupName,
              groupFields: [
                PropertyPaneTextField('redirectURL', {
                  label: strings.RedirectURLFieldLabel
                }),
                PropertyPaneTextField('paramName', {
                  label: strings.ParamNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
