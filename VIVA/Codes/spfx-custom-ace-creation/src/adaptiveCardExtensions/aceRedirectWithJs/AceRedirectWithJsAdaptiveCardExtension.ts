import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceRedirectWithJsPropertyPane } from './AceRedirectWithJsPropertyPane';

export interface IAceRedirectWithJsAdaptiveCardExtensionProps {
  title: string;
}

export interface IAceRedirectWithJsAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'AceRedirectWithJs_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceRedirectWithJs_QUICK_VIEW';

export default class AceRedirectWithJsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceRedirectWithJsAdaptiveCardExtensionProps,
  IAceRedirectWithJsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceRedirectWithJsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceRedirectWithJs-property-pane'*/
      './AceRedirectWithJsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceRedirectWithJsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
