import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ImportantAnnouncementsAdaptiveCardExtensionStrings';
import { IImportantAnnouncementsAdaptiveCardExtensionProps, IImportantAnnouncementsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../ImportantAnnouncementsAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IImportantAnnouncementsAdaptiveCardExtensionProps, IImportantAnnouncementsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: 'View',
        action: {
          type: 'ExternalLink',
          parameters: {
            target: this.state.announcement.url
          }
        }
      }
    ];
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: this.state.announcement.title,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.state.announcement.url
      }
    };
  }
}
