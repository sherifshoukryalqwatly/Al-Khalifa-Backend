import * as userService from '../../services/Users/user.service.js';
import asyncWrapper from '../../utils/asyncHandler.js';
import {appResponses} from '../../utils/AppResponses.js'

//create
export const create = asyncWrapper(async (req,res)=> {
    const userData = req.body;
    const user = await userService.create(userData);
    return appResponses.success(res,user,'User Registerd Successfully / تم تسجيل المستخدم بنجاح ',201);
})
//find
export const findById = asyncWrapper(async(req,res)=>{
    const {id} = req.params;
    const user = await userService.findById(id);
    return appResponses.success(res,user,'User Retrieved Successfully / تم استرداد المستخدم بنجاح');
})

export const findByEmail = asyncWrapper(async(req,res)=>{
    const {email} = req.params;
    const user = await userService.findByEmail(email);
    return appResponses.success(res,user,'User Retrieved Successfully / تم استرداد المستخدم بنجاح');
})

//findAll
export const findAll = asyncWrapper(async(req,res)=>{
    const {query} = req;
    const {users ,total ,pages} = await userService.findAll(query);
    return appResponses.success(res,{data:users,total,pages},'Users Retrieved Successfully / تم استرداد المستخدمين بنجاح')
})
//update
export const update = asyncWrapper(async (req,res)=>{
    const {id} = req.params;
    const newData = req.body;
    console.log("Incoming Request:", req.method, req.url);
    console.log("Content-Type:", req.headers['content-type']);
    console.log("Body:", req.body);
    
    const updatedUser = await userService.update(id,newData);
    return appResponses.success(res,updatedUser,'User Updated Successfully / تم تعديل المستخدم بنجاح')
})
//hard Delete
export const hRemove = asyncWrapper(async (req,res)=>{
    const {id}=req.params;
    await userService.hRemove(id);
    return appResponses.success(res,null,'User Deleted Successfully / تم حذف المستخدم بنجاح');
})
//soft Delete
export const remove = asyncWrapper(async (req,res)=>{
    const {id} = req.params;
    await userService.remove(id);
    return appResponses.success(res,null,'User Deleted Successfully / تم حذف المستخدم بنجاح');
})
//hard Delete all
export const hRemoveAll = asyncWrapper(async (req,res)=>{
    const {ids} = req.body;
    await userService.hRemoveAll(ids);
    return appResponses.success(res,null,'Users Deleted Successfully / تم حذف المستخدمين بنجاح');
})
//soft Delete all
export const removeAll = asyncWrapper(async (req,res)=>{
    console.log(req.body);
    
    const {ids} = req.body;
    await userService.removeAll(ids);
    return appResponses.success(res,null,'Users Deleted Successfully / تم حذف المستخدمين بنجاح');
})