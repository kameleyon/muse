import { Database } from '../database.types';

export type Tables = Database['public']['Tables'];
export type TablesInsert = {
  [TableName in keyof Tables]: Tables[TableName]['Insert'];
};
export type TablesUpdate = {
  [TableName in keyof Tables]: Tables[TableName]['Update'];
};
export type TablesRow = {
  [TableName in keyof Tables]: Tables[TableName]['Row'];
};
