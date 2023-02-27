import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ApiConsumerCardAdaptiveCardExtensionStrings';
import { IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../ApiConsumerCardAdaptiveCardExtension';

export class ICardViewProps {
  primaryText: string;
  title: string;

  constructor(){
    
  }
}

export class CardView extends BaseBasicCardView<IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState> {

  //private cardViewProps: ICardViewProps;
  private cardViewProps: ICardViewProps = new ICardViewProps();

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
    if (this.properties.primaryTextCustom){
      const temp= this.state.itemCount + " " + this.properties.primaryTextCustom
      this.cardViewProps.primaryText = temp;
    }else{
      this.cardViewProps.primaryText =strings.PrimaryText;
    }
    if (this.properties.title)
      this.cardViewProps.title = this.properties.title;

      return this.cardViewProps;
     /* 
    return {
      primaryText: strings.PrimaryText,
      title: this.properties.title
    };
    */
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
