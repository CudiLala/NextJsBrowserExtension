import type { AppProps } from "next/app";
import type { NextPage } from "next";
import React from "react";

export type NextPageXLayout = ({
  children,
  ...layoutProps
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => JSX.Element;

export type NextPageX = NextPage & {
  Layout?: NextPageXLayout;
  LayoutProps?: { [key: string]: any };
};
export type AppPropsX = AppProps & {
  Component: NextPageX;
};
