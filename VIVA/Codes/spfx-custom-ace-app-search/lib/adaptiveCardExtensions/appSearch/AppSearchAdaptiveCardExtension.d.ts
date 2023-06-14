import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IAppSearchAdaptiveCardExtensionProps {
    title: string;
}
export interface IAppSearchAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class AppSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<IAppSearchAdaptiveCardExtensionProps, IAppSearchAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=AppSearchAdaptiveCardExtension.d.ts.map