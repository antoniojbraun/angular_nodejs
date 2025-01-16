import { Request, Response } from "express";
import { addCategory, deleteCategoryById, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";
import { generateSlug } from "../shared/general.util";
import { z } from "zod";


export const getCategoriesController = async (req:Request, res:Response) => {
    const categories = await getAllCategories()
    res.json(categories)
}

export const addCategoryController = async (req:Request, res:Response) => {
    // Using zod to validate the data coming from forms
    const schema = z.object({
        name: z.string(),
        userId:z.number()
    })
    const schemaValidator = schema.safeParse(req.body)
    if(!schemaValidator.success) {
        res.status(400).json({message: 'Invalid data', errors: schemaValidator.error });
        return;
    }
    
    const {name,userId} = req.body;
    let slug = generateSlug(name);
    const categoryAlreadyExistsBySlug = await getCategoryBySlug(slug);

    if(categoryAlreadyExistsBySlug) slug = generateSlug(name,true)

    const category = await addCategory(name,userId,slug);
    res.json(category);
}

export const updateCategoryController = async(req:Request, res:Response) => {

    // Using zod to validate the data coming from forms
    const schema = z.object({
        name: z.string(),
        id: z.number()
    })
    const schemaValidator = schema.safeParse(req.body)
    if(!schemaValidator.success) {
        res.status(400).json({message: 'Invalid data', errors: schemaValidator.error });
        return;
    }
    
    let {name, id} = req.body;

    // check if the category exist by given id
    let dbCategory = await getCategoryById(id);
    if(!dbCategory) {
        res.status(400).json({message:'Category not found'});
        return
    }
       
    let slug = generateSlug(name);

    const checkCategoryBySlug = await getCategoryBySlug(slug) // Verify if a slug is already used
    if(checkCategoryBySlug) {
        res.status(400).json({message:'Category is already being used.'});
        return;
    }
    
    //update the category
    let updatedCategory = await updateCategory(name,id,slug);
    
    res.json(updatedCategory)

}

export const deleteCategoryController = async (req:Request, res:Response) => {
    let {id} = req.body;
    // check if the category exist by given id
    let dbCategory = await getCategoryById(id);
    if(!dbCategory) {
        res.status(400).json({message:'Category not found'});
        return;
    }
    
    let deleteCategory = await deleteCategoryById(id);
    if(deleteCategory === 1) res.json({message: 'Category deleted successfully!'})
}