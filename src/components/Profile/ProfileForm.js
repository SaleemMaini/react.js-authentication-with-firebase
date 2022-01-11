import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const newEnteredPasswordRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory()
  const submitHandler = (e) => {
    e.preventDefault();

    const enteredPassword = newEnteredPasswordRef.current.value;

    // add validation

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAOjtH9CTf41tkHXAoqX3wiWPIctg4YCLY",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      res.ok && console.log("success");
      history.replace('/')
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          ref={newEnteredPasswordRef}
          minLength="7"
          type="password"
          id="new-password"
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
