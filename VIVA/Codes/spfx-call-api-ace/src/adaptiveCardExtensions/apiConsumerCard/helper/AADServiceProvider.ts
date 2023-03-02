import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { LoggerHelper } from './LoggerHelper';


export interface weatherforecastdetails {
    date: string;
    summary: string;
    temperatureC: string;
    temperatureF: string
}

export class AADServiceProvider {
    private wpcontext: AdaptiveCardExtensionContext;
    private loggerHelper: LoggerHelper;
    /*
    public constructor(context: AdaptiveCardExtensionContext) {
        this.wpcontext = context;
    }*/

    public constructor(aadServiceProviderObj: any) {
        this.wpcontext = aadServiceProviderObj.context;
        this.loggerHelper = new LoggerHelper(aadServiceProviderObj.applicationName, aadServiceProviderObj.appInsightsConnectionString);
    }


/*
    public getResponse = async (url: string, aadAplicationResource: string): Promise<any> => {
     //   public getResponse = async (paramObj: any): Promise<any> => {
        this.wpcontext.aadHttpClientFactory.getClient(aadAplicationResource)
            .then((client: AadHttpClient): void => {
                console.log(client);
                client.get(url, AadHttpClient.configurations.v1)
                    .then((response: HttpClientResponse): Promise<weatherforecastdetails[]> => {
                        console.log('response= '+ response);                       
                        return response.json();
                    })
                    .catch((e: Error) => {
                        console.log('Error in client.get:' + e);
                    }
                    );

            })
            .catch((e2: Error) => {
                console.log('Error in getResponse:' +e2);
            }
            );
    }
*/
    
          public getResponse = async (paramObj: any): Promise<any> => {
           this.wpcontext.aadHttpClientFactory.getClient(paramObj.aadAplicationResource)
               .then((client: AadHttpClient): void => {
                   console.log(client);
                   client.get(paramObj.url, AadHttpClient.configurations.v1)
                       .then((response: HttpClientResponse): Promise<weatherforecastdetails[]> => {
                           console.log('response= '+ response);                       
                           return response.json();
                       })
                       .catch((error: Error) => {
                           console.log('Error in client.get:' + error);
                           this.loggerHelper.trackException(error, { message: 'Error in client.get.' });
                       }
                       );
   
               })
               .catch((e2: Error) => {
                   console.log('Error in getResponse:' +e2);
                   this.loggerHelper.trackException(e2, { message: 'Error in getResponse.' });
               }
               );
       }

  
}  