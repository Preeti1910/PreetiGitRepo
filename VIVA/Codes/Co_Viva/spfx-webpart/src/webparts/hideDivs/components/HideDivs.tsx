import * as React from 'react';

import { IHideDivsProps } from './IHideDivsProps';

import { StyleHelper } from '../helper/StyleHelper';

export default class HideDivs extends React.Component<IHideDivsProps, {}> {

  constructor(props:IHideDivsProps){
    super(props);
    StyleHelper.HideOOTBElements();

   
    var a = document.createElement('a');
    a.href = "https://www.google.com"; 
    a.id ="navigateTo";
    a.target="_blank";
    document.body.appendChild(a);
   // document.getElementById('navigateTo').click();
    //window.open("http://www.google.com",'_blank');
  }

  componentDidMount(){
    console.log('componentDidMount called');
    document.getElementById('navigateTo').click();
  }

  
  public render(): React.ReactElement<IHideDivsProps> {
    

    return (
      <section>

        <div>
        
        
        </div>
      </section>
    );
  }
}
