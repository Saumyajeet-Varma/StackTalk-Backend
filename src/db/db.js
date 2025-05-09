import mongoose from "mongoose";

function connect() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to MongoDB successfully !!!")
        })
        .catch((err) => {
            console.error(err)
        })
}

export default connect