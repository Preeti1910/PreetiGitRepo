import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IApiConsumerCardAdaptiveCardExtensionProps {
    title: string;
    apiURL: string;
    primaryTextCustom: string;
    aadAplicationResource: string;
    applicationName: string;
    appInsightsConnectionString: string;
}
export interface IApiConsumerCardAdaptiveCardExtensionState {
    itemCount: string;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class ApiConsumerCardAdaptiveCardExtension extends BaseAdaptiveCardExtension<IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private aadServiceProvider;
    private loggerHelper;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=ApiConsumerCardAdaptiveCardExtension.d.ts.map