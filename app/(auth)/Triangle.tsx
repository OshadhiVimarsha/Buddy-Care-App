import React from "react"
import { View } from "react-native"

type Props = {
  size?: number
  color?: string
  direction?: "up" | "down" | "left" | "right"
}

export default function Triangle({
  size = 1000,
  color = "#f43f5e",
  direction = "up",
}: Props) {
  const half = size / 2
  let style: any = {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
  }

  if (direction === "up") {
    style = {
      ...style,
      borderLeftWidth: half,
      borderRightWidth: half,
      borderBottomWidth: size,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: color,
    }
  } else if (direction === "down") {
    style = {
      ...style,
      borderLeftWidth: half,
      borderRightWidth: half,
      borderTopWidth: size,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderTopColor: color,
    }
  } else if (direction === "left") {
    style = {
      ...style,
      borderTopWidth: half,
      borderBottomWidth: half,
      borderRightWidth: size,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: color,
    }
  } else if (direction === "right") {
    style = {
      ...style,
      borderTopWidth: half,
      borderBottomWidth: half,
      borderLeftWidth: size,
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: color,
    }
  }

  return <View style={style} />
}
