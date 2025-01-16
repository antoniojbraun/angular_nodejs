import { Table,Model,Column,ForeignKey,BelongsTo } from "sequelize-typescript";
import { User } from "./User";
import { Post } from "./Post";


@Table
export class Comment extends Model<Comment>{
    @Column({
        allowNull: false
    })
    content?: string;

    @ForeignKey(()=>User)
    @Column({
        allowNull: false
    })
    userId?: number

    @ForeignKey(()=>Post)
    @Column({
        allowNull:false
    })
    postId?: number

    @BelongsTo(()=>Post)
    post?:Post

    @BelongsTo(()=>User)
    user?:User

}

/* 
    @BelongsTo = Usamos quando queremos informar que o Model em questão tem uma relação de 1 para 1
    com o objeto referenciado
    No caso em questão, um comentário percente a um único Usuário, como a um único Post.
*/