import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
`;

const Button = styled.button`
  background-color: #5a67d8;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
`;

const GoogleButton = styled(Button)`
  background-color: #db4437;
  margin: 0.5rem 0 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border-radius: 8px;
  border: none;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      alert(error.message);
    }
  }

  return (
    <Container>
      <h2>Login</h2>
      <label>Email</label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={signInWithEmail}>Sign in with Email</Button>
      <GoogleButton onClick={signInWithGoogle}>
        Sign in with Google
      </GoogleButton>
    </Container>
  );
};

export default Login;
