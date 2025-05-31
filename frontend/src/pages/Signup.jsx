import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../api/userAuth";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/loggoo1.png'

const Signup = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const { email, name, image } = result.data.user;
        const token = result.data.token;
        const obj = { email, name, token, image };
        localStorage.setItem('user-info', JSON.stringify(obj));
        navigate('/dashboard');
        
      } else {
        // console.log('hii');
        throw new Error(authResult);
      }
    } catch (e) {
      console.log('Error while Google Login...', e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <section className="bg-black lg:h-screen max-w-screen-2xl">
      <div className='flex py-7 px-12'>
        <img src={logo} alt="" className="w-14 h-14 mt-4"/>
        <span className='text-white font-bold mt-7 text-2xl px-3'>
          WriteTogether
        </span>
      </div>
      <div className="py-40 text-center">
        <div className="text-white">
          <div className="font-bold text-4xl">
            Create your WriteTogether Account
          </div>
          <div className='text-center py-4 text-md'>
            Already have an account?
            <Link className='text-sky-300' to='/login'> SignIn</Link>
          </div>
        </div>
        <button className="bg-slate-400 px-10 py-3 my-12 text-slate-900 rounded-lg hover:bg-slate-500" onClick={googleLogin}>
          Sign up with google
        </button>
      </div>
    </section>
  )
}

export default Signup;