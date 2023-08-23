import React, { useState } from 'react';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Input';
import Button from '../../components/Button';
import { carousalIcons, envelope, googleImage, letterMarkLogo, lock, shape, signUpBgImage, userIcon } from '../../theme/images';
import { useFormik } from 'formik';
import { SignUpSchema } from './SignUpSchema';
import { useAuthContext } from '../../context/AuthContext';
import { User } from '../../context/@types.auth';
import { createResource } from '../../api';
import { ResourceTypeEnum } from '../../models/ResourceTypeEnum';
import CustomSelect from '../../components/CustomSelect';
import { LabelValue } from '../../models/LabelValue';
import { ResourceId } from '../../models/types';

const SignUp = () => {
  const navigate = useNavigate()
  const [country, setCountry] = useState<LabelValue<ResourceId>>({label: "Canada", value: "Canada"})
  const { setUser, setCookie } = useAuthContext()
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPass: ""
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        const res: User & { success: boolean } = await createResource<User & { success: boolean }>("", ResourceTypeEnum.SignUp, { fullName: values.fullName, email: values.email, password: values.password, country: country.label })
        setUser({
          fullName: res.fullName,
          email: res.email,
          authToken: res.authToken,
          country:res.country
        })
        setCookie("auth-token", res.authToken, { path: '/', maxAge: 3600 })
        navigate('/')
      } catch (error) {
        // Error Silently
      }
    }
  })
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 h-screen bg-BgScreen">
      <div className="justify-center items-center flex-col hidden lg:flex xl:flex">
        <div className="flex items-center justify-center pointer-events-none">
          <img src={signUpBgImage} className="w-3/4" alt='' />
        </div>
        <div className='mb-4 flex flex-col justify-center items-center'>
          <span className="ml-2 text-2xl drop-shadow-lg font-Pm text-HeadingColor">Safe Access to Cluster</span>
          <span className="ml-2 text-lg drop-shadow-lg font-Pr text-black">K8saas quickly provide safe access to cluster</span>
          <img src={carousalIcons} className="w-12 m-4" alt='' />
        </div>
        <img src={shape} className="absolute h-28 left-0 bottom-0" alt='' />
      </div >
      <div className="xsm:px-4 xsm:pt-4 sm:px-12 sm:pt-12">
        <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-r from-gradientLightBlue to-gradientDarkBlue rounded-t-[50px]">
          <div className="inset-y-0 left-0 flex items-center pointer-events-none">
            <img src={letterMarkLogo} className="h-14 mb-4" alt="" />
          </div>
          <div className='mb-4'>
            <span className="ml-2 text-2xl drop-shadow-lg font-Pm text-white">Sign Up to K8Saas </span>
          </div>
          <form className='w-2/3' onSubmit={handleSubmit}>
            <Input icon={envelope} value={values.fullName} errors={errors} touched={touched} onBlur={handleBlur} onChange={handleChange} name="fullName" required={true} placeholder={"Full Name"} type={"text"} />
            <Input icon={userIcon} value={values.email} errors={errors} touched={touched} onBlur={handleBlur} onChange={handleChange} name="email" required={true} placeholder={"Email address"} type={"email"} />
            <Input icon={lock} value={values.password} errors={errors} touched={touched} onBlur={handleBlur} onChange={handleChange} name="password" required={true} placeholder={"Password"} type={"password"} />
            <Input icon={lock} value={values.confirmPass} errors={errors} touched={touched} onBlur={handleBlur} onChange={handleChange} name="confirmPass" required={true} placeholder={"Confirm Password"} type={"password"} />
            <div className="">
              <div className="mb-2">
                {/* <label className="text-[12px] md:text-[14px] text-MainHeading font-Psb">Country</label> */}
                <CustomSelect bgColor='bg-white' value={country} placeholder={"Select Country"} options={[{label: "Canada", value: "Canada"}, {label: "United States", value: "United States"}, {label: "United Kingdom", value: "United Kingdom"}, {label: "Others", value: "Others"}]} onChange={(value) => setCountry(value)} />
              </div>
            </div>
            <div className='w-full'>
              <div className="flex items-center mt-2 mb-6">
                <input id="link-checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-white rounded focus:ring-2" />
                <label htmlFor="link-checkbox" className="ml-2 text-sm font-Pm text-white ">I agree with the <a href="#" className="text-white hover:underline">terms and conditions</a>.</label>
              </div>
            </div>
            <button type='submit' className="w-full p-2 flex justify-center bg-white border mb-3 rounded-lg text-md text-gradientLightBlue font-Pm">Sign Up</button>
            <Button text={'Sign Up with Google'} icon={googleImage} bgColor={"bg-white"} textColor={"text-black"} onClick={() => { }} width={"w-full"} />
          </form>
          <div className='flex'>
            <span className="ml-2 text-sm font-Pm text-white">Already have an account? </span>
            <span className="ml-2 text-sm font-Pm text-white"> <Link to='/login'> Sign In </Link> </span>
          </div>
        </div >
      </div >
    </div >
  );
}

export default SignUp;
