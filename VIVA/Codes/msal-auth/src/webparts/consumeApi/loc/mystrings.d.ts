declare interface IConsumeApiWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AadAppConfigurationGroupName: string;
  ClientIdFieldLabel: string;
  TenantIdFieldLabel: string;
  RedirectUrlFieldLabel: string;
  ScopeFieldLabel: string;
  APIConfigurationGroupName: string;
  APIURLFieldLabel: string;
  APIMethodFieldLabel: string;
  OcpApimTraceFieldLabel: string;
  OcpApimSubscriptionKeyFieldLabel: string;
  RequestObjectFieldLabel: string;
}

declare module 'ConsumeApiWebPartStrings' {
  const strings: IConsumeApiWebPartStrings;
  export = strings;
}
