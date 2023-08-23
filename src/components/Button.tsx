import { ButtonInterface } from './@types';

const Button = ({
    icon,
    bgColor = 'bg-white',
    onClick,
    text,
    textColor = "bg-black",
    width = "w-2/3"
}: ButtonInterface) => {
    return (
        <div onClick={onClick} className={`${width} p-2 flex justify-center items-center ${bgColor} hover:bg-BgScreen border mb-3 rounded-lg shadow-md`}>
            {icon && <div className="flex items-center pointer-events-none">
                <img src={icon} alt="" className="w-4 h-4 mr-2" />
            </div>}
            <div className={`text-md ${textColor} font-Pm`}>
                {text}
            </div>
        </div>
    )
}

export default Button;