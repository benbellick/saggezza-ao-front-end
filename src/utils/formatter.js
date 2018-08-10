const noPhoneReturn = "No Phone Number";
const noSalaryReturn = "No Salary Info";
const noName = "Please enter:";

export default {
    salary(salary) {
        if(typeof salary !== "string"){
        salary = salary.toString();
        }
        if (parseFloat(salary) === -1) {
            return noSalaryReturn;
        } else if (salary===""){
            return "";
        } else {
            let output = "";
            for (let k = 0; k < salary.length && k < 15; k++) {
                output = salary[salary.length - 1 - k] + output;
                if ((k + 1) % 3 === 0 && k !==salary.length-1) {
                    output = "," + output;
                }

            }
            output = "$" + output;
            return output;
        }
    },
    //no email function as of now bc unclear which characters are unusable;


    phone(phone) {
        console.log(phone);
        if(typeof phone !== "string"){
            phone = phone.toString();
        }
        if(phone[0] !== '+') {
            phone = '';
        }

        return phone;

    },

    dateToString(date) {
        return date.toString();
    },


    phoneToString(number) {
        if(number===noPhoneReturn){
            return '-1';
        } else{
            let output= number.replace(/[^0-9\.\+]/g, '');
            console.log("whats going on", output);
            if(output.length>=10){
                return output.substring(0,10);
            }if(output.length===0){
                return '-1';
            }
            return output;
        }


    },
    salaryToNumber(salary) {

        if(salary===noSalaryReturn){
            return -1;
        } else{
            return parseInt(salary.replace(/[^0-9\.]/g, ''), 10);
        }
    },

    name(name) {
            return name.replace(/[^a-zA-Z ]/g, "");
    },
    
    date(date) {
        //Do something about the default
        return date.substring(0, 10);
    }
}