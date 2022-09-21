import Image from "next/image";
import NavbarInListProfessionals from "../../components/NavbarInListProfessionals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "../../styles/Electrician.module.scss";

export default function ServiceElectrician() {
  const router = useRouter();
  const [data, setData] = useState([]);

  const handleDetail = (id) => {
    router.push(`/profile/professional/${id}`);
  };

  useEffect(() => {
    const getAllElectrician = async () => {
      const response = await fetch("/api/maintance/electrician", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData(await response.json());
      console.log(
        "🚀 ~ file: electrician.jsx ~ line 25 ~ getAllElectrician ~ response",
        response
      );
    };
    getAllElectrician();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.header__img1}>
        <Image
          src="/img/about.png"
          width={1880}
          height={613}
          alt="Imagen Home"
        ></Image>
      </section>
      <section className={styles.header}>
        <div className={styles.header__title}>
          <h1>Electrician</h1>
        </div>
      </section>
      <section className={styles.info__services}>
        <div>
          <ul className={styles.info__list}>
            {data.map((data) =>
              data.isActivated === true ? (
                <li key={data.id} className={styles.info__services__users}>
                  <div className={styles.info__services__users__img}>
                    <Image
                      src={data.image}
                      width={277}
                      height={213}
                      alt="Service Paint"
                    ></Image>
                  </div>
                  <div className={styles.info__services__users__name}>
                    <button
                      className={styles.info__services__users__button}
                      onClick={() => handleDetail(data.id)}
                    >
                      <h3>
                        {data.firstName} {data.lastName}
                      </h3>
                    </button>
                  </div>
                  <div className={styles.info__services__users__description}>
                    <p>{data.description}</p>
                  </div>
                  <div className={styles.info__services__users__city}>
                    <p>{data.city}</p>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </section>
      <NavbarInListProfessionals />
    </div>
  );
}