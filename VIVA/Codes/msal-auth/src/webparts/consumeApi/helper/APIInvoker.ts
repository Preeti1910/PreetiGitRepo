export class APIInvoker {



    public retrieveAccessTokenForexternal(configuration: any): string | PromiseLike<any> {
        console.log('retrieveAccessTokenForexternal() has been invoked : ');
        const apiURL = configuration.externalTokenURL;

        return fetch(apiURL, {
            method: "POST"
        }).then((response) => response.text())
            .then((result) => {
                console.log('Success from retrieveAccessTokenForexternal:', result);
                return result;
            })
            .catch((error) => {
                console.error('Error from retrieveAccessTokenForexternal:', error);
            });
        return null;
    }

    /**
    * Method to retrieve search results for external.
    * @param requestPayload the request payload.
    * @returns the search results.
    */
 
    public callAPI = async (requestPayload: any): Promise<any> => {

        console.log('callAPI() has been invoked : , Method:' + requestPayload.APImethod);

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
                    console.log('Success callAPI get:', result);
                    return result;
                })
                .catch((error) => {
                    console.error('Error callAPI get:', error);
                });
        }else if (requestPayload.APImethod.toLowerCase() === "post") {
            return fetch(apiURL, {
                method: "POST",
                headers: myHeaders,              
                body: payload
            }).then(data => data.text())
              .then(body => {
                console.log('callAPI post result:' + body);
                return body;
                 }).catch(error => {
                console.log('callAPI post error:' + error);
                return error;
            });
        }
    }

    public retrieveServiceAcountAccessTokenJson = async (configuration: any): Promise<any> => {

        console.log('retrieveServiceAcountAccessTokenJson has been invoked : ');


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
                console.log('Success retrieveServiceAcountAccessTokenJson :', result);
                return result;
            })
            .catch((error) => {
                console.error('Error retrieveServiceAcountAccessTokenJson :', error);
            });


    }

    public retrieveServiceAcountAccessToken(configuration: any): string | PromiseLike<any> {
        console.log('retrieveServiceAcountAccessToken() has been invoked.');
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
                console.log('Success for ServiceAcountAccessToken:', result);
                return result;
            }
            ).catch(error => console.log('error for ServiceAcountAccessToken', error));
        return null;
    }
}