import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension, DeviceContext } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceRedirectPropertyPane } from './AceRedirectPropertyPane';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { app, dialog, pages } from '@microsoft/teams-js';
import { LoggerHelper } from '../helper/LoggerHelper';
import * as AdaptiveCards from "adaptivecards";




export interface IAceRedirectAdaptiveCardExtensionProps {
  title: string;
  redirectURL: string;
  paramName: string;
  applicationName: string;
  appInsightsConnectionString: string;
  apiURL: string;
  aadAplicationResource: string;
  teamsWindowURL: string;
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
  private deviceContext: DeviceContext;

  public async onInit(): Promise<void> {
    this.state = {};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());


    this.loggerHelper = new LoggerHelper(this.properties.applicationName, this.properties.appInsightsConnectionString);

    this.deviceContext = this.context.deviceContext;

   

    console.log('deviceContext: ' + this.deviceContext);
    console.log('current page' + this.context.pageContext.site.serverRequestPath);

    this.loggerHelper.trackTrace('deviceContext: ' + this.deviceContext);
   // await CreateACEDynamically();
    
   /*
   if (this.deviceContext.toLocaleLowerCase() === "mobile") {
    await this.InvokeJSForPop();
   }*/
    

    
   if (this.deviceContext.toLocaleLowerCase() === "webview") {
      await this.InvokeRedirection();
    } else {
      await app.initialize().then(async () => {
        await this.InvokeRedirection();
      }).catch((ex) => {
        console.log(ex)
        this.loggerHelper.trackException(ex, { message: 'in onInit of AceRedirectAdaptiveCardExtension' });
      });
    }
    
    return Promise.resolve();
  }

  InvokeJSForPop() {
    this.loggerHelper.trackTrace('InvokeJSForPop called from card');
    try {
      let htmlScript: HTMLScriptElement = document.createElement("script");
      htmlScript.setAttribute("src", "https://m365x07898200.sharepoint.com/sites/TestViva/SiteAssets/Scripts/modal.js");
      htmlScript.setAttribute("type", "text/javascript");
      document.head.appendChild(htmlScript);
    } catch (error) {
      console.log('Error in InvokeJSForPop' + error);
      this.loggerHelper.trackException(error,{message: "Error in InvokeJSForPop"});
    }



  }


  public InvokeRedirection() {
    console.log('Redirect url: ' + this.properties.redirectURL);
    let varURL: string;
    varURL = this.properties.apiURL + this.properties.paramName;
    this.context.httpClient.get(varURL, HttpClient.configurations.v1).then((res: HttpClientResponse): Promise<any> => {
      return res.json();
    })
      .then((response: any): void => {
        console.log(response);
        ///////Preeti: Remove this hard coded value of response.
        response = "true";

        if (response === "true") {
          console.log('Response received true');
        } else {

          console.log('Response received false');

          if (this.deviceContext.toLocaleLowerCase() === "webview") {
            window.location.replace(this.properties.redirectURL);
          } else {
            app.openLink(this.properties.redirectURL); //opens in new window, teams remains intact
            location.replace(this.properties.teamsWindowURL);
            
          }


          // pages.navigateCrossDomain(this.properties.redirectURL);
          //window.location.replace("https://www.google.com/");
          //location.replace(this.properties.redirectURL);
          //window.location.replace("https://www.google.com/");
          //document.location("https://m365x07898200.sharepoint.com/sites/TestViva/SitePages/non-compliance.aspx");
        }
      }).catch(ex => {
        console.log(ex)
        this.loggerHelper.trackException(ex, { message: 'in InvokeRedirection' });
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
function CreateACEDynamically() {
  
 // Author a card
// In practice you'll probably get this from a service
// see http://adaptivecards.io/samples/ for inspiration
var card = {
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
      {
          "type": "Image",
          "url": "http://adaptivecards.io/content/adaptive-card-50.png"
      },
      {
          "type": "TextBlock",
          "text": "Hello **Adaptive Cards!**"
      }
  ],
  "actions": [
      {
          "type": "Action.OpenUrl",
          "title": "Learn more",
          "url": "http://adaptivecards.io"
      },
      {
          "type": "Action.OpenUrl",
          "title": "GitHub",
          "url": "http://github.com/Microsoft/AdaptiveCards"
      }
  ]
};

// Create an AdaptiveCard instance
var adaptiveCard = new AdaptiveCards.AdaptiveCard();

// Set its hostConfig property unless you want to use the default Host Config
// Host Config defines the style and behavior of a card
adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
  fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
  // More host config options
});

// Set the adaptive card's event handlers. onExecuteAction is invoked
// whenever an action is clicked in the card
adaptiveCard.onExecuteAction = function(action) { alert("Ow!"); }

// For markdown support you need a third-party library
// E.g., to use markdown-it, include in your HTML page:
//     <script type="text/javascript" src="https://unpkg.com/markdown-it/dist/markdown-it.js"></script>
// And add this code to replace the default markdown handler:
//     AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
//         result.outputHtml = markdownit().render(text);
//         result.didProcess = true;
//     };

// Parse the card payload
adaptiveCard.parse(card);

// Render the card to an HTML element:
var renderedCard = adaptiveCard.render();

// And finally insert it somewhere in your page:
document.body.appendChild(renderedCard);


}

