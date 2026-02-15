# AI-Driven Risk-Based MFA System (Frontend)

The official frontend interface for the Cloud Security Project: **"AI-Driven Risk-Based Multi-Factor Authentication for Cloud Applications."**

This dashboard visualizes the authentication flow, including real-time "AI Analysis" simulations, MFA challenges, and secure access grants.

## 🚀 Project Status
* **Frontend:** ✅ Complete (UI + Logic Flow)
* **Backend Integration:** ⏳ Pending (Currently running on Mock Data for demo purposes)
* **Hosting:** Localhost (Dev Mode)

## 🛠️ Tech Stack
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS (Dark Mode / Glassmorphism)
* **Icons:** Lucide React
* **State Management:** React Hooks

---

## 💻 How to Run Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/Kaustubh779/MFA-cloud-project-.git](https://github.com/Kaustubh779/MFA-cloud-project-.git)
cd MFA-cloud-project-



install dependencies:
npm install



start dev server:
npm run dev
The app will launch at http://localhost:5173



Demo Credentials (Test Scenarios):
Since the backend is not yet connected, the application uses Mock Data to simulate the AI's decision-making process. Use these specific usernames to test the different security flows:

Username	Scenario	AI Decision	                Result
admin	    Low Risk	Behavior matches profile	✅ Direct Access (Green Dashboard)
user	   High Risk	Unusual Location/Device	    ❌ MFA Challenge (Red Alert Screen)



Project Structure:
src/App.jsx: Main controller handling the Login -> Analyzing -> Dashboard flow.
src/components: (Internal) Contains logic for Risk Analysis animation and MFA prompts.
src/services/MockAuth.js: (Concept) Where the fake backend logic currently lives.