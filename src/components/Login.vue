<template>
<div class="container">
    <div class="row">
        <div class="col-sm">
            <p>Please, enter your credentials</p>
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
                <div class="form-check">
                    <label class="form-check-label">
          <input type="checkbox" class="form-check-input">
          Check me out
        </label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</div>

</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                email: 'arancibiajav@gmail.com',
                password: "gtf"
            }
        }
    }
</script>

<style lang="scss" scoped>
    #form{
        max-width:400px;
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
