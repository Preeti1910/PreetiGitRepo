import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HolidayListAceAdaptiveCardExtensionStrings';
import { IHolidayListAceAdaptiveCardExtensionProps, IHolidayListAceAdaptiveCardExtensionState } from '../HolidayListAceAdaptiveCardExtension';
import { IListItem } from '../service/sp.service';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  listItems: IListItem[];
}

export class QuickView extends BaseAdaptiveCardView<
  IHolidayListAceAdaptiveCardExtensionProps,
  IHolidayListAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      listItems: this.state.listItems
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}