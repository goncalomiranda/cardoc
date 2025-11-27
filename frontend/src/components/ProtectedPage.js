import React from "react";

function ProtectedPage() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div
        className="card shadow-sm p-4 text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="card-title mb-4">Welcome to the Protected Area! 🎉</h2>
        <p className="card-text">
          You can only see this page because you are successfully signed in with
          Clerk.
        </p>
        <p className="card-text">
          Feel free to explore other features or log out.
        </p>
      </div>
    </div>
  );
}

export default ProtectedPage;
