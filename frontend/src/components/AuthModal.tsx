import Modal from "./Modal";
import { FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import * as api from "../helpers/api";

type Props = {
  onClick: () => void;
};

const AuthModal = ({ onClick }: Props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const viewLogin = (status: boolean) => {
    setError(null);
    setIsLoggedIn(status);
  };

  const handleSubmit = async (e: FormEvent, endpoint: string) => {
    e.preventDefault();

    if (!isLoggedIn && password !== confirmPassword) {
      setError("Invalid password or username");
      return;
    }

    const data = await api.userAuth(endpoint, username, password);

    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Username", username);
      setCookie("AuthToken", data.token);
      window.location.reload();
    }
  };

  return (
    <Modal
      title={isLoggedIn ? "Please sign in" : "Please sign up"}
      onClose={onClick}
    >
      <form>
        <input
          type="text"
          placeholder="Enter username"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />

        {!isLoggedIn && (
          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
            }}
          />
        )}
        <input
          type="submit"
          className="submit-btn"
          onClick={(e) => handleSubmit(e, isLoggedIn ? "login" : "register")}
        />
        {error && <p>{error}</p>}
      </form>

      <div className="auth-options">
        <button onClick={() => viewLogin(true)}>Sign in</button>
        <button onClick={() => viewLogin(false)}>Sign up</button>
      </div>
    </Modal>
  );
};

export default AuthModal;
