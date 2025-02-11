import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
    Assets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    Journey_Type: {
        type: String,
        required: true
    },
    Occupancy: {
        type: Number,
        required: true
    },

    SOS_Status: {
        type: String,
        default: 'inActive'
    }
}, { timestamps: true });

const Journey = mongoose.model('Journey', journeySchema);
export default Journey;
