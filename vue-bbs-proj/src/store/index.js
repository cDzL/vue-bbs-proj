import Vuex from 'vuex'

import Vue from 'vue'

Vue.use(Vuex)

const actions = {
    changeIsMobile(context,value){
        context.commit('CHANGEISMOBILE',value)
    },
    changeUserInfo(context,value){
        context.commit('CHANGEUSERINFO',value)
    },
    changeRid(context,value){
        context.commit('CHANGERID',value)
    },
    changeAdmin(context,value){
        context.commit('CHANGEDADMIN',value)
    },
    changeName(context,value){
        context.commit('CHANGENAME',value)
    },
    changeSort(context,value){
        context.commit('CHANGESORT',value)
    }
}
const mutations = {
    setToken(state,token){
        state.token = token
        localStorage.token = token
    },
    CHANGEISMOBILE(state,value){
        state.isMobile = value
    },
    CHANGEUSERINFO(state,value){
        state.user.username = value.username;
        state.user.userid = value.userid;
        state.user.upassword = value.upassword
    },
    CHANGERID(state,value){
        state.Rid = value
    },
    CHANGEDADMIN(state,value){
        state.admin.adminname = value.adminname
        state.admin.adminpassword = value.adminpassword 
    },
    CHANGENAME(state,value){
        state.user.username = value
    },
    CHANGESORT(state,value){
        state.user.sort = value 
    }
}

const state = {
    token:'',//初始化token,
    isMobile:false,
    user:{
        userid:null,
        username:null,
        upassword:null,
        sort:0
    },
    Rid:'',
    admin:{
        adminname:null,
        adminpassword:null
    }
}
const store = new Vuex.Store({
    actions,
    mutations,
    state
})
export default store