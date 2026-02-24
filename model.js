import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://lunlunapply_db_user:jwbGo4hQlD4c4tjH@cluster0.jujocd9.mongodb.net/?appName=Cluster0')
    console.log('succesffully connected to mongodb!')
}

export default models;
