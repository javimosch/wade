var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import security from './security';
export function configure() {
    return new Promise((resolve, reject) => {
        (async() => {


            var moduleSchema = new Schema({
                owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
                namespace: String,
                name: {
                    type: String,
                    required: true
                },
                contents: String,
                updated_at: {
                    type: String,
                    default: Date.now()
                },
                type: {
                    type: String,
                    default: "browser_and_server"
                } //[vue, browser_and_server, server_only ]
            });
            mongoose.model('module', moduleSchema);



            var userSchema = new Schema({
                firstname: String,
                lastname: String,
                email: String,
                password: String,
                type: String
            });
            mongoose.model('user', userSchema);

            let User = mongoose.model('user');

            let doc = await User.findOne({
                email: 'arancibiajav@gmail.com'
            }).exec();
            if (doc) {
                //await doc.remove();
                //doc = null;
            }
            if (!doc) {
                User.create({
                    email: "arancibiajav@gmail.com",
                    firstname: "Javier",
                    lastname: "Arancibia",
                    password: await security.bcryptEncode('gtf'),
                    type: "root"
                });
            }

            resolve();
        })().catch(reject);
    });
}
