import { Log } from '@microsoft/sp-core-library';
import {
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

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

  /*
    Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`).catch(() => {
      
    });
    */      

    let htmlScript: HTMLScriptElement = document.createElement("script");
    htmlScript.setAttribute("src", "https://m365x07898200.sharepoint.com/sites/TestViva/SiteAssets/Scripts/modal.js");
    htmlScript.setAttribute("type", "text/javascript");
    document.head.appendChild(htmlScript);

    return Promise.resolve();
  }
}
