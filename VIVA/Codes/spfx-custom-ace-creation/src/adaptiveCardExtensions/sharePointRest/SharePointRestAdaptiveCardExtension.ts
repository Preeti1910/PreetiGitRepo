import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SharePointRestPropertyPane } from './SharePointRestPropertyPane';
import { fetchListItems, fetchListTitle, IListItem } from './services/sp.service';
import { NewItemQuickView } from './quickView/NewItemQuickView';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface ISharePointRestAdaptiveCardExtensionProps {
  title: string;
  listId: string;
  redirectURL: string;
  paramName:string;
}

export interface ISharePointRestAdaptiveCardExtensionState {
  listTitle: string;
  listItems: IListItem[];
  currentIndex: number;
  listCount: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'SharePointRest_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'SharePointRest_QUICK_VIEW';
export const NEW_ITEM_QUICK_VIEW_REGISTRY_ID: string = 'SharePointRestCrud_NEW_ITEM_QUICK_VIEW';

export default class SharePointRestAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SharePointRestPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      currentIndex: 0,
      listItems: [],
      listTitle: '',
      listCount:0
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(NEW_ITEM_QUICK_VIEW_REGISTRY_ID, () => new NewItemQuickView());

    await this.InvokeRedirection();

    if (this.properties.listId) {
      //let tempListItems:IListItem[] = await fetchListItems(this.context, this.properties.listId)
      Promise.all(
        [
          this.setState(
            {
              listTitle: await fetchListTitle(this.context, this.properties.listId)
            }
          ),
          this.setState(
            {
              listItems: await fetchListItems(this.context, this.properties.listId)
             // listItems: tempListItems,
              //listCount: tempListItems.length
            }
          )
        ]
      );
    }

    this.setState(
      {
        listCount: this.state.listItems.length
      }
    )
    console.log('count=' +  this.state.listItems.length);


    return Promise.resolve();
  }

  

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SharePointRest-property-pane'*/
      './SharePointRestPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SharePointRestPropertyPane();
        }
      );
  }

  public InvokeRedirection() {
    console.log('Redirect url: ' + this.properties.redirectURL);
    let varURL:string;
    varURL= "https://functionapphcl.azurewebsites.net/api/Function1?code=TRjc_Yq9TE38-8-Q1zPXSd5BoQ6T5I-13MMKZE09dPhaAzFul0iHCg==&name=" + this.properties.paramName;
    this.context.httpClient.get(varURL, HttpClient.configurations.v1).then((res: HttpClientResponse): Promise<any> => {
     return res.json();
   })
   .then((response: any): void => {
     console.log(response);
 
     ///////Preeti: Remove this hard coded value of response.
     response= "true";
 
 
     if(response === "true"){
       console.log('Response received true');
     }else{
       console.log('Response received false');
       //window.location.replace("https://www.google.com/");
       location.replace(this.properties.redirectURL);
       //document.location("https://m365x07898200.sharepoint.com/sites/TestViva/SitePages/non-compliance.aspx");
     }
   });
  }

  protected renderCard(): string | undefined {
    //return CARD_VIEW_REGISTRY_ID;
    return "";
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'listId' && newValue !== oldValue) {
      if (newValue) {
        (async () => {
          this.setState({ listTitle: await fetchListTitle(this.context, newValue) });
          this.setState({ listItems: await fetchListItems(this.context, newValue) });
        })();
      } else {
        this.setState({ listTitle: '' });
        this.setState({ listItems: [] });
      }
    }
  }
}
