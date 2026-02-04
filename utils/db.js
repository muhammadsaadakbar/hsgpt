import mongoose from "mongoose";

// ⚠️ 1. Configuration Check
const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("⚠️ Please add MongoDB URI to the environment variables.");
}

// 🌐 2. Cache Initialization
// This global variable persists across hot-reloads in Next.js development mode.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB, ensuring a single connection is maintained.
 * @returns {Promise<typeof mongoose>} The Mongoose connection object.
 */
export default async function connect_db() {
  // 🟢 3. Return Cached Connection
  if (cached.conn) {
    console.log("✅ Database already connected (Cached)");
    return cached.conn;
  }

  // ⏳ 4. Wait for Existing Promise
  // If a connection is already being established, wait for that promise to resolve.
  if (cached.promise) {
    console.log("⏳ Waiting for existing connection attempt...");
    return cached.promise;
  }

  // 🛠️ 5. Set up Connection Options & Debugging
  const options = {
    // Note: Use the current, configured URI
  };

  // Optional: Enable debug logging for local development (highly recommended)
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  // 🚀 6. Start New Connection Attempt
  cached.promise = mongoose
    .connect(uri, options)
    .then((_mongoose) => {
      cached.conn = _mongoose;
      console.log("✅ Database Connected");
      return _mongoose;
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
      // Clear the promise on failure so a new attempt can be made next time
      cached.promise = null;
      throw new Error("Failed to connect to MongoDB.");
    });

  return cached.promise;
}
