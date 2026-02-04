import Swal from "sweetalert2";
export default async function logout(user) {
  if (!user.email) {
    Swal.fire({
      icon: "error",
      title: "Not Logged In",
      text: "You Are not Logged In Please Login to continue",
    });
  }
  const response = await fetch("/api/auth/logout", {
    method: "GET",
    credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  const data = await response.json();
  if (response.ok) {
    window.location.reload();
    Swal.fire({ icon: "success", title: "Logged Out", text: data.message });
  } else Swal.fire({ title: "Error", text: data.message, icon: "error" });
}
