export interface Employee {
    id: number;
    name: string;
    role: string;
    joinDate: Date;
    lastDate: Date;
    isDeleting?: boolean;
    currentX: number;
  }
  