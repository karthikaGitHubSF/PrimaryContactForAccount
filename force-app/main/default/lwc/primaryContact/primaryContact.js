// relatedContacts.js
import { LightningElement, wire, api,track } from 'lwc';
//import { updateRecord } from 'lightning/uiRecordApi';
import getRelatedContact from '@salesforce/apex/RelatedContactController.getRelatedContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import updateRec from '@salesforce/apex/updateContactController.updateRec';
import LightningConfirm from 'lightning/confirm';
export default class RelatedContactsComponent extends LightningElement {
    @api recordId;  // Automatically passed from the Account record page
    @track contactdata=[];
    flag=false;
    @track wiredResponse;
    @track error;
    @track selectedContact;
    @track columns = [
        { label: 'Contact ID', fieldName: 'Id' },
        { label: 'Lastname', fieldName: 'LastName' }
    ];
  
    @wire(getRelatedContact, { AccountId: '$recordId' })
    relatedContacts({ data, error }) {
        this.wiredResponse=data;
        if (data) {
            this.contactdata=data;
            console.log('Data:',JSON.stringify(data));
                  } 
        else if (error) {
            this.error = error;
            console.error('Error:', error);
        }
    }
    handleRowSelection(event)
    {
        this.selectedContact=event.detail.selectedRows[0];
    }
    handlePrimaryContact(event) {
        console.log('button');   
        if (!this.selectedContact) {
            console.log('no sel');
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Error', message: 'Please select a contact to update', variant: 'error' })
            );
            return;
        }
    
        console.log(this.selectedContact);
        for (var i = 0; i < this.contactdata.length; i++) {
            console.log('loop');
            console.log(this.contactdata[i].Id);
            console.log(this.contactdata[i].IsPrimary__c);
            
            if (this.contactdata[i].IsPrimary__c == true) {
                this.flag = true;
                console.log('Flag ' + this.flag);
            }
        }
    
        if (this.flag == true) {
            console.log('true flag, invoke confirm');
            this.getConfirm();
        } else {
            console.log('false flag, invoke updateContact');
            this.updateContact();
        }
    }
    
    getConfirm() {
        console.log('confirm');
    
        LightningConfirm.open({
            message: 'Already this Account has a Primary Contact. Do you want to change it?',
            variant: 'headerless',
            label: 'Confirm Changing Primary Contact'
        })
        .then((result) => { // Arrow function keeps `this`
            if (result) {
                this.updateContact();
            }
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Error', message: error.body.message, variant: 'error' })
            );
            console.error('Update Error:', error);
        });
    }
    
    updateContact() {
        console.log('update');
        updateRec({ recordId: this.selectedContact.Id, conList: this.contactdata })
        .then((str) => {
            console.log(str);
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Success', message: 'Contact updated successfully', variant: 'success' })
            );
            return refreshApex(this.wiredResponse); 
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({ title: 'Error', message: error.body.message, variant: 'error' })
            );
            console.error('Update Error:', error);
        });
    }
    

       /* const fields = {
                Id: this.selectedContact.Id,
                IsPrimary__c : true
        };
        /*console.log(this.selectedContact);
        fields.Id = this.selectedContact.Id;
        fields.IsPrimary__c = True; // Change the LastName field
        console.log(fields);
        const recordInput = { fields };
        console.log(recordInput);
        /*updateRecord(recordInput)
            .then(() => {
                console.log('success');
                // ')
                this.dispatchEvent(
                    new ShowToastEvent({title : 'Success',message : 'Contact updated successfully', variant: 'success'}));
                return refreshApex(this.wiredResponse); // Refresh the data
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({title: 'Error', message: error.body.message,variant: 'error'}));
                console.error('Update Error:', error);
            });*/

    
    
}


    

