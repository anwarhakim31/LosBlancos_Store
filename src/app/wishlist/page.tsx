"use client";
import BreadCrubm from "@/components/element/BreadCrubm";
import styles from "./wishlist.module.scss";
import Image from "next/image";
import { Star, X } from "lucide-react";
import { useAppSelector } from "@/store/hook";
import { formatCurrency } from "@/utils/contant";
import { useDispatch } from "react-redux";
import { addWishList, removeWishList } from "@/store/slices/wishSlice";
import { TypeProduct } from "@/services/type.module";
import { Fragment } from "react";
import Footer from "@/components/layouts/Footer";
import Link from "next/link";
const WishListPage = () => {
  const dispatch = useDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: TypeProduct
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (wishlist.some((item) => item._id === product._id)) {
      dispatch(removeWishList(product._id));
    } else {
      dispatch(addWishList(product));
    }
  };

  return (
    <Fragment>
      <main>
        <section className={styles.container}>
          <BreadCrubm />
          <h1>Daftar Keinginan</h1>
          <div className={styles.content}>
            {wishlist.length > 0 ? (
              wishlist.map((item) => {
                const collection = item.collectionName.name.replace(" ", "-");
                const id = item._id;
                return (
                  <Link
                    href={`/produk/${collection}/${id}`}
                    className={styles.card}
                    key={item._id}
                  >
                    <button
                      type="button"
                      aria-label="remove from wishlist"
                      className={styles.remove}
                      onClick={(e) => handleWishlist(e, item)}
                    >
                      <X />
                    </button>
                    <div className={styles.card__image}>
                      <Image
                        src={item.image[0]}
                        alt="image"
                        width={1000}
                        height={1000}
                        priority
                      />
                    </div>
                    <div className={styles.card__content}>
                      <p className={styles.card__content__collection}>
                        {item.collectionName.name}
                      </p>

                      <h3 className={styles.card__content__title}>
                        {item.name}
                      </h3>
                    </div>

                    <p className={styles.card__price}>
                      {formatCurrency(Number(item.price))}
                    </p>
                    <div className={styles.card__rating}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} />
                      ))}
                      <p>({Math.round(5.1)})</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className={styles.empty}>
                <Image
                  src={"/empty-wishlist.png"}
                  alt="image"
                  width={200}
                  height={200}
                />
                <p>Daftar keinginan anda kosong.</p>
                <span>
                  Tap simbol hati pada produk untuk menambahkan keinginan .
                </span>
                <Link className={styles.button} href={"/"}>
                  Belanja Sekarang
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default WishListPage;
