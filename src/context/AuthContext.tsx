import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, User } from './@types.auth';
import { useCookies } from 'react-cookie';
import { ResourceTypeEnum } from '../models/ResourceTypeEnum';
import { getResource } from '../api';



const AuthContext = createContext<AuthContextType | null>(null);
export const useAuthContext = () => useContext(AuthContext) as AuthContextType


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [cookies, setCookie] = useCookies(['auth-token']);
  const [user, setUser] = useState<User | null>(null)
  const accessToken = cookies['auth-token']
  useEffect(() => {
    getProfileData(cookies["auth-token"])
  }, [cookies])
  const getProfileData = async (cookie: string) => {
    if(cookie){
      try {
        const res: User & { success: boolean } = await getResource(cookie, ResourceTypeEnum.GetProfile)
        setUser({
          fullName: res.fullName,
          email: res.email,
          country:res.country
        })
      } catch (error) {
        // Error Silently
      }
    }
  }
  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setCookie }}>
      {children}
    </AuthContext.Provider>
  )
}