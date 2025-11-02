import { DataSource } from "typeorm"
import { User } from "./entities/user.entity";
import { Topic } from "./entities/topic.entity";
import { Comment } from "./entities/comment.entity";
import { Permission } from "./entities/permission.entity";

export const AppDataSourceOptions = new DataSource({
    type: 'postgres',
    database: 'testdb',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    entities: [Comment, Topic, User, Permission],
    synchronize: false,
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});