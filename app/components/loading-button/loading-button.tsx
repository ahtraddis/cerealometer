import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity } from "react-native"
import { Text } from "../"
import { viewPresets, textPresets } from "./loading-button.presets"
import { LoadingButtonProps } from "./loading-button.props"
import { mergeAll, flatten } from "ramda"
import { useSpring, animated } from "react-spring";
import * as Progress from 'react-native-progress'

/**
 * This component is a HOC over the built-in React Native one.
 */
export function LoadingButton(props: LoadingButtonProps) {
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    isLoading,
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, styleOverride]))
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, textStyleOverride]),
  )

  const content = children || <Text tx={tx} text={text} style={textStyle} />

  const AnimatedView = animated(View)

  const [showLoader, setShowLoader] = React.useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    }
    // Show loader for a minimum time to avoid loading flash
    if (!isLoading && showLoader) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 400);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isLoading, showLoader]);

  // Capture the dimensions of the button before the loading happens so it doesn't change size.
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.measure) {
      ref.current.measure((ox, oy, width, height, px, py) => {
        if (width && height) {
          setWidth(width)
          setHeight(height)
        }
      })
    }
  }, [children]);

  // Hooks used to fade in/out the loader or the button contents
  const fadeOutProps = useSpring({ opacity: showLoader ? 1 : 0 });
  const fadeInProps = useSpring({ opacity: showLoader ? 0 : 1 });

  // merge width and height tweaks when showing loader
  const mergedViewStyle = mergeAll(flatten([viewStyle, (showLoader && width && height) ? {width: width, height: height} : {}]))

  // return (
  //   <TouchableOpacity
  //     {...rest}
  //     ref={ref}
  //     //style={mergedViewStyle}
  //     style={viewStyle}
  //   >
  //     {showLoader ? (
  //       <AnimatedView style={fadeOutProps}>
  //         <Progress.Circle color={'#fff'} size={15} indeterminate={true} />
  //       </AnimatedView>
  //     ) : (
  //       <AnimatedView style={fadeInProps}>
  //         {content}
  //       </AnimatedView>
  //     )}
  //   </TouchableOpacity>
  // );

  return (
    <TouchableOpacity
      {...rest}
      ref={ref}
      style={mergedViewStyle}
    >
      {showLoader ? (
        <View>
          <Progress.Circle color={'#fff'} size={15} indeterminate={true} />
        </View>
      ) : (
        <View>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );

}
