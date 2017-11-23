<template>
<div class="container">
    <div class="row">
        <div class="col-sm">
            <form id="form" class="mw-50 d-block mx-auto">
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" v-model="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                </div>
                <button type="button" v-on:click="login()" class="btn btn-primary">Sign In with Google</button>
            </form>
        </div>
    </div>
</div>

</template>

<script>
    /*global firebase*/

    import fetch from 'unfetch';
    import { mapMutations } from 'vuex';


    export default {
        name: 'login',
        data() {
            return {
                email: 'arancibiajav@gmail.com',
                password: "gtf"
            };
        },
        mounted: mounted,
        methods: methods()
    };

    function mounted() {
        const vm = this;
        vm.$store.watch(() => this.$store.getters.userIsLogged, isLogged => {
            if (isLogged) {
                vm.$router.push({
                    path: vm.$store.getters.routerRedirect
                });
            }
        });
    }

    function methods() {
        return Object.assign({
            login: function() {
                let self = this;
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
                    firebase.auth().signInWithPopup(provider).then(function(result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        //var token = result.credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        console.info(user);


                        firebase.auth().currentUser.getToken( /* forceRefresh */ true).then(function(idToken) {
                            var options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ token: idToken })
                            };



                            fetch('/api/v1/verify-login', options)
                                .then(function(res) {
                                    // POST succeeded...
                                    res.json().then(console.log);
                                    self.markUserAsLogged();
                                })
                                .catch(function(err) {
                                    // POST failed...
                                    console.warn(err);
                                });
                        }).catch(function(error) {
                            // Handle error
                        });

                        ///

                        // ...
                    }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        console.error(errorCode, errorMessage, email, credential, error);
                        // ...
                    });
                });

            }
        }, mapMutations([
            'markUserAsLogged',
        ]));
    }
</script>

<style lang="scss" scoped>
    #form {
        max-width: 400px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1,
    h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
