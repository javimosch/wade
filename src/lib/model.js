var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import security from './security';
export function configure() {
    var userSchema = new Schema({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        type: String
    });
    mongoose.model('user', userSchema);

    let User = mongoose.model('user');
    (async() => {
        let doc = await User.findOne({
            email: 'arancibiajav@gmail.com'
        }).exec();
        if(doc){
            await doc.remove();
            doc = null;
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
    })().catch(err => console.log('User:configure', err.stack));
}
