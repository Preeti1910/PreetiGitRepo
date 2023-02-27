import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';


export interface weatherforecastdetails {
    date : string;
    summary : string;
    temperatureC : string;
    temperatureF : string
  }
  
export class AADServiceProvider {
    private wpcontext: AdaptiveCardExtensionContext;
    public constructor(context: AdaptiveCardExtensionContext) {
        this.wpcontext = context;
    }



    public getResponse = async (url: string, aadAplicationResource: string): Promise<any> => {
        this.wpcontext.aadHttpClientFactory.getClient(aadAplicationResource)
            .then((client: AadHttpClient): void => {
                console.log(client);
                client.get(url, AadHttpClient.configurations.v1)
                    .then((response: HttpClientResponse): Promise<weatherforecastdetails[]> => {
                        return response.json();
                    })                    
                    .catch((e: Error) => console.log(e));

            })
            .catch((e2: Error) => console.log(e2));
    }  
}  