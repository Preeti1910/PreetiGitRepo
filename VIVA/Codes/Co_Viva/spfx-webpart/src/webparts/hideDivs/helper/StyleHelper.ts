
export class StyleHelper {

    /**
     * This method is used to hide any OOTB elements on search page.
     */
    public static HideOOTBElements() {
      this.hideElements();
      setTimeout(() => {
        this.hideElements();
      }, 500);
    }
  
    private static hideElements() {
     
      if (document.getElementById('spSiteHeader')) {
        document.getElementById('spSiteHeader').style.display = 'none'
      }
  
      if (document.getElementById('sp-appBar')) {
        document.getElementById('sp-appBar').style.display = 'none'
      }

      if (document.getElementById('HeaderButtonRegion')) {
        document.getElementById('HeaderButtonRegion').style.display = 'none'
      }
  
      
    }
  }