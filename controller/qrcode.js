const Qrcode = require("../model/qrcode");
const ConnectedDevice = require('../model/connectedDevices');
const User = require("../model/user");
const jwt  = require("jsonwebtoken");
const qrcode = require("qrcode");
exports.generate = async (req, res, next)=>{
    try{
        const { userId } = req.body;
    const user = await User.findById({ userId: userId });
    if(!user){
        return res.status(401).json({
            message: "No user with such Id is found !!!"
        })
    }
    const qrExist = await Qrcode.findById({ userId });
    // check if a user with the id already has a qrcode registered
    // it is disabled and another one is generated else create new qrcode
    if(!qrExist){
        await Qrcode.save();
    }else{
        await Qrcode.findByIdAndUpdate({ userId: userId }, { $set: { disabled: true }});
        await Qrcode.save({ userId });
    }
    //generate encrypted data
    const encryptData = jwt.sign({
        email: user[0].email,
        userId: user[0]._id
    },
        process.env.JWT_KEY,
    {
        expiresIn: "1d"
    });
    //generate qrcode
    const image = await qrcode.toDataURL(encryptData);
    //return the code
    return res.status(201).json({
        message: "Qrcode generated",
        dataImage: image
    });
    }catch(err){
        return res.status(500).json({
            error: err
        })
    }
}
exports.scan = async (req, res, next)=>{
    try{
        const { token, deviceInformation } = req.body;
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const qrcodeData = await Qrcode.findOne({ userId: decode.userId, disabled: false });
        if(!qrcode){
            return res.status(401).json({
                message: "Qrcode not found"
            })
        }
        const connectedDeviceInfo = {
            userId: decode.userId,
            qrcodeId: qrcodeData[0]._id,
            deviceName: deviceInformation.deviceName,
            deviceModel: deviceInformation.deviceModel,
            deviceOs: deviceInformation.deviceOs,
            deviceVersion: deviceInformation.deviceVersion
        }
        const connectDevice = await ConnectedDevice.save({ connectedDeviceInfo });
        //update qrcode

        await Qrcode.findOneAndUpdate({
            _id: qrcodeData._id,
            isActive: true,
            connectedDeviceId: ConnectedDevice._id,
            lastUsedDate: new date
        });
        //find user that scan the code
        const user = await User.findById( decode.userId );
        //generate tokens
        const authTokens = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
        },
            process.env.JWT_KEY,
            {
                expiresIn: "2h"
            }
        );
        return res.status(201).json({
            message: "user code scan successfully",
            token: authTokens
        })
    }catch(err){
        return res.status(500).json({
            error: err
        })
    }
    

}