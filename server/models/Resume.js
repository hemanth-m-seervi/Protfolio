import mongoose from 'mongoose';
const schema=new mongoose.Schema({track:{type:String,required:true,uppercase:true},file:{url:String,publicId:String,fileId:String,resourceType:String,originalName:String},isDefault:{type:Boolean,default:false},published:{type:Boolean,default:true},order:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('Resume',schema);
