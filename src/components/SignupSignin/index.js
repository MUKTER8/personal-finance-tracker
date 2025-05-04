import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ✅ Icons
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";

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
          name: user.displayName || name,
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: user.metadata.creationTime,
        });
        toast.success("User data saved successfully!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
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

            updateProfile(user, { displayName: name })
              .then(() => {
                createDoc(user);
                toast.success("User created successfully!");
                setLoading(false);
                setName("");
                setPassword("");
                setEmail("");
                setConfirmPassword("");
                navigate("/dashboard");
              })
              .catch((error) => {
                toast.error("Profile update failed: " + error.message);
                setLoading(false);
              });
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
    setLoading(true);
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          toast.success("Login successfully!");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
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
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          createDoc(user);
          navigate("/dashboard");
          toast.success("Login successfully!");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } catch (e) {
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
              text={
                loading ? (
                  "Loading..."
                ) : (
                  <>
                    <MdEmail style={{ marginRight: "8px" }} />
                    Login with Email
                  </>
                )
              }
              onClick={loginUsingEmail}
              blue={true}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={
                <>
                  <FcGoogle style={{ marginRight: "8px" }} />
                  Login with Google
                </>
              }
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
              placeholder="Mukter Hosain"
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
              text={
                loading ? (
                  "Loading..."
                ) : (
                  <>
                    <MdEmail style={{ marginRight: "8px" }} />
                    Signup with Email
                  </>
                )
              }
              type="submit"
              onClick={signupWithEmail}
              blue={true}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={
                <>
                  <FcGoogle style={{ marginRight: "8px" }} />
                  Signup with Google
                </>
              }
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
