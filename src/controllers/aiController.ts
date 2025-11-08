import { Request, Response } from "express";
import { getPool } from "../db/config.js";
import { OpenAI } from "openai"; // use named import, not default

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeFarmData(req: Request, res: Response): Promise<void> {
  try {
    console.log("Received request:", req.body);
    const { farmName, data } = req.body as { farmName: string; data: string };

    console.log("Connecting to database...");
    const pool = await getPool();

    console.log("Sending request to OpenAI...");
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI agriculture analyst with cyber risk intelligence." },
        { role: "user", content: `Analyze this farm data for sustainability and security risks: ${data}` },
      ],
    });

    console.log("Got AI response:", aiResponse.choices?.[0]?.message?.content);

    const result = aiResponse.choices?.[0]?.message?.content || "No analysis found.";

    console.log("Inserting result into database...");
    await pool.request()
      .input("farmName", farmName)
      .input("data", data)
      .input("result", result)
      .query(`
        INSERT INTO analyses (farmName, data, result, createdAt)
        VALUES (@farmName, @data, @result, GETDATE())
      `);

    console.log("Data inserted successfully");
    res.json({ farmName, result });
  } catch (error: any) {
    console.error("Error analyzing farm data:", error?.response?.data || error?.message || error);
    res.status(500).json({
      error: "Analysis failed",
      details: error?.response?.data || error?.message || "Unknown error"
    });
  }
}
