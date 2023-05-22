import { useState, useEffect, useCallback } from "react";

type WindowSize = {
  width?: number;
  height?: number;
};

type useLayoutReturnType = {
  windowSize: WindowSize | undefined;
  columnsWidth: {
    leftWidth: number | string;
    mainWidth: number | string;
    rightWidth: number | string;
  };
};

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const useLayout = (): useLayoutReturnType => {
  //* states
  const [windowSize, setWindowSize] = useState<WindowSize>();

  //* handlers
  const getColumnsWidth = useCallback(() => {
    if (windowSize?.width && windowSize.width < breakpoints.sm) {
      return {
        leftWidth: "100%",
        mainWidth: "100%",
        rightWidth: 0,
      };
    } else if (
      windowSize?.width &&
      windowSize.width >= breakpoints.sm &&
      windowSize.width < breakpoints.md
    ) {
      return {
        leftWidth: "fit-content",
        mainWidth: "100%",
        rightWidth: "fit-content",
      };
    } else if (
      windowSize?.width &&
      windowSize.width >= breakpoints.md &&
      windowSize.width < breakpoints.lg
    ) {
      return {
        leftWidth: "fit-content",
        mainWidth: "100%",
        rightWidth: "fit-content",
      };
    } else if (
      windowSize?.width &&
      windowSize.width >= breakpoints.lg &&
      windowSize.width < breakpoints.xl
    ) {
      return {
        leftWidth: windowSize?.width ? windowSize.width * 0.2 : 0,
        mainWidth: windowSize?.width ? windowSize.width * 0.6 : 0,
        rightWidth: windowSize?.width ? windowSize.width * 0.2 : 0,
      };
    }

    return {
      leftWidth: windowSize?.width ? windowSize.width * 0.15 : 0,
      mainWidth: windowSize?.width ? windowSize.width * 0.7 : 0,
      rightWidth: windowSize?.width ? windowSize.width * 0.15 : 0,
    };
  }, [windowSize]);

  //* effects
  useEffect(() => {
    let isFirstRender = true;

    const handleResize = () => {
      const newWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      if (
        windowSize?.width !== newWindowSize.width ||
        windowSize?.height !== newWindowSize.height
      ) {
        setWindowSize(newWindowSize);
      }
      isFirstRender = false;
    };

    if (isFirstRender) handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize]);

  //* return
  return {
    windowSize,
    columnsWidth: getColumnsWidth(),
  };
};
