(window["webpackJsonp_75aa3afa_6d3e_4382_8d3c_8e14a15a2d96_0_0_1"] = window["webpackJsonp_75aa3afa_6d3e_4382_8d3c_8e14a15a2d96_0_0_1"] || []).push([["ApiConsumerCard-property-pane"],{

/***/ "6k3C":
/*!***********************************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/apiConsumerCard/ApiConsumerCardPropertyPane.js ***!
  \***********************************************************************************/
/*! exports provided: ApiConsumerCardPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiConsumerCardPropertyPane", function() { return ApiConsumerCardPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ApiConsumerCardAdaptiveCardExtensionStrings */ "Zr+z");
/* harmony import */ var ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var ApiConsumerCardPropertyPane = /** @class */ (function () {
    function ApiConsumerCardPropertyPane() {
    }
    ApiConsumerCardPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupName: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["BasicGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('primaryTextCustom', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PrimaryTextCustomFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupName: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["APIGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('apiURL', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["APIURLFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('aadAplicationResource', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AADAplicationResourceFieldLabel"]
                                })
                            ]
                        },
                        {
                            groupName: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AppInsightsGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('applicationName', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["ApplicationNameFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('appInsightsConnectionString', {
                                    label: ApiConsumerCardAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["AppInsightsConnectionStringFieldLabel"]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return ApiConsumerCardPropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.ApiConsumerCard-property-pane.js.map