import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},year:String,description:String,technologies:[String],issuer:String,credentialUrl:String,image:{url:String,publicId:String},published:{type:Boolean,default:true},order:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Certificate',schema);
