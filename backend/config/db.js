const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL, {
            tlsAllowInvalidCertificates: true,  // Fix SSL cert verify error on Windows
            family: 4                            // Force IPv4
        });

        console.log("✅ MongoDB Connected Successfully");

    } catch (error) {

        console.error("❌ MongoDB Connection Failed:", error.message);
        console.error("⚠️  Check MongoDB Atlas IP Whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/");
        // Do not exit — server will still run; DB-dependent routes will fail gracefully

    }
};

module.exports = connectDB;