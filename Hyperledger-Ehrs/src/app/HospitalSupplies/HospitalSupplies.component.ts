/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HospitalSuppliesService } from './HospitalSupplies.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-HospitalSupplies',
	templateUrl: './HospitalSupplies.component.html',
	styleUrls: ['./HospitalSupplies.component.css'],
  providers: [HospitalSuppliesService]
})
export class HospitalSuppliesComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          supplyID = new FormControl("", Validators.required);
        
  
      
          drugName = new FormControl("", Validators.required);
        
  
      
          drugAmount = new FormControl("", Validators.required);
        
  


  constructor(private serviceHospitalSupplies:HospitalSuppliesService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          supplyID:this.supplyID,
        
    
        
          drugName:this.drugName,
        
    
        
          drugAmount:this.drugAmount
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceHospitalSupplies.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "ehr.economics.HospitalSupplies",
      
        
          "supplyID":this.supplyID.value,
        
      
        
          "drugName":this.drugName.value,
        
      
        
          "drugAmount":this.drugAmount.value
        
      
    };

    this.myForm.setValue({
      
        
          "supplyID":null,
        
      
        
          "drugName":null,
        
      
        
          "drugAmount":null
        
      
    });

    return this.serviceHospitalSupplies.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "supplyID":null,
        
      
        
          "drugName":null,
        
      
        
          "drugAmount":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "ehr.economics.HospitalSupplies",
      
        
          
        
    
        
          
            "drugName":this.drugName.value,
          
        
    
        
          
            "drugAmount":this.drugAmount.value
          
        
    
    };

    return this.serviceHospitalSupplies.updateAsset(form.get("supplyID").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceHospitalSupplies.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceHospitalSupplies.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "supplyID":null,
          
        
          
            "drugName":null,
          
        
          
            "drugAmount":null 
          
        
      };



      
        if(result.supplyID){
          
            formObject.supplyID = result.supplyID;
          
        }else{
          formObject.supplyID = null;
        }
      
        if(result.drugName){
          
            formObject.drugName = result.drugName;
          
        }else{
          formObject.drugName = null;
        }
      
        if(result.drugAmount){
          
            formObject.drugAmount = result.drugAmount;
          
        }else{
          formObject.drugAmount = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "supplyID":null,
        
      
        
          "drugName":null,
        
      
        
          "drugAmount":null 
        
      
      });
  }

}
