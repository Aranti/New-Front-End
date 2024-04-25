import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function handleClose(windowObject, props) {
  props.handleToggleWindow(false);
  windowObject.close();
}

const RenderInWindow = (props) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(window);

  useEffect(() => {
    newWindow.current.addEventListener("beforeunload", (e) => {
      function toggle() {
        props.handleToggleWindow(false);
      }
      toggle();
      console.log("BEFORE UNLOAD!!!!!")

      // (e || newWindow.current.event).returnValue = null;
      return () => toggle();
    });
  }, [container, newWindow.current]);

  useEffect(() => {
    const div = document.createElement("div");
    setContainer(div);
  }, []);

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        "",
        "",
        "width=600,height=400,left=200,top=200"
      );
      newWindow.current.document.body.appendChild(container);
      const curWindow = newWindow.current;

      // curWindow.onbeforeunload(async (event) => {
      //   const e = event || curWindow.event;

      //   props.handleToggleWindow();
      //   // e.preventDefault();
      // })
      return () => curWindow.close();
    }
  }, [container]);

  // useEffect(async () => {
  //   newWindow.onbeforeunload((event) => {
  //     const e = event || window.event;

  //     props.handleToggleWindow();
  //     e.preventDefault();
  //   })
  // }, [])

  return container && createPortal(props.children, container);
};

export default RenderInWindow;