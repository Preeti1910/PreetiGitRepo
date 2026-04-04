import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ApiConsumerCardPropertyPane } from './ApiConsumerCardPropertyPane';

import { AADServiceProvider } from './helper/AADServiceProvider';
import { LoggerHelper } from './helper/LoggerHelper';


export interface IApiConsumerCardAdaptiveCardExtensionProps {
  title: string;
  apiURL: string;
  primaryTextCustom:string;
  aadAplicationResource:string;
  applicationName:string;
  appInsightsConnectionString:string;

}

export interface IApiConsumerCardAdaptiveCardExtensionState {
  itemCount:string;
}

const CARD_VIEW_REGISTRY_ID: string = 'ApiConsumerCard_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ApiConsumerCard_QUICK_VIEW';

export default class ApiConsumerCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IApiConsumerCardAdaptiveCardExtensionProps,
  IApiConsumerCardAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ApiConsumerCardPropertyPane | undefined;

  //private serviceProvider: ServiceProvider;
  private aadServiceProvider: AADServiceProvider;

  private loggerHelper: LoggerHelper;



  public async onInit(): Promise<void> {
    this.state = { 
      itemCount:""
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    this.loggerHelper = new LoggerHelper(this.properties.applicationName , this.properties.appInsightsConnectionString);
 

    console.log('apiURL: ' + this.properties.apiURL);

    this.loggerHelper.trackTrace("onInit called ApiConsumerCardAdaptiveCardExtension " +this.properties.apiURL);
    if(this.properties.apiURL){
      //this.serviceProvider = new ServiceProvider(this.context.spHttpClient); 
      var aadServiceProviderObj={
        context: this.context,
        applicationName:this.properties.applicationName,
        appInsightsConnectionString:this.properties.appInsightsConnectionString
      }
      //this.aadServiceProvider = new AADServiceProvider(this.context); 
      this.aadServiceProvider = new AADServiceProvider(aadServiceProviderObj); 
     
      
      var paramObj ={
        apiURL:this.properties.apiURL,
        aadAplicationResource:this.properties.aadAplicationResource
      }
     
       
      //const apiResponse = await this.aadServiceProvider.getResponse(this.properties.apiURL,this.properties.aadAplicationResource);
      const apiResponse = await this.aadServiceProvider.getResponse(paramObj);
      console.log('apiResponse: ' + apiResponse);
      if(apiResponse){
        this.setState({
          itemCount:apiResponse
        })
      }
    }    

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ApiConsumerCard-property-pane'*/
      './ApiConsumerCardPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ApiConsumerCardPropertyPane();
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
