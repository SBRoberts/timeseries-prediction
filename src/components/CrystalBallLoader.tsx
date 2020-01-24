import React, { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import styled from "styled-components";
import gsap, { TimelineMax, TweenMax } from "gsap";
import CrstalBallSvg from "../assets/crystal-ball.svg";
import COLORS from "../utils/colors";

export type loadStateTypes = "loading" | "loaded" | "idle";
const loadStates = ["loading", "loaded", "idle"];

type Props = {
  loadState: loadStateTypes;
  emitLoadState: Function;
};

const CrystalBall = styled(SVG)`
  min-width: 50px;
  max-width: 5%;
  transform-origin: center;
  path {
    transform-origin: center;
  }
`;

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const LoadStateTextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  margin: 10px 0 0;
`;

const LoadStateText = styled.h3`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 20px;
  line-height: 1em;
  font-family: "Heebo", sans-serif;
  /* width: 100%; */
  opacity: ${({ isVisible }: { isVisible: boolean }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-out;
  margin: 0;
`;

const CrystalBallLoader = ({ loadState, emitLoadState }: Props) => {
  const [crystalBallRef, setCrystalBallRef] = useState(null);

  const useIdleAnimation = elements => {
    const idleTimeline = new TimelineMax({
      repeat: 6,
      yoyo: true,
      delay: 0.2
    });
    idleTimeline.fromTo(
      elements[0].parentNode,
      0.4,
      {
        opacity: 0.3,
        scale: 0.9,
        fill: COLORS.black
      },
      {
        opacity: 1,
        scale: 1,
        fill: COLORS.black
      }
    );
    return idleTimeline;
  };

  const useLoadingAnimation = elements => {
    const loadingTimeline: any = new TimelineMax({
      repeat: 1,
      yoyo: true,
      delay: 0.2,
      onComplete: function() {
        if (loadState === "loading") {
          this.seek(0).play();
        }
      }
    });

    const loadingAnimation = loadingTimeline.staggerTo(
      elements,
      0.4,
      {
        opacity: 1,
        fill: COLORS.chartPink
      },
      0.1,
      "-=0"
    );

    return loadingTimeline;
  };

  const useLoadedAnimation = elements => {
    const loadedTimeline: any = new TimelineMax({
      repeat: 3,
      yoyo: true,
      delay: 0.2,
      onComplete: function() {
        emitLoadState("idle");
      }
    });

    const loadedAnimation: any = loadedTimeline
      .to(elements, {
        fill: COLORS.chartPink,
        opacity: 1,
        transformOrigin: "center"
      })
      .to(elements.reverse(), 0.2, {
        rotate: "-5deg",
        transformOrigin: "center"
      })
      .to(elements.reverse(), 0.2, {
        rotate: "5deg"
      })
      .to(elements.reverse(), 0.2, {
        rotate: "0deg"
      });
    return loadedTimeline;
  };

  const useAnimationReset = (elements, timelineArray) => {
    timelineArray.map(animation => animation.seek(0).pause());

    gsap.to(elements[0].parentNode, 0.2, {
      fill: COLORS.black,
      rotate: 0,
      opacity: 1,
      scale: 1
    });
    gsap.to(elements, 0.2, {
      fill: COLORS.black,
      rotate: 0,
      opacity: 1,
      scale: 1
    });
  };

  let idleAnimation;
  let loadingAnimation;
  let loadedAnimation;

  useEffect(() => {
    if (crystalBallRef) {
      const crystalBallElements = crystalBallRef.querySelectorAll("*");
      const crystalBallElArray = [];
      for (const [index, domNode] of crystalBallElements.entries()) {
        crystalBallElArray.push(domNode);
      }
      if (!idleAnimation)
        idleAnimation = useIdleAnimation(crystalBallElArray).pause();
      if (!loadedAnimation)
        loadingAnimation = useLoadingAnimation(crystalBallElArray).pause();
      if (!loadedAnimation)
        loadedAnimation = useLoadedAnimation(crystalBallElArray).pause();

      const animationArr = [idleAnimation, loadingAnimation, loadedAnimation];
      useAnimationReset(crystalBallElArray, animationArr);
      switch (loadState) {
        case "idle":
          idleAnimation.seek(0).play();
          break;
        case "loading":
          loadingAnimation.seek(0).play();
          break;
        case "loaded":
          loadedAnimation.seek(0).play();
          break;
        default:
          idleAnimation.seek(0).play();
          break;
      }
    }
    return () => {
      if (idleAnimation) idleAnimation.kill();
      if (loadingAnimation) loadingAnimation.kill();
      if (loadingAnimation) loadedAnimation.kill();
    };
  }, [crystalBallRef, loadState]);
  return (
    <LoaderContainer>
      <CrystalBall innerRef={e => setCrystalBallRef(e)} src={CrstalBallSvg} />
      <LoadStateTextContainer>
        <LoadStateText isVisible={loadState === "idle"}>
          Ready to search
        </LoadStateText>
        <LoadStateText isVisible={loadState === "loading"}>
          Generating prediction
        </LoadStateText>
        <LoadStateText isVisible={loadState === "loaded"}>
          Behold the future!
        </LoadStateText>
      </LoadStateTextContainer>
    </LoaderContainer>
  );
};

export default CrystalBallLoader;
