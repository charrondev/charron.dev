/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next-mdx-remote/render-to-string";
declare module "next-mdx-remote/hydrate";

interface SvgrComponent
    extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg" {
    const value: SvgrComponent;
    export default value;
}
