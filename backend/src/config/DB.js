const mongoose=require("mongoose");

async function main(){
    await mongoose.connect("mongodb+srv://Vk3730:Hunter%40Hunter@codingbtp.cre8vqi.mongodb.net/LeetCode");
}

module.exports=main;