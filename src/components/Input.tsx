import { InputInterface } from './@types';

const Input = ({ icon, value, placeholder, type, required, name, onChange, onBlur, errors, touched }: InputInterface) => {

    return (
        <>
            <div className="w-full relative my-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <img src={icon} alt="" className="w-4 h-4" />
                </div>
                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="block w-full p-2 pl-12 text-md text-white font-Pm border-2 rounded-lg bg-transparent focus:outline-none placeholder:font-Pm placeholder:text-white autofill:transition-colors autofill:duration-[5000000ms]"
                    placeholder={placeholder}
                    required={required} />

            </div>
            {errors[`${name}`] && touched[`${name}`] ? <p className={`mt-1 text-red-600 text-xs`}>{errors[`${name}`]}</p> : null}
        </>
    )
}

export default Input;