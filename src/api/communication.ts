import { request } from "./ajax"
/* eslint-disable */
const api = process.env.VUE_APP_api
export const getInfo = (params: any) => {
    return request({
        url: `${api}/peiyouwebseting/getInfo`,
        method: 'get',
        params
    })
}

export const getGroupTools = (params: any) => {
    return request({
        url: `${api}/peiyouwebseting/getGroupTools`,
        method: 'get',
        params
    })
}
// 获取待办列表
export const getTodoList = (params: any) => {
    return request({
        url: `${api}/api/demand/upcoming`,
        method: 'get',
        params
    })
}

// 获取需求总览列表
export const getDemandTotalList = (params: any) => {
    return request({
        url: `${api}/api/demand/chart`,
        method: 'post',
        data: params
    })
}
// 需求全景 获取需求列表
export const getDemandList = (params: any) => {
    return request({
        url: `${api}/api/demand/column/${params.month}/${params.type}`,
        method: 'get',
        params
    })
}

// 详情点赞
export const demandLike = (params: any) => {
    return request({
        url: `${api}/api/demand/like`,
        method: 'post',
        data:params
    })
}
// 效果通晒点赞
export const resultShowLike = (params: any) => {
    return request({
        url: `${api}/api/sameEffect/like`,
        method: 'post',
        data: params
    })
}

//星级项目 获取数据
export const getStarList = (params: any) => {
    return request({
        url: `${api}/api/starProject/projects`,
        method: 'get',
        params
    })
}

//登录
export const login = (params: any) => {
    return request({
        url: `${api}/api/login/login`,
        method: 'get',
        params
    })
}

//获取用户
export const getUser = (params: any) => {
    return request({
        url: `${api}/api/user/currentUser`,
        method: 'get',
        params
    })
}

//搜索用户
export const searchUser = ( params: any ) => {
    return request({
        url: `${api}/api/user/search/${params}`,
        method: 'get',
    })
}

// 新建需求
export const createDemand = ( params: any ) => {
    return request({
        url: `${api}/api/demand/demand`,
        method: 'post',
        data: params
    })
}

//获取编辑需求数据
export const getEditdemand = ( params: any ) => {
    return request({
        url: `${api}/api/demand/demand/${params}`,
        method: 'get',
    })
}

//修改需求描述
export const editDemandDescription = ( params: any ) => {
    return request({
        url: `${api}/api/demand/baseDemand`,
        method: 'post',
        data: params
    })
}

//编辑需求反馈
export const editDemandFeedBack = ( params: any ) => {
    return request({
        url: `${api}/api/demand/stageDemand`,
        method: 'post',
        data: params
    })
}

//获取需求效果通晒数据
export const getEffect = ( params: any ) => {
    return request({
        url: `${api}/api/sameEffect/sameEffect/${params}`,
        method: 'get',
    })
}

//新建需求效果通晒
export const createEffect = ( params: any ) => {
    return request({
        url: `${api}/api/sameEffect/sameEffect`,
        method: 'post',
        data: params
    })
}

//编辑需求效果通晒
export const editEffect = ( params: any ) => {
    return request({
        url: `${api}/api/sameEffect/effect`,
        method: 'post',
        data: params
    })
}

//获取我的代办
export const getMyAgents = ( params: any ) => {
    return request({
        url: `${api}/api/demand/upcoming`,
        method: 'get',
    })
}

//获取业务方
export const getBusinessSide = ( params: any ) => {
    return request({
        url: `${api}/api/demand/businessSide`,
        method: 'get',
    })
}
