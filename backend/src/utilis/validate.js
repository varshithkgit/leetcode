const validator=require("validator");

function validate(data){
    const mandatoryField=["firstname","emailID","password"];
    const isAllowed= mandatoryField.every(u=> Object.keys(data).includes(u));

    if(!isAllowed){
        throw new Error("Field Missing");
    }

    if(!validator.isEmail(data.emailID))
        throw new Error("Not a correct formatted email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Not a strong password");
}

module.exports=validate;