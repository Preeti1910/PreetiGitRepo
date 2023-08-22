declare interface ISharePointRestAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  BasicGroupName:string;
  RedirectionDetailsGroupName:string;
  RedirectURLFieldLabel:string;
  ParamNameFieldLabel:string;
}

declare module 'SharePointRestAdaptiveCardExtensionStrings' {
  const strings: ISharePointRestAdaptiveCardExtensionStrings;
  export = strings;
}
