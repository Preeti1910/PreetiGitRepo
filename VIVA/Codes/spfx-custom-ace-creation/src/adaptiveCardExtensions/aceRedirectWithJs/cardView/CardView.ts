import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceRedirectWithJsAdaptiveCardExtensionStrings';
import { IAceRedirectWithJsAdaptiveCardExtensionProps, IAceRedirectWithJsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AceRedirectWithJsAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAceRedirectWithJsAdaptiveCardExtensionProps, IAceRedirectWithJsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
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
  }

  public get data(): IBasicCardParameters {
   
    return {
      primaryText: strings.PrimaryText,
      title: this.properties.title
    };
  }

 

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
