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
import Cookies from 'js-cookie';

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
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male'); // Add state for gender
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const storeUserInfoInCookies = (name, email, gender) => {
    // Set cookies with name, email, and gender
    Cookies.set('name', name, { expires: 365, path: '/' });
    Cookies.set('email', email, { expires: 365, path: '/' });
    Cookies.set('gender', gender, { expires: 365, path: '/' });
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const name = user.displayName;
      const email = user.email;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      });

      storeUserInfoInCookies(name, email, 'unknown'); // Gender unknown for Google login

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
          storeUserInfoInCookies(result.user.displayName, result.user.email, 'unknown');
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
      const name = user.displayName;
      const email = user.email;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date(),
      });

      storeUserInfoInCookies(name, email, 'unknown'); // Gender unknown for Facebook login

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
          storeUserInfoInCookies(result.user.displayName, result.user.email, 'unknown');
          router.push('/');
        }
      } else {
        setError(err.message);
      }
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
        displayName: user.displayName,
        gender: gender, // Store gender in Firestore
        lastLogin: new Date(),
      });

      storeUserInfoInCookies(name, email, gender);

      setError(null);
      setIsSignup(false);
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

        storeUserInfoInCookies(user.displayName, user.email, 'unknown'); // Gender unknown for email login

        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex lg:mt-[85px] mt-[60px] p-2 flex-col items-center justify-center lg:p-12 bg-gradient-to-r from-green-200 via-green-400 to-green-600 md:flex-row">
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
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2 border w-[250px] border-gray-300 rounded-lg"
                  required
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="px-4 py-2 border w-[250px] border-gray-300 rounded-lg"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
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
                className="w-[250px] px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </div>
            </div>
            {isSignup && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-[250px] px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                </div>
              </div>
            )}
            {isSignup && (
              <p className="text-sm text-gray-500">
                Password Strength: {getPasswordStrength(password)}
              </p>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-white transition-all duration-300 bg-green-500 rounded-lg hover:bg-green-600"
            >
              {isSignup ? 'Sign up' : 'Log in'}
            </button>
            <p className="text-center">
              {isSignup
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
