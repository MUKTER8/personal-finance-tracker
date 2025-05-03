import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSigninComponents() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: user.metadata.creationTime,
        });
        toast.success("User data saved successfully!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      //toast.error("User already exists!");
      setLoading(false);
    }
  }

  function signupWithEmail() {
    setLoading(true);
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User created successfully!");
            setLoading(false);
            setName("");
            setPassword("");
            setEmail("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password do not match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are required!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log(email, password);
    setLoading(true);

    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          toast.success("Login successfully!");
          setLoading(false);
          navigate("/dashboard");
          console.log("User Logged in successfully!", userCredential.user);
        })
        .catch((error) => toast.error(error.message));
      setLoading(false);
    } else {
      toast.error("All fields are required");
      setLoading(false);
    }
  }

  // Google Auth
  const provider = new GoogleAuthProvider();
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>>", user);
          createDoc(user);
          navigate("/dashboard");
          toast.success("Login successfully!");
          setLoading(false);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(error.message);
          setLoading(false);
        });
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Finance</span>
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="example@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="********"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login with Email"}
              onClick={loginUsingEmail}
              blue={true}
            />
            <p className="p-login">or</p>
            <Button onClick={googleAuth} text="Login with Google" blue={true} />
            <p
              className="p-login"
              style={{
                cursor: "pointer",
                marginTop: "10px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Or Don't Have an Account?{" "}
              <span
                style={{ color: "blue", fontWeight: "bold" }}
                onClick={() => setLoginForm(!loginForm)}
              >
                Signup
              </span>
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Signup <span style={{ color: "var(--theme)" }}>Finance</span>
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="John Doe"
            />
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="example@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="********"
            />
            <Input
              type="password"
              label="Confirm Password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="********"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup with Email"}
              blue={true}
              type="submit"
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text="Signup with Google"
              blue={true}
            />
            <p
              className="p-login"
              style={{
                cursor: "pointer",
                marginTop: "10px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Already have an account?{" "}
              <span
                style={{ color: "blue", fontWeight: "bold" }}
                onClick={() => setLoginForm(!loginForm)}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponents;
