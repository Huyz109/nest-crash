import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false, comment: 'Permission name' })
    name: string;

    @Column({ length: 6, unique: true, nullable: false})
    nameCode: string;

    @Column({ nullable: true})
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: 'Creation time' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', comment: 'Last update time' })
    updatedAt: Date;
}