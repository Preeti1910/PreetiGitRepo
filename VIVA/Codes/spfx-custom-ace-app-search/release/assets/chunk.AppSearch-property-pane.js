(window["webpackJsonp_441f940c_c13a_423c_9850_ae692e51237a_0_0_1"] = window["webpackJsonp_441f940c_c13a_423c_9850_ae692e51237a_0_0_1"] || []).push([["AppSearch-property-pane"],{

/***/ "n5Bi":
/*!***********************************************************************!*\
  !*** ./lib/adaptiveCardExtensions/appSearch/AppSearchPropertyPane.js ***!
  \***********************************************************************/
/*! exports provided: AppSearchPropertyPane */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppSearchPropertyPane", function() { return AppSearchPropertyPane; });
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var AppSearchAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! AppSearchAdaptiveCardExtensionStrings */ "IOdL");
/* harmony import */ var AppSearchAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(AppSearchAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__);


var AppSearchPropertyPane = /** @class */ (function () {
    function AppSearchPropertyPane() {
    }
    AppSearchPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: AppSearchAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["PropertyPaneDescription"] },
                    groups: [
                        {
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_0__["PropertyPaneTextField"])('title', {
                                    label: AppSearchAdaptiveCardExtensionStrings__WEBPACK_IMPORTED_MODULE_1__["TitleFieldLabel"]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AppSearchPropertyPane;
}());



/***/ })

}]);
//# sourceMappingURL=chunk.AppSearch-property-pane.js.map