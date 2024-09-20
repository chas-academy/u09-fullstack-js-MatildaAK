import {
  faCirclePlus,
  faCircleMinus,
  faBookmark,
  faChevronDown,
  faChevronUp,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  icon?:
    | "faBookmark"
    | "faCirclePlus"
    | "faChevronDown"
    | "faChevronUp"
    | "faCircleMinus";
  type: "button" | "submit";
  variant?: "primary" | "secondary" | "third";
  size?: "small";
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  filterButton?: "filterButton";
  filterItem?: "filterItem";
}

// Guide Hur man lägger till en knapp
// För att lägga till en knapp så importerar man Button komponenten och sätter den där du vill ha den i ditt form.
// Ex. <Button type="button" variant="primary" onClick={handleClick} icon="faCirclePlus">Click me!</Button>
// Ovan väljer du vilken type, variant, size och icon samt vad som ska stå i knappen. All styling är klar.

//primarybutton type="button/submit " variant="primary" size="/small"
//secondarybutton type="button/submit" variant="secondary" size="/small"
//thirdbutton type="button/submit" variant=" " size="/small"

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  type,
  variant,
  size,
  onClick,
  filterButton,
  filterItem,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "faBookmark":
        return (
          <div className="pl-3 ">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        );
      case "faCirclePlus":
        return (
          <div className="pl-3 ">
            <FontAwesomeIcon icon={faCirclePlus} />
          </div>
        );
      case "faCircleMinus":
        return (
          <div className="pl-3 ">
            <FontAwesomeIcon icon={faCircleMinus} />
          </div>
        );
      case "faChevronDown":
        return (
          <div className="pl-3 ">
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        );
      case "faChevronUp":
        return (
          <div className="pl-3 ">
            <FontAwesomeIcon icon={faChevronUp} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {variant === "primary" ? (
        <button
          className={`${
            size === "small" ? "min-h-12 min-w-44" : "min-h-12 w-80"
          } h-fit 'cursor-pointer rounded bg-primaryLightGreen dark:bg-primaryDarkGreen text-xs text-black dark:text-white hover:text-base font-light font-sans shadow-custom'`}
          type={type}
          onClick={onClick}
        >
          <div
            className={`flex flex-row ${
              filterButton ? "justify-between pr-4 pl-4" : "justify-center"
            } items-center `}
          >
            {filterButton ? (
              <>
                <div className="flex flex-row items-center">
                  <FontAwesomeIcon className="pr-3" icon={faFilter} />
                  {children}
                </div>
                <>{icon && getIcon()}</>
              </>
            ) : (
              <>
                {children}
                {icon && getIcon()}
              </>
            )}
          </div>
        </button>
      ) : variant === "secondary" || filterItem ? (
        <button
          className={`${
            size === "small"
              ? "min-h-12 min-w-44"
              : `min-h-12 ${filterItem ? "min-w-72 md:min-w-56" : "w-80"}`
          } h-fit 'cursor-pointer rounded border border-black dark:border-white bg-primaryLightGreen dark:bg-primaryDarkGreen hover:outline-none hover:ring hover:ring-black dark:hover:ring-white font-medium text-xs text-black dark:text-white hover:text-base font-light font-sans shadow-custom '`}
          type={type}
          onClick={onClick}
        >
          <div
            className={`flex flex-row ${
              filterItem ? "justify-between pr-4 pl-4" : "justify-center"
            } items-center `}
          >
            <>
              {children}
              {icon && getIcon()}
            </>
          </div>
        </button>
      ) : (
        <button
          className={`${
            size === "small" ? "min-h-12 min-w-44" : "min-h-12 min-w-80"
          } h-fit 'cursor-pointer rounded bg-thirdLightBlue dark:bg-thirdDarkBlue text-xs text-black dark:text-white font-light hover:text-base font-sans shadow-custom '`}
          type={type}
          onClick={onClick}
        >
          <div className="flex flex-row justify-center items-center ">
            {children}
            {icon && getIcon()}
          </div>
        </button>
      )}
    </>
  );
};

export default Button;
