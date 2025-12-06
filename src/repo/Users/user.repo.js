import User from '../../models/Users/user.model.js';

//CREATE
export const create = async (data)=> {
    const user = new User(data);
    return await user.save();
}
//Find
export const findById = async (id)=>{
    return await User.findById(id);
}
export const findByEmail = async (email)=>{
    return await User.findOne({email});
}
//Find All
export const findAll = async (filters,sort,pagination)=>{
    const [users,total] = await Promise.all([
        User.find(filters)
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip),
        User.countDocuments(filters)
    ])
    return {users,total};
}
//Update
export const update = async (id,newData)=>{
    return await User.findByIdAndUpdate(id,newData,{new:true});
}
//Delete hard
export const hRemove = async (id)=>{
    return await User.findByIdAndDelete(id);
}
//Delete Soft
export const remove = async (id)=>{
    return User.findByIdAndUpdate(id,{isDeleted:true},{runValidators:true,new:true});
}
//Delete All Hard
export const hRemoveAll = async (ids)=>{
    return User.deleteMany({_id:{$in:ids}});
}
//Delete All Soft
export const removeAll = async (ids)=> {
    return User.updateMany(
        { _id: { $in: ids } }, // filter
        { $set: { isDeleted: true } }, // update
        { runValidators: true } // options
    );
}