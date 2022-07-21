const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectedDeviceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    qrcodeId: {
        type: Schema.Types.ObjectId,
        ref: "Qrcode",
        required: true
    },
    deviceName: {
        type: String,
        required: true,
        default: null
    },
    deviceModel: {
        type: String,
        required: true,
        default: null
    },
    deviceOs: {
        type: String,
        required: true,
        default: null
    },
    deviceVersion: {
        type: String,
        required: true,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    }

});
module.exports = mongoose.model("ConnectedDevice", connectedDeviceSchema);