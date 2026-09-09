import mongoose from 'mongoose';

const testUris = [
  'mongodb+srv://gbolahanbakry111_db_user:GfYZWXXp0SDEC6zJ@cluster0.spqpfaw.mongodb.net/trusty_real_estate?retryWrites=true&w=majority',
  'mongodb+srv://gbolahanbakry111_db_user:GfYZWXXp0SDEC6zJ@cluster0.spqpfaw.mongodb.net/?retryWrites=true&w=majority',
  'mongodb+srv://gbolahanbakry111_db_user:GfYZWXXp0SDEC6zJ@cluster0.spqpfaw.mongodb.net/test?retryWrites=true&w=majority',
  'mongodb+srv://gbolahanbakry111_db_user:GfYZWXXp0SDEC6zJ@cluster0.spqpfaw.mongodb.net/trusty?retryWrites=true&w=majority&authSource=admin',
];

async function testAll() {
  for (const uri of testUris) {
    console.log(`\nTesting URI: ${uri}`);
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(` Connected! Host: ${conn.connection.host}`);
      await mongoose.disconnect();
      return;
    } catch (err) {
      console.log(` Failed: ${err.message}`);
    }
  }
}

testAll();
