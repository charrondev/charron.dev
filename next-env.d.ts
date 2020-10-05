/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next-mdx-remote/render-to-string";
declare module "next-mdx-remote/hydrate";

interface SvgrComponent
    extends React.StatelessComponent<
        React.SVGAttributes<SVGElement> & {
            // Preact supports using "class" instead of "classname" - need to teach typescript
            class?: string;
        }
    > {}

declare module "*.svg" {
    const value: SvgrComponent;
    export default value;
}

// Preact

declare namespace React {
    interface HTMLAttributes<T> {
        // Preact supports using "class" instead of "classname" - need to teach typescript
        class?: string;
    }
}
