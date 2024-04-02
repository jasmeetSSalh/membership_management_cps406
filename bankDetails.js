class bankDetails {
    constructor(id, address, expenses, payStatus, timesPaid, missedPayment) {
        this.id = id; //foreign key
        this.address = address;
        this.expenses = expenses;
        this.payStatus = payStatus;
        this.timesPaid = timesPaid;
        this.missedPayment = missedPayment;

        
    }

}