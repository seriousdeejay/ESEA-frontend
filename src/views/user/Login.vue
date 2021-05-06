<template>

<div style="width: 500px; border-radius: 2px;" class="p-shadow-10 p-py-5">
    <h1 class="p-mx-5" style="border-bottom: 1px solid green;">Open ESEA - Login Page</h1>
        <form v-on:submit.prevent="login" class="p-grid p-fluid p-m-5 p-text-left">
             <Message v-if="incorrectAuth" severity="error" class="p-col-12">Invalid credentials. Please try again!</Message>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                     <InputText type="text" id="username" v-model="username" :class="{'borderless': v$.username.$invalid && submitted}"/>
                    <label for="username">Username</label>
                </span>
                <div v-if="v$.username.required.$invalid && submitted" class="p-error p-text-italic">Username is required</div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                    <Password id="password" v-model="password" :feedback="false" :class="{'borderless': v$.password.$invalid && submitted}" />
                    <label for="password">Password</label>
                </span>
                <div v-if="v$.password.required.$invalid && submitted" class="p-error p-text-italic">Password is required</div>
            </div>
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
import { required } from 'vuelidate/lib/validators'
import useVuelidate from '@vuelidate/core'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import Message from 'primevue/message'

export default {
    name: 'login',
    components: {
        Message
    },
    data () {
        return {
            username: 'admin', // Filled in for easy login, should be removed before deployment!
            password: 'admin',
            submitted: false,
            incorrectAuth: false
        }
    },
    computed: {
        nameErrors () {
            return HandleValidationErrors(this.v$.username)
        },
        passwordErrors () {
            return HandleValidationErrors(this.v$.password)
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        username: { required },
        password: { required }
    },
    created () {
    },
    methods: {
        ...mapActions('authentication', ['userLogin']),
        async login () {
            this.submitted = true
            if (this.v$.invalid) { return }

            await this.userLogin({
                username: this.username,
                password: this.password
            })
            .then(() => {
                this.$router.push({ name: 'home' })
            })
            .catch(() => {
                this.incorrectAuth = true
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.p-inputtext {
    border: none;
    border-bottom: 1px solid lightgrey;
}
.borderless {
    border-bottom: 1px solid red;

}
</style>
