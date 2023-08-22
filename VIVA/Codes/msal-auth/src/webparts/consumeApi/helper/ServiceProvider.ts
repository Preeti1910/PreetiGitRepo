import { WebPartContext } from '@microsoft/sp-webpart-base';  
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export class ServiceProvider {  
    private wpcontext:WebPartContext;  
    public constructor(context: WebPartContext) {  
       this.wpcontext= context;  
      }  
      private httpClientOptionsForGlobal: IHttpClientOptions = {  
        /*
        headers: new Headers({  
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",  
            "x-rapidapi-key": "<REPLACE WHIT WITH YOUR APIKEY>"  
        }),  
        */
        method: "POST",  
        mode: "no-cors"  
    };
    public async getTotals(url: string) {  
  
   var response = await this.wpcontext.httpClient  
  .post(url, HttpClient.configurations.v1,this.httpClientOptionsForGlobal);  
  console.log('response: '+response);  
  var responeJson : any = await response.json();  
  console.log('responeJson: '+responeJson);  
  return responeJson;  
  }  
    
}  