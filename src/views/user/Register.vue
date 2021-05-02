<template>
    <div style="width: 500px; border-radius: 2px" class="p-shadow-10 p-input-filled p-py-5">
        <h1 class="p-mx-5 p-px-5" style="border-bottom: 1px solid green;">Create An Account</h1>
        <form v-on:submit.prevent="register" class="p-grid p-fluid p-m-5 p-text-left">
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="username" v-model="customuser.username" :class="{'borderless': usernameErrors.length && submitted}" />
                        <label for="username">Username</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in usernameErrors" :key="error"><small v-if="error === 'This field must be unique.'">Username is already taken.</small><small v-else>{{ error }}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="email" v-model="customuser.email" :class="{'borderless': emailErrors.length && submitted}" />
                        <label for="email">Email</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in emailErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="password" id="password" v-model="customuser.password" :class="{'borderless': passwordErrors.length && submitted}" />
                        <label for="password">Password</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in passwordErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="password" id="password2" v-model="customuser.password2" :class="{'borderless': password2Errors.length && submitted}" />
                        <label for="password2">Confirm Password</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in password2Errors" :key="error"><small>{{error}}</small></div>
            </div>

            <h4 class="p-col-12 p-text-center" style="border-bottom: 1px solid green">Optional fields <small>(to be pushed to account settings page)</small></h4>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="firstname" v-model="customuser.first_name" :class="{'borderless': firstnameErrors.length && submitted}" />
                        <label for="firstname">First Name</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in firstnameErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="lastnameprefix" v-model="customuser.last_name_prefix" :class="{'borderless': lastnameprefixErrors.length && submitted}" />
                        <label for="lastnameprefix">Last Name Prefix</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in lastnameprefixErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="lastname" v-model="customuser.last_name" :class="{'borderless': lastnameErrors.length && submitted}" />
                        <label for="lastname">Last Name</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in lastnameErrors" :key="error"><small>{{error}}</small></div>
            </div>

            <Button type="submit" value="submit" class="p-my-5 p-jc-center p-button-success">Register Account</Button>
        </form>
        <div class="p-d-flex p-jc-center p-ai-center">
            <h4>Already have an Account?</h4>
            <div>
            <Button @click="$router.push('login')" class="p-button-text">Go to Login</Button>
        </div>
        </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
import { mapActions, mapState } from 'vuex'

export default {
    data () {
        return {
            customuser: {
                username: '',
                password: '',
                password2: '',
                email: '',
                first_name: '',
                last_name_prefix: '',
                last_name: ''
            },
            submitted: false
        }
    },
    computed: {
        ...mapState('authentication', ['errors']),
        usernameErrors () {
            return HandleValidationErrors(this.v$.customuser.username, this.errors.username)
        },
        emailErrors () {
            return HandleValidationErrors(this.v$.customuser.email)
        },
        passwordErrors () {
            return HandleValidationErrors(this.v$.customuser.password, this.errors.password)
        },
        password2Errors () {
            return HandleValidationErrors(this.v$.customuser.password2)
        },
        firstnameErrors () {
            return HandleValidationErrors(this.v$.customuser.first_name)
        },
        lastnameprefixErrors () {
            return HandleValidationErrors(this.v$.customuser.last_name_prefix)
        },
        lastnameErrors () {
            return HandleValidationErrors(this.v$.customuser.last_name)
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    validations: {
        customuser: {
            username: { required, minLength: minLength(4), maxLength: maxLength(100) },
            password: { required, minLength: minLength(8) },
            password2: { required, sameAsPassword: sameAs(function () { return this.customuser.password }) },
            email: { required, email },
            first_name: { required, maxLength: maxLength(50) },
            last_name_prefix: { maxLength: maxLength(50) },
            last_name: { required, maxLength: maxLength(50) }
        }
    },
    created () {
        this.initialize()
    },
    methods: {
        ...mapActions('authentication', ['userRegister']),
        initialize () {
            this.$store.commit('authentication/clearErrors')
        },
        register (e) {
            this.submitted = true
            this.v$.customuser.$touch()
            if (this.v$.$invalid) {
                return
            }
            console.log('succes!')
            this.userRegister(this.customuser)
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
