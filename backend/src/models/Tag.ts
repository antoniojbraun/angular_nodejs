import { BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { PostTag } from "./PostTag";
import { Post } from "./Post";
import { User } from "./User";

@Table
export class Tag extends Model<Tag>{
    @Column({
        allowNull: false
    })
    name?: string;

    @Column({
        allowNull : false,
        unique : true
    })
    slug?: string;

    @ForeignKey(()=>User)
    @Column({
        allowNull:false
    })
    userId?:number;
    
    @BelongsTo(()=>User)
    user?: User;

    @BelongsToMany(()=>Post, ()=>PostTag)
    posts?:Post[];

}