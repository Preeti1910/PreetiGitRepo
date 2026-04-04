import { Log } from '@microsoft/sp-core-library';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import {
  ApplicationCustomizerContext,
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ModalExtensionApplicationCustomizerStrings';
require('./styles/modal.module.css')

const LOG_SOURCE: string = 'ModalExtensionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IModalExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ModalExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<IModalExtensionApplicationCustomizerProperties> {

  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }


    /*
      Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`).catch(() => {
        
      });*/
      
      //Redirection
     
      var currentPageUrl = this.context.pageContext.site.serverRequestPath;
      console.log('currentPageUrl=' + currentPageUrl);
      if(currentPageUrl != '/sites/TestViva/SitePages/non-compliance.aspx'){
        await InvokeRedirection(this.context.httpClient);
      }
      

    //await InvokeJSForPop();

    //await InvokeCSS();
    /*
    let htmlScript: HTMLScriptElement = document.createElement("script");
    htmlScript.setAttribute("src", "https://m365x07898200.sharepoint.com/sites/TestViva/SiteAssets/Scripts/modal.js");
    htmlScript.setAttribute("type", "text/javascript");
    document.head.appendChild(htmlScript);
*/
    return Promise.resolve();
  }
}

function InvokeCSS() {
  const cssUrl: string = "https://m365x6151710.sharepoint.com/sites/TheLanding/SiteAssets/css/globalcss.css";

  //console.log('CSS URL', cssUrl)

  if (cssUrl) {
    const head: HTMLElement = document.getElementsByTagName("head")[0] || document.documentElement;

    let customStyle: HTMLLinkElement = document.createElement("link");
    customStyle.href = cssUrl;
    customStyle.rel = "stylesheet";
    customStyle.type = "text/css";
    head.insertAdjacentElement("beforeend", customStyle);
    console.log('HEAD', head)

  }
}
function InvokeJSForPop() {
  let htmlScript: HTMLScriptElement = document.createElement("script");
  htmlScript.setAttribute("src", "https://m365x07898200.sharepoint.com/sites/TestViva/SiteAssets/Scripts/modal.js");
  htmlScript.setAttribute("type", "text/javascript");
  document.head.appendChild(htmlScript);

}

function InvokeRedirection(httpclient: HttpClient) {
  httpclient.get("https://functionapphcl.azurewebsites.net/api/Function1?code=TRjc_Yq9TE38-8-Q1zPXSd5BoQ6T5I-13MMKZE09dPhaAzFul0iHCg==&name=false", HttpClient.configurations.v1).then((res: HttpClientResponse): Promise<any> => {
    return res.json();
  })
    .then((response: any): void => {
      console.log(response);

      ///////Preeti: Remove this hard coded value of response.
      //response = "true";


      if (response === "true") {
        console.log('Response received true');
      } else {
        console.log('Response received false');
        location.replace("https://m365x07898200.sharepoint.com/sites/TestViva/SitePages/non-compliance.aspx");
      }
    });

}

