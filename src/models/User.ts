import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";
import { IsEmail, Length } from "class-validator";
import bcrypt from "bcrypt";
import { instanceToPlain, Exclude } from 'class-transformer'

@Entity("users")
export class User extends BaseEntity {
//!Removed for User.findOne() to work
//   constructor(user: Partial<User>) {
//     super();
//     Object.assign(this, user);
//   }

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(6, 255, { message: "Username must be at least 6 characters long" })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Password must be more than 6 characters" })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPasword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  toJSON() {
      return instanceToPlain(this)
  }
}