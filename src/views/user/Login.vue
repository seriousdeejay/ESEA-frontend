<template>

<div style="width: 500px; border-radius: 2px;" class="p-shadow-10 p-py-5">
    <h1 class="p-mx-5" style="border-bottom: 1px solid green;">Open ESEA - Login Page</h1>
        <form v-on:submit.prevent="login" class="p-grid p-fluid p-m-5">
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                     <InputText type="text" id="username" v-model="username" />
                    <label for="username">Username</label>
                </span>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                    <Password id="password" v-model="password" :feedback="false" />
                    <label for="password">Password</label>
                </span>
            </div>
            <h4 v-if="incorrectAuth" class="p-col p-text-italic p-mx-5" style="border-bottom: 1px solid red">Authentication failed - please try again!</h4>
            <div class="p-col-12 p-d-flex p-jc-between">
            <Button type="submit" value="submit" class="p-jc-center p-button-success">Login</Button>
            <Button @click="$router.push('register')" class="p-button-text p-flex-row-reverse">Forgot Password?</Button>
            </div>
        </form>
        <hr>
        <div class="p-d-flex p-jc-center p-ai-center">
            <h4>No Account yet?</h4>
            <div>
            <Button @click="$router.push('register')" class="p-button-text">Create Account</Button>
        </div>
        </div>
        <div class="p-text-left p-px-5">
            <small>Add assessments, get peer reviews, share and find out what your organisations
                needs now and in the future!</small>
        </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { API_URL } from '../../utils/constants'

export default {
    name: 'login',
    data () {
        return {
            username: 'admin', // Filled in for easy login, should be removed before deployment!
            password: 'scriptie',
            incorrectAuth: false
        }
    },
    created () {
    },
    methods: {
        ...mapActions('authentication', ['userLogin']),
        async login () {
            console.log(API_URL)
            await this.userLogin({
                username: this.username,
                password: this.password
            })
            .then(() => {
                this.$router.push({ name: 'home' })
            })
            .catch(err => {
                console.log(err)
                this.incorrectAuth = true
            })
        }
    }
}
</script>
