import * as React from 'react';
import styles from './ConsumeApi.module.scss';
import { IConsumeApiProps } from './IConsumeApiProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IConsumeApiStates } from './IConsumeApiStates';
import { AuthenticationHelper } from '../helper/AuthenticationHelper';
import { APIInvoker } from '../helper/APIInvoker';

export default class ConsumeApi extends React.Component<IConsumeApiProps, IConsumeApiStates> {

  private webPartConfiguration: any;
  private authenticationHelper: AuthenticationHelper;
  private accessToken: string;
  private aPIInvoker: APIInvoker;



  public constructor(props: IConsumeApiProps, state: IConsumeApiStates) {
    super(props);
    this.webPartConfiguration = this.populateConfiguration();
    this.authenticationHelper = new AuthenticationHelper(this.webPartConfiguration);
    this.aPIInvoker = new APIInvoker();
    this.state = {
      result: "",
      accessToken:""
    }

  }
  populateConfiguration(): any {

    return {
      clientId: this.props.ClientId,
      tenantId: this.props.TenantId,
      redirectUrl: this.props.RedirectUrl,
      scope: (this.props.Scope) ? JSON.parse(this.props.Scope) : [],
      apiURL: this.props.APIURL,
      OcpApimSubscriptionKey: this.props.OcpApimSubscriptionKey,
      OcpApimTrace: this.props.OcpApimTrace,
      RequestObject: this.props.RequestObject,
      APImethod: this.props.APImethod
    };
  }
  async componentDidMount() {
    this.accessToken = await this.authenticationHelper.retrieveAccessToken();
    console.log('access token: ' + this.accessToken);
   
    this.setState({accessToken: this.accessToken});
    await this.getResults();
   
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
          this.setState({result: response});
        }
      ).catch(ex => {
        console.log(ex)
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
