import React, { useEffect, useState } from "react";
import "./styles.css";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      fetchUserData();
    }
  }, [user, loading, navigate]);

  async function fetchUserData() {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logout successfully");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  // Get the user's proper name with priority:
  // 1. Name from database (for manual registered users)
  // 2. Google/Facebook displayName
  // 3. Fallback to 'User'
  const getUserProperName = () => {
    if (userData?.name) return userData.name; // From database
    if (user?.displayName) return user.displayName; // From Google/Facebook
    return "User";
  };

  return (
    <div className="navbar">
      <p className="logo">Finance Tracker</p>
      {user && (
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{getUserProperName()}</span>
            <img
              src={user.photoURL || userImg}
              className="user-avatar"
              alt="User profile"
            />
          </div>
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
