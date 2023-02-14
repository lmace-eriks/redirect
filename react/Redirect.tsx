import React, { useEffect, useRef, useState } from "react";
import { canUseDOM } from "vtex.render-runtime";

import styles from "./styles.css";

interface RedirectProps {
  redirectList: Array<RedirectObject>
}

interface RedirectObject {
  from: string
  to: string
}

const Redirect: StorefrontFunctionComponent<RedirectProps> = ({ redirectList }) => {
  const openGate = useRef(true);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    findRedirect();
  });

  const findRedirect = () => {
    if (!canUseDOM) return;
    const currentLocation = window.location.href.split(".com")[1];

    for (const spot of redirectList) {
      if (spot.from === currentLocation) {
        setIsRedirect(true);
        goToRedirect(spot.to);
        break;
      }
    }
  };

  const goToRedirect = (to: string) => {
    if (!canUseDOM) return;

    history.pushState(null, "", "/blog");
    window.location.href = to;
  };

  const RedirectDisplay = () => (
    <div className={styles.redirectBox}>
      <div className={styles.redirectText}>Redirecting... Please Wait.</div>
      <SpinnerAnim />
    </div>
  )

  const SpinnerAnim = () => (
    <svg className={styles.spinner} viewBox="0 0 50 50">
      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
  )

  return isRedirect ? <RedirectDisplay /> : <div data-redirect="false"></div>;
}

Redirect.schema = {
  title: "Redirect",
  type: "object",
  properties: {
    redirectList: {
      type: "array",
      title: "Redirect List",
      items: {
        properties: {
          __editorItemTitle: {
            title: "Name",
            description: "Site Editor Name",
            type: "string"
          },
          from: {
            title: "From",
            description: "URL text after .com to match.",
            type: "string"
          },
          to: {
            title: "To",
            description: "Redirect destination URL.",
            type: "string"
          }
        }
      }
    }
  }
}

export default Redirect;