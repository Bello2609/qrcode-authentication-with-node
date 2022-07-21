const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrcodeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    connectedDeviceId: {
        type: Schema.Types.ObjectId,
        ref: "ConnectedDevice",
        required: true
    },
    lastUsedDate: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }


});
module.exports = mongoose.model("Qrcode", qrcodeSchema);