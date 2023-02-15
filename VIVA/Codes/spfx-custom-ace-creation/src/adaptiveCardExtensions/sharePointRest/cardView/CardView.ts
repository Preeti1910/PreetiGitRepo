import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SharePointRestAdaptiveCardExtensionStrings';
import { ISharePointRestAdaptiveCardExtensionProps, ISharePointRestAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID, NEW_ITEM_QUICK_VIEW_REGISTRY_ID } from '../SharePointRestAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<ISharePointRestAdaptiveCardExtensionProps, ISharePointRestAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if (!this.properties.listId) {
      return undefined;
    } else {
      return [{
          title: 'Add item',
          action: {
            type: 'QuickView',
            parameters: { view: NEW_ITEM_QUICK_VIEW_REGISTRY_ID }
          }
        }];
    }
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: (this.state.listTitle)
      ? `View ${this.state.listCount} items in the '${this.state.listTitle}' list`
      : `Missing list ID`,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
