<template>
    <div class="p-m-5" style="min-width: 1000px;">
        <h1>Methods Overview</h1>
        <div class="p-d-flex p-jc-between p-m-5">
            <div>
                <Button :label="(allMethods ? 'All Methods' : 'My Methods')" class="p-mr-2" @click="allMethods = !allMethods"/>
                <Button label="Change Display" class="p-mr-2" @click="tableDisplay = !tableDisplay" />
                <Button label="Create Method" icon="pi pi-plus" class="p-button-success" @click="goToMethodCreate()" />
            </div>
            <span class="p-input-icon-left">
                <i class="pi pi-search" /><InputText v-model="search" placeholder="Search Methods..." />
            </span>
        </div>
        <Divider />
        <method-list :methods="methods" :table="tableDisplay" :search="search" :loading="loading"  @clicked-method="goToMethod" />
    </div>

    <!-- <Dialog v-model:visible="createMethodDialog" style="width: 500px" header="Method Details" :modal="true" :dismissableMask="true">
        <method-form @closedialog="createMethodDialog=false" />
    </Dialog> -->
    <!-- <div class="methods">
        <h1>Methods Overview</h1>
        <Button label="Method Wizard" @click="goToMethodCreate" />
        <Toast position="top-right"/>
        <div class="card p-m-5 p-shadow-2">
            <my-methods :columns="columns" selection-enabled></my-methods>
        </div>
    </div> -->
    <!-- <Dialog v-model:visible="methodDialog" :style="{width: '450px'}" header="Method Details" :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">Name</label>
            <InputText id="name" v-model.trim="method.name" required="true" autofocus :class="{'p-invalid': submitted && !method.name}"
            @blur="updateMethodForm({ name: $event.target.value })" />
            <small class="p-error" v-if="submitted && !method.name">Name is required.</small>
        </div>
        <div class="p-field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="method.description" required="true" rows="3" cols="20"
            @blur="updateMethodForm({ description: $event.target.value })" />
        </div>
        <div class="p-field">
            <label for="ispublic">Should this method be public? </label>
            <SelectButton id="ispublic" v-model="method.ispublic" required="true" :options="ispublicbool"
            @blur="updateMethodForm({ ispublic: $event.target.value })" />
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMethod" :disabled="!method.name" />
        </template>
    </Dialog> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MethodList from '../../components/lists/MethodList'
// import NetworkForm from '../../components/forms/NetworkForm'
// import { mapActions, mapState } from 'vuex'
// import MyMethods from '../../components/MyMethods'
export default {
    components: {
        // MyMethods
        MethodList
        // MethodForm
    },
    data () {
        return {
            allMethods: false,
            tableDisplay: false,
            search: '',
            loading: true,
            createMethodDialog: false
            // columns: [
            //     { field: 'name', header: 'Name' },
            //     { field: 'description', header: 'Description' },
            //     { field: 'surveys.length', header: 'Surveys' },
            //     { field: 'networks.length', header: 'Networks' },
            //     { field: 'organisations.length', header: 'Organisations' }
            //     ]
        }
    },
    computed: {
        ...mapState('method', ['methods', 'method'])
    },
    watch: {
        allMethods () {
            this.getMethods()
        }
    },
    async created () {
        this.getMethods()
    },
    methods: {
        ...mapActions('method', ['fetchMethods', 'setMethod', 'createMethod']),
        async getMethods () {
            if (this.allMethods) {
                await this.fetchMethods({ query: '?allmethods=1' })
            } else {
                await this.fetchMethods({})
            }
            this.loading = false
        },
        async goToMethod (method) {
            if (method.id) {
                await this.setMethod(method)
                this.$router.push({ name: 'newmethoddetails', params: { id: this.method.id } })
            }
        },
        // async goToMethodCreate () {
        //     await this.createMethod({})
        //     this.$router.push({ name: 'method-create', params: { id: this.method.id } })
        // },
        async goToMethodCreate () {
            this.$router.push({ name: 'methodcreation' })
        }
    }
}
</script>
