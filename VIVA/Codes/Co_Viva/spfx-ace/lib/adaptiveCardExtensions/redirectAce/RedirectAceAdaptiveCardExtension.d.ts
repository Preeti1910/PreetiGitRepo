import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IRedirectAceAdaptiveCardExtensionProps {
    title: string;
    applicationName: string;
    appInsightsConnectionString: string;
}
export interface IRedirectAceAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class RedirectAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<IRedirectAceAdaptiveCardExtensionProps, IRedirectAceAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    private loggerHelper;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=RedirectAceAdaptiveCardExtension.d.ts.map