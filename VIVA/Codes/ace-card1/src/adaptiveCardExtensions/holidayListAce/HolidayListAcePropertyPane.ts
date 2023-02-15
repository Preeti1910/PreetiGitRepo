import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'HolidayListAceAdaptiveCardExtensionStrings';

export class HolidayListAcePropertyPane {
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
              groupName: strings.SPOGroupName,
              groupFields: [
                PropertyPaneTextField('holidaylistGUID', {
                  label: strings.SPOHolidayListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
