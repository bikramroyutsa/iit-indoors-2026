import { useState } from "react";
import { adminLogin } from "./actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    try {
      await adminLogin(email, password);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to login");
      }
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 pixel-pattern opacity-20 pointer-events-none" />
      <div className="z-10 w-full max-w-md bg-deep-teal border-8 border-black shadow-[0_0_0_4px_var(--mint),_12px_12px_0px_#000] p-8">
        <h1 className="text-3xl font-bold text-mint text-center tracking-widest mb-6 uppercase">
          admin terminal
        </h1>
        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 text-red-200 p-3 mb-6 text-sm font-pixelify text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-6 text-left">
          <div className="space-y-2">
            <label className="pixel-label">email</label>
            <input type="email" className="pixel-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="pixel-label">password</label>
            <input type="password" className="pixel-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="pixel-button mt-4" disabled={loggingIn}>
            {loggingIn ? "authenticating..." : "login"}
          </button>
        </form>
      </div>
    </div>
  );
}
