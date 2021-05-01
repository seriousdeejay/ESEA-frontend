<template>
    <div style="width: 30rem; border-radius:0.25rem" class="p-d-block p-mx-auto p-p-5 p-shadow-10 p-input-filled">
        <h1>Create An Account</h1>
        <form v-on:submit.prevent="register" class="p-grid p-fluid p-text-left">
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="username" v-model="customuser.username" :class="{'borderless': usernameErrors.length && submitted}" />
                        <label for="username">Username</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in usernameErrors" :key="error"><small>{{error}}</small></div>
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
                        <InputText type="text" id="password" v-model="customuser.password" :class="{'borderless': passwordErrors.length && submitted}" />
                        <label for="password">Password</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in passwordErrors" :key="error"><small>{{error}}</small></div>
            </div>
            <div class="p-col-12 p-field">
                <span class="p-float-label">
                        <InputText type="text" id="password2" v-model="customuser.password2" :class="{'borderless': password2Errors.length && submitted}" />
                        <label for="password2">Confirm Password</label>
                    </span>
                    <div class="p-error p-text-italic" v-for="error in password2Errors" :key="error"><small>{{error}}</small></div>
            </div>
            <!-- <div class="p-field p-grid">
                <label for="email" class="p-col">Email</label>
                <div class="p-col">
                    <InputText type="text" id="email" v-model="customuser.email" :class="{'borderless': v$.customuser.email.$error && submitted}" />
                </div>
            </div>
            <div class="p-field p-grid">
                <label for="password" class="p-col" >Password</label>
                <div class="p-col">
                    <Password id="password" v-model="customuser.password" :feedback="false" :class="{'borderless': v$.customuser.password.$error && submitted}" />
                </div>
            </div>

            <div class="p-field p-grid">
                <label for="password2" class="p-col" >Confirm Password</label>
                <div class="p-col">
                    <Password id="password2" v-model="customuser.password2" :feedback="false" :class="{'borderless': v$.customuser.password2.$error && submitted}" />
                </div>
            </div> -->
            <h4 class="p-col-12">Optional fields <small>(to be pushed to account settings page)</small></h4>
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

            <!-- <div class="p-field p-grid">
                <label for="firstname" class="p-col">First Name</label>
                <div class="p-col">
                    <InputText type="text" id="firstname" v-model="customuser.first_name" :class="{'borderless': v$.customuser.first_name.$error && submitted}" />
                </div>
            </div>

            <div class="p-field p-grid">
                <label for="lastnameprefix" class="p-col"> Last Name Prefix</label>
                <div class="p-col">
                    <InputText type="text" id="lastnameprefix" v-model="customuser.last_name_prefix" :class="{'borderless': v$.customuser.last_name_prefix.$error && submitted}" />
                </div>
            </div>

                      <div class="p-field p-grid">
                <label for="lastname" class="p-col">Last Name</label>
                <div class="p-col">
                    <InputText type="text" id="lastname" v-model="customuser.last_name" :class="{'borderless': v$.customuser.last_name.$error && submitted}" />
                </div>
            </div> -->

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
// import { AxiosInstance } from '../../plugins/axios'
// import { API_URL } from '../../utils/constants'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
import HandleValidationErrors from '../../utils/HandleValidationErrors'
// import { maxLength, sameAs } from '../../utils/validators'

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
        usernameErrors () {
            return HandleValidationErrors(this.v$.customuser.username)
        },
        emailErrors () {
            return HandleValidationErrors(this.v$.customuser.email)
        },
        passwordErrors () {
            return HandleValidationErrors(this.v$.customuser.password)
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
    methods: {
        register (e) {
            this.submitted = true
            this.v$.customuser.$touch()
            if (this.v$.$invalid) {
                console.log('not valid!', this.v$.$errors)
                return
            }
            console.log('succes!')
            this.userRegister({ newuser: customuser })
        }
        // register: function (e) {
        //     AxiosInstance.post(`${API_URL}/account/register/`,
        //         this.customuser
        //     )
        //     .then(response => {
        //         this.$router.push('/login')
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        // }
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
