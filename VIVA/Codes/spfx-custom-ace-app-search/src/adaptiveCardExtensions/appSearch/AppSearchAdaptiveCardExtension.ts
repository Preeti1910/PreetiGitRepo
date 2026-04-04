import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AppSearchPropertyPane } from './AppSearchPropertyPane';

export interface IAppSearchAdaptiveCardExtensionProps {
  title: string;
}

export interface IAppSearchAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'AppSearch_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AppSearch_QUICK_VIEW';

export default class AppSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAppSearchAdaptiveCardExtensionProps,
  IAppSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AppSearchPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AppSearch-property-pane'*/
      './AppSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AppSearchPropertyPane();
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
