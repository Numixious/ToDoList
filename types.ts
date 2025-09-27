
export enum Category {
  Personal = 'Personal',
  Work = 'Work',
  Other = 'Other',
}

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
}
