export interface PostInterface {
  id?: string;
  thumbnail: string;
  title: string;
  shortDescription: string;
  mainCategoryId: number;
  subCategoryId: number;
  topics?: string[];
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  version?: string;
  isHighlight?: boolean;
  link?: string;
  isActive?: boolean;
}
