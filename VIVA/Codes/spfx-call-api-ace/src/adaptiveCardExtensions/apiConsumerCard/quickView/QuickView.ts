import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ApiConsumerCardAdaptiveCardExtensionStrings';
import { IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState } from '../ApiConsumerCardAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IApiConsumerCardAdaptiveCardExtensionProps,
  IApiConsumerCardAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}