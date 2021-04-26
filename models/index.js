import mongoose from 'mongoose';

const uri =
  'mongodb+srv://bootcmapo:admin@cluster0.t1pxw.mongodb.net/grades?retryWrites=true&w=majority';

//Conectar ao MongoDB pelo mongoose
const db = (async () => {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado com sucesso ao MongoDB');
  } catch (error) {
    console.log('Erro ao conectar ao MongoDB,' + error);
  }
})();

export { db };
