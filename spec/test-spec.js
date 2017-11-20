/*global expect*/
var request = require('request-promise');
describe('Passaport session', function() {
    it("should auth ok", function(done) {
        var options = {
            method: 'POST',
            uri: "http://localhost:8080/api/v1/login",
            body: {
                email: 'arancibiajav@gmail.com',
                password:"gtf"
            },
            json: true // Automatically stringifies the body to JSON
        };
        request(options).then(parsedBody => {
            expect(parsedBody.email).toEqual("arancibiajav@gmail.com");
            done();
        }).catch(err => {
            console.log("Error!",err.message,err.response.toJSON().body);
            done();
        })
    });
});
