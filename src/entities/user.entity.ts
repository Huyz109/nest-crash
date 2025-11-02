import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Comment } from "./comment.entity";
import { Permission } from "./permission.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false})
    name: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

    @OneToMany((type) => Comment, (comment) => comment.user)
    comments: Comment[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: 'Creation time' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: 'Last update time' })
    updatedAt: Date;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'user_permissions',
    })
    permissions: Permission[];

    @BeforeInsert()
    async hasPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}