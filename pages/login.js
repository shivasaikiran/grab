import React, { useState } from 'react';
import { auth, db } from '@/Firebase/Config';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, setDoc } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import login from '../Images/login.png';
import Image from 'next/image';

const validatePassword = (password) => {
  const lengthValid = password.length >= 8;
  const uppercaseValid = /[A-Z]/.test(password);
  const numberValid = /[0-9]/.test(password);
  const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return lengthValid && uppercaseValid && numberValid && specialCharValid;
};

const getPasswordStrength = (password) => {
  const length = password.length;
  if (length === 0) return 'None';
  if (length < 8) return 'Weak';
  if (validatePassword(password)) return 'Strong';
  return 'Medium';
};

const Login = () => {
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Add state for name
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      });
      router.push('/');
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData.email;
        const pendingCred = GoogleAuthProvider.credentialFromError(err);
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
          const provider = getProviderForProviderId(methods[0]);
          const result = await signInWithPopup(auth, provider);
          await linkWithCredential(result.user, pendingCred);
          router.push('/');
        }
      } else {
        setError(err.message);
      }
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      });
      router.push('/');
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData.email;
        const pendingCred = FacebookAuthProvider.credentialFromError(err);
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
          const provider = getProviderForProviderId(methods[0]);
          const result = await signInWithPopup(auth, provider);
          await linkWithCredential(result.user, pendingCred);
          router.push('/');
        }
      } else {
        setError(err.message);
      }
    }
  };

  const getProviderForProviderId = (providerId) => {
    switch (providerId) {
      case GoogleAuthProvider.PROVIDER_ID:
        return new GoogleAuthProvider();
      case FacebookAuthProvider.PROVIDER_ID:
        return new FacebookAuthProvider();
      default:
        throw new Error(`No provider implemented for ${providerId}`);
    }
  };

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, with an uppercase letter, number, and special character');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name, // Save the name
        lastLogin: new Date(),
      });
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          lastLogin: new Date(),
        });
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex   lg:mt-[85px] mt-[60px] p-2 flex-col items-center justify-center  lg:p-12 bg-gradient-to-r from-green-200 via-green-400 to-green-600 md:flex-row">
      <div className="hidden w-full mb-4 md:w-1/2 sm:block">
        <Image src={login} alt="Image" className="w-full h-auto " />
      </div>
      <div className="w-full p-10 mb-4 border rounded-md shadow-2xl shadow-white lg:p-8 md:w-1/2">
        <div className="flex flex-col items-center justify-center h-[450px]">
          <h2 className="p-2 text-xl font-bold text-center text-green-500 bg-white rounded-md lg:text-2xl ">
            Grab Deals Daily
          </h2>
        <div className='flex flex-col my-4 space-y-4 '>
        <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-[250px] py-2 text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-lg shadow-md"
              style={{ height: '48px' }}
            >
              <FcGoogle className="mr-2" size={24} /> Sign up with Google
            </button>
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-[250px] py-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
              style={{ height: '48px' }}
            >
              <FaFacebookF className="mr-2" /> Sign up with Facebook
            </button>
        </div>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form
            onSubmit={isSignup ? handleEmailSignup : handleEmailLogin}
            className="flex flex-col space-y-4"
          >
            {isSignup && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border w-[250px] border-gray-300 rounded-lg"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border w-[250px] border-gray-300 rounded-lg"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" px-4 py-2 w-[250px] border border-gray-300 rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 w-[250px] left-56 flex items-center "
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {isSignup && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className=" px-4 py-2 w-[250px] border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 w-[250px] left-56 flex items-center pr-3"
                >
                  {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            )}
            {password && (
              <p className={`text-sm mt-1 ${getPasswordStrength(password) === 'Strong' ? 'text-green-900' : 'text-red-500'}`}>
                Password Strength: {getPasswordStrength(password)}
              </p>
            )}
            <button
              type="submit"
              className="flex items-center justify-center w-[250px] py-2 text-green-500 transition-all duration-300 bg-white rounded-lg shadow-md font-bold"
              style={{ height: '48px' }}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>
          <div className="flex flex-col mt-4 space-y-4">
           
            <p className="text-center text-white">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="font-bold text-white underline"
              >
                {isSignup ? 'Login here' : 'Sign up here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
