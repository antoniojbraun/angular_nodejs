import { User } from "../models/User"

export const getUserByEmail = async (email:string)=>{
    return await User.findOne({
        where:{
            email
        }
    });
}

export const addUser = async (name:string, email:string, password:string) => {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    const newUser = await user.save();
    return newUser
}

export const updateUser = async ({name, status, id,password}:{
    name?:string,
    status?: 'active' | 'pending',
    password?: string
    id: number
}) => {
    const user = await User.findByPk(id);
    if(!user){
        throw new Error('User not found.')
    }
    if(name) user.name = name
    if(status) user.status = status
    if(password) user.password = password

    return user.save()
}