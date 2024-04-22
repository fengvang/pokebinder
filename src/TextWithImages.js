import * as Icon from "./Icons";
import { Image } from "react-bootstrap";

export function textWithImage(name) {
  let substrIndex, updatedName;

  switch (true) {
    case name.includes("BREAK"):
      substrIndex = name.indexOf("BREAK");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image src={Icon.breaklogo} alt="BREAK" style={{ width: "140px" }} />
        </span>
      );
    case name.includes("-GX"):
      substrIndex = name.indexOf("-GX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image src={Icon.gx} alt="GX" style={{ width: "70px" }} />
        </span>
      );
    case name.includes("ex") && name !== "Toxapex":
      substrIndex = name.indexOf("ex");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.ex}
            alt="ex"
            style={{ width: window.innerWidth < 576 ? "45px" : "70px" }}
          />
        </span>
      );
    case name.includes("-EX"):
      substrIndex = name.indexOf("-EX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.exOld}
            alt="EX"
            style={{ width: window.innerWidth < 576 ? "50px" : "65px" }}
          />
        </span>
      );
    case name.includes(" V") && !name.includes("VMAX"):
      substrIndex = name.lastIndexOf("V");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.v}
            alt="V"
            style={{ width: window.innerWidth < 576 ? "40px" : "50px" }}
          />
        </span>
      );
    case name.includes("VMAX"):
      substrIndex = name.indexOf("VMAX");
      updatedName = name.slice(0, substrIndex);

      return (
        <span>
          {updatedName}{" "}
          <Image
            src={Icon.vmax}
            alt="VMAX"
            style={{ width: window.innerWidth < 576 ? "60px" : "75px" }}
          />
        </span>
      );
    default:
      return <span>{name}</span>;
  }
}
