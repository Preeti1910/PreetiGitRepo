import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IConsumeApiProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  ClientId: string;
  TenantId: string;
  RedirectUrl: string;
  Scope: string;
  APIURL: string;
  OcpApimTrace: string;
  OcpApimSubscriptionKey: string;
  RequestObject:string;
  APImethod:string;
  AuthTokenTypeToGenerate:string;
  grantType:string;
  clientSecret:string;
  externalTokenURL:string;
  externalURLSuffix:string;
  context:WebPartContext;  
  applicationName:string;  
  appInsightsConnectionString:string;  
}
