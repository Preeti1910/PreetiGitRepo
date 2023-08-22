import { LoggerHelper } from "./LoggerHelper";

export class APIInvoker {

    private loggerHelper: LoggerHelper;


    constructor(configuration: any) {
        this.loggerHelper = new LoggerHelper(configuration.applicationName, configuration.appInsightsConnectionString);
    }

    public retrieveAccessTokenForexternal(configuration: any): string | PromiseLike<any> {
         this.loggerHelper.trackTrace('retrieveAccessTokenForexternal() has been invoked : ');
        const apiURL = configuration.externalTokenURL;

        return fetch(apiURL, {
            method: "POST"
        }).then((response) => response.text())
            .then((result) => {
                 this.loggerHelper.trackTrace('Success from retrieveAccessTokenForexternal:', result);
                return result;
            })
            .catch((error) => {                
                this.loggerHelper.trackException(error, { message: 'Error from retrieveAccessTokenForexternal:' });
            });
        return null;
    }

    /**
    * Method to retrieve search results for external.
    * @param requestPayload the request payload.
    * @returns the search results.
    */
 
    public callAPI = async (requestPayload: any): Promise<any> => {

         this.loggerHelper.trackTrace('callAPI() has been invoked : , Method:' + requestPayload.APImethod);

        const apiURL = requestPayload.apiURL.trim();
        const requestObj = requestPayload.requestObj;
        const payload = requestObj ? requestObj : '';

       // const payload = requestObj ? JSON.stringify(requestObj) : '';

        /*
        var payload = JSON.stringify({
            "EmployeeCode": "51622809"
          });
*/
          
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        if(requestPayload.accessToken){
            myHeaders.append("Authorization", "Bearer " + requestPayload.accessToken);
        }
        if(requestPayload.OcpApimTrace){
            myHeaders.append("Ocp-Apim-Trace", requestPayload.OcpApimTrace);
        }
        if(requestPayload.OcpApimSubscriptionKey){
            myHeaders.append("Ocp-Apim-Subscription-Key", requestPayload.OcpApimSubscriptionKey);
        }                      

        if (requestPayload.APImethod.toLowerCase() === "get") {
            return fetch(apiURL, {
                method: "GET",
                headers: myHeaders                
            }).then((response) => response.json())
                .then((result) => {
                     this.loggerHelper.trackTrace('Success callAPI get:', result);
                    return result;
                })
                .catch((error) => {
                    this.loggerHelper.trackException(error, { message: 'Error callAPI get:' });
                });
        }else if (requestPayload.APImethod.toLowerCase() === "post") {
            return fetch(apiURL, {
                method: "POST",
                headers: myHeaders,              
                body: payload
            }).then(data => data.text())
              .then(body => {
                 this.loggerHelper.trackTrace('callAPI post result:' + body);
                return body;
                 }).catch(error => {
                 this.loggerHelper.trackException(error, { message: 'callAPI post error:' });
                return error;
            });
        }
    }

    public retrieveServiceAcountAccessTokenJson = async (configuration: any): Promise<any> => {

         this.loggerHelper.trackTrace('retrieveServiceAcountAccessTokenJson has been invoked : ');


        var requestObj = {
            client_id: configuration.clientId,
            client_secret: configuration.clientSecret,
            grant_type: configuration.grantType,
            scope: configuration.scope,
        }
        var apiURL = "https://login.microsoftonline.com/" + configuration.tenantId + "/oauth2/v2.0/token";

        var payload = requestObj ? JSON.stringify(requestObj) : '';

        return fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload
        }).then((response) => response.json())
            .then((result) => {
                 this.loggerHelper.trackTrace('Success retrieveServiceAcountAccessTokenJson :', result);
                return result;
            })
            .catch((error) => {
                this.loggerHelper.trackException(error, { message: 'Error retrieveServiceAcountAccessTokenJson' });
            });


    }

    public retrieveServiceAcountAccessToken(configuration: any): string | PromiseLike<any> {
         this.loggerHelper.trackTrace('retrieveServiceAcountAccessToken() has been invoked.');
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var formdata = new FormData();

        formdata.append("client_id", configuration.clientId);
        formdata.append("client_secret", configuration.clientSecret);
        //formdata.append("resource", "api://399557e2-0984-4a3a-868c-d9093e395506");
        formdata.append("scope", configuration.scope);
        formdata.append("grant_type", "client_credentials");
        // var url = "https://login.microsoftonline.com/189de737-c93a-4f5a-8b68-6f4ca9941912/oauth2/token";
        var url = "https://login.microsoftonline.com/" + configuration.tenantId + "/oauth2/v2.0/token";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
            // mode: 'no-cors'
            // redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                 this.loggerHelper.trackTrace('Success for ServiceAcountAccessToken:', result);
                return result;
            }
            ).catch((error) => { 
                this.loggerHelper.trackException(error, { message: 'Error for ServiceAcountAccessToken' });
            });
        return null;
    }
}