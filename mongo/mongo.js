const mongoose = require('mongoose');
const destinySchema = require('./destinySchema');

module.exports = {
    async connect(){
        const options = {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(process.env.MONGODB_SRV, options);
        return mongoose;
    },
    async pushTokens(discordid, authtoken, reftoken, memberid){
        try {
            let user = await destinySchema.create({_id: discordid});
                user.access_token = authtoken;
                user.refresh_token = reftoken;
                user.membership_id = memberid;
                user.save();
            return true;
        } catch (error) {
            return false;
        }
    },
}