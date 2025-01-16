import { Category } from "../models/Category"

export async function getAllCategories(){
    const categories =  await Category.findAll() // select * from categories
    return categories
}

export async function getCategoryBySlug(slug:string){
    const category = await Category.findOne({where: {slug} })
    return category;
}

export async function getCategoryById(id:number){
    const category = await Category.findByPk(id);
    return category; 
}

export async function addCategory(name:string,userId:number,slug:string){
    const category = new Category();
    category.name = name;
    category.userId = userId;
    category.slug = slug;

    await category.save();
    return category;
}

export async function updateCategory(name:string,id:number,slug:string){
    const category = await Category.findByPk(id);
    if(!category) throw new Error('Category not found!');
    
    // verify if a name and a slug are provided before update
    if(name) category.name = name;
    if(slug) category.slug = slug;

    await category.save();
    return category;
}

export async function deleteCategoryById(id:number){
    const deleteCategory = await Category.destroy({where:{id}})
    return deleteCategory
}