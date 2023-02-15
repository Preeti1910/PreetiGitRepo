import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HolidayListAcePropertyPane } from './HolidayListAcePropertyPane';
import {  
  fetchListItems,
  IListItem
} from './service/sp.service';

export interface IHolidayListAceAdaptiveCardExtensionProps {
  title: string;
  holidaylistGUID: string;
}

export interface IHolidayListAceAdaptiveCardExtensionState {
  listItems: IListItem[];
}

const CARD_VIEW_REGISTRY_ID: string = 'HolidayListAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HolidayListAce_QUICK_VIEW';

export default class HolidayListAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHolidayListAceAdaptiveCardExtensionProps,
  IHolidayListAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HolidayListAcePropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = { 
      listItems:[]
    };
    
    console.log('holidaylistGUID: ' +this.properties.holidaylistGUID);

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    if (this.properties.holidaylistGUID) {
      Promise.all([       
        this.setState({ listItems: await fetchListItems(this.context, this.properties.holidaylistGUID) })
      ]);
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HolidayListAce-property-pane'*/
      './HolidayListAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HolidayListAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    console.log('data:' + this.state.listItems.length);
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'holidaylistGUID' && newValue !== oldValue) {
      // TODO onPropertyPaneFieldChanged
    }
  }
}
