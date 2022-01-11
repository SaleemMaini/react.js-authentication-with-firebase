import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Get current data
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    // Optional: add validation

    setIsLoading(true);
    let url = "";

    if (isLogin) {
      // LOGIN MODE
      // update url to sign in api
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOjtH9CTf41tkHXAoqX3wiWPIctg4YCLY";
    } else {
      // SIGN UP MODE
      // update url to sign up api
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOjtH9CTf41tkHXAoqX3wiWPIctg4YCLY";
    }

    // Send request for sign in or sign up

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          console.log("done");
          return res.json();
        } else {
          return res.json().then((data) => {
            // show an error modal
            console.log(data);
            let errorMessage = "Authentication Failed!";
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            // alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // convert exptime from seconds to mli seconds

        // const expTime = new Date(new Date().getTime() + +data.expiresIn * 1000);
        // authCtx.login(data.idToken, expTime.toISOString());
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        console.log(data.expiresIn);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
