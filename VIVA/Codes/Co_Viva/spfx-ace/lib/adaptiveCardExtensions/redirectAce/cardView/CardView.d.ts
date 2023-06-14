import { BaseBasicCardView, IBasicCardParameters, IExternalLinkCardAction, IQuickViewCardAction, ICardButton } from '@microsoft/sp-adaptive-card-extension-base';
import { IRedirectAceAdaptiveCardExtensionProps, IRedirectAceAdaptiveCardExtensionState } from '../RedirectAceAdaptiveCardExtension';
export declare class CardView extends BaseBasicCardView<IRedirectAceAdaptiveCardExtensionProps, IRedirectAceAdaptiveCardExtensionState> {
    get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined;
    get data(): IBasicCardParameters;
    get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined;
}
//# sourceMappingURL=CardView.d.ts.map