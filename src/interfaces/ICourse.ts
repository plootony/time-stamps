import type {IChapter} from './IChapter';

export interface ICourse {
    id: string,
    image: string,
    title: string,
    link: string,
    desc: string,
    tags: string[],
    createdAt: Date,
    isCompleted: boolean,
    chapters?: IChapter[];
}