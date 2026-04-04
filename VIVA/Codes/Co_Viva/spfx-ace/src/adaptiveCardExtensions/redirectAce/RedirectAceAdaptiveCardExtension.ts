import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { RedirectAcePropertyPane } from './RedirectAcePropertyPane';
import {LoggerHelper} from 'spfx-library'
import { Constants } from './helpers/Constants';

export interface IRedirectAceAdaptiveCardExtensionProps {
  title: string;
  applicationName:string;
  appInsightsConnectionString:string;
}

export interface IRedirectAceAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'RedirectAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'RedirectAce_QUICK_VIEW';

export default class RedirectAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IRedirectAceAdaptiveCardExtensionProps,
  IRedirectAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: RedirectAcePropertyPane | undefined;
  private loggerHelper: LoggerHelper;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    const applicationName = this.properties.applicationName ? this.properties.applicationName : Constants.ApplicationName;
    this.loggerHelper = new LoggerHelper(applicationName, this.properties.appInsightsConnectionString);

    this.loggerHelper.trackTrace('onInit called');


    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'RedirectAce-property-pane'*/
      './RedirectAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.RedirectAcePropertyPane();
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
