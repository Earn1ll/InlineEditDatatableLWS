import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Rating', fieldName: 'Rating', type: 'picklist', editable: true,
        typeAttributes:{placeholder:'Rating', options:[
            { label: 'Hot', value: 'Hot' },
            { label: 'Warm', value: 'Warm' },
            { label: 'Cold', value: 'Cold' },
        ]}
    },
    { label: '', type: "button-icon", fixedWidth: 100, typeAttributes: {
        name: 'Delete',
        iconName: 'utility:delete',
        class: 'slds-m-left_xx-small',
        variant: 'bare',
        title: 'Delete',} 
    },
];

export default class AccountsDatatable extends LightningElement {
    columns = columns;
    @track accObj;
    wiredAccountResult;
    fldsItemValues = [];
    error;
 
    @wire(getAccounts)
    cons(result) {
        this.accObj = result;
        if (result.error) {
            this.accObj = undefined;
        }
    };
 
    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }
    async refresh() {
        await refreshApex(this.accObj);
    }
    
    handleRowAction(event) {
		if (event.detail.action.name === "Delete") {
			deleteRecord(event.detail.row.Id).then(() => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Success',
						message: "Record deleted successfully!",
						variant: 'success'
					})
				);
                refreshApex(this.wiredAccountResult);
			}).catch((error) => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Error deleting record',
						message: error.body.message,
						variant: 'error'
					})
				);
			})
		}
	}
}
