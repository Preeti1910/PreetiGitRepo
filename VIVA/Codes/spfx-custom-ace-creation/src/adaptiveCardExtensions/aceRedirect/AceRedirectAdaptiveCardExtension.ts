import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, DeviceContext } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceRedirectPropertyPane } from './AceRedirectPropertyPane';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { app, pages } from '@microsoft/teams-js';
import { LoggerHelper } from '../helper/LoggerHelper';
import { Constants } from '../helper/Constants';


export interface IAceRedirectAdaptiveCardExtensionProps {
  title: string;
  redirectURL: string;
  paramName: string;
}

export interface IAceRedirectAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'AceRedirect_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceRedirect_QUICK_VIEW';

export default class AceRedirectAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceRedirectAdaptiveCardExtensionProps,
  IAceRedirectAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceRedirectPropertyPane | undefined;
  private loggerHelper: LoggerHelper;

  public async onInit(): Promise<void> {
    this.state = {};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    const appinsightsconnstring= "";
    this.loggerHelper = new LoggerHelper(Constants.ApplicationName , appinsightsconnstring);

    const deviceContext:DeviceContext = this.context.deviceContext;

    this.loggerHelper.trackTrace('deviceContext: '+deviceContext);
    try{
    app.initialize();
    }catch(e){
      console.log('Exception in initializing app:' + e);
      this.loggerHelper.trackException(e,{ message: 'Exception in initializing app' });
    }
    await this.InvokeRedirection();

    return Promise.resolve();
  }


  public InvokeRedirection() {
    console.log('Redirect url: ' + this.properties.redirectURL);
    let varURL: string;
    varURL = "https://functionapphcl.azurewebsites.net/api/Function1?code=TRjc_Yq9TE38-8-Q1zPXSd5BoQ6T5I-13MMKZE09dPhaAzFul0iHCg==&name=" + this.properties.paramName;
    this.context.httpClient.get(varURL, HttpClient.configurations.v1).then((res: HttpClientResponse): Promise<any> => {
      return res.json();
    })
      .then((response: any): void => {
        console.log(response);
        ///////Preeti: Remove this hard coded value of response.
        //response= "true";

        if (response === "true") {
          console.log('Response received true');
        } else {
          console.log('Response received false');
          // app.openLink(this.properties.redirectURL);
          pages.navigateCrossDomain(this.properties.redirectURL);


          //window.location.replace("https://www.google.com/");
          //location.replace(this.properties.redirectURL);
          //window.location.replace("https://www.google.com/");
          //document.location("https://m365x07898200.sharepoint.com/sites/TestViva/SitePages/non-compliance.aspx");
        }
      }).catch(ex => {
        console.log(ex)
        this.loggerHelper.trackException(ex,{ message: 'in InvokeRedirection' });
      });
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceRedirect-property-pane'*/
      './AceRedirectPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceRedirectPropertyPane();
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
