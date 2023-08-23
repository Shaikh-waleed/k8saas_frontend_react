export interface InputInterface {
    name: string,
    icon: string,
    value: string,
    placeholder: string,
    type: string,
    required: boolean,
    onChange: (evt: any) => void,
    onBlur: (evt: any) => void,
    errors: any,
    touched: any
}
export interface ButtonInterface {
    icon?: string,
    bgColor: string,
    width: string,
    textColor: string,
    onClick: () => void,
    text: string
}