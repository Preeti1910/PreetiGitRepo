import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IAppSearchAdaptiveCardExtensionProps, IAppSearchAdaptiveCardExtensionState } from '../AppSearchAdaptiveCardExtension';
export declare class CardView extends BaseBasicCardView<IAppSearchAdaptiveCardExtensionProps, IAppSearchAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map