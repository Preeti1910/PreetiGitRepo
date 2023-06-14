(window["webpackJsonp_977c2b2c_2dfa_4bc4_80c5_78479b203d6c_0_0_1"] = window["webpackJsonp_977c2b2c_2dfa_4bc4_80c5_78479b203d6c_0_0_1"] || []).push([["RedirectAce-property-pane"],{

/***/ "V1CQ":
/*!***************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/redirectAce/RedirectAcePropertyPane.js ***!
  \***************************************************************************/
/*! exports provided: RedirectAcePropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectAcePropertyPane", function() { return RedirectAcePropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! RedirectAceAdaptiveCardExtensionStrings */ "G0jW");
/* harmony import */ var RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var RedirectAcePropertyPane = /** @class */ (function () {
    function RedirectAcePropertyPane() {
    }
    RedirectAcePropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupName: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["BasicGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupName: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AppInsightsGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('applicationName', {
                                    label: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["ApplicationNameFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('appInsightsConnectionString', {
                                    label: RedirectAceAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AppInsightsConnectionStringFieldLabel"]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return RedirectAcePropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.RedirectAce-property-pane.js.map