import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false, comment: 'Role name' })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: 'Creation time' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: 'Last update time' })
    updatedAt: Date;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions',
    })
    permissions: Permission[];
}