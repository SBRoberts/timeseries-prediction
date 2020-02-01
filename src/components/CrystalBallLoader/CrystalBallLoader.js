import React, { useEffect, useState } from "react";

// Packages
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import gsap, { TimelineMax } from "gsap";
import CrstalBallSvg from "../../assets/crystal-ball.svg";

// Utils
import COLORS from "../../utils/colors";

// Constants
import { LOAD_STATE } from "../../constants";
const { idle, loading, loaded } = LOAD_STATE;

// Redux Actions
import { dispatchLoadState } from "../../store/actions";

// Styles
import {
  CrystalBall,
  LoadStateText,
  LoadStateTextContainer,
  LoaderContainer
} from "./CrystalBallLoaderStyles";

const CrystalBallLoader = () => {
  const dispatch = useDispatch();
  const loadState = useSelector(state => state.loadState, shallowEqual);
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
    const loadingTimeline = new TimelineMax({
      repeat: 1,
      yoyo: true,
      delay: 0.2,
      onComplete: function() {
        if (loadState === loading) {
          this.seek(0).play();
        }
      }
    });

    loadingTimeline.staggerTo(
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
    const loadedTimeline = new TimelineMax({
      repeat: 3,
      yoyo: true,
      delay: 0.2,
      onComplete: function() {
        dispatchLoadState(dispatch, idle);
      }
    });

    loadedTimeline
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
        case idle:
          idleAnimation.seek(0).play();
          break;
        case loading:
          loadingAnimation.seek(0).play();
          break;
        case loaded:
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
        <LoadStateText isVisible={loadState === idle}>
          Ready to search
        </LoadStateText>
        <LoadStateText isVisible={loadState === loading}>
          Generating prediction
        </LoadStateText>
        <LoadStateText isVisible={loadState === loaded}>
          Behold the future!
        </LoadStateText>
      </LoadStateTextContainer>
    </LoaderContainer>
  );
};

export default CrystalBallLoader;
