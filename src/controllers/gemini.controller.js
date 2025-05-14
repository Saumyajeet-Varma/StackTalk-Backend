import { generateResult } from "../services/gemini.service.js";

export const getResult = async (req, res) => {

    try {
        const { prompt } = req.query

        const result = await generateResult(prompt)

        res.status(200).json({
            success: true,
            message: "Successfully got Gemini result",
            data: result
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong with Gemini",
            error: err.message,
        })
    }
}