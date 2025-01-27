/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseError } from "@/utils/axios/response-error";
import React, { useEffect, useRef, useState } from "react";
import styles from "./select.module.scss";
import { ChevronDown } from "lucide-react";

interface propsType {
  placeholder: string;
  id: string;
  name: string;
  setValue: (value: any) => void;
  fetching: () => Promise<any>;
  value?: any;
}

const SelectOptionFetch = ({
  placeholder,
  id,
  name,
  setValue,
  fetching,
  value,
}: propsType) => {
  const compRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([]);
  const [select, setSelect] = React.useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (value) {
      setSelect(value || "");
    }
  }, [value]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetching();

        if (res.status === 200) {
          setData(res.data[name]);
        }
      } catch (error) {
        ResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [fetching, name]);

  const handleSelect = (value: any) => {
    setSelect(value?.name || "");
    setValue(value);
    setOpen(false);
  };

  const handleKeyDown = (value: any, e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      setSelect(value?.name || "");
      setValue(value);
      setOpen(!open);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (compRef.current && !compRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={compRef} className={styles.container}>
      <input
        type="text"
        id={id}
        readOnly
        value={select}
        placeholder={placeholder}
        disabled={loading}
        className={styles.text}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      />
      <div className={styles.icon}>
        <ChevronDown className={open ? styles.active : ""} />
      </div>
      {open && (
        <ul
          role="dialog"
          className={styles.dropdown}
          tabIndex={-1}
          aria-labelledby={id}
        >
          <li
            tabIndex={0}
            onClick={() => handleSelect("")}
            onKeyDown={(e) => handleKeyDown("", e)}
          >
            {placeholder}
          </li>

          {data?.length > 0 &&
            data.map((item: any) => (
              <li
                key={item._id}
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => handleKeyDown(item, e)}
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SelectOptionFetch;
