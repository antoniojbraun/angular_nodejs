import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Post } from "./Post";
import { Tag } from "./Tag";

@Table
export class PostTag extends Model<PostTag>{
    
    @ForeignKey(()=>Post)
    @Column({
        allowNull:false
    })
    postId?: number

    @ForeignKey(()=>Tag)
    @Column({
        allowNull:false
    })
    tagId?: number



}   