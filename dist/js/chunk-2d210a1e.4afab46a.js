(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d210a1e"],{b95f:function(e,t,i){"use strict";i.r(t);i("b0c0"),i("a4d3"),i("e01a");var o=i("7a23"),n={class:"p-px-5",style:{width:"500px"}},l={class:"p-fluid p-text-left p-my-5"},c={class:"p-field"},r=Object(o["k"])("label",{for:"name"},"Name",-1),a={key:0,class:"p-error"},s={class:"p-field"},u=Object(o["k"])("label",{for:"description"},"Description",-1),b={class:"p-field"},d=Object(o["k"])("label",{for:"ispublic"},"Should this network be public? ",-1),p=Object(o["k"])("small",{class:"p-text-italic"},"*Public networks and their organisations are visible to anyone. Explicitly granted access is still required for certain operations.",-1),k={class:"p-d-flex p-jc-between"},m=Object(o["k"])("i",{class:"pi pi-star p-mr-3",style:{"font-size":"1.5rem"}},null,-1),f=Object(o["k"])("span",null,"You need premium to make your network private.",-1),j={class:"confirmation-content"},w=Object(o["k"])("i",{class:"pi pi-exclamation-triangle p-mr-3",style:{"font-size":"1.5rem"}},null,-1),O=Object(o["j"])("Are you sure you want to delete "),v=Object(o["j"])("?");function h(e,t,i,h,g,N){var x=Object(o["H"])("InputText"),y=Object(o["H"])("Textarea"),D=Object(o["H"])("SelectButton"),C=Object(o["H"])("Button"),V=Object(o["H"])("Dialog");return Object(o["z"])(),Object(o["g"])(o["a"],null,[Object(o["k"])("div",n,[Object(o["k"])("div",l,[Object(o["k"])("div",c,[r,Object(o["k"])(x,{id:"name",modelValue:e.network.name,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.network.name=t}),modelModifiers:{trim:!0},required:"true",autofocus:"",class:[{"p-invalid":e.submitted&&!e.network.name},"p-text-italic"]},null,8,["modelValue","class"]),e.network.name?Object(o["h"])("",!0):(Object(o["z"])(),Object(o["g"])("small",a,"Name is required."))]),Object(o["k"])("div",s,[u,Object(o["k"])(y,{id:"description",modelValue:e.network.description,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.network.description=t}),class:"p-text-italic",required:"false",rows:"3",cols:"20"},null,8,["modelValue"])]),Object(o["k"])("div",b,[d,Object(o["k"])(D,{id:"ispublic",modelValue:g.boolChoice,"onUpdate:modelValue":t[3]||(t[3]=function(e){return g.boolChoice=e}),options:g.ispublicbool,optionLabel:"name",onFocus:t[4]||(t[4]=function(e){return g.ispublicDialog=!0}),disabled:!0,class:"p-mb-3"},null,8,["modelValue","options"]),p])]),Object(o["k"])("div",k,[Object(o["k"])(C,{label:"Save Network Details",class:"p-button-primary",onClick:N.editNetwork,disabled:!1},null,8,["onClick"]),Object(o["k"])(C,{label:"Delete Network",class:"p-button-danger",onClick:t[5]||(t[5]=function(e){return g.deleteNetworkDialog=!0})})])]),Object(o["k"])(V,{visible:g.ispublicDialog,"onUpdate:visible":t[8]||(t[8]=function(e){return g.ispublicDialog=e}),style:{width:"450px"},header:"Premium required",modal:!0},{footer:Object(o["R"])((function(){return[Object(o["k"])(C,{label:"No thanks",icon:"pi pi-times",class:"p-button-text",onClick:t[6]||(t[6]=function(e){return g.ispublicDialog=!1})}),Object(o["k"])(C,{label:"What's Premium?",icon:"pi pi-question",class:"p-button-text",onClick:t[7]||(t[7]=function(e){return g.ispublicDialog=!1})})]})),default:Object(o["R"])((function(){return[m,f]})),_:1},8,["visible"]),e.network?(Object(o["z"])(),Object(o["g"])(V,{key:0,visible:g.deleteNetworkDialog,"onUpdate:visible":t[11]||(t[11]=function(e){return g.deleteNetworkDialog=e}),style:{width:"450px"},header:"Confirm",modal:!0},{footer:Object(o["R"])((function(){return[Object(o["k"])(C,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:t[9]||(t[9]=function(e){return g.deleteNetworkDialog=!1})}),Object(o["k"])(C,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:t[10]||(t[10]=function(e){return N.removeNetwork()})})]})),default:Object(o["R"])((function(){return[Object(o["k"])("div",j,[w,Object(o["k"])("span",null,[O,Object(o["k"])("b",null,Object(o["L"])(e.network.name),1),v])])]})),_:1},8,["visible"])):Object(o["h"])("",!0)],64)}var g=i("1da1"),N=i("5530"),x=(i("96cf"),i("5502")),y={data:function(){return{ispublicbool:[{name:"Public",value:!0},{name:"Private",value:!1}],boolChoice:null,ispublicDialog:!1,deleteNetworkDialog:!1}},watch:{boolChoice:function(){this.network.ispublic=this.boolChoice.value}},computed:Object(N["a"])({},Object(x["d"])("network",["network","networkform"])),created:function(){this.initialize()},methods:Object(N["a"])(Object(N["a"])({},Object(x["b"])("network",["updateNetwork","deleteNetwork"])),{},{initialize:function(){this.boolChoice={name:"Public",value:this.network.ispublic}},editNetwork:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.updateNetwork({});case 2:e.$toast.add({severity:"success",summary:"Successful",detail:"Network Updated",life:3e3});case 3:case"end":return t.stop()}}),t)})))()},removeNetwork:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.deleteNetworkDialog=!1,t.next=3,e.deleteNetwork({id:(null===(i=e.network)||void 0===i?void 0:i.id)||0});case 3:e.$toast.add({severity:"success",summary:"Succesful",detail:"Network Deleted",life:3e3}),e.$router.push({name:"networks"});case 5:case"end":return t.stop()}}),t)})))()}})};y.render=h;t["default"]=y}}]);
//# sourceMappingURL=chunk-2d210a1e.4afab46a.js.map