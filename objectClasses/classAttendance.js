class Class_Attendance {
    constructor(userId, classId, timeAttended, timesPaid, attendanceStatus, payStatus) {
        this.userId = userId;
        this.classId = classId;
        this.timeAttended = timeAttended;
        this.timesPaid = timesPaid;
        this.attendanceStatus = attendanceStatus;
        this.payStatus = payStatus;
    }
}

module.exports = Class_Attendance;