import { Tag } from "../models/Tag";

export async function getAllTagsService (){
    return Tag.findAll() // select * from categories
}

export async function getTagBySlugService(slug:string){
    const tag =  await Tag.findOne({where: {slug}})
    return tag;
}

export async function getTagById(id:number){
    const tag = await Tag.findByPk(id);
    return tag;
}

export async function getTagsByIds(ids:number[]){
    const tags = await Tag.findAll({
        where: {
            id:ids
        }
    })
    return tags;
}

export async function addTagService(name:string, slug:string, userId:number){
    const tag = new Tag();
    tag.name = name;
    tag.slug = slug;
    tag.userId = userId;
    return tag.save();
}

export async function updateTagService(name:string,slug:string, id:number){
    const tag = await Tag.findByPk(id)
    if(!tag) throw new Error ('Tag not found!');

    if(name) tag.name = name;
    if(slug) tag.slug = slug;
    await tag.save();
    return tag;
}

export async function deleteTagService(id:number){
    const tag = await Tag.findByPk(id);
    if(!tag) throw new Error ('Tag not found!');
    const deleteTag = await Tag.destroy({where: {id}})
    return deleteTag
}

