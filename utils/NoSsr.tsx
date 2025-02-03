import dynamic from "next/dynamic";
import React from "react";

const NoSSRWrapperImpl = (props: { children: React.ReactNode }) => (
    <React.Fragment>{props.children}</React.Fragment>
);

export const NoSSRWrapper = dynamic(() => Promise.resolve(NoSSRWrapperImpl), {
    ssr: false,
});
