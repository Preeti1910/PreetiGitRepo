import * as React from 'react';
import styles from './ConsumeApi.module.scss';
import { IConsumeApiProps } from './IConsumeApiProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IConsumeApiStates } from './IConsumeApiStates';
import { AuthenticationHelper } from '../helper/AuthenticationHelper';
import { APIInvoker } from '../helper/APIInvoker';
import { ServiceProvider } from '../helper/ServiceProvider';
import { AADServiceProvider } from '../helper/AADServiceProvider';
import { LoggerHelper } from '../helper/LoggerHelper';

export default class ConsumeApi extends React.Component<IConsumeApiProps, IConsumeApiStates> {

  private webPartConfiguration: any;
  private authenticationHelper: AuthenticationHelper;
  private accessToken: string;
  private aPIInvoker: APIInvoker;
  private serviceProvider: ServiceProvider;
  private aadServiceProvider: AADServiceProvider;
  private loggerHelper: LoggerHelper;



  public constructor(props: IConsumeApiProps, state: IConsumeApiStates) {
    super(props);
    this.webPartConfiguration = this.populateConfiguration();
    this.loggerHelper = new LoggerHelper(this.webPartConfiguration.applicationName, this.webPartConfiguration.appInsightsConnectionString);
    this.authenticationHelper = new AuthenticationHelper(this.webPartConfiguration);
    this.aPIInvoker = new APIInvoker();
    this.state = {
      result: "",
      accessToken: ""
    }


    // this.serviceProvider = new ServiceProvider(this.props.context);

  }
  populateConfiguration(): any {

    return {
      clientId: this.props.ClientId,
      tenantId: this.props.TenantId,
      redirectUrl: this.props.RedirectUrl,
      //scope: (this.props.Scope) ? JSON.parse(this.props.Scope) : [],
      scope: this.props.Scope,
      apiURL: this.props.APIURL,
      OcpApimSubscriptionKey: this.props.OcpApimSubscriptionKey,
      OcpApimTrace: this.props.OcpApimTrace,
      RequestObject: this.props.RequestObject,
      authTokenTypeToGenerate: this.props.AuthTokenTypeToGenerate,
      APImethod: this.props.APImethod,
      grantType: this.props.grantType,
      clientSecret: this.props.clientSecret,
      externalTokenURL: this.props.externalTokenURL,
      externalURLSuffix: this.props.externalURLSuffix,
      context: this.props.context,
      applicationName: this.props.applicationName,
      appInsightsConnectionString: this.props.appInsightsConnectionString
    };
  }
  async componentDidMount() {

    if (this.webPartConfiguration.authTokenTypeToGenerate === "UserAcountAccesssToken") {
      // this.accessToken = await this.authenticationHelper.retrieveAccessToken(['api://399557e2-0984-4a3a-868c-d9093e395506/.default']);
      if (this.webPartConfiguration.scope) {
        this.accessToken = await this.authenticationHelper.retrieveAccessToken([this.webPartConfiguration.scope]);
      } else {
        this.accessToken = await this.authenticationHelper.retrieveAccessToken();
      }
      console.log('user access token: ' + this.accessToken);
      if (this.accessToken) {
        this.setState({ accessToken: this.accessToken });
        await this.getResults();
      }

    }else if (this.webPartConfiguration.authTokenTypeToGenerate === "UsingAADHttpClient") {
      this.aadServiceProvider = new AADServiceProvider(this.webPartConfiguration.context);
      await this.aadServiceProvider.getResponse(this.webPartConfiguration.apiURL,this.webPartConfiguration.scope).then(
        (result: any): void =>{
          console.log('result =' + result);
        }
      );

    }else if (this.webPartConfiguration.authTokenTypeToGenerate === "ServiceAcountAccessToken") {
      this.accessToken = await this.aPIInvoker.retrieveServiceAcountAccessTokenJson(this.webPartConfiguration);
      console.log('service account access token: ' + this.accessToken);
      if (this.accessToken) {
        this.setState({ accessToken: this.accessToken });
        await this.getResults();
      }
    } else if (this.webPartConfiguration.authTokenTypeToGenerate === "ExternalAPI") {

      // var resulttest = await this.aPIInvoker.test(this.webPartConfiguration);


      var result = await this.aPIInvoker.retrieveAccessTokenForexternal(this.webPartConfiguration);

      if (result) {
        const jsonData = JSON.parse(result);

        this.accessToken = jsonData.access_token;
        var instance_url = jsonData.instance_url;
        /*
        this.accessToken = result['access_token'];
        var instance_url = result['instance_url'];
        */

        var serviceURL = instance_url + this.webPartConfiguration.externalURLSuffix;

        var requestPayloadForMainResults = {
          accessToken: this.accessToken,
          apiURL: serviceURL,
          APImethod: this.props.APImethod,
          requestObj: this.props.RequestObject,
        }

        await this.getExternalAPIResults(requestPayloadForMainResults);
      }
    }

    //this.getData(); // using httpclient

  }

  private async getExternalAPIResults(requestPayload: any) {
    await this.aPIInvoker.callAPI(requestPayload).then(
      (response: any): any => {
        console.log("getExternalAPIResults: " + response);
        this.setState({ result: response });
      }
    ).catch(ex => {
      console.log(ex)
      this.loggerHelper.trackException(ex, { message: 'Error occured in getExternalAPIResults.' });
    });
  }

  private getData() {
    this.serviceProvider.getTotals(this.webPartConfiguration.apiURL).then(
      (result: any): void => {
        console.log(result);
        //this.setState({data:result[0]});  
      }
    )
      .catch(error => {
        console.log(error);
      });
  }

  private async getResults() {
    if (this.state.accessToken) {
      var requestPayloadForMainResults = {
        accessToken: this.state.accessToken,
        apiURL: this.props.APIURL,
        APImethod: this.props.APImethod,
        OcpApimSubscriptionKey: this.props.OcpApimSubscriptionKey,
        OcpApimTrace: this.props.OcpApimTrace,
        RequestObject: this.props.RequestObject,
      }
      await this.aPIInvoker.callAPI(requestPayloadForMainResults).then(
        (response: any): any => {
          console.log(response);
          this.setState({ result: response });
        }
      ).catch(ex => {
        console.log(ex);
        this.loggerHelper.trackException(ex, { message: 'Error occured in getResults.' });
      });

    }
  }

  public render(): React.ReactElement<IConsumeApiProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,

    } = this.props;


    return (
      <section className={`${styles.consumeApi} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
          <div>Web part property value for clientId: <strong>{escape(this.webPartConfiguration.clientId)}</strong></div>
          <hr></hr>
          <div>API result: <strong>{this.state.result}</strong></div>


        </div>

      </section>
    );
  }
}
