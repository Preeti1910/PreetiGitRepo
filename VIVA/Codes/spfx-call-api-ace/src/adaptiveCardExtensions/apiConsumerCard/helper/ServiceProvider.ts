import { SPHttpClient } from '@microsoft/sp-http';

export class ServiceProvider {
  // private wpcontext:BaseAdaptiveCardExtension; 
  private sphttpclientObj: SPHttpClient
  public constructor(spHttpClient: SPHttpClient) {
    this.sphttpclientObj = spHttpClient;
  }
 

  public getTotals = async (url: string): Promise<any> => {

    return await this.sphttpclientObj
      .get(url, SPHttpClient.configurations.v1
      ).then((response) => response.json())
      .then((result) => {
        console.log('Success getTotals get:', result);
        return result;
      }).catch((error) =>{
        console.error('Error getTotals get:', error);
      });
   
  }

}  