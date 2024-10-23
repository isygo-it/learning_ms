import {TopicDetailType} from "./topicTypes";
import {AuthorTypes} from "./authorTypes";

export type ArticleTypes = {
  id?: number;
  code: string;
  domain: string;
  tags: string;
  authorID: number;
  name: string;
  type: ArticleTypeEnum;
  title: string;
  description: string;
  extension: string;
  file: File;
  originalFileName: string;
  topics: TopicDetailType[];
  author:AuthorTypes;
  createDate: Date;
  updateDate: Date;
};
export enum ArticleTypeEnum {
  HTML = 'HTML',
  PDF = 'PDF',
  VIDEO = 'VIDEO'
}
export type ListItemsMenuType = {
  title: string
  name: string
}
