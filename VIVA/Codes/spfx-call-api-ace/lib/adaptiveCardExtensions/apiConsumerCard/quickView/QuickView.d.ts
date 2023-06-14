import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState } from '../ApiConsumerCardAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
}
export declare class QuickView extends BaseAdaptiveCardView<IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map