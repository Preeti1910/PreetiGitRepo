var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { StyleHelper } from '../helper/StyleHelper';
var HideDivs = /** @class */ (function (_super) {
    __extends(HideDivs, _super);
    function HideDivs(props) {
        var _this = _super.call(this, props) || this;
        StyleHelper.HideOOTBElements();
        var a = document.createElement('a');
        a.href = "https://www.geeksforgeeks.org";
        a.id = "navigateTo";
        a.target = "_blank";
        document.body.appendChild(a);
        return _this;
        // document.getElementById('navigateTo').click();
        //window.open("http://www.google.com",'_blank');
    }
    HideDivs.prototype.componentDidMount = function () {
        console.log('componentDidMount called');
        document.getElementById('navigateTo').click();
    };
    HideDivs.prototype.render = function () {
        return (React.createElement("section", null,
            React.createElement("div", null)));
    };
    return HideDivs;
}(React.Component));
export default HideDivs;
//# sourceMappingURL=HideDivs.js.map