import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6">
      <div className="text-center">

        <div className="text-8xl mb-6">
          🤖
        </div>

        <h1 className="text-6xl font-bold mb-4">
          404
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          Oops! Indha page kிடைக்கல.
        </p>

        <Link
          to="/"
          className="inline-block bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          ← Home ku Ponga
        </Link>

      </div>
    </main>
  );
}

export default NotFound;