export class APIInvoker {

    /**
    * Method to retrieve search results for external.
    * @param requestPayload the request payload.
    * @returns the search results.
    */
    public callAPI = async (requestPayload: any): Promise<any> => {

        console.log('callAPI() has been invoked : ');

        var apiURL = requestPayload.apiURL;
        var requestObj = requestPayload.requestObj;
        var payload = requestObj ? JSON.stringify(requestObj) : '';                   

        return fetch(apiURL, {
            method: requestPayload.APImethod,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + requestPayload.accessToken,
                "Ocp-Apim-Trace": requestPayload.OcpApimTrace,
                "Ocp-Apim-Subscription-Key": requestPayload.OcpApimSubscriptionKey                
            }
           // body: payload
        }).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                return result;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            

    }
}