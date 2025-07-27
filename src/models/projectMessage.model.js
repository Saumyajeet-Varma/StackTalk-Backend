import mongoose from "mongoose";

const projectMessageSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    message: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProjectMessage = mongoose.model("projectMessage", projectMessageSchema);

export default ProjectMessage;