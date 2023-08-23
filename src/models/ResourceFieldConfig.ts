export interface ResourceFieldConfig {
  key: string;
  label: string;
  valueFormatter: (value) => string | number;
  isImage?: boolean;
}
