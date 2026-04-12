require('dotenv').config();
const express = require('express');
const app = express();
const path= require ('path');
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
let userLoginData;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function startServer() {
   await client.connect();
console.log("Connected to MongoDB");

const db = client.db("dbs");
const userLoginData = db.collection("userLoginData");
const chatLogs = db.collection("chatLogs");
const id = req.session.id;

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, id } = req.body;

        const result = await userLoginData.insertOne({
            name,
            email,
            password,
            id,
            createdAt: new Date()
        });

        res.json({ success: true, id: result.insertedId });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ success: false, message: "Signup failed." });
    }
});

app.post("/api/chat", async (req, res) => {
    try {
        console.log("CHAT ROUTE VERSION A");
        if (!userMessage || !userMessage.trim()) {
            return res.status(400).json({ error: "Message is required." });
        }
        const aiResponse = await fetch("https://ollama.com/api/generate", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-oss:120b",
                prompt: userMessage,
                stream: false
            })
        });
        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error("Ollama API error:", aiResponse.status, errorText);
            return res.status(aiResponse.status).json({
                error: "AI request failed.",
                details: errorText
            });
        }
        const responseData = await aiResponse.json();
        const reply = responseData.response || "No response";

        const user = req.session.user;
        if (user) {
        console.log("logged in 4 real")
        chatLogs.insertOne({
            userMessage,
            reply,
            id,
            createdAt: new Date()
        });
        }
        
        console.log("Reached past the ollama part")
         //only store if the user is logged in
        if(loggedIn){
            const result = await chatLogs.insertOne({
            userMessage,
            id,
            reply,
            createdAt: new Date()
        });
        }
        else{
            console.log("false for some reason");
        }

        res.json({ reply });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
}

startServer();

