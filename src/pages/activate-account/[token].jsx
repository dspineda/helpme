import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Activate.module.scss";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ActivateAccount() {
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  const activateAccount = async () => {
    setSpinner(true);
    const response = await fetch(`/api/auth/activate-account/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setSpinner(false);
      Swal.fire({
        title: "Welcome to HelpMe",
        icon: "success",
        confirmButtonText: `Let's beggin!`,
      });
      router.push(`/login/professional/${data.id}`);
    } else {
      Swal.fire({
        title: "Invalid token!",
        text: "Please, try again later.",
        icon: "error",
        confirmButtonText: "Got it!",
      });
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.container__title}>
        <h1 className={styles.title}>Activate Account</h1>
      </section>
      <section className={styles.container__content}>
        <p>
          You are just one step away from being part of this great community of
          professionals and technicians.
        </p>
      </section>
      <section className={styles.container__button}>
        <button className={styles.button} onClick={activateAccount}>
          {spinner ? <Spinner color="primary" /> : <p>ACTIVATE</p>}
        </button>
      </section>
    </div>
  );
}
