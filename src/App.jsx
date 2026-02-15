import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, MapPin, Lock, User, Key, ArrowRight, CheckCircle } from 'lucide-react';

// --- COMPONENT 1: THE LOGIN SCREEN ---
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <ShieldCheck size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">Secure Cloud Access</h1>
        <p className="text-slate-400 text-center mb-8">AI-Driven Risk Assessment Gateway</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter username"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">Try 'admin' (Low Risk) or 'user' (High Risk)</p>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="password" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            onClick={() => onLogin(username)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            Secure Login <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT 2: THE AI ANALYSIS ANIMATION (THE WOW FACTOR) ---
const RiskAnalyzer = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 1, text: "Analyzing IP Geolocation & VPN...", status: "pending", icon: MapPin },
    { id: 2, text: "Verifying Device Fingerprint...", status: "pending", icon: Lock },
    { id: 3, text: "Assessing Keystroke Dynamics...", status: "pending", icon: Activity },
    { id: 4, text: "Calculating ML Risk Score...", status: "pending", icon: ShieldCheck },
  ]);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      setSteps((prev) => {
        const newSteps = [...prev];
        if (currentStep < newSteps.length) {
          newSteps[currentStep].status = "completed";
          if (currentStep === newSteps.length - 1) {
             setTimeout(onComplete, 800);
             clearInterval(interval);
          }
        }
        return newSteps;
      });
      currentStep++;
    }, 800); // Speed of animation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <Activity className="text-blue-500 animate-pulse" />
          AI Risk Engine Active
        </h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`p-2 rounded-full transition-colors duration-500 ${step.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                <step.icon size={18} />
              </div>
              <span className={`text-sm text-slate-300 transition-opacity duration-500 ${step.status === 'completed' ? 'opacity-100' : 'opacity-50'}`}>{step.text}</span>
              {step.status === 'completed' && <CheckCircle size={16} className="ml-auto text-green-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT 3: MFA CHALLENGE SCREEN ---
const MFAScreen = ({ onVerify }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full animate-pulse">
            <ShieldAlert size={40} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">High Risk Detected</h1>
        <p className="text-slate-400 text-center mb-6">Our AI flagged this login as unusual. Please verify your identity.</p>
        
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Risk Factors</p>
          <ul className="text-sm text-red-400 list-disc list-inside">
            <li>Unusual Geolocation (Russia)</li>
            <li>New Device Detected</li>
            <li>Risk Score: 92/100</li>
          </ul>
        </div>

        <input type="text" placeholder="Enter 6-digit OTP" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-center text-xl tracking-widest text-white focus:border-red-500 focus:outline-none mb-4" />
        
        <button onClick={onVerify} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all">Verify Identity</button>
      </div>
    </div>
  );
};

// --- COMPONENT 4: DASHBOARD (SUCCESS) ---
const Dashboard = ({ user, riskScore }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <nav className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="font-bold text-xl flex items-center gap-2"><ShieldCheck className="text-green-500"/> SecureCloud</div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold">{user}</p>
            <p className="text-xs text-green-400">Authenticated</p>
          </div>
          <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center"><User /></div>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-2">Session Risk Score</h3>
          <div className="text-4xl font-bold text-green-500">{riskScore}% <span className="text-xs text-slate-500 font-normal">Safe</span></div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-2">Last Login</h3>
          <div className="text-xl font-bold">Just Now</div>
          <p className="text-xs text-slate-500">Via Ghaziabad, India</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-2">Auth Method</h3>
          <div className="text-xl font-bold">AI-Based Passthrough</div>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-800/50 p-12 rounded-xl border border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-500">
        <Lock size={48} className="mb-4 opacity-50"/>
        <p>Secure Application Content Loads Here...</p>
      </div>
    </div>
  );
};

// --- MAIN APP CONTROLLER ---
function App() {
  const [screen, setScreen] = useState('login'); // login, analyzing, mfa, dashboard
  const [currentUser, setCurrentUser] = useState('');
  const [riskScore, setRiskScore] = useState(0);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen('analyzing');
  };

  const handleAnalysisComplete = () => {
    // THE DEMO LOGIC (CHEAT CODE)
    if (currentUser.toLowerCase().includes('admin')) {
      setRiskScore(12); // Low Risk
      setScreen('dashboard');
    } else {
      setRiskScore(92); // High Risk
      setScreen('mfa');
    }
  };

  return (
    <>
      {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
      {screen === 'analyzing' && <RiskAnalyzer onComplete={handleAnalysisComplete} />}
      {screen === 'mfa' && <MFAScreen onVerify={() => setScreen('dashboard')} />}
      {screen === 'dashboard' && <Dashboard user={currentUser} riskScore={riskScore} />}
    </>
  );
}

export default App;