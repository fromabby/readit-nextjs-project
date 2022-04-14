import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm'
import { instanceToPlain, Exclude } from 'class-transformer'

export default abstract class Entity extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date

    toJSON() {
        return instanceToPlain(this)
    }
}
