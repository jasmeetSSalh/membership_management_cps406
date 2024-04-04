class bankDetails {
    constructor(userId, expense, missedPayment) {
        this.userId = userId; //primary key
        this.expense = expense;
        this.missedPayment = missedPayment;
    }
}

module.exports = bankDetails;
