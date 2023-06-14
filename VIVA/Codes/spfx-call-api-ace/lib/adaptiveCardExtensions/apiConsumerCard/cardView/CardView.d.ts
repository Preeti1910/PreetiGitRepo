import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState } from '../ApiConsumerCardAdaptiveCardExtension';
export declare class ICardViewProps {
    primaryText: string;
    title: string;
    constructor();
}
export declare class CardView extends BaseBasicCardView<IApiConsumerCardAdaptiveCardExtensionProps, IApiConsumerCardAdaptiveCardExtensionState> {
    private cardViewProps;
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map