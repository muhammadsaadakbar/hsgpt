import Link from "next/link";

export default function Profile({
  user,
 }: {
  user: any;
 }) {
  return (
    <div className="sidebar-footer">
      {!user?.name ? (
        /* ---------------- LOGIN STATE ---------------- */
        <Link href="/auth/login" className="login-link">
          <div className="user-profile">
            <div className="user-avatar guest">?</div>
            <span className="user-name">Login</span>
          </div>
        </Link>
      ) : (
        /* ---------------- LOGGED IN STATE ---------------- */
        <div className="user-profile">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <button  className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
