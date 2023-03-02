/**
 * The static configuration.
 */
export class Configuration {


    public static APIAuthOptions = [
        {
            key: 'UserAcountAccesssToken',
            text: 'User Acount Accesss Token (MSAL)'
        },
        {
            key: 'UsingAADHttpClient',
            text: 'Using AAD HttpClient'
        },
        {
            key: 'ServiceAcountAccessToken',
            text: 'Service Acount Access Token'
        },
        {
            key: 'ExternalAPI',
            text: 'External API'
        }
    ];

    public static GrantTypeOptions = [
        {
            key: 'client_credentials',
            text: 'client_credentials'
        },
        {
            key: 'password',
            text: 'password'
        }
    ];

  
}