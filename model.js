import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect(process.env.MONGODBPASSWARD)
    console.log('succesffully connected to mongodb!')
}

export default models;
