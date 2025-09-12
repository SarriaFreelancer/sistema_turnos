import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    const mongoURI = isProduction
      ? process.env.MONGO_URI_PROD    // MongoDB en Railway
      : process.env.MONGO_URI_LOCAL;  // MongoDB local

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado en ${isProduction ? "producción" : "desarrollo"}`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1); // Detiene la app si no puede conectar
  }
};

export default connectDB;
