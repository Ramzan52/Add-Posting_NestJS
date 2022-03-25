export interface BaseModel {
  id: string;
  isDeleted: boolean;
  createdByUsername: string;
  createdBy: string;
  createdOn: Date;
  modifiedByUsername: string;
  modifiedBy: string;
  modifiedOn: Date;
}
