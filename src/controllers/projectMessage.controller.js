import ProjectMessage from '../models/projectMessage.model.js';

export const getProjectMessages = async (req, res) => {

    try {
        const messages = await ProjectMessage.find({ projectId: req.params.projectId })
            .populate("sender", "username _id")
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export const saveMessage = async (req, res) => {

    try {
        const { projectId, sender, message } = req.body;

        const newMsg = new ProjectMessage({ projectId, sender, message });
        await newMsg.save();

        res.status(201).json({ success: true, data: newMsg });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}