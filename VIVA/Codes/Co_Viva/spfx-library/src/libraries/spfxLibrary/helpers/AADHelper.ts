import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export class AADHelper {
    private wpcontext: WebPartContext;
    public constructor(context: WebPartContext) {
        this.wpcontext = context;
    }



    public getResponse = async (url: string, aadAplicationResource: string): Promise<any> => {
        this.wpcontext.aadHttpClientFactory.getClient(aadAplicationResource)
            .then((client: AadHttpClient): void => {
                console.log(client);
                client.get(url, AadHttpClient.configurations.v1)
                    .then((response: HttpClientResponse): Promise<any> => {
                        console.log('response= '+ response); 
                        return response.json();
                    })
                    .catch((e: Error) => {
                        console.log('Error in client.get:' + e);
                    }
                    );

            })
            .catch((e2: Error) => {
                console.log('Error in getResponse:' + e2);
            }
            );
    }
}  