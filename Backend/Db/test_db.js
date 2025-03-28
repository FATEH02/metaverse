import pg from "pg";

const client = new pg.Client({
  connectionString: "postgresql://metaverse_85ig_user:IiYlnTqzeoApUjrrGfSp6qzFrY7XnwDv@dpg-cvj1j66uk2gs73b0korg-a.singapore-postgres.render.com/metaverse_85ig",
  ssl: { rejectUnauthorized: false } // Required for Render
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL!");
    const res = await client.query("SELECT NOW()");
    console.log("Current Time:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}

testConnection();
