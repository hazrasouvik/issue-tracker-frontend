export interface Issue {
  id: string;
  description: string;
  severity: string;
  status: string;
  createdDate: string | Date;
  resolvedDate: string | Date;
}
