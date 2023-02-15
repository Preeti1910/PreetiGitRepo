import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ConsumeApiWebPartStrings';
import ConsumeApi from './components/ConsumeApi';
import { IConsumeApiProps } from './components/IConsumeApiProps';

export interface IConsumeApiWebPartProps {
  description: string;
  ClientId: string;
  TenantId: string;
  RedirectUrl: string;
  Scope: string;
  APIURL: string;
  OcpApimTrace: string;
  OcpApimSubscriptionKey: string;
  RequestObject: string;
  APImethod:string;
}

export default class ConsumeApiWebPart extends BaseClientSideWebPart<IConsumeApiWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public constructor(){
    super();
  }

  public render(): void {
    const element: React.ReactElement<IConsumeApiProps> = React.createElement(
      ConsumeApi,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        ClientId: this.properties.ClientId,
        TenantId: this.properties.TenantId,
        RedirectUrl: this.properties.RedirectUrl,
        Scope: this.properties.Scope,
        APIURL: this.properties.APIURL,
        OcpApimTrace: this.properties.OcpApimTrace,
        OcpApimSubscriptionKey: this.properties.OcpApimSubscriptionKey,
        RequestObject: this.properties.RequestObject,
        APImethod: this.properties.APImethod

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            },
            {
              groupName: strings.AadAppConfigurationGroupName,
              groupFields: [
                PropertyPaneTextField('ClientId', {
                  label: strings.ClientIdFieldLabel
                }),
                PropertyPaneTextField('TenantId', {
                  label: strings.TenantIdFieldLabel
                }),
                PropertyPaneTextField('RedirectUrl', {
                  label: strings.RedirectUrlFieldLabel
                }),
                PropertyPaneTextField('Scope', {
                  label: strings.ScopeFieldLabel
                })
              ]
            },
            {
              groupName: strings.APIConfigurationGroupName,
              groupFields: [
                PropertyPaneTextField('APIURL', {
                  label: strings.APIURLFieldLabel
                }),
                PropertyPaneTextField('APImethod', {
                  label: strings.APIMethodFieldLabel
                }),
                PropertyPaneTextField('OcpApimTrace', {
                  label: strings.OcpApimTraceFieldLabel
                }),
                PropertyPaneTextField('OcpApimSubscriptionKey', {
                  label: strings.OcpApimSubscriptionKeyFieldLabel
                })
                ,
                PropertyPaneTextField('RequestObject', {
                  label: strings.RequestObjectFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
