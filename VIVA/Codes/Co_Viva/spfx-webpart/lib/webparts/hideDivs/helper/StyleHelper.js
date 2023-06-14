var StyleHelper = /** @class */ (function () {
    function StyleHelper() {
    }
    /**
     * This method is used to hide any OOTB elements on search page.
     */
    StyleHelper.HideOOTBElements = function () {
        var _this = this;
        this.hideElements();
        setTimeout(function () {
            _this.hideElements();
        }, 500);
    };
    StyleHelper.hideElements = function () {
        if (document.getElementById('spSiteHeader')) {
            document.getElementById('spSiteHeader').style.display = 'none';
        }
        if (document.getElementById('sp-appBar')) {
            document.getElementById('sp-appBar').style.display = 'none';
        }
        if (document.getElementById('HeaderButtonRegion')) {
            document.getElementById('HeaderButtonRegion').style.display = 'none';
        }
    };
    return StyleHelper;
}());
export { StyleHelper };
//# sourceMappingURL=StyleHelper.js.map