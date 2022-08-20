import { Column, Model, Table } from "sequelize-typescript";


@Table
export class Tweet extends Model {
    @Column
    content:string;
    @Column
    author:string;
}